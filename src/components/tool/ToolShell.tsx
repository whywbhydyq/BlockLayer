'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { trackToolEvent } from '@/lib/analytics/events';
import { rowListText } from '@/lib/export/exportCsv';
import { safeExportFilename } from '@/lib/export/filenames';
import { requestBrowserPrint } from '@/lib/export/exportPrint';
import { generateCircle, generateEllipse, type RowSegment, type TwoDimensionalResult } from '@/lib/geometry';
import { BlueprintCanvas, type BlueprintCanvasHandle } from './BlueprintCanvas';
import { initialFormState, parseNumber, type FormState, type ToolShellProps } from './controlTypes';

type BuilderShape = 'circle' | 'ellipse';

type BuilderState = Pick<FormState, 'inputMode' | 'diameter' | 'radius' | 'width' | 'height' | 'fillMode' | 'thickness'> & {
  shape: BuilderShape;
};

function normalizeInitialState(props: ToolShellProps): BuilderState {
  const initial = initialFormState(props);
  return {
    shape: initial.shape === 'ellipse' ? 'ellipse' : 'circle',
    inputMode: initial.inputMode,
    diameter: initial.diameter,
    radius: initial.radius,
    width: props.initialWidth || initial.width,
    height: props.initialHeight || initial.height,
    fillMode: initial.fillMode,
    thickness: initial.thickness
  };
}

function generateBlueprint(state: BuilderState): TwoDimensionalResult {
  if (state.shape === 'ellipse') {
    return generateEllipse({ width: state.width, height: state.height, fillMode: state.fillMode, thickness: state.thickness });
  }
  return generateCircle({
    inputMode: state.inputMode,
    diameter: state.diameter,
    radius: state.radius,
    fillMode: state.fillMode,
    thickness: state.thickness
  });
}

function clampInt(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value || min)));
}

function segmentText(row: RowSegment) {
  return row.segments.map((segment) => `X ${segment.startX} to ${segment.endX} (${segment.length})`).join('; ');
}

function centerTitle(result: TwoDimensionalResult) {
  return result.centerType === 'single-block' ? 'Single center block' : 'Between four blocks';
}

function centerSubtitle(result: TwoDimensionalResult) {
  return result.centerType === 'single-block' ? 'Odd diameter' : 'Even diameter';
}

function boundsText(result: TwoDimensionalResult) {
  return `X ${result.bounds.minX} to ${result.bounds.maxX}, Z ${result.bounds.minZ} to ${result.bounds.maxZ}`;
}

function stacksText(result: TwoDimensionalResult) {
  if (result.stacks.remainder === 0) return `${result.stacks.fullStacks} stacks`;
  return `${result.stacks.fullStacks} stacks + ${result.stacks.remainder} blocks`;
}

const commonDiameters = [16, 19, 23, 31, 33, 39, 51];

export function ToolShell(props: ToolShellProps) {
  const [state, setState] = useState<BuilderState>(() => normalizeInitialState(props));
  const [showCenter, setShowCenter] = useState(true);
  const [showAxis, setShowAxis] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [showRowLabels, setShowRowLabels] = useState(true);
  const [copied, setCopied] = useState('');
  const [manualCopy, setManualCopy] = useState<{ label: string; text: string } | null>(null);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [buildMode, setBuildMode] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [completedRows, setCompletedRows] = useState<Set<number>>(() => new Set());
  const canvasRef = useRef<BlueprintCanvasHandle | null>(null);
  const manualCopyRef = useRef<HTMLTextAreaElement | null>(null);
  const companionRef = useRef<HTMLElement | null>(null);
  const result = useMemo(() => generateBlueprint(state), [state]);
  const rows = 'rows' in result ? result.rows : [];
  const currentRow = rows[Math.min(currentRowIndex, Math.max(0, rows.length - 1))] || null;
  const completedCount = rows.filter((row) => completedRows.has(row.z)).length;

  useEffect(() => {
    trackToolEvent('tool_view', { shape: state.shape, title: 'Minecraft Circle & Oval Blueprint Builder' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!manualCopy) return;
    window.setTimeout(() => {
      manualCopyRef.current?.focus();
      manualCopyRef.current?.select();
    }, 0);
  }, [manualCopy]);

  useEffect(() => {
    if (!buildMode) return;
    window.setTimeout(() => companionRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 0);
  }, [buildMode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shapeParam = params.get('shape');
    const shape: BuilderShape = shapeParam === 'ellipse' || shapeParam === 'oval' ? 'ellipse' : 'circle';
    setState((previous) => ({
      ...previous,
      shape,
      diameter: clampInt(parseNumber(params.get('d'), previous.diameter), 3, 512),
      radius: clampInt(parseNumber(params.get('r'), previous.radius), 2, 256),
      width: clampInt(parseNumber(params.get('w'), previous.width), 3, 512),
      height: clampInt(parseNumber(params.get('h'), previous.height), 3, 512),
      inputMode: params.get('input') === 'radius' ? 'radius' : previous.inputMode,
      fillMode: params.get('fill') === 'filled' ? 'filled' : previous.fillMode,
      thickness: clampInt(parseNumber(params.get('t'), previous.thickness), 1, 8)
    }));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('shape', state.shape);
    params.set('fill', state.fillMode);
    params.set('t', String(state.thickness));
    if (state.shape === 'ellipse') {
      params.set('w', String(state.width));
      params.set('h', String(state.height));
    } else {
      params.set('input', state.inputMode);
      params.set('d', String(state.diameter));
      params.set('r', String(state.radius));
    }
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }, [state]);

  useEffect(() => {
    setCurrentRowIndex(0);
    setCompletedRows(new Set());
  }, [result.title, result.dimensions.width, result.dimensions.height, state.fillMode, state.thickness]);

  useEffect(() => {
    if (currentRowIndex > Math.max(0, rows.length - 1)) {
      setCurrentRowIndex(Math.max(0, rows.length - 1));
    }
  }, [currentRowIndex, rows.length]);

  function setPatch(patch: Partial<BuilderState>) {
    setState((previous) => ({ ...previous, ...patch }));
    trackToolEvent('params_changed', { shape: patch.shape || state.shape, param: Object.keys(patch).join(',') });
  }

  async function copy(text: string, label: string, eventName: Parameters<typeof trackToolEvent>[0]) {
    setManualCopy(null);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 1600);
      trackToolEvent(eventName, { shape: result.shape });
    } catch {
      setCopied('Manual copy needed');
      setManualCopy({ label, text });
    }
  }

  function reset() {
    setState({
      shape: 'circle',
      inputMode: 'diameter',
      diameter: 16,
      radius: 8,
      width: 16,
      height: 16,
      fillMode: 'outline',
      thickness: 1
    });
    trackToolEvent('params_changed', { shape: 'circle', param: 'reset' });
  }

  function updateDiameter(next: number) {
    const diameter = clampInt(next, 3, 512);
    setPatch({ diameter, radius: Math.floor(diameter / 2), shape: 'circle' });
  }

  function updateRadius(next: number) {
    const radius = clampInt(next, 2, 256);
    setPatch({ radius, diameter: radius * 2 + 1, shape: 'circle' });
  }

  function exportPng() {
    canvasRef.current?.exportPng(safeExportFilename(result, 'png'));
    trackToolEvent('download_png_clicked', { shape: result.shape });
  }

  function printBlueprint() {
    trackToolEvent('print_clicked', { shape: result.shape, mode: 'current' });
    requestBrowserPrint();
  }

  function copyRows() {
    return copy(rowListText(result, 0), 'Row list copied', 'copy_row_list_clicked');
  }

  function copyCurrentRow() {
    if (!currentRow) return undefined;
    return copy(
      `Z ${currentRow.z}: ${segmentText(currentRow)} (${currentRow.blockCount} blocks)`,
      'Current row copied',
      'copy_current_row_clicked'
    );
  }

  function previousRow() {
    setCurrentRowIndex((value) => Math.max(0, value - 1));
    trackToolEvent('build_row_changed', { shape: result.shape, direction: 'previous' });
  }

  function nextRow() {
    setCurrentRowIndex((value) => Math.min(Math.max(0, rows.length - 1), value + 1));
    trackToolEvent('build_row_changed', { shape: result.shape, direction: 'next' });
  }

  function toggleRowDone() {
    if (!currentRow) return;
    setCompletedRows((previous) => {
      const next = new Set(previous);
      if (next.has(currentRow.z)) next.delete(currentRow.z);
      else next.add(currentRow.z);
      return next;
    });
    trackToolEvent('build_row_done_toggled', { shape: result.shape, row: currentRow.z });
  }

  function toggleBuildMode() {
    setBuildMode((value) => {
      const next = !value;
      trackToolEvent('build_mode_toggled', { shape: result.shape, active: next });
      return next;
    });
  }

  async function fullscreenCanvas() {
    const ok = await canvasRef.current?.fullscreen();
    if (!ok) {
      setCopied('Fullscreen unavailable');
      setTimeout(() => setCopied(''), 1600);
    }
  }

  function copyShareLink() {
    return copy(window.location.href, 'Share link copied', 'copy_share_url_clicked');
  }

  const currentSizeLabel =
    state.shape === 'circle' ? `${result.dimensions.width} block circle` : `${result.dimensions.width} × ${result.dimensions.height} oval`;

  return (
    <section className="builder-shell" aria-label="Minecraft Circle & Oval Blueprint Builder">
      <div className="workspace-grid">
        <aside className="build-card build-settings" aria-label="Build settings">
          <div className="panel-title">Build settings</div>
          <div className="step-block">
            <div className="step-heading">
              <span>1</span>Shape
            </div>
            <div className="segmented-control">
              <button type="button" className={state.shape === 'circle' ? 'active' : ''} onClick={() => setPatch({ shape: 'circle' })}>
                ○ Circle
              </button>
              <button type="button" className={state.shape === 'ellipse' ? 'active' : ''} onClick={() => setPatch({ shape: 'ellipse' })}>
                ▭ Oval / Ellipse
              </button>
            </div>
          </div>

          <div className="step-block">
            <div className="step-heading">
              <span>2</span>Size
            </div>
            {state.shape === 'circle' ? (
              <>
                <div className="segmented-control small">
                  <button
                    type="button"
                    className={state.inputMode === 'diameter' ? 'active' : ''}
                    onClick={() => setPatch({ inputMode: 'diameter' })}
                  >
                    Diameter
                  </button>
                  <button
                    type="button"
                    className={state.inputMode === 'radius' ? 'active' : ''}
                    onClick={() => setPatch({ inputMode: 'radius' })}
                  >
                    Radius
                  </button>
                </div>
                <label className="field-label">{state.inputMode === 'diameter' ? 'Diameter (blocks)' : 'Radius (blocks)'}</label>
                <div className="number-stepper">
                  <input
                    value={state.inputMode === 'diameter' ? state.diameter : state.radius}
                    min={state.inputMode === 'diameter' ? 3 : 2}
                    max={state.inputMode === 'diameter' ? 512 : 256}
                    type="number"
                    onChange={(event) =>
                      state.inputMode === 'diameter' ? updateDiameter(Number(event.target.value)) : updateRadius(Number(event.target.value))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => (state.inputMode === 'diameter' ? updateDiameter(state.diameter - 1) : updateRadius(state.radius - 1))}
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => (state.inputMode === 'diameter' ? updateDiameter(state.diameter + 1) : updateRadius(state.radius + 1))}
                  >
                    ＋
                  </button>
                </div>
                <p className="range-note">Range: 3 – 512</p>
              </>
            ) : (
              <div className="size-pair">
                <label>
                  <span>Width</span>
                  <input
                    type="number"
                    min={3}
                    max={512}
                    value={state.width}
                    onChange={(event) => setPatch({ width: clampInt(Number(event.target.value), 3, 512), shape: 'ellipse' })}
                  />
                </label>
                <label>
                  <span>Height</span>
                  <input
                    type="number"
                    min={3}
                    max={512}
                    value={state.height}
                    onChange={(event) => setPatch({ height: clampInt(Number(event.target.value), 3, 512), shape: 'ellipse' })}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="step-block">
            <div className="step-heading">
              <span>3</span>Build type
            </div>
            <div className="segmented-control">
              <button
                type="button"
                className={state.fillMode === 'outline' ? 'active' : ''}
                onClick={() => setPatch({ fillMode: 'outline' })}
              >
                Outline
              </button>
              <button
                type="button"
                className={state.fillMode === 'filled' ? 'active' : ''}
                onClick={() => setPatch({ fillMode: 'filled' })}
              >
                Filled
              </button>
            </div>
          </div>

          <div className="step-block">
            <div className="step-heading">
              <span>4</span>Thickness
            </div>
            <div className="thickness-row">
              <input
                type="range"
                min={1}
                max={8}
                value={state.thickness}
                onChange={(event) => setPatch({ thickness: clampInt(Number(event.target.value), 1, 8) })}
              />
              <input
                className="thickness-number"
                type="number"
                min={1}
                max={8}
                value={state.thickness}
                onChange={(event) => setPatch({ thickness: clampInt(Number(event.target.value), 1, 8) })}
              />
            </div>
            <p className="range-note">Range: 1 – 8</p>
          </div>

          <div className="action-stack">
            <button
              type="button"
              className="primary-action"
              onClick={() => {
                canvasRef.current?.fitToScreen();
                trackToolEvent('generate_success', {
                  shape: result.shape,
                  totalBlocks: result.totalBlocks,
                  warnings: result.warnings.length
                });
              }}
            >
              ⚡ Update & Fit Blueprint
            </button>
            <button type="button" className="secondary-action" onClick={reset}>
              ↻ Reset
            </button>
          </div>
        </aside>

        <section className="blueprint-workspace" aria-label="Blueprint canvas and row segments">
          <div className="workspace-toolbar">
            <div className="view-options">
              <strong>View options:</strong>
              <button type="button" className={showCenter ? 'active' : ''} onClick={() => setShowCenter((v) => !v)}>
                ▦ Center
              </button>
              <button type="button" className={showAxis ? 'active' : ''} onClick={() => setShowAxis((v) => !v)}>
                ━ Axis
              </button>
              <button type="button" className={showCoordinates ? 'active' : ''} onClick={() => setShowCoordinates((v) => !v)}>
                ▦ Coordinates
              </button>
              <button type="button" className={showRowLabels ? 'active' : ''} onClick={() => setShowRowLabels((v) => !v)}>
                12 Row labels
              </button>
            </div>
            <div className="zoom-controls">
              <button type="button" className={buildMode ? 'build-mode-toggle active' : 'build-mode-toggle'} onClick={toggleBuildMode}>
                Build Mode
              </button>
              <button type="button" onClick={() => canvasRef.current?.zoomOut()}>
                −
              </button>
              <span>{zoomPercent}%</span>
              <button type="button" onClick={() => canvasRef.current?.zoomIn()}>
                ＋
              </button>
              <button type="button" onClick={() => canvasRef.current?.fitToScreen()}>
                Fit
              </button>
              <button type="button" className="icon-button" aria-label="Fullscreen" onClick={fullscreenCanvas}>
                ⛶
              </button>
            </div>
          </div>

          <BlueprintCanvas
            ref={canvasRef}
            result={result}
            selectedLayerIndex={0}
            showCoordinates={showCoordinates}
            showSegments={showRowLabels}
            showCenter={showCenter}
            showAxis={showAxis}
            showGhost={false}
            highContrast={false}
            hideToolbar
            highlightedRowZ={buildMode ? (currentRow?.z ?? null) : null}
            onZoomChange={(percent) => setZoomPercent(percent)}
          />

          <div className="canvas-caption">
            <span>Center</span>
            <span>Axis (X/Z)</span>
            <span>Each grid = 1 block</span>
            <strong>Diameter: {result.dimensions.width} blocks</strong>
            {state.shape === 'circle' && <strong>Radius: {Math.floor(result.dimensions.width / 2)} blocks</strong>}
          </div>

          {buildMode && currentRow && (
            <section ref={companionRef} className="companion-mode-card" aria-label="Companion build mode" aria-live="polite">
              <div className="companion-kicker">Companion Mode</div>
              <div className="current-row-copy">
                <span>Current row</span>
                <strong>Z = {currentRow.z}</strong>
                <em>{segmentText(currentRow)}</em>
                <small>
                  {currentRow.blockCount} blocks · {currentRowIndex + 1} / {rows.length} rows · {completedCount} done
                </small>
              </div>
              <div className="build-progress" aria-label="Build progress">
                <span style={{ width: `${rows.length ? Math.round((completedCount / rows.length) * 100) : 0}%` }} />
              </div>
              <div className="companion-actions">
                <button type="button" onClick={previousRow} disabled={currentRowIndex === 0}>
                  Previous row
                </button>
                <button type="button" className={completedRows.has(currentRow.z) ? 'done' : ''} onClick={toggleRowDone}>
                  {completedRows.has(currentRow.z) ? 'Undo done' : 'Mark done'}
                </button>
                <button type="button" onClick={nextRow} disabled={currentRowIndex >= rows.length - 1}>
                  Next row
                </button>
                <button type="button" onClick={copyCurrentRow}>
                  Copy this row
                </button>
              </div>
            </section>
          )}

          <div className="lower-grid">
            <section className="data-card row-table-card">
              <div className="card-header">
                <h3>Row Segments (top to bottom)</h3>
                <button type="button" onClick={copyRows}>
                  ⌘ Copy all rows
                </button>
              </div>
              <div className="row-table-scroll">
                <table className="row-table">
                  <thead>
                    <tr>
                      <th>Z (row)</th>
                      <th>X start</th>
                      <th>X end</th>
                      <th>Length</th>
                      <th>Blocks</th>
                      <th>Visual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIndex) => {
                      const first = row.segments[0];
                      const last = row.segments[row.segments.length - 1];
                      const selectable = buildMode;
                      return (
                        <tr
                          key={row.z}
                          className={`${buildMode && currentRow?.z === row.z ? 'active-row' : ''} ${completedRows.has(row.z) ? 'completed-row' : ''}`.trim()}
                          role={selectable ? 'button' : undefined}
                          tabIndex={selectable ? 0 : undefined}
                          aria-current={buildMode && currentRow?.z === row.z ? 'step' : undefined}
                          onClick={() => selectable && setCurrentRowIndex(rowIndex)}
                          onKeyDown={(event) => {
                            if (!selectable) return;
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setCurrentRowIndex(rowIndex);
                            }
                          }}
                        >
                          <td>
                            {completedRows.has(row.z) ? '✓ ' : ''}
                            {row.z}
                          </td>
                          <td>{first?.startX ?? '—'}</td>
                          <td>{last?.endX ?? '—'}</td>
                          <td>{row.segments.map((segment) => segment.length).join(' + ')}</td>
                          <td>{row.blockCount}</td>
                          <td>
                            <span className="mini-blocks" style={{ ['--blocks' as string]: Math.min(24, row.blockCount) }}>
                              {Array.from({ length: Math.min(24, row.blockCount) }, (_, i) => (
                                <i key={i} />
                              ))}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="data-card center-guide-card">
              <h3>Odd vs Even Center</h3>
              <div className="center-explain-row">
                <div className="mini-grid odd">
                  <b />
                </div>
                <div>
                  <strong>Odd diameter</strong> <span>(like 31)</span>
                  <p>Has a single center block. Perfect symmetry around center.</p>
                </div>
              </div>
              <div className="center-explain-row">
                <div className="mini-grid even">
                  <b />
                </div>
                <div>
                  <strong>Even diameter</strong> <span>(like 32)</span>
                  <p>Center is between four blocks. Mark a 2×2 area as center.</p>
                </div>
              </div>
            </section>
          </div>
        </section>

        <aside className="result-rail" aria-label="Result summary and exports">
          <section className="result-card center-type-card">
            <div className="card-kicker">Center type</div>
            <div className="center-type-content">
              <div className="mini-grid big">
                <b />
              </div>
              <div>
                <h3>{centerTitle(result)}</h3>
                <p>({centerSubtitle(result)})</p>
              </div>
            </div>
            <div className="start-card">
              <strong>Start here:</strong>
              <br />
              Place the center block, then mark the X/Z axis.
            </div>
          </section>

          <section className="result-card bounds-card">
            <div className="card-kicker">Bounds</div>
            <p>
              <strong>{boundsText(result)}</strong>
            </p>
            <span>{currentSizeLabel}</span>
          </section>

          <section className="result-card block-count-card">
            <div className="card-kicker">Block count</div>
            <dl>
              <dt>{state.fillMode === 'outline' ? 'Outline blocks' : 'Filled blocks'}</dt>
              <dd>{result.totalBlocks}</dd>
              {'outlineBlocks' in result && (
                <>
                  <dt>Blocks if filled</dt>
                  <dd>{state.fillMode === 'filled' ? result.totalBlocks : result.filledBlocks}</dd>
                </>
              )}
              <dt>Stacks of 64</dt>
              <dd>{stacksText(result)}</dd>
            </dl>
          </section>

          <section className="result-card export-card">
            <div className="card-kicker">Export & share</div>
            <button type="button" onClick={copyRows}>
              ▣ Copy row list
            </button>
            <button type="button" onClick={exportPng}>
              ⇩ Download PNG
            </button>
            <button type="button" onClick={printBlueprint}>
              ▤ Print blueprint
            </button>
            <button type="button" className="share-button" onClick={copyShareLink}>
              🔗 Copy share link
            </button>
            {copied && (
              <p className="copy-status" role="status">
                {copied}
              </p>
            )}
            {manualCopy && (
              <div className="manual-copy-box" role="dialog" aria-label={`${manualCopy.label} manual fallback`}>
                <p>Clipboard permission was blocked. Select and copy manually:</p>
                <textarea ref={manualCopyRef} readOnly value={manualCopy.text} onFocus={(event) => event.currentTarget.select()} />
                <button type="button" onClick={() => setManualCopy(null)}>
                  Close
                </button>
              </div>
            )}
          </section>

          <section className="result-card build-mode-card">
            <div className="card-kicker">Build while playing</div>
            <p>Use Companion Mode on a second screen or a narrow browser beside Minecraft.</p>
            <button type="button" className={buildMode ? 'share-button' : ''} onClick={toggleBuildMode}>
              {buildMode ? 'Exit Companion Mode' : 'Open Companion Mode'}
            </button>
          </section>
        </aside>
      </div>

      <div className="below-workspace">
        <section className="info-card how-to" id="how-to-use">
          <h3>How to use</h3>
          <ol>
            <li>Choose Circle or Oval.</li>
            <li>Enter diameter, radius, or width × height.</li>
            <li>Choose outline or filled and set thickness.</li>
            <li>View the blueprint and row segments.</li>
            <li>Open Companion Mode when building beside the game.</li>
            <li>Use Previous / Next row and Mark done as you place blocks.</li>
            <li>Copy the row list or export the image.</li>
          </ol>
        </section>

        <section className="info-card common-sizes">
          <h3>Common diameters</h3>
          <div className="size-chips">
            {commonDiameters.map((size) => (
              <button
                type="button"
                key={size}
                className={state.shape === 'circle' && state.diameter === size ? 'active' : ''}
                onClick={() => updateDiameter(size)}
              >
                {size}
              </button>
            ))}
          </div>
          <p>Even diameters center between blocks; odd diameters use one center block.</p>
        </section>

        <section className="info-card build-tips">
          <h3>Build tips</h3>
          <ul>
            <li>Place the center block first.</li>
            <li>Build the north, south, east and west axis.</li>
            <li>Then build each row outward.</li>
            <li>Use row segments to stay accurate.</li>
          </ul>
        </section>

        <section className="info-card faq-card">
          <h3>FAQ</h3>
          <details>
            <summary>Why does my circle look different in Minecraft?</summary>
            <p>This tool uses block-center approximation. Other tools may include edge blocks differently.</p>
          </details>
          <details>
            <summary>What is the difference between odd and even diameters?</summary>
            <p>Odd diameters have one center block. Even diameters are centered between four blocks.</p>
          </details>
          <details>
            <summary>How do I build a perfect circle in Minecraft?</summary>
            <p>Mark the center and axis first, then follow the row segment list.</p>
          </details>
        </section>
      </div>
    </section>
  );
}

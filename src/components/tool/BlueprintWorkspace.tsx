'use client';
import { useEffect, useRef, useState, type WheelEvent, type KeyboardEvent } from 'react';
import { trackToolEvent } from '@/lib/analytics/events';
import { layerSummaryText, rowListText, summaryText } from '@/lib/export/exportText';
import type { BlueprintResult, LayeredResult, RowSegment, ShapeKind, TwoDimensionalResult } from '@/lib/geometry/types';
import { BlueprintCanvas, type BlueprintCanvasHandle } from './BlueprintCanvas';
import { LayerSummaryTable } from './LayerSummaryTable';
import { WarningPanel } from './WarningPanel';
import { initialFormState, parseNumber, shapeLabels, type BuilderState, type ToolShellProps } from './controlTypes';
import { useBlueprintResult } from './useBlueprintResult';

type PrintMode = 'current' | 'all' | 'selected';

type BlueprintWorkspaceProps = Omit<ToolShellProps, 'contentKey'> & {
  initialResult: BlueprintResult;
};

const roundShapes: ShapeKind[] = ['circle', 'sphere', 'dome'];
const commonDiameters = [16, 19, 23, 31, 33, 39, 51];
const commonOvalSizes = [
  { label: '31×21', width: 31, height: 21 },
  { label: '41×25', width: 41, height: 25 },
  { label: '51×31', width: 51, height: 31 },
  { label: '64×32', width: 64, height: 32 }
];
const allShapes: ShapeKind[] = ['circle', 'ellipse', 'sphere', 'dome'];

function normalizeInitialState(props: ToolShellProps): BuilderState {
  const initial = initialFormState(props);
  return {
    shape: initial.shape,
    inputMode: initial.inputMode,
    diameter: initial.diameter,
    radius: initial.radius,
    width: props.initialWidth || initial.width,
    height: props.initialHeight || initial.height,
    fillMode: initial.fillMode,
    solidMode: initial.solidMode,
    thickness: initial.thickness,
    shellThickness: initial.shellThickness,
    capHeight: initial.capHeight,
    buildDirection: initial.buildDirection,
    domeHalf: initial.domeHalf
  };
}

function isLayered(result: BlueprintResult): result is LayeredResult {
  return result.shape === 'sphere' || result.shape === 'dome';
}

function isFlat(result: BlueprintResult): result is TwoDimensionalResult {
  return result.shape === 'circle' || result.shape === 'ellipse';
}

function clampInt(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value || min)));
}

function clampLayerRange(start: number, end: number, layerCount: number) {
  const safeStart = clampInt(start, 1, layerCount);
  const safeEnd = clampInt(end, safeStart, layerCount);
  return { start: safeStart, end: safeEnd };
}

function segmentText(row: RowSegment) {
  return row.segments.map((segment) => `X ${segment.startX} to ${segment.endX} (${segment.length})`).join('; ');
}

function footprint(result: BlueprintResult) {
  return {
    width: result.dimensions.width,
    depth: result.dimensions.depth || result.dimensions.height
  };
}

function centerTitle(result: BlueprintResult) {
  const { width, depth } = footprint(result);
  if (width % 2 === 1 && depth % 2 === 1) return 'Single center block';
  if (width % 2 === 0 && depth % 2 === 0) return 'Between four blocks';
  return 'Between two blocks on one axis';
}

function centerSubtitle(result: BlueprintResult) {
  const { width, depth } = footprint(result);
  if (width % 2 === 1 && depth % 2 === 1) return result.shape === 'ellipse' ? 'Odd width and height' : 'Odd diameter';
  if (width % 2 === 0 && depth % 2 === 0) return result.shape === 'ellipse' ? 'Even width and height' : 'Even diameter';
  return width % 2 === 0 ? 'Even width, odd height' : 'Odd width, even height';
}

function centerInstruction(result: BlueprintResult) {
  const { width, depth } = footprint(result);
  if (width % 2 === 1 && depth % 2 === 1) return 'Place the center block, then mark the X/Z axis.';
  if (width % 2 === 0 && depth % 2 === 0) return 'Mark the 2×2 center area, then mirror each quadrant from those center grid lines.';
  return 'Mark the center line between the two middle blocks on the even axis, then mirror both sides.';
}

function boundsText(result: BlueprintResult) {
  if (isLayered(result)) {
    const layer = result.layers[0];
    return `X ${layer.bounds.minX} to ${layer.bounds.maxX}, Z ${layer.bounds.minZ} to ${layer.bounds.maxZ}`;
  }
  return `X ${result.bounds.minX} to ${result.bounds.maxX}, Z ${result.bounds.minZ} to ${result.bounds.maxZ}`;
}

function stacksText(result: BlueprintResult) {
  if (result.stacks.remainder === 0) return `${result.stacks.fullStacks} stacks`;
  return `${result.stacks.fullStacks} stacks + ${result.stacks.remainder} blocks`;
}

function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function validShape(value: string | null, fallback: ShapeKind): ShapeKind {
  return value === 'circle' || value === 'ellipse' || value === 'oval' || value === 'sphere' || value === 'dome'
    ? value === 'oval'
      ? 'ellipse'
      : value
    : fallback;
}


function preventNumberWheelChange(event: WheelEvent<HTMLInputElement>) {
  if (document.activeElement === event.currentTarget) event.currentTarget.blur();
}

function isEscape(event: KeyboardEvent<HTMLElement>) {
  return event.key === 'Escape' || event.key === 'Esc';
}

export function BlueprintWorkspace(props: BlueprintWorkspaceProps) {
  const [state, setState] = useState<BuilderState>(() => normalizeInitialState(props));
  const [showCenter, setShowCenter] = useState(true);
  const [showAxis, setShowAxis] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [showRowLabels, setShowRowLabels] = useState(true);
  const [showGhost, setShowGhost] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [copied, setCopied] = useState('');
  const [manualCopy, setManualCopy] = useState<{ label: string; text: string } | null>(null);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [buildMode, setBuildMode] = useState(false);
  const [layerIndex, setLayerIndex] = useState(0);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [completedRows, setCompletedRows] = useState<Set<number>>(() => new Set());
  const [printMode, setPrintMode] = useState<PrintMode>('current');
  const [printStartLayer, setPrintStartLayer] = useState(1);
  const [printEndLayer, setPrintEndLayer] = useState(1);
  const [printJobRange, setPrintJobRange] = useState<{ start: number; end: number } | null>(null);
  const canvasRef = useRef<BlueprintCanvasHandle | null>(null);
  const manualCopyRef = useRef<HTMLTextAreaElement | null>(null);
  const companionRef = useRef<HTMLElement | null>(null);
  const urlUpdateTimeout = useRef<number | null>(null);
  const { result, pending: blueprintPending, error: blueprintError } = useBlueprintResult(state, props.initialResult);
  const layered = isLayered(result) ? result : null;
  const currentLayer = layered ? layered.layers[layerIndex] || layered.layers[0] : null;
  const rows = currentLayer ? currentLayer.rows : isFlat(result) ? result.rows : [];
  const currentRow = rows[Math.min(currentRowIndex, Math.max(0, rows.length - 1))] || null;
  const completedCount = rows.filter((row) => completedRows.has(row.z)).length;
  const maxRoundDiameter = state.shape === 'sphere' || state.shape === 'dome' ? 257 : 512;
  const maxRoundRadius = state.shape === 'sphere' || state.shape === 'dome' ? 128 : 256;

  useEffect(() => {
    trackToolEvent('tool_view', { shape: state.shape, title: props.title || 'Minecraft Circle Generator & Blueprint Builder' });
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
    const clearPrintJob = () => setPrintJobRange(null);
    window.addEventListener('afterprint', clearPrintJob);
    return () => window.removeEventListener('afterprint', clearPrintJob);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextShape = validShape(params.get('shape'), state.shape);
    setState((previous) => ({
      ...previous,
      shape: nextShape,
      diameter: clampInt(parseNumber(params.get('d'), previous.diameter), 3, nextShape === 'sphere' || nextShape === 'dome' ? 257 : 512),
      radius: clampInt(parseNumber(params.get('r'), previous.radius), 2, nextShape === 'sphere' || nextShape === 'dome' ? 128 : 256),
      width: clampInt(parseNumber(params.get('w'), previous.width), 3, 512),
      height: clampInt(parseNumber(params.get('h'), previous.height), 3, 512),
      inputMode: params.get('input') === 'radius' ? 'radius' : previous.inputMode,
      fillMode: params.get('fill') === 'filled' ? 'filled' : previous.fillMode,
      solidMode: params.get('mode') === 'solid' ? 'solid' : previous.solidMode,
      thickness: clampInt(parseNumber(params.get('t'), previous.thickness), 1, 8),
      shellThickness: clampInt(parseNumber(params.get('shell'), previous.shellThickness), 1, 4),
      capHeight: clampInt(parseNumber(params.get('cap'), previous.capHeight), 1, 129),
      buildDirection: params.get('dir') === 'top-down' ? 'top-down' : previous.buildDirection,
      domeHalf: params.get('half') === 'bottom' ? 'bottom' : previous.domeHalf
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('shape', state.shape);
    if (roundShapes.includes(state.shape)) {
      params.set('input', state.inputMode);
      params.set('d', String(state.diameter));
      params.set('r', String(state.radius));
    }
    if (state.shape === 'ellipse') {
      params.set('w', String(state.width));
      params.set('h', String(state.height));
    }
    if (state.shape === 'circle' || state.shape === 'ellipse') {
      params.set('fill', state.fillMode);
      params.set('t', String(state.thickness));
    }
    if (state.shape === 'sphere' || state.shape === 'dome') {
      params.set('mode', state.solidMode);
      params.set('shell', String(state.shellThickness));
      params.set('dir', state.buildDirection);
    }
    if (state.shape === 'dome') {
      params.set('cap', String(state.capHeight));
      params.set('half', state.domeHalf);
    }
    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    if (urlUpdateTimeout.current !== null) window.clearTimeout(urlUpdateTimeout.current);
    urlUpdateTimeout.current = window.setTimeout(() => {
      const currentUrl = `${window.location.pathname}${window.location.search}`;
      if (currentUrl !== nextUrl) window.history.replaceState(null, '', nextUrl);
    }, 180);
    return () => {
      if (urlUpdateTimeout.current !== null) window.clearTimeout(urlUpdateTimeout.current);
    };
  }, [state]);

  useEffect(() => {
    setLayerIndex(0);
    setCurrentRowIndex(0);
    setCompletedRows(new Set());
  }, [
    result.title,
    result.dimensions.width,
    result.dimensions.height,
    result.dimensions.depth,
    state.fillMode,
    state.thickness,
    state.solidMode,
    state.shellThickness,
    state.capHeight,
    state.buildDirection,
    state.domeHalf
  ]);

  useEffect(() => {
    if (!layered) return;
    if (layerIndex > Math.max(0, layered.layerCount - 1)) setLayerIndex(Math.max(0, layered.layerCount - 1));
    setPrintStartLayer((value) => clampLayerRange(value, value, layered.layerCount).start);
    setPrintEndLayer((value) => clampLayerRange(value, value, layered.layerCount).end);
  }, [layerIndex, layered]);

  useEffect(() => {
    setCurrentRowIndex(0);
    setCompletedRows(new Set());
  }, [layerIndex]);

  useEffect(() => {
    if (currentRowIndex > Math.max(0, rows.length - 1)) {
      setCurrentRowIndex(Math.max(0, rows.length - 1));
    }
  }, [currentRowIndex, rows.length]);

  function setPatch(patch: Partial<BuilderState>) {
    setState((previous) => ({ ...previous, ...patch }));
    trackToolEvent(patch.shape ? 'shape_changed' : 'params_changed', {
      shape: patch.shape || state.shape,
      param: Object.keys(patch).join(',')
    });
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
      shape: props.initialShape || 'circle',
      inputMode: 'diameter',
      diameter: props.initialDiameter || 16,
      radius: Math.floor((props.initialDiameter || 16) / 2),
      width: props.initialWidth || 16,
      height: props.initialHeight || 16,
      fillMode: 'outline',
      solidMode: 'hollow',
      thickness: 1,
      shellThickness: 1,
      capHeight: Math.ceil((props.initialDiameter || 16) / 2),
      buildDirection: 'bottom-up',
      domeHalf: 'top'
    });
    trackToolEvent('params_changed', { shape: props.initialShape || 'circle', param: 'reset' });
  }

  function updateDiameter(next: number) {
    const diameter = clampInt(next, 3, maxRoundDiameter);
    setPatch({ diameter, radius: Math.floor(diameter / 2) });
  }

  function updateRadius(next: number) {
    const radius = clampInt(next, 2, maxRoundRadius);
    setPatch({ radius, diameter: Math.min(maxRoundDiameter, radius * 2 + 1) });
  }

  function updateOvalSize(width: number, height: number) {
    setPatch({ shape: 'ellipse', width: clampInt(width, 3, 512), height: clampInt(height, 3, 512) });
  }

  async function exportPng() {
    const { safeExportFilename } = await import('@/lib/export/filenames');
    canvasRef.current?.exportPng(safeExportFilename(result, 'png'));
    trackToolEvent('download_png_clicked', { shape: result.shape, layer: currentLayer ? layerIndex + 1 : undefined });
  }

  async function exportSvg() {
    const [{ safeExportFilename }, { exportBlueprintSvg }] = await Promise.all([
      import('@/lib/export/filenames'),
      import('@/lib/export/exportSvg')
    ]);
    downloadTextFile(safeExportFilename(result, 'svg'), exportBlueprintSvg(result, layerIndex), 'image/svg+xml;charset=utf-8');
    trackToolEvent('download_svg_clicked', { shape: result.shape, layer: currentLayer ? layerIndex + 1 : undefined });
  }

  async function exportCsv(mode: 'selected' | 'all' | 'range' = 'all') {
    const [{ safeExportFilename }, { exportBlueprintCsv }] = await Promise.all([
      import('@/lib/export/filenames'),
      import('@/lib/export/exportCsv')
    ]);
    const range = layered && selectedPrintRange ? selectedPrintRange : undefined;
    downloadTextFile(safeExportFilename(result, 'csv'), exportBlueprintCsv(result, layerIndex, mode, range), 'text/csv;charset=utf-8');
    trackToolEvent('download_csv_clicked', {
      shape: result.shape,
      mode,
      layer: currentLayer ? layerIndex + 1 : undefined,
      startLayer: mode === 'range' ? range?.start : undefined,
      endLayer: mode === 'range' ? range?.end : undefined
    });
  }

  async function printBlueprint() {
    const { requestBrowserPrint } = await import('@/lib/export/exportPrint');
    const range = layered
      ? printMode === 'current'
        ? { start: layerIndex + 1, end: layerIndex + 1 }
        : printMode === 'all'
          ? { start: 1, end: layered.layerCount }
          : clampLayerRange(printStartLayer, printEndLayer, layered.layerCount)
      : { start: 1, end: 1 };
    setPrintJobRange(range);
    trackToolEvent('print_clicked', {
      shape: result.shape,
      mode: layered ? printMode : 'current',
      layer: currentLayer ? layerIndex + 1 : undefined,
      startLayer: range.start,
      endLayer: range.end
    });
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => requestBrowserPrint()));
  }

  function copyRows() {
    return copy(rowListText(result, layerIndex), currentLayer ? 'Layer row list copied' : 'Row list copied', 'copy_row_list_clicked');
  }

  function copyCurrentRow() {
    if (!currentRow) return undefined;
    const layerPrefix = currentLayer ? `Layer ${layerIndex + 1}, Y ${currentLayer.y}; ` : '';
    return copy(
      `${layerPrefix}Z ${currentRow.z}: ${segmentText(currentRow)} (${currentRow.blockCount} blocks)`,
      'Current row copied',
      'copy_current_row_clicked'
    );
  }

  function copyLayerSummary() {
    return copy(layerSummaryText(result), 'Layer summary copied', 'copy_layer_summary_clicked');
  }

  function copySummary() {
    return copy(summaryText(result, layerIndex), 'Summary copied', 'copy_summary_clicked');
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
    trackToolEvent('build_row_done_toggled', { shape: result.shape, row: currentRow.z, layer: currentLayer ? layerIndex + 1 : undefined });
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

  const currentSizeLabel = currentLayer
    ? `${result.dimensions.width} block ${state.solidMode} ${result.shape} · layer ${layerIndex + 1} / ${layered?.layerCount ?? 0}`
    : result.shape === 'circle'
      ? `${result.dimensions.width} block circle`
      : `${result.dimensions.width} × ${result.dimensions.height} oval`;
  const introTitle = props.title || 'Minecraft Circle Generator & Blueprint Builder';
  const selectedPrintRange = layered
    ? printMode === 'current'
      ? { start: layerIndex + 1, end: layerIndex + 1 }
      : printMode === 'all'
        ? { start: 1, end: layered.layerCount }
        : clampLayerRange(printStartLayer, printEndLayer, layered.layerCount)
    : null;
  const printableLayers = layered && printJobRange ? layered.layers.slice(printJobRange.start - 1, printJobRange.end) : [];

  return (
    <>
      <div className="workspace-grid">
        <aside className="build-card build-settings" aria-label="Build settings">
          <div className="panel-title">Build settings</div>
          <div className="step-block">
            <div className="step-heading">
              <span>1</span>Shape
            </div>
            <div className="segmented-control shape-grid">
              {allShapes.map((shape) => (
                <button key={shape} type="button" className={state.shape === shape ? 'active' : ''} onClick={() => setPatch({ shape })}>
                  {shape === 'circle' ? '○ ' : shape === 'ellipse' ? '▭ ' : shape === 'sphere' ? '◉ ' : '◒ '}
                  {shapeLabels[shape]}
                </button>
              ))}
            </div>
          </div>

          <div className="step-block">
            <div className="step-heading">
              <span>2</span>Size
            </div>
            {state.shape === 'ellipse' ? (
              <div className="size-pair">
                <label>
                  <span>Width</span>
                  <input
                    type="number"
                    onWheel={preventNumberWheelChange}
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
                    onWheel={preventNumberWheelChange}
                    min={3}
                    max={512}
                    value={state.height}
                    onChange={(event) => setPatch({ height: clampInt(Number(event.target.value), 3, 512), shape: 'ellipse' })}
                  />
                </label>
              </div>
            ) : (
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
                    max={state.inputMode === 'diameter' ? maxRoundDiameter : maxRoundRadius}
                    type="number"
                    onWheel={preventNumberWheelChange}
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
                <p className="range-note">Range: 3 – {maxRoundDiameter}</p>
              </>
            )}
          </div>

          <div className="step-block">
            <div className="step-heading">
              <span>3</span>
              {state.shape === 'circle' || state.shape === 'ellipse' ? 'Build type' : 'Layer mode'}
            </div>
            {state.shape === 'circle' || state.shape === 'ellipse' ? (
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
            ) : (
              <>
                <div className="segmented-control">
                  <button
                    type="button"
                    className={state.solidMode === 'hollow' ? 'active' : ''}
                    onClick={() => setPatch({ solidMode: 'hollow' })}
                  >
                    Hollow shell
                  </button>
                  <button
                    type="button"
                    className={state.solidMode === 'solid' ? 'active' : ''}
                    onClick={() => setPatch({ solidMode: 'solid' })}
                  >
                    Solid
                  </button>
                </div>
                <label className="field-label">Build direction</label>
                <div className="segmented-control small">
                  <button
                    type="button"
                    className={state.buildDirection === 'bottom-up' ? 'active' : ''}
                    onClick={() => setPatch({ buildDirection: 'bottom-up' })}
                  >
                    Bottom-up
                  </button>
                  <button
                    type="button"
                    className={state.buildDirection === 'top-down' ? 'active' : ''}
                    onClick={() => setPatch({ buildDirection: 'top-down' })}
                  >
                    Top-down
                  </button>
                </div>
              </>
            )}
          </div>

          <details key={`${state.shape}-advanced`} className="step-block advanced-settings" open={state.shape === 'dome' || undefined}>
            <summary>
              <div className="step-heading">
                <span>4</span>
                {state.shape === 'circle' || state.shape === 'ellipse' ? 'Thickness' : 'Shell and dome options'}
              </div>
            </summary>
            <div className="thickness-row">
              <input
                type="range"
                min={1}
                max={state.shape === 'circle' || state.shape === 'ellipse' ? 8 : 4}
                value={state.shape === 'circle' || state.shape === 'ellipse' ? state.thickness : state.shellThickness}
                onChange={(event) =>
                  state.shape === 'circle' || state.shape === 'ellipse'
                    ? setPatch({ thickness: clampInt(Number(event.target.value), 1, 8) })
                    : setPatch({ shellThickness: clampInt(Number(event.target.value), 1, 4) })
                }
              />
              <input
                className="thickness-number"
                type="number"
                onWheel={preventNumberWheelChange}
                min={1}
                max={state.shape === 'circle' || state.shape === 'ellipse' ? 8 : 4}
                value={state.shape === 'circle' || state.shape === 'ellipse' ? state.thickness : state.shellThickness}
                onChange={(event) =>
                  state.shape === 'circle' || state.shape === 'ellipse'
                    ? setPatch({ thickness: clampInt(Number(event.target.value), 1, 8) })
                    : setPatch({ shellThickness: clampInt(Number(event.target.value), 1, 4) })
                }
              />
            </div>
            <p className="range-note">Range: 1 – {state.shape === 'circle' || state.shape === 'ellipse' ? 8 : 4}</p>
            {state.shape === 'dome' && (
              <div className="dome-options">
                <label className="field-label">Dome half</label>
                <div className="segmented-control small">
                  <button type="button" className={state.domeHalf === 'top' ? 'active' : ''} onClick={() => setPatch({ domeHalf: 'top' })}>
                    Top half
                  </button>
                  <button
                    type="button"
                    className={state.domeHalf === 'bottom' ? 'active' : ''}
                    onClick={() => setPatch({ domeHalf: 'bottom' })}
                  >
                    Bottom half
                  </button>
                </div>
                <label className="field-label">Cap height layers</label>
                <input
                  className="thickness-number wide"
                  type="number"
                  onWheel={preventNumberWheelChange}
                  min={1}
                  max={129}
                  value={state.capHeight}
                  onChange={(event) => setPatch({ capHeight: clampInt(Number(event.target.value), 1, 129) })}
                />
              </div>
            )}
          </details>

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
              Fit blueprint to screen
            </button>
            <p className="instant-note">Blueprint, counts, row segments, and exports update as soon as you edit a value.</p>
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
              {layered && (
                <button type="button" className={showGhost ? 'active' : ''} onClick={() => setShowGhost((v) => !v)}>
                  Ghost layer
                </button>
              )}
              <button type="button" className={highContrast ? 'active' : ''} onClick={() => setHighContrast((v) => !v)}>
                High contrast
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
              <span className="zoom-hint" aria-hidden="true">Ctrl/Cmd + wheel</span>
            </div>
          </div>

          {(blueprintPending || blueprintError) && (
            <p className="worker-status" role="status">
              {blueprintError || "Calculating large 3D blueprint in the background…"}
            </p>
          )}

          <div className="result-strip" aria-label="Current blueprint result summary">
            <div className="result-strip-stat">
              <span>{layered ? 'Total blocks' : state.fillMode === 'outline' ? 'Outline blocks' : 'Filled blocks'}</span>
              <strong>{result.totalBlocks.toLocaleString()}</strong>
            </div>
            <div className="result-strip-stat">
              <span>{currentLayer ? 'Current layer' : 'Stacks of 64'}</span>
              <strong>{currentLayer ? currentLayer.blockCount.toLocaleString() : stacksText(result)}</strong>
            </div>
            <div className="result-strip-stat">
              <span>Center</span>
              <strong>{centerTitle(result)}</strong>
            </div>
            <div className="result-strip-stat">
              <span>Bounds</span>
              <strong>{boundsText(result)}</strong>
            </div>
            <div className="result-strip-actions">
              <button type="button" className="primary-mini" onClick={copyRows}>
                Copy rows
              </button>
              <button type="button" onClick={exportPng}>
                PNG
              </button>
              <a href="#export-and-share">More exports</a>
            </div>
          </div>

          <BlueprintCanvas
            ref={canvasRef}
            result={result}
            selectedLayerIndex={layerIndex}
            showCoordinates={showCoordinates}
            showSegments={showRowLabels}
            showCenter={showCenter}
            showAxis={showAxis}
            showGhost={showGhost}
            highContrast={highContrast}
            hideToolbar
            highlightedRowZ={buildMode ? (currentRow?.z ?? null) : null}
            onZoomChange={(percent) => setZoomPercent(percent)}
          />

          <div className="canvas-caption">
            <span>Center</span>
            <span>Axis (X/Z)</span>
            <span>Each grid = 1 block</span>
            <strong>{currentSizeLabel}</strong>
            {state.shape === 'circle' && <strong>Radius: {Math.floor(result.dimensions.width / 2)} blocks</strong>}
          </div>

          <WarningPanel warnings={result.warnings} />

          {layered && (
            <section className="layer-control-card" aria-label="Layer controls">
              <strong>{currentLayer?.label}</strong>
              <p>
                Current layer blocks: {currentLayer?.blockCount.toLocaleString()} · Local radius: {currentLayer?.localRadius.toFixed(2)} ·
                Total layers: {layered.layerCount}
              </p>
              <input
                aria-label="Layer slider"
                type="range"
                min={0}
                max={Math.max(0, layered.layerCount - 1)}
                value={layerIndex}
                onChange={(event) => {
                  const next = clampInt(Number(event.target.value), 0, layered.layerCount - 1);
                  setLayerIndex(next);
                  trackToolEvent('layer_changed', { shape: result.shape, layer: next + 1 });
                }}
              />
              <div className="layer-actions">
                <button type="button" onClick={() => setLayerIndex(0)}>
                  First
                </button>
                <button type="button" onClick={() => setLayerIndex((value) => Math.max(0, value - 1))}>
                  Previous layer
                </button>
                <button type="button" onClick={() => setLayerIndex((value) => Math.min(layered.layerCount - 1, value + 1))}>
                  Next layer
                </button>
                <button type="button" onClick={() => setLayerIndex(layered.layerCount - 1)}>
                  Last
                </button>
              </div>
            </section>
          )}

          {buildMode && currentRow && (
            <section ref={companionRef} className="companion-mode-card" aria-label="Companion build mode" aria-live="polite">
              <div className="companion-kicker">Companion Mode</div>
              <div className="current-row-copy">
                <span>{currentLayer ? `Layer ${layerIndex + 1}, Y = ${currentLayer.y}` : 'Current row'}</span>
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
                <h3>{currentLayer ? 'Current layer row segments' : 'Row Segments (top to bottom)'}</h3>
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
                          key={`${currentLayer?.index ?? 0}:${row.z}`}
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

            {layered ? (
              <section className="data-card center-guide-card layer-summary-card">
                <h3>Layer summary</h3>
                <LayerSummaryTable layers={layered.layers} />
              </section>
            ) : (
              <section className="data-card center-guide-card">
                <h3>Odd vs Even Center</h3>
                <div className="center-explain-row">
                  <div className="mini-grid odd">
                    <b />
                  </div>
                  <div>
                    <strong>Odd footprint</strong> <span>(like 31)</span>
                    <p>Has one exact center block. Perfect symmetry around center.</p>
                  </div>
                </div>
                <div className="center-explain-row">
                  <div className="mini-grid even">
                    <b />
                  </div>
                  <div>
                    <strong>Even footprint</strong> <span>(like 32)</span>
                    <p>Center is between middle blocks. Mark the shared center line or 2×2 area before mirroring.</p>
                  </div>
                </div>
              </section>
            )}
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
              {centerInstruction(result)}
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
              <dt>{layered ? 'Total blocks' : state.fillMode === 'outline' ? 'Outline blocks' : 'Filled blocks'}</dt>
              <dd>{result.totalBlocks.toLocaleString()}</dd>
              {currentLayer && (
                <>
                  <dt>Current layer</dt>
                  <dd>{currentLayer.blockCount.toLocaleString()}</dd>
                </>
              )}
              {isFlat(result) && (
                <>
                  <dt>Blocks if filled</dt>
                  <dd>{state.fillMode === 'filled' ? result.totalBlocks.toLocaleString() : result.filledBlocks.toLocaleString()}</dd>
                </>
              )}
              <dt>Stacks of 64</dt>
              <dd>{stacksText(result)}</dd>
            </dl>
          </section>

          <section id="export-and-share" className="result-card export-card">
            <div className="card-kicker">Export & share</div>
            <button type="button" onClick={copyRows}>
              ▣ Copy row list
            </button>
            <button type="button" onClick={copySummary}>
              ▣ Copy summary
            </button>
            {layered && (
              <button type="button" onClick={copyLayerSummary}>
                ▣ Copy layer summary
              </button>
            )}
            <button type="button" onClick={exportPng}>
              ⇩ Download PNG
            </button>
            <button type="button" onClick={exportSvg}>
              ⇩ Download SVG
            </button>
            <button type="button" onClick={() => exportCsv('all')}>
              ⇩ Download CSV
            </button>
            {layered && (
              <button type="button" onClick={() => exportCsv('selected')}>
                ⇩ CSV current layer
              </button>
            )}
            {layered && printMode === 'selected' && (
              <button type="button" onClick={() => exportCsv('range')}>
                ⇩ CSV selected range
              </button>
            )}
            {layered && (
              <div className="print-range-card" aria-label="Layer print range">
                <strong>Layer print range</strong>
                <div className="segmented-control small print-mode-control">
                  <button type="button" className={printMode === 'current' ? 'active' : ''} onClick={() => setPrintMode('current')}>
                    Current layer
                  </button>
                  <button type="button" className={printMode === 'all' ? 'active' : ''} onClick={() => setPrintMode('all')}>
                    All layers
                  </button>
                  <button type="button" className={printMode === 'selected' ? 'active' : ''} onClick={() => setPrintMode('selected')}>
                    Selected range
                  </button>
                </div>
                {printMode === 'selected' && (
                  <div className="print-range-inputs">
                    <label>
                      <span>From layer</span>
                      <input
                        type="number"
                        onWheel={preventNumberWheelChange}
                        min={1}
                        max={layered.layerCount}
                        value={printStartLayer}
                        onChange={(event) => setPrintStartLayer(clampInt(Number(event.target.value), 1, layered.layerCount))}
                      />
                    </label>
                    <label>
                      <span>To layer</span>
                      <input
                        type="number"
                        onWheel={preventNumberWheelChange}
                        min={1}
                        max={layered.layerCount}
                        value={printEndLayer}
                        onChange={(event) => setPrintEndLayer(clampInt(Number(event.target.value), 1, layered.layerCount))}
                      />
                    </label>
                  </div>
                )}
              </div>
            )}
            <button type="button" onClick={printBlueprint}>
              ▤ {layered ? 'Print selected layers' : 'Print blueprint'}
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
              <div className="manual-copy-box" role="dialog" aria-modal="true" aria-label={`${manualCopy.label} manual fallback`} onKeyDown={(event) => isEscape(event) && setManualCopy(null)}>
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

      {printJobRange && (
        <section className="print-sheet" aria-label="Printable blueprint layers">
        <header>
          <p>BlockLayer printable blueprint</p>
          <h2>{result.title}</h2>
          <span>
            {layered && printJobRange ? `Layers ${printJobRange.start}–${printJobRange.end} of ${layered.layerCount}` : currentSizeLabel}
          </span>
        </header>
        <dl className="print-summary">
          <dt>Total blocks</dt>
          <dd>{result.totalBlocks.toLocaleString()}</dd>
          <dt>Center</dt>
          <dd>{centerTitle(result)}</dd>
          <dt>Bounds</dt>
          <dd>{boundsText(result)}</dd>
          <dt>Exports</dt>
          <dd>Rows, PNG, SVG, CSV, and share link are generated from the same current blueprint.</dd>
        </dl>
        {layered ? (
          printableLayers.map((layer) => (
            <article key={`print-${layer.index}`} className="print-layer">
              <h3>
                {layer.label} · Y {layer.y} · {layer.blockCount.toLocaleString()} blocks
              </h3>
              <table>
                <thead>
                  <tr>
                    <th>Z</th>
                    <th>X ranges</th>
                    <th>Blocks</th>
                  </tr>
                </thead>
                <tbody>
                  {layer.rows.map((row) => (
                    <tr key={`print-${layer.index}-${row.z}`}>
                      <td>{row.z}</td>
                      <td>{segmentText(row)}</td>
                      <td>{row.blockCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          ))
        ) : (
          <article className="print-layer">
            <h3>Row segments</h3>
            <table>
              <thead>
                <tr>
                  <th>Z</th>
                  <th>X ranges</th>
                  <th>Blocks</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={`print-flat-${row.z}`}>
                    <td>{row.z}</td>
                    <td>{segmentText(row)}</td>
                    <td>{row.blockCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        )}
        </section>
      )}

      <div className="below-workspace workspace-common-sizes" aria-label="Common blueprint sizes">
        <section className="info-card common-sizes">
          <h3>{state.shape === 'ellipse' ? 'Common oval footprints' : 'Common diameters'}</h3>
          <div className="size-chips">
            {state.shape === 'ellipse'
              ? commonOvalSizes.map((size) => (
                  <button
                    type="button"
                    key={size.label}
                    className={state.width === size.width && state.height === size.height ? 'active' : ''}
                    onClick={() => updateOvalSize(size.width, size.height)}
                  >
                    {size.label}
                  </button>
                ))
              : commonDiameters.map((size) => (
                  <button
                    type="button"
                    key={size}
                    className={roundShapes.includes(state.shape) && state.diameter === size ? 'active' : ''}
                    onClick={() => updateDiameter(size)}
                  >
                    {size}
                  </button>
                ))}
          </div>
          <p>
            Even footprints center between blocks; odd footprints use one center block. Mixed oval footprints use a center line on only one
            axis.
          </p>
        </section>

      </div>
    </>
  );
}

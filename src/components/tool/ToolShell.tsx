'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { trackToolEvent } from '@/lib/analytics/events';
import { exportBlueprintCsv, layerSummaryText, rowListText, summaryText } from '@/lib/export/exportCsv';
import { exportBlueprintSvg } from '@/lib/export/exportSvg';
import { safeExportFilename } from '@/lib/export/filenames';
import { requestBrowserPrint, type PrintMode } from '@/lib/export/exportPrint';
import { generateCircle, generateDome, generateEllipse, generateSphere, type BlueprintResult, type LayeredResult, type RowSegment, type ShapeKind } from '@/lib/geometry';
import { BlueprintCanvas, type BlueprintCanvasHandle } from './BlueprintCanvas';
import { BlueprintTables, rowsForResult } from './BlueprintTables';
import { CircleControls } from './CircleControls';
import { CoordinateReadout } from './CoordinateReadout';
import { DisplayOptions } from './DisplayOptions';
import { DomeControls } from './DomeControls';
import { EllipseControls } from './EllipseControls';
import { ExportPanel } from './ExportPanel';
import { InputPanel } from './InputPanel';
import { LayerSlider } from './LayerSlider';
import { PresetSelector, type PresetPatch } from './PresetSelector';
import { ResultsPanel } from './ResultsPanel';
import { ShapeControls } from './ShapeControls';
import { ShapeTabs } from './ShapeTabs';
import { SphereControls } from './SphereControls';
import { WarningPanel } from './WarningPanel';
import { initialFormState, parseNumber, shapeLabels, type FormState, type ToolShellProps } from './controlTypes';

function generate(state: FormState): BlueprintResult {
  if (state.shape === 'ellipse') return generateEllipse({ width: state.width, height: state.height, fillMode: state.fillMode, thickness: state.thickness });
  if (state.shape === 'sphere') return generateSphere({ inputMode: state.inputMode, diameter: state.diameter, radius: state.radius, mode: state.solidMode, shellThickness: state.shellThickness, buildDirection: state.buildDirection });
  if (state.shape === 'dome') return generateDome({ inputMode: state.inputMode, diameter: state.diameter, radius: state.radius, mode: state.solidMode, shellThickness: state.shellThickness, capHeight: state.capHeight, buildDirection: state.buildDirection, half: state.domeHalf });
  return generateCircle({ inputMode: state.inputMode, diameter: state.diameter, radius: state.radius, fillMode: state.fillMode, thickness: state.thickness });
}

function asLayered(result: BlueprintResult): LayeredResult | null {
  return result.shape === 'sphere' || result.shape === 'dome' ? result : null;
}

function segmentText(row: RowSegment) {
  return row.segments.map((segment) => `${segment.startX}..${segment.endX} (${segment.length})`).join('; ');
}

export function ToolShell(props: ToolShellProps) {
  const [state, setState] = useState<FormState>(() => initialFormState(props));
  const [layerIndex, setLayerIndex] = useState(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [copied, setCopied] = useState('');
  const [printMode, setPrintMode] = useState<PrintMode>('current');
  const [printStartLayer, setPrintStartLayer] = useState(1);
  const [printEndLayer, setPrintEndLayer] = useState(8);
  const canvasRef = useRef<BlueprintCanvasHandle | null>(null);
  const result = useMemo(() => generate(state), [state]);
  const layered = asLayered(result);
  const currentRows = useMemo(() => rowsForResult(result, layerIndex), [result, layerIndex]);
  const currentRow = currentRows[selectedRowIndex] || currentRows[0] || null;

  useEffect(() => {
    trackToolEvent('tool_view', { shape: state.shape, title: props.title || 'BlockLayer generator' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    trackToolEvent('generate_success', { shape: result.shape, totalBlocks: result.totalBlocks, warnings: result.warnings.length });
    if (result.warnings.some((warning) => warning.code === 'LARGE_BLUEPRINT' || warning.code === 'PERFORMANCE_DEGRADED')) {
      trackToolEvent('large_blueprint_warning', { shape: result.shape, totalBlocks: result.totalBlocks });
    }
  }, [result]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shape = params.get('shape') as ShapeKind | null;
    setState((previous) => ({
      ...previous,
      shape: shape && shape in shapeLabels ? shape : previous.shape,
      diameter: parseNumber(params.get('d'), previous.diameter),
      radius: parseNumber(params.get('r'), previous.radius),
      width: parseNumber(params.get('w'), previous.width),
      height: parseNumber(params.get('h'), previous.height),
      inputMode: params.get('input') === 'radius' ? 'radius' : previous.inputMode,
      fillMode: params.get('fill') === 'filled' ? 'filled' : previous.fillMode,
      solidMode: params.get('solid') === 'solid' ? 'solid' : previous.solidMode
    }));
  }, []);

  useEffect(() => {
    if (layered) setLayerIndex((value) => Math.min(value, Math.max(0, layered.layerCount - 1)));
    else setLayerIndex(0);
    setSelectedRowIndex(0);
  }, [layered, result.shape, result.totalBlocks]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('shape', state.shape);
    if (state.shape === 'ellipse') {
      params.set('w', String(state.width));
      params.set('h', String(state.height));
      params.set('fill', state.fillMode);
    } else {
      params.set('input', state.inputMode);
      params.set('d', String(state.diameter));
      params.set('r', String(state.radius));
      if (state.shape === 'circle') params.set('fill', state.fillMode);
      else params.set('solid', state.solidMode);
    }
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }, [state]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((previous) => ({ ...previous, [key]: value }));
    trackToolEvent(key === 'shape' ? 'shape_changed' : 'params_changed', { shape: key === 'shape' ? (value as ShapeKind) : state.shape, param: String(key) });
  }

  function applyPreset(patch: PresetPatch) {
    setState((previous) => ({ ...previous, ...patch }));
    trackToolEvent('params_changed', { shape: patch.shape || state.shape, param: 'local_preset' });
  }

  function download(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copy(text: string, label: string, eventName: Parameters<typeof trackToolEvent>[0]) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 1600);
      trackToolEvent(eventName, { shape: result.shape });
    } catch {
      setCopied('Copy failed');
    }
  }

  function exportPng() {
    canvasRef.current?.exportPng(safeExportFilename(result, 'png'));
    trackToolEvent('download_png_clicked', { shape: result.shape });
  }

  function exportCsv(mode: 'selected' | 'all') {
    download(safeExportFilename(result, 'csv'), exportBlueprintCsv(result, layerIndex, mode), 'text/csv');
    trackToolEvent('download_csv_clicked', { shape: result.shape, mode });
  }

  function exportSvg() {
    download(safeExportFilename(result, 'svg'), exportBlueprintSvg(result, layerIndex), 'image/svg+xml');
    trackToolEvent('download_svg_clicked', { shape: result.shape });
  }

  function printBlueprint(mode: PrintMode = 'current') {
    setPrintMode(mode);
    trackToolEvent('print_clicked', { shape: result.shape, mode });
    requestBrowserPrint();
  }

  function copyCurrentRow() {
    if (!currentRow) return copy('No row selected', 'No row selected', 'copy_row_list_clicked');
    return copy(`Z ${currentRow.z}: ${segmentText(currentRow)} (${currentRow.blockCount} blocks)`, 'Current row copied', 'copy_row_list_clicked');
  }

  function previousRow() {
    setSelectedRowIndex((index) => Math.max(0, index - 1));
  }

  function nextRow() {
    setSelectedRowIndex((index) => Math.min(Math.max(0, currentRows.length - 1), index + 1));
  }

  return (
    <section className="tool-shell" aria-label={props.title || 'BlockLayer generator'}>
      <div className="tool-header">
        <div>
          <span className="eyebrow">Interactive blueprint tool</span>
          <h2>{props.title || 'Generate a block blueprint'}</h2>
        </div>
        <ShapeControls state={state} update={update} />
      </div>
      <ShapeTabs state={state} update={update} />
      <div className="tool-grid">
        <aside className="controls">
          <InputPanel>
            <PresetSelector applyPreset={applyPreset} />
            <div className="control-group">
              <DisplayOptions state={state} update={update} />
              <CircleControls state={state} update={update} />
              <EllipseControls state={state} update={update} />
              <SphereControls state={state} update={update} />
              <DomeControls state={state} update={update} />
            </div>
          </InputPanel>
          <ResultsPanel result={result} layerIndex={layerIndex} />
        </aside>
        <div className="canvas-column">
          <LayerSlider result={layered} layerIndex={layerIndex} setLayerIndex={setLayerIndex} />
          <CoordinateReadout result={result} layerIndex={layerIndex} />
          <BlueprintCanvas ref={canvasRef} result={result} selectedLayerIndex={layerIndex} showCoordinates={state.showCoordinates} showSegments={state.showSegments} showGhost={state.showGhost} highContrast={state.highContrast} highlightedRowZ={currentRow?.z ?? null} />
          <WarningPanel warnings={result.warnings} />
          <ExportPanel layered={layered} copied={copied} printStartLayer={printStartLayer} printEndLayer={printEndLayer} setPrintStartLayer={setPrintStartLayer} setPrintEndLayer={setPrintEndLayer} exportPng={exportPng} exportSvg={exportSvg} exportCsv={exportCsv} printBlueprint={printBlueprint} copyRowList={() => copy(rowListText(result, layerIndex), 'Row list copied', 'copy_row_list_clicked')} copyLayerSummary={() => copy(layerSummaryText(result), 'Layer summary copied', 'copy_layer_summary_clicked')} copyShareLink={() => copy(window.location.href, 'Share URL copied', 'copy_share_url_clicked')} copySummary={() => copy(summaryText(result, layerIndex), 'Summary copied', 'copy_summary_clicked')} copyCurrentRow={copyCurrentRow} previousRow={previousRow} nextRow={nextRow} />
          <BlueprintTables result={result} layerIndex={layerIndex} printMode={printMode} printStartLayer={printStartLayer} printEndLayer={printEndLayer} selectedRowIndex={selectedRowIndex} setSelectedRowIndex={setSelectedRowIndex} />
        </div>
      </div>
    </section>
  );
}

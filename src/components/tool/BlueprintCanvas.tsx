'use client';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { BlueprintResult, TwoDimensionalResult } from '@/lib/geometry';
import { trackToolEvent } from '@/lib/analytics/events';
import { downloadCanvasPng } from '@/lib/export/exportPng';
import { drawBlueprintGrid } from '@/lib/render/canvasRenderer';
import { clampScale, distanceBetweenTouches, fitBoundsToViewport } from '@/lib/render/viewport';

export type BlueprintCanvasHandle = {
  exportPng: (filename: string) => void;
  fitToScreen: () => void;
};

type Props = {
  result: BlueprintResult;
  selectedLayerIndex: number;
  showCoordinates: boolean;
  showSegments: boolean;
  showGhost: boolean;
  highContrast: boolean;
  highlightedRowZ?: number | null;
};

function isTwoDimensionalResult(result: BlueprintResult): result is TwoDimensionalResult {
  return result.shape === 'circle' || result.shape === 'ellipse';
}

function view(result: BlueprintResult, layerIndex: number) {
  if (isTwoDimensionalResult(result)) {
    return { cells: result.cells, bounds: result.bounds, rows: result.rows, previousCells: [] };
  }

  const layer = result.layers[layerIndex] || result.layers[0];
  const previous = result.layers[Math.max(0, layerIndex - 1)] || null;
  return { cells: layer.cells, bounds: layer.bounds, rows: layer.rows, previousCells: previous?.cells || [] };
}

export const BlueprintCanvas = forwardRef<BlueprintCanvasHandle, Props>(function BlueprintCanvas({ result, selectedLayerIndex, showCoordinates, showSegments, showGhost, highContrast, highlightedRowZ }, ref) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const lastPinchDistance = useRef<number | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const data = useMemo(() => view(result, selectedLayerIndex), [result, selectedLayerIndex]);

  const draw = useCallback((canvas: HTMLCanvasElement, exportScale = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cssWidth = canvas.clientWidth || 900;
    const cssHeight = canvas.clientHeight || 620;
    const dpr = exportScale || window.devicePixelRatio || 1;
    if (canvas.width !== Math.floor(cssWidth * dpr) || canvas.height !== Math.floor(cssHeight * dpr)) {
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    drawBlueprintGrid(ctx, {
      bounds: data.bounds,
      cells: data.cells,
      previousCells: data.previousCells,
      width: cssWidth,
      height: cssHeight,
      cellSize: scale,
      offset,
      showCoordinates,
      showSegments,
      showGhost,
      highContrast,
      highlightedRowZ
    });
  }, [data, highContrast, highlightedRowZ, offset, scale, showCoordinates, showGhost, showSegments]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    draw(canvas);
  }, [draw]);

  const fitToScreen = useCallback(() => {
    trackToolEvent('fit_to_screen_clicked', { shape: result.shape });
    const wrap = wrapRef.current;
    if (!wrap) return;
    const viewport = fitBoundsToViewport(data.bounds, wrap.clientWidth, wrap.clientHeight);
    setScale(viewport.scale);
    setOffset(viewport.offset);
  }, [data.bounds, result.shape]);

  useEffect(() => {
    fitToScreen();
  }, [fitToScreen, result.dimensions.width, result.dimensions.height, selectedLayerIndex]);

  useImperativeHandle(ref, () => ({
    exportPng(filename: string) {
      const source = canvasRef.current;
      if (!source) return;
      downloadCanvasPng(source, filename);
    },
    fitToScreen
  }), [fitToScreen]);

  function onWheel(event: React.WheelEvent<HTMLCanvasElement>) {
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.12 : 0.88;
    setScale((value) => clampScale(value * factor));
    trackToolEvent('zoom_used', { shape: result.shape, direction: event.deltaY < 0 ? 'in' : 'out' });
  }

  function onTouchStart(event: React.TouchEvent<HTMLCanvasElement>) {
    lastPinchDistance.current = distanceBetweenTouches(event.touches);
  }

  function onTouchMove(event: React.TouchEvent<HTMLCanvasElement>) {
    const distance = distanceBetweenTouches(event.touches);
    if (!distance || !lastPinchDistance.current) return;
    event.preventDefault();
    const ratio = distance / lastPinchDistance.current;
    setScale((value) => clampScale(value * ratio));
    lastPinchDistance.current = distance;
    trackToolEvent('zoom_used', { shape: result.shape, direction: ratio >= 1 ? 'pinch-out' : 'pinch-in' });
  }

  return (
    <div className="canvas-card">
      <div className="canvas-toolbar">
        <button type="button" onClick={fitToScreen}>Fit to screen</button>
        <button type="button" onClick={() => { setScale((value) => clampScale(value * 1.2)); trackToolEvent('zoom_used', { shape: result.shape, direction: 'in' }); }}>Zoom in</button>
        <button type="button" onClick={() => { setScale((value) => clampScale(value * 0.8)); trackToolEvent('zoom_used', { shape: result.shape, direction: 'out' }); }}>Zoom out</button>
        <button type="button" onClick={() => wrapRef.current?.requestFullscreen?.()}>Fullscreen</button>
        <span>{Math.round(scale * 10) / 10}px / block</span>
      </div>
      <div className="canvas-wrap" ref={wrapRef}>
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="img"
          aria-label={`${result.title} blueprint canvas. Double-click or double-tap Fit to screen; pinch zoom is supported on touch devices.`}
          onWheel={onWheel}
          onDoubleClick={fitToScreen}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={() => { lastPinchDistance.current = null; }}
          onPointerDown={(event) => setDrag({ x: event.clientX, y: event.clientY })}
          onPointerMove={(event) => {
            if (!drag) return;
            setOffset((previous) => ({ x: previous.x + event.clientX - drag.x, y: previous.y + event.clientY - drag.y }));
            trackToolEvent('pan_used', { shape: result.shape });
            setDrag({ x: event.clientX, y: event.clientY });
          }}
          onPointerUp={() => setDrag(null)}
          onPointerLeave={() => setDrag(null)}
        />
      </div>
    </div>
  );
});
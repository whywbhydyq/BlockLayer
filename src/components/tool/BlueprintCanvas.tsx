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
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  fullscreen: () => Promise<boolean>;
};

type Props = {
  result: BlueprintResult;
  selectedLayerIndex: number;
  showCoordinates: boolean;
  showSegments: boolean;
  showGhost: boolean;
  highContrast: boolean;
  highlightedRowZ?: number | null;
  showCenter?: boolean;
  showAxis?: boolean;
  hideToolbar?: boolean;
  onZoomChange?: (percent: number, pxPerBlock: number) => void;
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

export const BlueprintCanvas = forwardRef<BlueprintCanvasHandle, Props>(function BlueprintCanvas({ result, selectedLayerIndex, showCoordinates, showSegments, showGhost, highContrast, highlightedRowZ, showCenter = true, showAxis = true, hideToolbar = false, onZoomChange }, ref) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const lastPinchDistance = useRef<number | null>(null);
  const baseScale = useRef<number | null>(null);
  const lastTracked = useRef<Record<string, number>>({});
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const data = useMemo(() => view(result, selectedLayerIndex), [result, selectedLayerIndex]);

  const notifyZoom = useCallback((nextScale: number) => {
    const base = baseScale.current || nextScale || 1;
    const percent = Math.max(1, Math.round((nextScale / base) * 100));
    onZoomChange?.(percent, nextScale);
  }, [onZoomChange]);

  useEffect(() => {
    notifyZoom(scale);
  }, [notifyZoom, scale]);

  const trackThrottled = useCallback((eventName: 'zoom_used' | 'pan_used', payload: Record<string, string | number | boolean | undefined>, wait = 800) => {
    const now = Date.now();
    if ((lastTracked.current[eventName] || 0) + wait > now) return;
    lastTracked.current[eventName] = now;
    trackToolEvent(eventName, payload);
  }, []);

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
      rows: data.rows,
      width: cssWidth,
      height: cssHeight,
      cellSize: scale,
      offset,
      showCoordinates,
      showSegments,
      showGhost,
      showCenter,
      showAxis,
      highContrast,
      highlightedRowZ
    });
  }, [data, highContrast, highlightedRowZ, offset, scale, showAxis, showCenter, showCoordinates, showGhost, showSegments]);

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
    baseScale.current = viewport.scale;
    setScale(viewport.scale);
    setOffset(viewport.offset);
  }, [data.bounds, result.shape]);

  const zoomIn = useCallback(() => {
    setScale((value) => {
      const next = clampScale(value * 1.2);
      notifyZoom(next);
      return next;
    });
    trackToolEvent('zoom_used', { shape: result.shape, direction: 'in' });
  }, [notifyZoom, result.shape]);

  const zoomOut = useCallback(() => {
    setScale((value) => {
      const next = clampScale(value * 0.8);
      notifyZoom(next);
      return next;
    });
    trackToolEvent('zoom_used', { shape: result.shape, direction: 'out' });
  }, [notifyZoom, result.shape]);

  const resetView = useCallback(() => {
    fitToScreen();
  }, [fitToScreen]);

  const fullscreen = useCallback(async () => {
    const target = wrapRef.current;
    if (!target?.requestFullscreen) return false;
    try {
      await target.requestFullscreen();
      return true;
    } catch {
      return false;
    }
  }, []);

  const exportFullBlueprint = useCallback((filename: string) => {
    const padding = 72;
    const maxCanvas = 4096;
    const maxCells = Math.max(data.bounds.width, data.bounds.height, 1);
    const cellSize = Math.max(4, Math.min(32, Math.floor((maxCanvas - padding * 2) / maxCells)));
    const renderWidth = Math.min(maxCanvas, data.bounds.width * cellSize + padding * 2);
    const renderHeight = Math.min(maxCanvas, data.bounds.height * cellSize + padding * 2);
    const canvas = document.createElement('canvas');
    canvas.width = renderWidth;
    canvas.height = renderHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawBlueprintGrid(ctx, {
      bounds: data.bounds,
      cells: data.cells,
      previousCells: data.previousCells,
      rows: data.rows,
      width: renderWidth,
      height: renderHeight,
      cellSize,
      offset: { x: padding, y: padding },
      showCoordinates,
      showSegments,
      showGhost,
      showCenter,
      showAxis,
      highContrast,
      highlightedRowZ
    });
    downloadCanvasPng(canvas, filename);
  }, [data, highContrast, highlightedRowZ, showAxis, showCenter, showCoordinates, showGhost, showSegments]);

  useEffect(() => {
    fitToScreen();
  }, [fitToScreen, result.dimensions.width, result.dimensions.height, selectedLayerIndex]);

  useImperativeHandle(ref, () => ({
    exportPng(filename: string) {
      exportFullBlueprint(filename);
    },
    fitToScreen,
    zoomIn,
    zoomOut,
    resetView,
    fullscreen
  }), [exportFullBlueprint, fitToScreen, fullscreen, resetView, zoomIn, zoomOut]);

  function onWheel(event: React.WheelEvent<HTMLCanvasElement>) {
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.12 : 0.88;
    setScale((value) => {
      const next = clampScale(value * factor);
      notifyZoom(next);
      return next;
    });
    trackThrottled('zoom_used', { shape: result.shape, direction: event.deltaY < 0 ? 'in' : 'out' });
  }

  function onTouchStart(event: React.TouchEvent<HTMLCanvasElement>) {
    if (event.touches.length < 2) return;
    lastPinchDistance.current = distanceBetweenTouches(event.touches);
  }

  function onTouchMove(event: React.TouchEvent<HTMLCanvasElement>) {
    if (event.touches.length < 2) return;
    const distance = distanceBetweenTouches(event.touches);
    if (!distance || !lastPinchDistance.current) return;
    event.preventDefault();
    const ratio = distance / lastPinchDistance.current;
    setScale((value) => {
      const next = clampScale(value * ratio);
      notifyZoom(next);
      return next;
    });
    lastPinchDistance.current = distance;
    trackThrottled('zoom_used', { shape: result.shape, direction: ratio >= 1 ? 'pinch-out' : 'pinch-in' });
  }

  return (
    <div className="canvas-card blueprint-card">
      {!hideToolbar && (
        <div className="canvas-toolbar">
          <button type="button" onClick={fitToScreen}>Fit to screen</button>
          <button type="button" onClick={zoomIn}>Zoom in</button>
          <button type="button" onClick={zoomOut}>Zoom out</button>
          <button type="button" onClick={fullscreen}>Fullscreen</button>
          <span>{Math.round(scale * 10) / 10}px / block</span>
        </div>
      )}
      <div className="canvas-wrap blueprint-canvas-wrap" ref={wrapRef}>
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
          onPointerDown={(event) => {
            if (event.pointerType === 'touch') return;
            setDrag({ x: event.clientX, y: event.clientY });
          }}
          onPointerMove={(event) => {
            if (event.pointerType === 'touch' || !drag) return;
            setOffset((previous) => ({ x: previous.x + event.clientX - drag.x, y: previous.y + event.clientY - drag.y }));
            trackThrottled('pan_used', { shape: result.shape });
            setDrag({ x: event.clientX, y: event.clientY });
          }}
          onPointerUp={() => setDrag(null)}
          onPointerLeave={() => setDrag(null)}
          onPointerCancel={() => setDrag(null)}
        />
      </div>
    </div>
  );
});

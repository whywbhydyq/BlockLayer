'use client';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { BlueprintResult, TwoDimensionalResult } from '@/lib/geometry';
import { trackToolEvent } from '@/lib/analytics/events';
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
  const pinchActive = useRef(false);
  const baseScale = useRef<number | null>(null);
  const lastTracked = useRef<Record<string, number>>({});
  const resizeFrame = useRef<number | null>(null);
  const touchPanLock = useRef<'pan' | 'scroll' | null>(null);
  const panPointerId = useRef<number | null>(null);
  const lastPanPoint = useRef<{ x: number; y: number } | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
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

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      if (resizeFrame.current !== null) window.cancelAnimationFrame(resizeFrame.current);
      resizeFrame.current = window.requestAnimationFrame(() => {
        fitToScreen();
      });
    });
    observer.observe(wrap);
    return () => {
      observer.disconnect();
      if (resizeFrame.current !== null) window.cancelAnimationFrame(resizeFrame.current);
    };
  }, [fitToScreen]);

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

  const exportFullBlueprint = useCallback(async (filename: string) => {
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
    const { downloadCanvasPng } = await import('@/lib/export/exportPng');
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
    const intentionalZoom = event.ctrlKey || event.metaKey;
    if (!intentionalZoom) return;

    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.12 : 0.88;
    setScale((value) => {
      const next = clampScale(value * factor);
      notifyZoom(next);
      return next;
    });
    trackThrottled('zoom_used', { shape: result.shape, direction: event.deltaY < 0 ? 'in' : 'out', input: 'modified-wheel' });
  }

  function onTouchStart(event: React.TouchEvent<HTMLCanvasElement>) {
    if (event.touches.length < 2) return;
    event.preventDefault();
    pinchActive.current = true;
    lastPinchDistance.current = distanceBetweenTouches(event.touches);
    panPointerId.current = null;
    lastPanPoint.current = null;
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

  function onTouchEnd(event: React.TouchEvent<HTMLCanvasElement>) {
    if (event.touches.length >= 2) return;
    lastPinchDistance.current = null;
    pinchActive.current = false;
    touchPanLock.current = null;
  }

  function stopPan(event?: React.PointerEvent<HTMLCanvasElement>) {
    if (event && panPointerId.current !== event.pointerId) return;
    if (event && event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    panPointerId.current = null;
    lastPanPoint.current = null;
    touchPanLock.current = null;
  }

  function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    const isTouchPointer = event.pointerType === 'touch';
    const isPrimaryButton = event.pointerType === 'touch' || event.button === 0;
    if (!isPrimaryButton || (isTouchPointer && pinchActive.current)) return;
    if (!isTouchPointer) event.preventDefault();
    panPointerId.current = event.pointerId;
    lastPanPoint.current = { x: event.clientX, y: event.clientY };
    touchPanLock.current = null;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (event.pointerType === 'touch' && pinchActive.current) return;
    if (panPointerId.current !== event.pointerId || !lastPanPoint.current) return;
    const dx = event.clientX - lastPanPoint.current.x;
    const dy = event.clientY - lastPanPoint.current.y;
    if (!dx && !dy) return;

    if (event.pointerType === 'touch') {
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (!touchPanLock.current && Math.max(absX, absY) < 6) return;
      if (!touchPanLock.current) touchPanLock.current = absY > absX ? 'scroll' : 'pan';
      if (touchPanLock.current === 'scroll') {
        stopPan(event);
        return;
      }
    }

    event.preventDefault();
    lastPanPoint.current = { x: event.clientX, y: event.clientY };
    setOffset((value) => ({ x: value.x + dx, y: value.y + dy }));
    trackThrottled('pan_used', { shape: result.shape, pointer: event.pointerType });
  }

  function onCanvasKeyDown(event: React.KeyboardEvent<HTMLCanvasElement>) {
    const largeStep = event.shiftKey ? 80 : 24;
    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      zoomIn();
      return;
    }
    if (event.key === '-' || event.key === '_') {
      event.preventDefault();
      zoomOut();
      return;
    }
    if (event.key === '0' || event.key.toLowerCase() === 'f') {
      event.preventDefault();
      fitToScreen();
      return;
    }
    const arrowOffsets: Record<string, { x: number; y: number }> = {
      ArrowUp: { x: 0, y: largeStep },
      ArrowDown: { x: 0, y: -largeStep },
      ArrowLeft: { x: largeStep, y: 0 },
      ArrowRight: { x: -largeStep, y: 0 }
    };
    const nextOffset = arrowOffsets[event.key];
    if (!nextOffset) return;
    event.preventDefault();
    setOffset((value) => ({ x: value.x + nextOffset.x, y: value.y + nextOffset.y }));
    trackThrottled('pan_used', { shape: result.shape, pointer: 'keyboard' });
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
          aria-label={`${result.title} blueprint canvas. Drag with a mouse or pen to pan. On touch screens, horizontal one-finger drags pan the blueprint and vertical swipes scroll the page. Use Fit to recenter, Ctrl or Command plus mouse wheel, plus and minus keys, or pinch to zoom.`}
          onWheel={onWheel}
          onKeyDown={onCanvasKeyDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={stopPan}
          onPointerLeave={stopPan}
          onPointerCancel={stopPan}
        />
      </div>
    </div>
  );
});

import type { GridBounds } from '@/lib/geometry';

export type ViewportState = { scale: number; offset: { x: number; y: number } };
type TouchPointList = { readonly length: number; [index: number]: { clientX: number; clientY: number } };

export function fitBoundsToViewport(bounds: GridBounds, viewportWidth: number, viewportHeight: number): ViewportState {
  const scale = Math.max(4, Math.min((viewportWidth - 80) / bounds.width, (viewportHeight - 80) / bounds.height));
  return {
    scale,
    offset: {
      x: viewportWidth / 2 - (bounds.width * scale) / 2,
      y: viewportHeight / 2 - (bounds.height * scale) / 2
    }
  };
}

export function clampScale(value: number): number {
  return Math.max(2, Math.min(80, value));
}

export function distanceBetweenTouches(touches: TouchPointList): number | null {
  if (touches.length < 2) return null;
  const a = touches[0];
  const b = touches[1];
  if (!a || !b) return null;
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}
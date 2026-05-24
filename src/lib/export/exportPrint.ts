export type PrintMode = 'current' | 'all' | 'selected';

export function clampPrintRange(startLayer: number, endLayer: number, totalLayers: number) {
  const start = Math.max(1, Math.min(Math.round(startLayer), totalLayers));
  const end = Math.max(start, Math.min(Math.round(endLayer), totalLayers));
  return { start, end };
}

export function requestBrowserPrint() {
  window.setTimeout(() => window.print(), 0);
}

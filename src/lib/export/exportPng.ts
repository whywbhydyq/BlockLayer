export function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

export function isPngExportLarge(width: number, height: number, scale = 1) {
  return width * scale > 4096 || height * scale > 4096;
}

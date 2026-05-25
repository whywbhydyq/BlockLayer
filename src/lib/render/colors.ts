export type BlueprintPalette = {
  background: string;
  empty: string;
  outline: string;
  fill: string;
  ghost: string;
  axis: string;
  axisStrong: string;
  grid: string;
  text: string;
  highlight: string;
  center: string;
  labelBackground: string;
  labelBorder: string;
  labelText: string;
};

export function blueprintPalette(highContrast = false): BlueprintPalette {
  return highContrast
    ? { background: '#ffffff', empty: '#ffffff', outline: '#000000', fill: '#111827', ghost: 'rgba(0,0,0,0.18)', axis: '#111827', axisStrong: '#000000', grid: '#111827', text: '#000000', highlight: 'rgba(245, 158, 11, 0.25)', center: '#dc2626', labelBackground: '#ffffff', labelBorder: '#000000', labelText: '#000000' }
    : { background: '#fbfdff', empty: '#fbfdff', outline: '#0b63ce', fill: '#4f9bff', ghost: 'rgba(15, 97, 202, 0.12)', axis: '#0b63ce', axisStrong: '#0b63ce', grid: '#e1e7ef', text: '#1d2939', highlight: 'rgba(245, 158, 11, 0.20)', center: '#ef1d2a', labelBackground: '#eef6ff', labelBorder: '#0b63ce', labelText: '#102a43' };
}

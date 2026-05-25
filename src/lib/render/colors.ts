export type BlueprintPalette = {
  background: string;
  empty: string;
  outline: string;
  fill: string;
  ghost: string;
  axis: string;
  grid: string;
  text: string;
  highlight: string;
};

export function blueprintPalette(highContrast = false): BlueprintPalette {
  return highContrast
    ? { background: '#ffffff', empty: '#ffffff', outline: '#000000', fill: '#111827', ghost: 'rgba(0,0,0,0.18)', axis: '#b45309', grid: '#111827', text: '#000000', highlight: 'rgba(245, 158, 11, 0.25)' }
    : { background: '#f8fbf7', empty: '#fbfdf9', outline: '#236c43', fill: '#3b8f5a', ghost: 'rgba(59, 130, 246, 0.18)', axis: '#c06a25', grid: '#d5ddd5', text: '#17201b', highlight: 'rgba(245, 158, 11, 0.20)' };
}

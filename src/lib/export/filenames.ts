import type { BlueprintResult } from '@/lib/geometry';
import { safeFilename as legacySafeFilename } from './exportCsv';

export function safeExportFilename(result: BlueprintResult, extension: 'png' | 'csv' | 'svg' | 'txt' | 'html') {
  if (extension === 'html') return legacySafeFilename(result, 'txt').replace(/\.txt$/, '.html');
  return legacySafeFilename(result, extension);
}

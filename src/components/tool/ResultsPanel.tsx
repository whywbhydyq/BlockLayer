import type { BlueprintResult } from '@/lib/geometry';
import { ResultsSummary } from './ResultsSummary';

export function ResultsPanel({ result, layerIndex }: { result: BlueprintResult; layerIndex: number }) {
  return <section className="results-panel" aria-label="Results panel"><ResultsSummary result={result} layerIndex={layerIndex} /></section>;
}

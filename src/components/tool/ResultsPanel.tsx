// Legacy modular component retained for migration/reference.
// ToolShell.tsx is the current primary homepage/tool-page workspace; see LEGACY_COMPONENTS.md before reintroducing this component.
import type { BlueprintResult } from '@/lib/geometry';
import { ResultsSummary } from './ResultsSummary';

export function ResultsPanel({ result, layerIndex }: { result: BlueprintResult; layerIndex: number }) {
  return <section className="results-panel" aria-label="Results panel"><ResultsSummary result={result} layerIndex={layerIndex} /></section>;
}

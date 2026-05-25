import type { BlueprintWarning } from '@/lib/geometry';

export function WarningPanel({ warnings }: { warnings: BlueprintWarning[] }) {
  if (warnings.length === 0) return null;
  return (
    <div className="warning-panel" role="status" aria-live="polite">
      <strong>Blueprint notes</strong>
      <ul>{warnings.map((warning) => <li key={warning.code + warning.message}>{warning.message}</li>)}</ul>
    </div>
  );
}

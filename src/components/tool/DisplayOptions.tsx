'use client';
// Legacy modular component retained for migration/reference.
// ToolShell.tsx is the current primary homepage/tool-page workspace; see LEGACY_COMPONENTS.md before reintroducing this component.
import type { FormState, UpdateFormState } from './controlTypes';

export function DisplayOptions({ state, update }: { state: FormState; update: UpdateFormState }) {
  return (
    <div className="control-row">
      <label className="checkbox-row"><input type="checkbox" checked={state.highContrast} onChange={(event) => update('highContrast', event.target.checked)} /> High contrast</label>
      <label className="checkbox-row"><input type="checkbox" checked={state.showCoordinates} onChange={(event) => update('showCoordinates', event.target.checked)} /> Coordinates</label>
      <label className="checkbox-row"><input type="checkbox" checked={state.showSegments} onChange={(event) => update('showSegments', event.target.checked)} /> Segment labels</label>
      <label className="checkbox-row"><input type="checkbox" checked={state.showGhost} disabled={state.shape === 'circle' || state.shape === 'ellipse'} onChange={(event) => update('showGhost', event.target.checked)} /> Ghost previous layer</label>
    </div>
  );
}

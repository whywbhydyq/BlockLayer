'use client';
// Legacy modular component retained for migration/reference.
// ToolShell.tsx is the current primary homepage/tool-page workspace; see LEGACY_COMPONENTS.md before reintroducing this component.
import type { BuildDirection, InputMode, SolidMode } from '@/lib/geometry';
import type { FormState, UpdateFormState } from './controlTypes';
import { parseNumber } from './controlTypes';

export function SphereControls({ state, update }: { state: FormState; update: UpdateFormState }) {
  if (state.shape !== 'sphere') return null;
  return (
    <>
      <div className="control-row">
        <label>Input mode<select value={state.inputMode} onChange={(event) => update('inputMode', event.target.value as InputMode)}><option value="diameter">Diameter</option><option value="radius">Radius</option></select></label>
        {state.inputMode === 'diameter' ? <label>Diameter blocks<input type="number" onWheel={(event) => event.currentTarget.blur()} min={1} max={257} value={state.diameter} onChange={(event) => update('diameter', parseNumber(event.target.value, 31))} /></label> : <label>Radius blocks<input type="number" onWheel={(event) => event.currentTarget.blur()} min={1} max={128} value={state.radius} onChange={(event) => update('radius', parseNumber(event.target.value, 15))} /></label>}
      </div>
      <div className="control-row">
        <label>Mode<select value={state.solidMode} onChange={(event) => update('solidMode', event.target.value as SolidMode)}><option value="hollow">Hollow shell</option><option value="solid">Solid</option></select></label>
        <label>Shell thickness<input type="number" onWheel={(event) => event.currentTarget.blur()} min={1} max={4} value={state.shellThickness} onChange={(event) => update('shellThickness', parseNumber(event.target.value, 1))} /></label>
        <label>Build direction<select value={state.buildDirection} onChange={(event) => update('buildDirection', event.target.value as BuildDirection)}><option value="bottom-up">Bottom-up</option><option value="top-down">Top-down</option></select></label>
      </div>
    </>
  );
}

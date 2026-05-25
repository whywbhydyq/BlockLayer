'use client';
import type { FillMode, InputMode } from '@/lib/geometry';
import type { FormState, UpdateFormState } from './controlTypes';
import { parseNumber } from './controlTypes';

export function CircleControls({ state, update }: { state: FormState; update: UpdateFormState }) {
  if (state.shape !== 'circle') return null;
  return (
    <>
      <div className="control-row">
        <label>Input mode<select value={state.inputMode} onChange={(event) => update('inputMode', event.target.value as InputMode)}><option value="diameter">Diameter</option><option value="radius">Radius</option></select></label>
        {state.inputMode === 'diameter' ? <label>Diameter blocks<input type="number" min={1} max={1024} value={state.diameter} onChange={(event) => update('diameter', parseNumber(event.target.value, 31))} /></label> : <label>Radius blocks<input type="number" min={1} max={512} value={state.radius} onChange={(event) => update('radius', parseNumber(event.target.value, 15))} /></label>}
      </div>
      <div className="control-row">
        <label>Build mode<select value={state.fillMode} onChange={(event) => update('fillMode', event.target.value as FillMode)}><option value="outline">Outline</option><option value="filled">Filled</option></select></label>
        <label>Outline thickness<input type="number" min={1} max={8} value={state.thickness} onChange={(event) => update('thickness', parseNumber(event.target.value, 1))} /></label>
      </div>
    </>
  );
}

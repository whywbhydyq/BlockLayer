'use client';
// Legacy modular component retained for migration/reference.
// ToolShell.tsx is the current primary homepage/tool-page workspace; see LEGACY_COMPONENTS.md before reintroducing this component.
import type { FillMode } from '@/lib/geometry';
import type { FormState, UpdateFormState } from './controlTypes';
import { parseNumber } from './controlTypes';

export function EllipseControls({ state, update }: { state: FormState; update: UpdateFormState }) {
  if (state.shape !== 'ellipse') return null;
  return (
    <>
      <div className="control-row">
        <label>Width blocks<input type="number" onWheel={(event) => event.currentTarget.blur()} min={1} max={1024} value={state.width} onChange={(event) => update('width', parseNumber(event.target.value, 31))} /></label>
        <label>Height blocks<input type="number" onWheel={(event) => event.currentTarget.blur()} min={1} max={1024} value={state.height} onChange={(event) => update('height', parseNumber(event.target.value, 21))} /></label>
      </div>
      <div className="control-row">
        <label>Build mode<select value={state.fillMode} onChange={(event) => update('fillMode', event.target.value as FillMode)}><option value="outline">Outline</option><option value="filled">Filled</option></select></label>
        <label>Outline thickness<input type="number" onWheel={(event) => event.currentTarget.blur()} min={1} max={8} value={state.thickness} onChange={(event) => update('thickness', parseNumber(event.target.value, 1))} /></label>
      </div>
    </>
  );
}

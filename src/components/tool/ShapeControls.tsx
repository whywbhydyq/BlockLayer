'use client';
// Legacy modular component retained for migration/reference.
// ToolShell.tsx is the current primary homepage/tool-page workspace; see LEGACY_COMPONENTS.md before reintroducing this component.
import type { ShapeKind } from '@/lib/geometry';
import type { FormState, UpdateFormState } from './controlTypes';
import { shapeLabels } from './controlTypes';

export function ShapeControls({ state, update }: { state: FormState; update: UpdateFormState }) {
  return (
    <div className="shape-tabs" role="tablist" aria-label="Blueprint shape">
      {(Object.keys(shapeLabels) as ShapeKind[]).map((shape) => (
        <button key={shape} type="button" role="tab" aria-selected={state.shape === shape} className={state.shape === shape ? 'active' : ''} onClick={() => update('shape', shape)}>
          {shapeLabels[shape]}
        </button>
      ))}
    </div>
  );
}

'use client';
import type { FormState, UpdateFormState } from './controlTypes';
import { shapeLabels } from './controlTypes';
import type { ShapeKind } from '@/lib/geometry';

export function ShapeTabs({ state, update }: { state: FormState; update: UpdateFormState }) {
  const shapes = Object.entries(shapeLabels) as Array<[ShapeKind, string]>;
  return (
    <div className="shape-tabs" role="tablist" aria-label="Shape tabs">
      {shapes.map(([shape, label]) => (
        <button key={shape} type="button" role="tab" aria-selected={state.shape === shape} className={state.shape === shape ? 'active' : ''} onClick={() => update('shape', shape)}>
          {label}
        </button>
      ))}
    </div>
  );
}

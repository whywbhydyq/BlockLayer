'use client';
import type { FormState } from './controlTypes';

export type PresetPatch = Partial<Pick<FormState, 'shape' | 'diameter' | 'radius' | 'width' | 'height' | 'capHeight' | 'fillMode' | 'solidMode'>>;

const presets: Array<{ label: string; patch: PresetPatch }> = [
  { label: '31 circle', patch: { shape: 'circle', diameter: 31, radius: 15, fillMode: 'outline' } },
  { label: '64 arena circle', patch: { shape: 'circle', diameter: 64, radius: 32, fillMode: 'outline' } },
  { label: '48×32 oval', patch: { shape: 'ellipse', width: 48, height: 32, fillMode: 'outline' } },
  { label: '32 sphere', patch: { shape: 'sphere', diameter: 32, radius: 16, solidMode: 'hollow' } },
  { label: '32 dome', patch: { shape: 'dome', diameter: 32, radius: 16, capHeight: 16, solidMode: 'hollow' } }
];

export function PresetSelector({ applyPreset }: { applyPreset: (patch: PresetPatch) => void }) {
  return (
    <section className="preset-selector" aria-label="Local blueprint presets">
      <strong>Local presets</strong>
      <div className="preset-actions">
        {presets.map((preset) => <button type="button" key={preset.label} onClick={() => applyPreset(preset.patch)}>{preset.label}</button>)}
      </div>
    </section>
  );
}

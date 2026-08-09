import {
  blueprintSignature,
  readActiveSession,
  readProjectLibrary,
  removeProject,
  upsertProject,
  writeActiveSession,
  writeProjectLibrary,
  type BlueprintProject
} from '../src/lib/projects/blueprintProjects';
import { summarizeMaterialPlan } from '../src/lib/projects/materialPlan';
import type { BlueprintInputState } from '../src/lib/geometry/generateBlueprint';
import { parseNumber } from '../src/components/tool/controlTypes';

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

const circle: BlueprintInputState = {
  shape: 'circle',
  inputMode: 'diameter',
  diameter: 31,
  radius: 15,
  width: 31,
  height: 31,
  fillMode: 'outline',
  solidMode: 'hollow',
  thickness: 1,
  shellThickness: 1,
  capHeight: 16,
  buildDirection: 'bottom-up',
  domeHalf: 'top'
};

const signature = blueprintSignature(circle);
assert(parseNumber(null, 16) === 16, 'missing URL parameters must preserve the configured default');
assert(signature === blueprintSignature({ ...circle }), 'same blueprint settings must produce the same signature');
assert(signature !== blueprintSignature({ ...circle, diameter: 33 }), 'different dimensions must not share progress');

const storage = new MemoryStorage();
writeActiveSession(storage, signature, {
  progress: { layerIndex: 2, currentRowIndex: 4, completedRowsByLayer: { '2': [3, 1, 3, Number.NaN] } },
  materials: [
    { id: 'stone', name: ' Stone ', count: 64 },
    { id: 'glass', name: 'Glass', count: 17 }
  ]
});
const restored = readActiveSession(storage, signature);
assert(restored?.progress.layerIndex === 2, 'active session must restore the selected layer');
assert(restored?.progress.completedRowsByLayer['2']?.join(',') === '1,3', 'completed rows must be finite, unique, and sorted');
assert(restored?.materials[0]?.name === 'Stone', 'material names must be normalized before persistence');

storage.setItem('blocklayer:active-sessions:v1', '{broken');
assert(readActiveSession(storage, signature) === null, 'corrupt local storage must fail closed without throwing');

const project: BlueprintProject = {
  id: 'project-1',
  name: 'Spawn dome',
  updatedAt: '2026-08-09T00:00:00.000Z',
  state: { ...circle, shape: 'dome' },
  session: {
    progress: { layerIndex: 1, currentRowIndex: 2, completedRowsByLayer: { '1': [0] } },
    materials: [{ id: 'quartz', name: 'Quartz', count: 128 }]
  }
};
writeProjectLibrary(storage, upsertProject([], project));
assert(readProjectLibrary(storage)[0]?.name === 'Spawn dome', 'saved project library must round-trip');
assert(upsertProject([project], { ...project, name: 'Updated dome' }).length === 1, 'saving the same project id must replace it');
assert(removeProject([project], project.id).length === 0, 'project deletion must remove only the selected id');

const plan = summarizeMaterialPlan(200, [
  { id: 'stone', name: 'Stone', count: 130 },
  { id: 'glass', name: 'Glass', count: 64 }
]);
assert(plan.allocated === 194 && plan.remaining === 6 && plan.overAssigned === 0, 'material plan totals must be exact');
assert(plan.entries[0]?.fullStacks === 2 && plan.entries[0]?.remainder === 2, 'material plan must report stack breakdown');
assert(plan.entries[0]?.shulkerBoxes === 1, 'material plan must report shulker boxes needed');
const over = summarizeMaterialPlan(10, [{ id: 'stone', name: 'Stone', count: 12 }]);
assert(over.remaining === 0 && over.overAssigned === 2, 'over-assignment must be explicit instead of hidden');

console.log('project persistence and material plan tests passed');

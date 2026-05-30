import { generateBlueprint } from '@/lib/geometry/generateBlueprint';
import type { BlueprintResult } from '@/lib/geometry/types';
import type { BlueprintInputState } from '@/lib/geometry/generateBlueprint';

export type BlueprintWorkerRequest = {
  id: number;
  state: BlueprintInputState;
};

export type BlueprintWorkerResponse =
  | { id: number; ok: true; result: BlueprintResult }
  | { id: number; ok: false; error: string };

self.onmessage = (event: MessageEvent<BlueprintWorkerRequest>) => {
  const { id, state } = event.data;
  try {
    const result = generateBlueprint(state);
    self.postMessage({ id, ok: true, result } satisfies BlueprintWorkerResponse);
  } catch (error) {
    self.postMessage({ id, ok: false, error: error instanceof Error ? error.message : 'Blueprint generation failed' } satisfies BlueprintWorkerResponse);
  }
};

import type { BlueprintInputState } from '../geometry/generateBlueprint';
import { sanitizeMaterialEntries, type MaterialEntry } from './materialPlan';

export const ACTIVE_SESSIONS_STORAGE_KEY = 'blocklayer:active-sessions:v1';
export const PROJECT_LIBRARY_STORAGE_KEY = 'blocklayer:saved-projects:v1';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export type BlueprintProgress = {
  layerIndex: number;
  currentRowIndex: number;
  completedRowsByLayer: Record<string, number[]>;
};

export type BlueprintSession = {
  progress: BlueprintProgress;
  materials: MaterialEntry[];
};

export type BlueprintProject = {
  id: string;
  name: string;
  updatedAt: string;
  state: BlueprintInputState;
  session: BlueprintSession;
};

type ActiveSessionEnvelope = {
  version: 1;
  sessions: Record<string, BlueprintSession>;
};

type ProjectLibraryEnvelope = {
  version: 1;
  projects: BlueprintProject[];
};

const emptyProgress = (): BlueprintProgress => ({
  layerIndex: 0,
  currentRowIndex: 0,
  completedRowsByLayer: {}
});

function finiteIndex(value: unknown) {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(10_000, Math.round(parsed)));
}

function parseJson(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function normalizeCompletedRows(value: unknown): Record<string, number[]> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  const rows: Record<string, number[]> = {};
  for (const [layer, candidates] of Object.entries(value as Record<string, unknown>).slice(0, 10_000)) {
    if (!Array.isArray(candidates)) continue;
    const normalized = Array.from(
      new Set(
        candidates
          .filter((candidate): candidate is number => typeof candidate === 'number' && Number.isFinite(candidate))
          .map((candidate) => Math.round(candidate))
      )
    ).sort((left, right) => left - right);
    rows[layer.slice(0, 40)] = normalized.slice(0, 10_000);
  }
  return rows;
}

export function sanitizeProgress(value: unknown): BlueprintProgress {
  if (!value || typeof value !== 'object') return emptyProgress();
  const record = value as Record<string, unknown>;
  return {
    layerIndex: finiteIndex(record.layerIndex),
    currentRowIndex: finiteIndex(record.currentRowIndex),
    completedRowsByLayer: normalizeCompletedRows(record.completedRowsByLayer)
  };
}

export function sanitizeSession(value: unknown): BlueprintSession {
  if (!value || typeof value !== 'object') return { progress: emptyProgress(), materials: [] };
  const record = value as Record<string, unknown>;
  return {
    progress: sanitizeProgress(record.progress),
    materials: sanitizeMaterialEntries(record.materials)
  };
}

function validEnum<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === 'string' && allowed.includes(value as T);
}

function finiteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function normalizeBlueprintState(value: unknown): BlueprintInputState | null {
  if (!value || typeof value !== 'object') return null;
  const state = value as Record<string, unknown>;
  if (
    !validEnum(state.shape, ['circle', 'ellipse', 'sphere', 'dome'] as const) ||
    !validEnum(state.inputMode, ['diameter', 'radius'] as const) ||
    !validEnum(state.fillMode, ['outline', 'filled'] as const) ||
    !validEnum(state.solidMode, ['hollow', 'solid'] as const) ||
    !validEnum(state.buildDirection, ['bottom-up', 'top-down'] as const) ||
    !validEnum(state.domeHalf, ['top', 'bottom'] as const)
  ) {
    return null;
  }
  for (const field of ['diameter', 'radius', 'width', 'height', 'thickness', 'shellThickness', 'capHeight'] as const) {
    if (!finiteNumber(state[field])) return null;
  }
  return state as BlueprintInputState;
}

function normalizeProject(value: unknown): BlueprintProject | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const id = typeof record.id === 'string' ? record.id.trim().slice(0, 100) : '';
  const name = typeof record.name === 'string' ? record.name.trim().slice(0, 100) : '';
  const updatedAt = typeof record.updatedAt === 'string' ? record.updatedAt : '';
  const state = normalizeBlueprintState(record.state);
  if (!id || !name || !updatedAt || !state) return null;
  return { id, name, updatedAt, state, session: sanitizeSession(record.session) };
}

export function blueprintSignature(state: BlueprintInputState) {
  return [
    'v1',
    state.shape,
    state.inputMode,
    state.diameter,
    state.radius,
    state.width,
    state.height,
    state.fillMode,
    state.solidMode,
    state.thickness,
    state.shellThickness,
    state.capHeight,
    state.buildDirection,
    state.domeHalf
  ].join('|');
}

function readActiveEnvelope(storage: StorageLike): ActiveSessionEnvelope | null {
  const value = parseJson(storage.getItem(ACTIVE_SESSIONS_STORAGE_KEY));
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (record.version !== 1 || !record.sessions || typeof record.sessions !== 'object' || Array.isArray(record.sessions)) return null;
  const sessions: Record<string, BlueprintSession> = {};
  for (const [signature, session] of Object.entries(record.sessions as Record<string, unknown>).slice(-50)) {
    sessions[signature] = sanitizeSession(session);
  }
  return { version: 1, sessions };
}

export function readActiveSession(storage: StorageLike, signature: string): BlueprintSession | null {
  return readActiveEnvelope(storage)?.sessions[signature] ?? null;
}

export function writeActiveSession(storage: StorageLike, signature: string, session: BlueprintSession) {
  const envelope = readActiveEnvelope(storage) ?? { version: 1 as const, sessions: {} };
  delete envelope.sessions[signature];
  envelope.sessions[signature] = sanitizeSession(session);
  const entries = Object.entries(envelope.sessions).slice(-50);
  storage.setItem(ACTIVE_SESSIONS_STORAGE_KEY, JSON.stringify({ version: 1, sessions: Object.fromEntries(entries) }));
}

export function clearActiveSession(storage: StorageLike, signature: string) {
  const envelope = readActiveEnvelope(storage);
  if (!envelope) return;
  delete envelope.sessions[signature];
  storage.setItem(ACTIVE_SESSIONS_STORAGE_KEY, JSON.stringify(envelope));
}

export function readProjectLibrary(storage: StorageLike): BlueprintProject[] {
  const value = parseJson(storage.getItem(PROJECT_LIBRARY_STORAGE_KEY));
  if (!value || typeof value !== 'object') return [];
  const record = value as Record<string, unknown>;
  if (record.version !== 1 || !Array.isArray(record.projects)) return [];
  return record.projects.flatMap((project) => {
    const normalized = normalizeProject(project);
    return normalized ? [normalized] : [];
  }).slice(0, 30);
}

export function writeProjectLibrary(storage: StorageLike, projects: BlueprintProject[]) {
  const envelope: ProjectLibraryEnvelope = {
    version: 1,
    projects: projects.flatMap((project) => {
      const normalized = normalizeProject(project);
      return normalized ? [normalized] : [];
    }).slice(0, 30)
  };
  storage.setItem(PROJECT_LIBRARY_STORAGE_KEY, JSON.stringify(envelope));
}

export function upsertProject(projects: BlueprintProject[], project: BlueprintProject) {
  const normalized = normalizeProject(project);
  if (!normalized) return projects;
  return [normalized, ...projects.filter((candidate) => candidate.id !== normalized.id)].slice(0, 30);
}

export function removeProject(projects: BlueprintProject[], id: string) {
  return projects.filter((project) => project.id !== id);
}

export type MaterialEntry = {
  id: string;
  name: string;
  count: number;
};

export type MaterialPlanEntry = MaterialEntry & {
  fullStacks: number;
  remainder: number;
  stacksRoundedUp: number;
  shulkerBoxes: number;
};

export type MaterialPlanSummary = {
  entries: MaterialPlanEntry[];
  totalBlocks: number;
  allocated: number;
  remaining: number;
  overAssigned: number;
  isBalanced: boolean;
};

function finiteNonNegativeInt(value: unknown, fallback = 0) {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.min(10_000_000, Math.round(parsed)));
}

export function sanitizeMaterialEntries(value: unknown): MaterialEntry[] {
  if (!Array.isArray(value)) return [];

  const seenIds = new Set<string>();
  return value.slice(0, 40).flatMap((candidate, index) => {
    if (!candidate || typeof candidate !== 'object') return [];
    const record = candidate as Record<string, unknown>;
    const rawId = typeof record.id === 'string' ? record.id.trim() : '';
    const baseId = rawId || `material-${index + 1}`;
    let id = baseId.slice(0, 80);
    while (seenIds.has(id)) id = `${baseId}-${index + 1}`.slice(0, 80);
    seenIds.add(id);

    return [
      {
        id,
        name: (typeof record.name === 'string' ? record.name.trim() : '').slice(0, 80),
        count: finiteNonNegativeInt(record.count)
      }
    ];
  });
}

export function summarizeMaterialPlan(totalBlocks: number, value: unknown): MaterialPlanSummary {
  const safeTotal = finiteNonNegativeInt(totalBlocks);
  const entries = sanitizeMaterialEntries(value).map((entry) => ({
    ...entry,
    fullStacks: Math.floor(entry.count / 64),
    remainder: entry.count % 64,
    stacksRoundedUp: entry.count === 0 ? 0 : Math.ceil(entry.count / 64),
    shulkerBoxes: entry.count === 0 ? 0 : Math.ceil(entry.count / (64 * 27))
  }));
  const allocated = entries.reduce((sum, entry) => sum + entry.count, 0);

  return {
    entries,
    totalBlocks: safeTotal,
    allocated,
    remaining: Math.max(0, safeTotal - allocated),
    overAssigned: Math.max(0, allocated - safeTotal),
    isBalanced: allocated === safeTotal
  };
}

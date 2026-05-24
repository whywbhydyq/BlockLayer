import type { StackCount } from './types';

export function countStacks(totalBlocks: number): StackCount {
  const safe = Math.max(0, Math.floor(totalBlocks));
  const fullStacks = Math.floor(safe / 64);
  const remainder = safe % 64;
  const totalStacksRoundedUp = Math.ceil(safe / 64);
  return {
    totalBlocks: safe,
    fullStacks,
    remainder,
    totalStacksRoundedUp,
    shulkerBoxes: Math.floor(totalStacksRoundedUp / 27),
    shulkerRemainderStacks: totalStacksRoundedUp % 27
  };
}

'use client';
import type { ReactNode } from 'react';

export function InputPanel({ children }: { children: ReactNode }) {
  return <section className="input-panel" aria-label="Input panel"><h3>Input panel</h3>{children}</section>;
}

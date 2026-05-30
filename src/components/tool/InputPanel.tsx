'use client';
// Legacy modular component retained for migration/reference.
// ToolShell.tsx is the current primary homepage/tool-page workspace; see LEGACY_COMPONENTS.md before reintroducing this component.
import type { ReactNode } from 'react';

export function InputPanel({ children }: { children: ReactNode }) {
  return <section className="input-panel" aria-label="Input panel"><h3>Input panel</h3>{children}</section>;
}

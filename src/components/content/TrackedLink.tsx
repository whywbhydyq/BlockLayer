'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { trackToolEvent, type ToolEventName } from '@/lib/analytics/events';

type Props = { href: string; children: ReactNode; eventName?: ToolEventName; label?: string; className?: string };

export function TrackedLink({ href, children, eventName = 'related_tool_clicked', label, className }: Props) {
  return <Link className={className} href={href} onClick={() => trackToolEvent(eventName, { label: label || String(children), href })}>{children}</Link>;
}

'use client';
import { useEffect } from 'react';
import { trackToolEvent } from '@/lib/analytics/events';

export function AdSlot({ label = 'Advertisement' }: { label?: string }) {
  useEffect(() => {
    trackToolEvent('ad_slot_viewed', { label });
  }, [label]);
  return <aside className="ad-slot" aria-label={label}><span>{label}</span><p>Reserved ad space outside the blueprint, layer slider, export, copy, and print controls.</p></aside>;
}

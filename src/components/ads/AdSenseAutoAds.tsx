'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { isAdEligiblePath } from '@/lib/publicPolicy';

const ADSENSE_CLIENT = 'ca-pub-1653188471819736';
const SCRIPT_ID = 'adsense-auto-ads';

function removeAutoAds() {
  document.getElementById(SCRIPT_ID)?.remove();
  document
    .querySelectorAll('ins.adsbygoogle, iframe[id^="google_ads"], iframe[name^="google_ads"], .google-auto-placed')
    .forEach((node) => node.remove());
}

export function AdSenseAutoAds() {
  const pathname = usePathname() || '/';

  useEffect(() => {
    const existing = document.getElementById(SCRIPT_ID);
    if (!isAdEligiblePath(pathname)) {
      removeAutoAds();
      return;
    }
    if (existing) return;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    document.head.appendChild(script);
  }, [pathname]);

  return null;
}

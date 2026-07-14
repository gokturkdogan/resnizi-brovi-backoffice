'use client';

import { useEffect } from 'react';
import { LocaleProvider } from '@/components/i18n/LocaleProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js').catch(() => {
      // PWA install still works on iOS without SW; ignore registration errors in dev.
    });
  }, []);

  return <LocaleProvider>{children}</LocaleProvider>;
}

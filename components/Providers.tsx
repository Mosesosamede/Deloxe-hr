'use client';

import { CurrencyProvider } from '@/lib/CurrencyContext';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CurrencyProvider>
      {children}
    </CurrencyProvider>
  );
};

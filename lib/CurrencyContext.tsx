'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyCode = 'USD' | 'NGN' | 'GBP' | 'EUR';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');

  useEffect(() => {
    async function initCurrency() {
      const saved = localStorage.getItem('user_currency') as CurrencyCode;
      if (saved) {
        setCurrencyState(saved);
        return;
      }

      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const country = data.country_code;
        let detectedCurrency: CurrencyCode = 'USD';
        
        if (country === 'NG') detectedCurrency = 'NGN';
        else if (country === 'GB') detectedCurrency = 'GBP';
        else if (['DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'IE', 'PT', 'AT', 'FI', 'GR', 'LU'].includes(country)) detectedCurrency = 'EUR';
        
        setCurrencyState(detectedCurrency);
        localStorage.setItem('user_currency', detectedCurrency);
      } catch {
        setCurrencyState('USD');
      }
    }
    initCurrency();
  }, []);

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('user_currency', newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

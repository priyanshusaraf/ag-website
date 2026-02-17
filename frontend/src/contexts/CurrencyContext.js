'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const RATES = {
  INR: 1,
  USD: 0.012,
  GBP: 0.0095,
};

const SYMBOLS = {
  INR: '₹',
  USD: '$',
  GBP: '£',
};

const LOCALES = {
  INR: 'en-IN',
  USD: 'en-US',
  GBP: 'en-GB',
};

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('ag-currency');
    if (saved && RATES[saved]) setCurrency(saved);
  }, []);

  const changeCurrency = (c) => {
    if (RATES[c]) {
      setCurrency(c);
      localStorage.setItem('ag-currency', c);
    }
  };

  const formatPrice = (amountInINR) => {
    const amount = parseFloat(amountInINR) || 0;
    const converted = amount * RATES[currency];
    return new Intl.NumberFormat(LOCALES[currency], {
      style: 'currency',
      currency,
      minimumFractionDigits: currency === 'INR' ? 0 : 2,
      maximumFractionDigits: currency === 'INR' ? 0 : 2,
    }).format(converted);
  };

  const convertPrice = (amountInINR) => {
    return (parseFloat(amountInINR) || 0) * RATES[currency];
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: changeCurrency, formatPrice, convertPrice, symbol: SYMBOLS[currency] }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}

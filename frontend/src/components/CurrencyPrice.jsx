'use client';

import { useCurrency } from '@/contexts/CurrencyContext';

export function CurrencyPrice({ amount, className = '' }) {
  const { formatPrice } = useCurrency();
  return <span className={className}>{formatPrice(amount)}</span>;
}

export function CurrencyPriceFrom({ amount, className = '' }) {
  const { formatPrice } = useCurrency();
  return <span className={className}>From {formatPrice(amount)}</span>;
}

export function CurrencySelector({ className = '' }) {
  const { currency, setCurrency } = useCurrency();
  const currencies = ['INR', 'USD', 'GBP'];
  return (
    <div className={`inline-flex items-center border border-white/15 rounded-sm overflow-hidden text-[10px] sm:text-[11px] tracking-wider ${className}`}>
      {currencies.map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={`px-3 py-1.5 transition-colors ${currency === c ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'}`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

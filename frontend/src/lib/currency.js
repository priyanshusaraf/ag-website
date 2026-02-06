/**
 * Currency formatting utilities for INR
 */

export const formatINR = (amount) => {
  const price = parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatINRWithDecimals = (amount) => {
  const price = parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const parsePrice = (priceString) => {
  if (typeof priceString === 'number') return priceString;
  return parseFloat(priceString.toString().replace(/[₹,$\s]/g, '').replace(',', '')) || 0;
};

export const formatPriceRange = (minPrice, maxPrice) => {
  if (minPrice === maxPrice) {
    return formatINR(minPrice);
  }
  return `${formatINR(minPrice)} - ${formatINR(maxPrice)}`;
};

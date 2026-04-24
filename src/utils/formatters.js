export const formatVolume = (vol) => {
  if (!vol) return '—';
  if (vol >= 1e6) return (vol / 1e6).toFixed(1) + 'M';
  if (vol >= 1e3) return (vol / 1e3).toFixed(1) + 'K';
  return vol.toString();
};

export const formatPrice = (price, precision = 2) => {
  if (!price) return '—';
  return price.toFixed(precision);
};

export const formatPercent = (change) => {
  if (!change) return '0.00%';
  const num = parseFloat(change);
  return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
};

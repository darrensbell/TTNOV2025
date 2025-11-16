
export const formatCurrency = (value) => {
  if (value >= 1000000) {
    return `£${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `£${(value / 1000).toFixed(0)}K`;
  }
  return `£${value.toFixed(0)}`;
};

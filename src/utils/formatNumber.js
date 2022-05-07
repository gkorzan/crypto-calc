// formatNumber.js

export const formatNumber = (
  num,
  maximumFractionDigits,
  minimumFractionDigits
) => {
  if (!num) {
    return 0;
  }

  return num.toLocaleString(undefined, {
    minimumFractionDigits: minimumFractionDigits ? minimumFractionDigits : 2,
    maximumFractionDigits: maximumFractionDigits ? maximumFractionDigits : 2,
  });
};

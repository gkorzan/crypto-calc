// calculateExchange.js

export const calculateExchange = (
  value,
  target,
  currency,
  targetCurrency,
  rates
) => {
  if (value && target && currency && targetCurrency && rates) {
    // console.log(rates);
    const accuracy = targetCurrency === "usd" ? 100 : 1000000;
    const btc1 = value / rates[currency].value;
    target =
      Math.floor(btc1 * rates[targetCurrency].value * accuracy) / accuracy;
  }
  return { value, target, currency, targetCurrency };
};

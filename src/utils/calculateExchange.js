// calculateExchange.js

export const calculateExchange = (value, target, currency, targetCurrency, rates) => {
    if (
        value &&
        target &&
        currency &&
        targetCurrency &&
        rates
      ) {
        // console.log(rates);
        const btc1 = value / rates[currency].value;
        target = btc1 * rates[targetCurrency].value;
      }
    return {value, target, currency, targetCurrency}
}
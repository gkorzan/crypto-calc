//  walletUtils.js 

export const initWallet = (currencyList) => {
    const wallet = {}
    for (let currency of currencyList) {
        wallet[currency] = 0;
    };
    return wallet;
}
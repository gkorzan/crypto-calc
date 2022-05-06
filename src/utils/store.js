// store.js
import { reactive, computed } from 'vue'

export const store = reactive({
  rates: null,
  wallet: null,
  btcMarketChartData: null,
  ethMarketChartData: null,
  setRates(rates) {
      this.rates = rates;
  },
  setWallet(wallet) {
    this.wallet = wallet;
  },
  setbtcMarketChartData(btcMarketChartData) {
    this.btcMarketChartData = btcMarketChartData
  },
  setethMarketChartData(ethMarketChartData) {
    this.ethMarketChartData = ethMarketChartData
  }
});

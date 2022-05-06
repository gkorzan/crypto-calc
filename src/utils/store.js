// store.js
import { reactive } from 'vue'

export const store = reactive({
  rates: null,
  setRates(rates) {
      this.rates = rates;
  },
  getRates() {
      this.rates
  }
})
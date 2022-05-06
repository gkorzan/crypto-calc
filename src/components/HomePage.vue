<template>
  <div>
    HomePage
    <currency-exchange />
  </div>
</template>

<script>
import CurrencyExchange from "./CurrencyExchange.vue";
import { store } from "../utils/store";
export default {
  components: {
    CurrencyExchange,
  },
  data() {
    return {
      store,
    };
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      const responce = await fetch(
        "https://api.coingecko.com/api/v3/exchange_rates"
      )
        .then((responce) => responce.json())
        .catch((err) => console.error(err));
      const rates = {
        btc: responce.rates.btc,
        eth: responce.rates.eth,
        usd: responce.rates.usd,
      };
      store.setRates(rates);
      // console.log(rates);
    },
  },
};
</script>

<style>
</style>
<template>
  <a href="#/">Home</a> | <a href="#/second">About</a> |
  <!-- <a href="#/non-existent-path">Broken Link</a> -->
  <component :is="currentView" />
</template>

<script>
import Home from "./components/HomePage.vue";
import SecondPageVue from "./components/SecondPage.vue";
import { store } from "./utils/store";
import { initWallet } from "./utils/walletUtils";
// import About from "./About.vue";
// import NotFound from "./NotFound.vue";

const routes = {
  "/": Home,
  "/second": SecondPageVue,
};

export default {
  data() {
    return {
      currentPath: window.location.hash,
      store,
    };
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || "/"] || <h1>NotFound</h1>;
    },
  },
  async mounted() {
    window.addEventListener("hashchange", () => {
      this.currentPath = window.location.hash;
    });
    await this.fetchExchangeRatesData();
    await this.fetchMarketChartsData();
  },
  methods: {
    async fetchExchangeRatesData() {
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
      const currencyList = Object.keys(rates);
      const wallet = initWallet(currencyList);
      store.setWallet(wallet);
      store.setRates(rates);
    },
    async fetchMarketChartsData() {
      const days = 14;
      const interval = "daily";
      const btcMarketChartData = await fetch(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=${interval}`
      )
        .then((responce) => responce.json())
        .catch((err) => console.error(err));
      const ethMarketChartData = await fetch(
        `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=${days}&interval=${interval}`
      )
        .then((responce) => responce.json())
        .catch((err) => console.error(err));
      store.setbtcMarketChartData(btcMarketChartData);
      store.setethMarketChartData(ethMarketChartData);
    },
  },
};
</script>
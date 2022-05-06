<template>
  <a href="#/">Home</a> | <a href="#/second">About</a> |
  <!-- <a href="#/non-existent-path">Broken Link</a> -->
  <component :is="currentView" />
</template>

<script>
import Home from "./components/HomePage.vue";
import SecondPageVue from "./components/SecondPage.vue";
import { store } from "./utils/store";
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
      store.setRates(rates);
      // console.log(rates);
    },
  },
};
</script>
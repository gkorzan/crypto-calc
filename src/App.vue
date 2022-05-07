<template>
  <div class="app-wrapper">
    <header>
      <a href="#" class="logo">Block<span>Task</span></a>
      <nav>
        <svg
          @click="closeMenu"
          class="close"
          width="33"
          height="33"
          viewBox="0 0 33 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.5 0.25C13.2861 0.25 10.1443 1.20305 7.47199 2.98862C4.79969 4.77419 2.71689 7.31209 1.48697 10.2814C0.257041 13.2507 -0.0647633 16.518 0.562247 19.6702C1.18926 22.8224 2.73692 25.7179 5.00952 27.9905C7.28213 30.2631 10.1776 31.8108 13.3298 32.4378C16.482 33.0648 19.7493 32.743 22.7186 31.513C25.6879 30.2831 28.2258 28.2003 30.0114 25.528C31.797 22.8557 32.75 19.7139 32.75 16.5C32.75 14.366 32.3297 12.2529 31.5131 10.2814C30.6964 8.30985 29.4994 6.51847 27.9905 5.00952C26.4815 3.50056 24.6902 2.3036 22.7186 1.48696C20.7471 0.670319 18.634 0.25 16.5 0.25ZM20.9038 18.5963C21.0561 18.7473 21.177 18.927 21.2595 19.1251C21.342 19.3231 21.3844 19.5355 21.3844 19.75C21.3844 19.9645 21.342 20.1769 21.2595 20.3749C21.177 20.573 21.0561 20.7527 20.9038 20.9038C20.7527 21.0561 20.573 21.177 20.3749 21.2594C20.1769 21.3419 19.9645 21.3844 19.75 21.3844C19.5355 21.3844 19.3231 21.3419 19.1251 21.2594C18.927 21.177 18.7473 21.0561 18.5963 20.9038L16.5 18.7913L14.4038 20.9038C14.2527 21.0561 14.073 21.177 13.8749 21.2594C13.6769 21.3419 13.4645 21.3844 13.25 21.3844C13.0355 21.3844 12.8231 21.3419 12.6251 21.2594C12.427 21.177 12.2473 21.0561 12.0963 20.9038C11.9439 20.7527 11.8231 20.573 11.7406 20.3749C11.6581 20.1769 11.6156 19.9645 11.6156 19.75C11.6156 19.5355 11.6581 19.3231 11.7406 19.1251C11.8231 18.927 11.9439 18.7473 12.0963 18.5963L14.2088 16.5L12.0963 14.4038C11.7903 14.0978 11.6184 13.6827 11.6184 13.25C11.6184 12.8173 11.7903 12.4022 12.0963 12.0963C12.4023 11.7903 12.8173 11.6184 13.25 11.6184C13.6827 11.6184 14.0978 11.7903 14.4038 12.0963L16.5 14.2088L18.5963 12.0963C18.9023 11.7903 19.3173 11.6184 19.75 11.6184C20.1827 11.6184 20.5978 11.7903 20.9038 12.0963C21.2098 12.4022 21.3817 12.8173 21.3817 13.25C21.3817 13.6827 21.2098 14.0978 20.9038 14.4038L18.7913 16.5L20.9038 18.5963Z"
            fill="black"
          />
        </svg>
        <ul>
          <li><a href="#/">Home</a></li>
          <li><a href="#/portfolio">Portfolio</a></li>
        </ul>
      </nav>
      <svg
        @click="openMenu"
        class="menu"
        width="48"
        height="32"
        viewBox="0 0 48 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 32H0V26.6667H24V32ZM48 18.6667H0V13.3333H48V18.6667ZM48 5.33333H24V0H48V5.33333Z"
          fill="#27292f"
        />
      </svg>
    </header>
    <component :is="currentView" />
  </div>
</template>

<script>
import Home from "./components/HomePage.vue";
import PortfolioPageVue from "./components/PortfolioPage.vue";
import { store } from "./utils/store";
import { initWallet } from "./utils/walletUtils";

const routes = {
  "/": Home,
  "/portfolio": PortfolioPageVue,
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
    openMenu() {
      const nav = document.querySelector("nav");
      nav.classList.add("open-nav");
    },
    closeMenu() {
      const nav = document.querySelector("nav");
      nav.classList.remove("open-nav");
    },
  },
};
</script>

<style >
:root {
  --bg-color: #f2f4f7;
  --bg-card-color: #ffffff;
  --border-radius: 8px;
  --divider: #e9e9f4;
  --color-primary: #27292f;
  --text-sm-2: 12px;
  --color-gray-3: #58667e;
}
body {
  margin: 1.5em;
  font-family: "Roboto", sans-serif;
  background: var(--bg-color);
  color: var(--color-primary);
}
a {
  text-decoration: none;
  font-size: 1.3rem;
}

h1,
h2 {
  color: var(--color-primary);
}
nav {
  position: fixed;
  right: 0;
  top: 0;
  background: white;
  height: 100vh;
  width: 50%;
  z-index: 999;
  text-transform: uppercase;
  transform: translateX(100%);
  transition: transform 0.5s ease-in-out;
}

nav > ul {
  list-style-type: none;
  padding: 0;
  margin-top: 6em;
}

nav > ul > li > a {
  color: black;
  padding: 0.75em 2em;
  display: block;
}
nav > ul > li > a:hover {
  background: gray;
}

header {
  display: flex;
  justify-content: space-between;
}
header > svg {
  width: 2em;
  cursor: pointer;
}

.close {
  float: right;
  margin: 2em;
  width: 2.5em;
  cursor: pointer;
}

.open-nav {
  transform: translateX(0);
}

.logo {
  color: var(--color-primary);
}

.logo > span {
  color: var(--color-gray-3);
}

@media only screen and (min-width: 680px) {
  body {
    margin: 1.5em 5em;
  }
}
@media only screen and (min-width: 920px) {
  .menu {
    display: none;
  }
  nav {
    transform: translateX(0);
    position: unset;
    display: block;
    width: auto;
    height: auto;
    background: none;
  }
  nav > svg.close {
    display: none;
  }
  nav > ul {
    display: flex;
    margin: 0;
  }
  nav > ul > li > a {
    color: black;
    padding: 0.5em 1.5em;
    font-size: 0.9rem;
  }
  nav > ul > li > a:hover {
    background: none;
    text-decoration: underline;
  }
}
@media only screen and (min-width: 1200px) {
  .app-wrapper {
    width: 1200px;
    margin: 0 auto;
  }
  h1 {
    font-size: 3em;
    margin-top: 2em;
    line-height: 3.3rem;
    text-align: center;
  }
}
</style>
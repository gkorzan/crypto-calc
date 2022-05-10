<template>
  <div class="app-wrapper">
    <header>
      <a href="#" class="logo">Block<span>Task</span></a>
      <nav>
        <img :src="closeSvgPath" class="close" @click="closeMenu" />
        <ul>
          <li><a href="#/">Home</a></li>
          <li><a href="#/portfolio">Portfolio</a></li>
        </ul>
      </nav>
      <img :src="menuSvgPath" class="menu" @click="openMenu" />
      <!-- <svg
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
      </svg> -->
    </header>
    <component :is="currentView" />
  </div>
</template>

<script>
import Home from "./components/HomePage.vue";
import PortfolioPageVue from "./components/PortfolioPage.vue";
import { store } from "./utils/store";
import { initWallet } from "./utils/walletUtils";

import closeSvgPath from "@/assets/close.svg";
import menuSvgPath from "@/assets/menu.svg";

const routes = {
  "/": Home,
  "/portfolio": PortfolioPageVue,
};

export default {
  data() {
    return {
      currentPath: window.location.hash,
      store,
      closeSvgPath,
      menuSvgPath,
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

<style lang="scss">
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
  ul {
    list-style-type: none;
    padding: 0;
    margin-top: 6em;
    a {
      color: black;
      padding: 0.75em 2em;
      display: block;
    }
    a:hover {
      background: gray;
    }
  }
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
    ul {
      display: flex;
      margin: 0;
      a {
        color: black;
        padding: 0.5em 1.5em;
        font-size: 0.9rem;
      }
      a:hover {
        background: none;
        text-decoration: underline;
      }
    }
    .close {
      display: none;
    }
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
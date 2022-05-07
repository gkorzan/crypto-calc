<template>
  <div class="portfolio-container">
    <div class="stats">
      <h2>Balance: {{ walletBalance }} $</h2>
      <div class="inputs">
        <currency-input
          v-model:amount="inputValue"
          v-model:selectedCurrency="inputCurrency"
        />
        <div class="button-wrapper">
          <button @click="addCurrency">+</button>
          <button @click="minusCurrency">-</button>
        </div>
      </div>
      <div class="wallet-desriptive-balance">
        <div
          v-for="(value, key) in store.wallet"
          :key="key"
          class="wallet-descriptive-entry"
        >
          <span style="display: flex; justify-content: space-between">
            <div style="width: 80px; text-align: right; padding-right: 0.75em">
              {{ store.rates[key].name }} :
            </div>
          </span>
          <div class="currency-value">
            {{ value }}
          </div>
          <button>clear</button>
        </div>
      </div>
    </div>
    <div class="chart">
      <DoughnutChart
        ref="assetAllocationChartRef"
        :chartData="chartData"
        :options="options"
      />
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, computed } from "vue";
import CurrencyInput from "./CurrencyInput.vue";

import { store } from "../utils/store";
import { assembleWalletChartData } from "../utils/assembleWalletChartData";

import { DoughnutChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default defineComponent({
  name: "CryptoPortfolio",
  components: { CurrencyInput, DoughnutChart },

  setup() {
    const inputValue = ref(0);
    const inputCurrency = ref("btc");
    console.log(store);

    // const rates = this.store.rates;

    const walletBalance = computed(() => {
      let walletBalance = 0;
      if (!store.wallet || !store.rates) {
        return walletBalance;
      }
      for (let currency of Object.keys(store.wallet)) {
        walletBalance += store.wallet[currency] / store.rates[currency].value;
      }
      return walletBalance * store.rates["usd"].value;
    });
    const assetAllocationChartRef = ref();

    const chartData = computed(() => {
      if (!store.wallet) {
        return {};
      }
      const labels = [];
      const data = [];
      for (let currency of Object.keys(store.wallet)) {
        labels.push(store.rates[currency].name);
        data.push(
          (store.wallet[currency] / store.rates[currency].value) *
            store.rates["usd"].value
        );
      }
      return assembleWalletChartData(labels, data);
    });

    const options = ref({
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Chart.js Doughnut Chart",
        },
      },
    });

    return {
      store,
      inputValue,
      inputCurrency,
      chartData,
      options,
      assetAllocationChartRef,
      walletBalance,
    };
  },
  methods: {
    addCurrency() {
      const newWallet = this.store.wallet;
      //   if (newWallet[this.inputCurrency] + this.inputValue > 100000) {
      //     return;
      //   }
      newWallet[this.inputCurrency] += this.inputValue;

      store.setWallet({ ...newWallet });
    },
    minusCurrency() {
      const newWallet = this.store.wallet;
      if (newWallet[this.inputCurrency] - this.inputValue < 0) {
        newWallet[this.inputCurrency] = 0;
        store.setWallet({ ...newWallet });
        return;
      }
      newWallet[this.inputCurrency] -= this.inputValue;

      store.setWallet({ ...newWallet });
    },
    clearCurrency() {},
  },
});
</script>

<style scoped>
.portfolio-container {
  display: flex;
  flex-direction: column;
  background: var(--bg-card-color);
  padding: 3em;
  border-radius: 16px;
  box-shadow: 0px 5px 5px 5px rgba(0, 0, 0, 0.2);
  gap: 1.5em;
}
.stats {
  display: flex;
  flex-direction: column;
}
.wallet-desriptive-balance {
}
.wallet-descriptive-entry {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1.5em;
  margin-bottom: 15px;
}
.wallet-desriptive-balance > div > button {
  flex-grow: 1;
  flex-shrink: 0;
  max-width: 250px;
  padding: 10px;
  background-color: var(--bg-card-color);
  border-radius: var(--border-radius);
  border: solid 1px var(--divider);
  color: var(--color-primary);
}
.wallet-desriptive-balance > div > button:focus {
  border: solid 2px black;
}
.currency-value {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  overflow: auto;
}
.inputs {
  display: flex;
  flex-direction: column;
  /* flex-grow: 1; */
  /* flex: ; */
  min-width: 30%;
  /* row-gap: 1.5em; */
}
.button-wrapper {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}
.button-wrapper > button {
  flex-grow: 1;
  max-width: 250px;
  padding: 10px;
  background-color: var(--bg-card-color);
  border-radius: var(--border-radius);
  border: solid 1px var(--divider);
  color: var(--color-primary);
}
.button-wrapper > button:focus {
  border: solid 2px black;
}
/* .input > button {
  flex-shrink: 0;
  flex-grow: 1;
} */
.chart {
  flex-grow: 1;
}
.stats {
  display: flex;
  justify-content: space-between;
}
/* @media only screen and (min-width: 920px) {
  .portfolio-container {
    flex-direction: row;
  }
} */
@media only screen and (min-width: 1200px) {
  .portfolio-container {
    flex-direction: row;
  }
}
</style>
<template>
  <div class="portfolio-container">
    <div class="stats">
      <h2>Balance: {{ formatNumber(walletBalance) }} $</h2>
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
          <div class="wallet-entry-name">
            <span style="min-width: 80px">{{ store.rates[key].name }} :</span>
          </div>
          <div class="currency-value" v-if="key === 'usd'">
            {{ formatNumber(value, 2) }}
          </div>
          <div class="currency-value" v-else>
            {{ formatNumber(value, 6) }}
          </div>
          <button
            @click="
              () => {
                clearCurrency(key);
              }
            "
          >
            Clear
          </button>
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
import { formatNumber } from "../utils/formatNumber";

import { DoughnutChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default defineComponent({
  name: "CryptoPortfolio",
  components: { CurrencyInput, DoughnutChart },

  setup() {
    const inputValue = ref(0);
    const inputCurrency = ref("btc");

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
          position: "bottom",
        },
        title: {
          display: true,
          text: "Assets Allocation Chart",
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
      formatNumber,
    };
  },
  methods: {
    addCurrency() {
      const newWallet = this.store.wallet;
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
    clearCurrency(currency) {
      store.wallet[currency] = 0;
    },
  },
});
</script>

<style lang="scss" scoped>
.portfolio-container {
  display: flex;
  flex-direction: column;
  background: var(--bg-card-color);
  padding: 1.5em;
  border-radius: 16px;
  box-shadow: 0px 5px 5px 5px rgba(0, 0, 0, 0.2);
  gap: 1.5em;
}

.stats {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
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
    min-width: 30%;
    .button-wrapper {
      display: flex;
      gap: 8px;
      margin-bottom: 15px;
      button {
        flex-grow: 1;
        max-width: 250px;
        padding: 10px;
        background-color: var(--bg-card-color);
        border-radius: var(--border-radius);
        border: solid 1px var(--divider);
        color: var(--color-primary);
      }
      button:focus {
        outline: var(--color-gray-3) solid 2px;
      }
    }
  }
  .wallet-desriptive-balance {
    .wallet-descriptive-entry {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 1.5em;
      margin-bottom: 15px;
      .wallet-entry-name {
        display: flex;
        justify-content: space-between;
        text-align: right;
      }
    }
    button {
      flex-grow: 1;
      flex-shrink: 0;
      max-width: 250px;
      padding: 10px;
      background-color: var(--bg-card-color);
      border-radius: var(--border-radius);
      border: solid 1px var(--divider);
      color: var(--color-primary);
    }
    button:focus {
      outline: var(--color-gray-3) solid 2px;
    }
  }
}

.chart {
  flex-grow: 1;
}

@media only screen and (min-width: 1200px) {
  .portfolio-container {
    flex-direction: row;
    padding: 3em;
  }
}
</style>
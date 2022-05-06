<template>
  <div>CryptoPortfolio</div>
  <currency-input
    v-model:amount="inputValue"
    v-model:selectedCurrency="inputCurrency"
  />
  <button @click="addCurrency">+</button>
  <button @click="minusCurrency">-</button>
  <div v-for="(value, key) in store.wallet" :key="key">
    {{ store.rates[key].name }} = {{ value }} <button>clear</button>
  </div>
  <div>Balance: {{ walletBalance }} $</div>
  <DoughnutChart
    ref="assetAllocationChartRef"
    :chartData="chartData"
    :options="options"
  />
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

<style>
</style>
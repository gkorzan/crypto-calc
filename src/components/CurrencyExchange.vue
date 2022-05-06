<template>
  <div>
    <currency-input
      v-model:amount="amount1"
      v-model:selectedCurrency="selectedCurrency1"
      @update:amount="onUpdateCurrencyInputFirst"
      @update:selectedCurrency="onUpdateCurrencyInputFirst"
    />
    <currency-input
      v-model:amount="amount2"
      v-model:selectedCurrency="selectedCurrency2"
      @update:amount="onUpdateCurrencyInputSecond"
      @update:selectedCurrency="onUpdateCurrencyInputFirst"
    />
    <LineChart
      ref="exchangeChartRef"
      :chartData="chartData"
      :options="options"
    />
  </div>
</template>

<script>
import { store } from "@/utils/store";
import CurrencyInput from "./CurrencyInput.vue";
import { calculateExchange } from "../utils/calculateExchange";
import { assembleExchangeChartData } from "../utils/assembleExchangeChartData";
import { ref, onMounted, computed } from "vue";

import { LineChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  components: {
    CurrencyInput,
    LineChart,
  },
  data() {
    return {
      store,
      amount1: 1,
      amount2: 1,
      selectedCurrency1: "btc",
      selectedCurrency2: "btc",
    };
  },
  setup() {
    const exchangeChartRef = ref();
    onMounted(() => {
      // console.log(exchangeChartRef.value.chartInstance);
      exchangeChartRef.value.chartInstance.toBase64Image();
    });
    // let gradient = exchangeChartRef.value
    //   .getContext("2d")
    //   .createLinearGradient(0, 0, 0, 400); // from the bottom to the top
    // gradient.addColorStop(0, "rgba(58,123,213,1)");
    // gradient.addColorStop(1, "rgba(0,210,255,.3)");

    const { chartData, options } = assembleExchangeChartData();

    return { chartData, options, exchangeChartRef };
  },

  mounted() {},

  methods: {
    onUpdateCurrencyInputFirst() {
      const { value, target, currency, targetCurrency } = calculateExchange(
        this.amount1,
        this.amount2,
        this.selectedCurrency1,
        this.selectedCurrency2,
        this.store.rates
      );
      this.amount2 = target;
    },
    onUpdateCurrencyInputSecond() {
      const { value, target, currency, targetCurrency } = calculateExchange(
        this.amount2,
        this.amount1,
        this.selectedCurrency2,
        this.selectedCurrency1,
        this.store.rates
      );
      this.amount1 = target;
    },
  },
};
</script>

<style>
</style>
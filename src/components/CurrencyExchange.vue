<template>
  <div class="exchange-container">
    <div class="inputs">
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
    </div>
    <div class="chart">
      <LineChart
        ref="exchangeChartRef"
        :chartData="chartData"
        :options="options"
      />
    </div>
  </div>
</template>

<script>
import { store } from "../utils/store";
import CurrencyInput from "./CurrencyInput.vue";
import { calculateExchange } from "../utils/calculateExchange";
import { assembleExchangeChartData } from "../utils/assembleExchangeChartData";
import { ref, computed, defineComponent } from "vue";

import { LineChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default defineComponent({
  name: "CurrencyExchange",
  components: {
    CurrencyInput,
    LineChart,
  },
  setup() {
    const amount1 = ref(1);
    const amount2 = ref(1);
    const selectedCurrency1 = ref("btc");
    const selectedCurrency2 = ref("btc");
    const exchangeChartRef = ref();

    const chartData = computed(() => {
      if (!store.btcMarketChartData || !store.ethMarketChartData) {
        return {};
      }

      switch (selectedCurrency1.value) {
        case "btc":
          if (selectedCurrency2.value === "usd")
            return assembleExchangeChartData(store.btcMarketChartData);
          else if (selectedCurrency2.value === "eth")
            return assembleExchangeChartData(
              store.btcMarketChartData,
              store.ethMarketChartData
            );
          else
            return assembleExchangeChartData(
              store.btcMarketChartData,
              store.btcMarketChartData
            );
          break;
        case "eth":
          if (selectedCurrency2.value === "usd")
            return assembleExchangeChartData(store.ethMarketChartData);
          else if (selectedCurrency2.value === "btc")
            return assembleExchangeChartData(
              store.ethMarketChartData,
              store.btcMarketChartData
            );
          else
            return assembleExchangeChartData(
              store.ethMarketChartData,
              store.ethMarketChartData
            );
          break;
        case "usd":
          if (selectedCurrency2.value === "btc")
            return assembleExchangeChartData(
              store.btcMarketChartData,
              null,
              true
            );
          else if (selectedCurrency2.value === "eth")
            return assembleExchangeChartData(
              store.ethMarketChartData,
              null,
              true
            );
          else
            return assembleExchangeChartData(
              store.btcMarketChartData,
              store.btcMarketChartData
            );
          break;
        default:
          return assembleExchangeChartData(
            store.btcMarketChartData,
            store.btcMarketChartData
          );
          break;
      }
    });

    const options = ref({
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: false,
          text: "Chart.js Doughnut Chart",
        },
      },
    });

    return {
      store,
      chartData,
      exchangeChartRef,
      amount1,
      amount2,
      selectedCurrency1,
      selectedCurrency2,
      options,
    };
  },

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
});
</script>

<style scoped>
.exchange-container {
  display: flex;
  flex-direction: column;
  background: var(--bg-card-color);
  padding: 1.5em;
  border-radius: 16px;
  box-shadow: 0px 5px 5px 5px rgba(0, 0, 0, 0.2);
  gap: 1.5em;
}
.inputs {
  flex-grow: 1;
  min-width: 30%;
}
.chart {
  flex-grow: 1;
}
@media only screen and (min-width: 1200px) {
  .exchange-container {
    flex-direction: row;
    padding: 3em;
  }
}
</style>
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
    <p>
      {{ amount1 }} {{ selectedCurrency1 }} = {{ amount2 }}
      {{ selectedCurrency2 }}
    </p>
  </div>
</template>

<script>
import { store } from "@/utils/store";
import CurrencyInput from "./CurrencyInput.vue";
import { calculateExchange } from "../utils/calculateExchange";
export default {
  components: {
    CurrencyInput,
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
  mounted() {},
  computed: {
    rates: {
      get() {
        return store.rates;
      },
    },
  },
  methods: {
    onUpdateCurrencyInputFirst() {
      const { value, target, currency, targetCurrency } = calculateExchange(
        this.amount1,
        this.amount2,
        this.selectedCurrency1,
        this.selectedCurrency2,
        this.rates
      );
      this.amount2 = target;
    },
    onUpdateCurrencyInputSecond() {
      const { value, target, currency, targetCurrency } = calculateExchange(
        this.amount2,
        this.amount1,
        this.selectedCurrency2,
        this.selectedCurrency1,
        this.rates
      );
      this.amount1 = target;
    },
  },
};
</script>

<style>
</style>
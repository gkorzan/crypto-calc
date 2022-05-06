<template>
  <div>
    <div v-if="rates">
      <input type="number" v-model="inputValue" step="0.01" />
      <select name="rates" id="rates" v-model="selectorValue">
        <option v-for="(value, key) in rates" :key="key" :value="key">
          {{ value.unit }}
        </option>
      </select>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import { store } from "../utils/store";
export default {
  props: {
    amount: Number,
    selectedCurrency: String,
  },
  emits: ["update:amount", "update:selectedCurrency", "update"],
  computed: {
    inputValue: {
      get() {
        return this.amount;
      },
      set(inputValue) {
        this.$emit("update:amount", inputValue);
        this.$emit("update");
      },
    },
    selectorValue: {
      get() {
        return this.selectedCurrency;
      },
      set(selectorValue) {
        this.$emit("update:selectedCurrency", selectorValue);
        this.$emit("update");
      },
    },
    rates: {
      get() {
        return store.rates;
      },
    },
  },
  data() {
    return {
      store,
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style>
</style>
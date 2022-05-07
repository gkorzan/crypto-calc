<template>
  <div v-if="rates" class="wrapper">
    <input
      type="number"
      v-model="inputValue"
      step="0.01"
      min="0"
      :class="{ invalid: isInputError }"
    />
    <select name="rates" id="rates" v-model="selectorValue">
      <option v-for="(value, key) in rates" :key="key" :value="key">
        {{ value.unit }}
      </option>
    </select>
  </div>
  <div v-else>Loading...</div>
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
        if (inputValue < 0) {
          this.isInputError = true;
          return;
        }
        if (typeof inputValue != "number") {
          this.isInputError = true;
        } else {
          this.isInputError = false;
        }
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
      isInputError: false,
    };
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 8px;
  margin-bottom: 15px;
}
input[type="number"] {
  width: 70%;
  flex-grow: 2;
  padding: 10px;
  background-color: var(--bg-card-color);
  border-radius: var(--border-radius);
  border: solid 1px var(--divider);
  color: var(--color-primary);
}
input:focus {
  outline: var(--color-gray-3) solid 2px;
}
.invalid {
  box-shadow: 0px 0px 2px 2px #ff0000;
}
select {
  flex-grow: 1;
  width: 30%;
  height: inherit !important;
  font-size: var(--text-sm-2) !important;
  padding: 10px !important;
  border: solid 1px var(--divider) !important;
  border-radius: var(--border-radius) !important;
  color: var(--color-gray-3);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent
    url("data:image/svg+xml,%3Csvg stroke='%23A6B0C3' fill='%23A6B0C3' xmlns='http://www.w3.org/2000/svg' width='13' height='8' viewBox='0 0 13 8'%3E%3Cpath fill-rule='evenodd' d='M7.618 6.972a1.2 1.2 0 01-1.697 0L1.204 2.254a.8.8 0 011.132-1.131L6.77 5.557l4.434-4.434a.8.8 0 011.132 1.131L7.618 6.972z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")
    no-repeat right 0.35rem center/.4rem 0.5rem;
}
select:focus {
  outline: var(--color-gray-3) solid 2px;
}
</style>
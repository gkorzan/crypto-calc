<template>
  <div>
    <h1>Portfolio</h1>
    <crypto-portfolio />
  </div>
</template>

<script>
import CryptoPortfolio from "./CryptoPortfolio.vue";
export default {
  name: "PortfolioPage",
  components: { CryptoPortfolio },
  setup() {},
};
</script>

<style>
</style>
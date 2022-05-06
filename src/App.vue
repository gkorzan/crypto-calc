<template>
  <a href="#/">Home</a> | <a href="#/second">About</a> |
  <!-- <a href="#/non-existent-path">Broken Link</a> -->
  <component :is="currentView" />
</template>

<script>
import Home from "./components/HomePage.vue";
import SecondPageVue from "./components/SecondPage.vue";
// import About from "./About.vue";
// import NotFound from "./NotFound.vue";

const routes = {
  "/": Home,
  "/second": SecondPageVue,
};

export default {
  data() {
    return {
      currentPath: window.location.hash,
    };
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || "/"] || <h1>NotFound</h1>;
    },
  },
  mounted() {
    window.addEventListener("hashchange", () => {
      this.currentPath = window.location.hash;
    });
  },
};
</script>
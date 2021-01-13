<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
  created() {
    // this.$http
    //   .get(`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`)
    //   .then((response) => {
    //     console.log(response.data);
    //   });
  },
};

</script>

<style lang="scss">
@import "./assets/all";

</style>

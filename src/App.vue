<template>
  <div id="app">
    <Shape class="shape" />
    <img alt="Vue logo" src="./assets/logo.svg" />
    <DraggAble msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DraggAble from "./components/DraggAble.vue";
import Shape from "./components/Shape.vue";

export default Vue.extend({
  name: "App",
  components: {
    DraggAble,
    Shape
  },
  created() {
    this.$store.commit("SET_SHAPE", "Cuboid");
  }
});
</script>

<style lang="scss">
html,
body {
  background-color: #f5f5f5;
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  height: 100%;

  .shape {
    position: absolute;
    left: 50px;
    top: 100px;
  }
  img {
    max-width: 150px;
  }
}
</style>

<template>
  <div>
    <select v-model="shape">
      <option>Cuboid</option>
      <option>Cylinder</option>
    </select>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data: () => ({
    shape: "Cuboid"
  }),
  watch: {
    shape(val) {
      this.$store.commit("SET_SHAPE", val);
    }
  }
});
</script>
<style lang="scss" scoped>
select,
option {
  font-size: 30px !important;
}
</style>

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    shape: ""
  },
  getters: {
    shapeGetter: state => state.shape
  },
  mutations: {
    SET_SHAPE(state, shape) {
      state.shape = shape;
    }
  },
  actions: {},
  modules: {}
});

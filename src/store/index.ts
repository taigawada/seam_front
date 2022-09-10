import Vue from 'vue';
import Vuex from 'vuex';
import holidays from './modules/holidays';
import cantTransition from './modules/cantTransition';

Vue.use(Vuex);
export default new Vuex.Store({
  strict: true,
  modules: {
    holidays,
    cantTransition,
  },
  state: {},
  getters: {},
  mutations: {},
  actions: {},
});

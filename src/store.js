import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    jobs: [],
    files: []
  },
  mutations: {},
  actions: {},
  getters: {
    jobsLength: state => {
      return state.jobs.length;
    }
  }
});

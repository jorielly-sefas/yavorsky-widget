import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    columnsForJobs: "",
    columnsForFiles:
      "offset,VPF_path,VPF_ind_path,images_path,overlay_path,removal_mark,mailpiece_id,oaccd,SuprvLgnid",
    currentPage: 0,
    currentPageSize: 20,
    jobs: [],
    files: []
  },
  mutations: {
    PUSH_JOB(state, jobToPush) {
      state.jobs.push(jobToPush);
    }
  },
  actions: {
    addJob({ commit }, jobToAdd) {
      commit("PUSH_JOB", jobToAdd);
    }
  },
  getters: {
    jobsLength: state => {
      return state.jobs.length;
    }
  }
});

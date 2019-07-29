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
    },
    SPLICE_JOB(state, jobToSplice) {
      let indexOfJob = state.jobs.indexOf(jobToSplice);
      state.jobs.splice(indexOfJob, 1);
    },
    TOGGLE_SELECTED_JOB(state, jobToToggle) {
      let indexOfJob = state.jobs.indexOf(jobToToggle);
      state.jobs[indexOfJob].selected = false;
    },
    EMPTY_JOBS_QUEUE(state) {
      state.jobs = [];
    },
    EMPTY_FILES_QUEUE(state) {
      state.files = [];
    }
  },
  actions: {
    addJob({ commit, state }, jobToAdd) {
      if (!(jobToAdd in state.jobs)) {
        commit("PUSH_JOB", jobToAdd);
      } else {
        console.log("job already exists: ", jobToAdd);
      }
    },
    removeJob({ commit }, jobToRemove) {
      commit("SPLICE_JOB", jobToRemove);
    },
    toggleSelectedJob({ commit }, jobToToggle) {
      commit("TOGGLE_SELECTED_JOB", jobToToggle);
    },
    emptyJobsQueue({ commit }) {
      commit("EMPTY_JOBS_QUEUE");
    },
    emptyFilesQueue({ commit }) {
      commit("EMPTY_FILES_QUEUE");
    }
  },
  getters: {
    jobsLength: state => {
      return state.jobs.length;
    },
    jobWithId: (state, idToGet) => {
      state.jobs.forEach(item => {
        if (item.jobId === idToGet) {
          return item;
        }
      });
    }
  }
});

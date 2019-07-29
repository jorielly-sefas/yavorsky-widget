import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    jobs: [],
    docs: []
  },
  mutations: {
    PUSH_DOC(state, docToPush) {
      state.docs.push(docToPush);
    },
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
    EMPTY_DOCS_QUEUE(state) {
      state.docs = [];
    }
  },
  actions: {
    addDoc({ commit, state }, docToAdd) {
      if (!(docToAdd in state.docs)) {
        commit("PUSH_DOC", docToAdd);
      } else {
        console.log("doc already exists: ", docToAdd);
      }
    },
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
    docsLength: state => {
      return state.docs.length;
    },
    jobsLength: state => {
      return state.jobs.length;
    },
    jobWithId: (state, idToGet) => {
      state.jobs.forEach(item => {
        if (item.jobId === idToGet) {
          return item;
        }
      });
    },
    selectedDocs: state => {
      return state.docs.filter(function(data) {
        return data.selected === true;
      });
    },
    selectedJobs: state => {
      return state.jobs.filter(function(data) {
        return data.selected === true;
      });
    }
  }
});

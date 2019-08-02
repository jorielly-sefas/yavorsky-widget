import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const prefix_config = "PPQA_";

export default new Vuex.Store({
  state: {
    jobs: [],
    docs: [],
    selectedDocs: [],
    storedPerPage: 5,
    storedCurrentPage: 1,
    token: window.sessionStorage.token
  },
  mutations: {
    PUSH_DOC(state, docToPush) {
      state.docs.push(docToPush);
    },
    PUSH_JOB(state, jobToPush) {
      state.jobs.push(jobToPush);
    },
    SET_PER_PAGE(state, perPageToSet) {
      state.storedPerPage = perPageToSet;
    },
    SET_CURRENT_PAGE(state, currentPageToSet) {
      state.storedCurrentPage = currentPageToSet;
    },
    SPLICE_DOC(state, docToSplice) {
      let indexOfDoc = state.docs.indexOf(
        element =>
          Number(element.mailpiece_id) === Number(docToSplice.mailpiece_id)
      );
      state.docs.splice(indexOfDoc, 1);
    },
    SPLICE_JOB(state, jobToSplice) {
      let indexOfJob = state.jobs.indexOf(jobToSplice);
      state.jobs.splice(indexOfJob, 1);
    },
    TOGGLE_SELECTED_JOB(state, jobToToggle) {
      let indexOfJob = state.jobs.indexOf(jobToToggle);
      state.jobs[indexOfJob].selected = false;
    },
    TOGGLE_SELECTED_DOC(state, docToToggle) {
      state.docs
        .filter(
          doc => Number(doc.mailpiece_id) === Number(docToToggle.mailpiece_id)
        )
        .forEach(doc => (doc.selected = !doc.selected));
    },
    EMPTY_JOBS_QUEUE(state) {
      state.jobs = [];
    },
    EMPTY_DOCS_QUEUE(state) {
      state.docs = [];
    }
  },
  actions: {
    addDoc({ commit, state }, docToAdd, jobId, fileNumber) {
      let formattedFileNumber =
        fileNumber > 9 ? "" + fileNumber : "0" + fileNumber;
      let newId = prefix_config + jobId + "_O" + formattedFileNumber + "_0";

      const widgetDocIds = state.docs.map(doc => Number(doc.mailpiece_id));
      console.log("mailpiece_ids in widget ", widgetDocIds);
      var matchingDocs = widgetDocIds.filter(
        id => id === Number(docToAdd.mailpiece_id)
      );
      console.log("matching docs ", matchingDocs);
      if (matchingDocs.length > 0) {
        console.log("doc already exists: ", matchingDocs);
        for (var doc of matchingDocs) {
          commit("SPLICE_DOC", doc);
        }
        commit("PUSH_DOC", docToAdd);
      } else {
        docToAdd["widgetDocId"] = newId;
        docToAdd["select"] = "select html goes here";
        docToAdd["selected"] = false;
        docToAdd["pull"] = "pull html goes here";
        docToAdd["boolean"] = "boolean html goes here";
        docToAdd["viewpdf"] = "viewpdf html goes here";
        console.log("adding");
        commit("PUSH_DOC", docToAdd);
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
    setPerPage({ commit }, perPageToSet) {
      commit("SET_PER_PAGE", perPageToSet);
    },
    setCurrentPage({ commit }, currentPageToSet) {
      commit("SET_CURRENT_PAGE", currentPageToSet);
    },
    setSelectedDocs({ commit }, selectedDocsToSet) {
      selectedDocsToSet.forEach(doc => commit("TOGGLE_SELECTED_DOC", doc));
    },
    toggleSelectedDoc({ commit }, docToToggle) {
      commit("TOGGLE_SELECTED_DOC", docToToggle);
    },
    toggleSelectedJob({ commit }, jobToToggle) {
      commit("TOGGLE_SELECTED_JOB", jobToToggle);
    },
    emptyJobsQueue({ commit }) {
      commit("EMPTY_JOBS_QUEUE");
    },
    emptyDocsQueue({ commit }) {
      commit("EMPTY_DOCS_QUEUE");
    }
  },
  getters: {
    idsOfDocsInStore: state => {
      let widgetDocIds = [];
      state.docs.forEach(doc => {
        widgetDocIds.push(doc.widgetDocId);
      });
      return widgetDocIds;
    },
    docsLength: state => {
      return state.docs.length;
    },
    getDocsForFile: state => {
      return state.docs;
    },
    getStoredCurrentPage: state => {
      return state.storedCurrentPage;
    },
    getStoredPerPage: state => {
      return state.storedPerPage;
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
    getSelectedDocs: state => {
      return state.docs.filter(function(data) {
        return data.selected === true;
      });
    },
    getSelectedJobs: state => {
      return state.jobs.filter(function(data) {
        return data.selected === true;
      });
    }
  }
});

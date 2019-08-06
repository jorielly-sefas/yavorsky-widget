import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const prefix_config = "PPQA_";

export default new Vuex.Store({
  state: {
    jobs: [],
    docs: [],
    currentQuery: {},
    selectedDocs: [],
    storedPerPage: 5,
    storedCurrentPage: 1,
    storedSortBy: "",
    storedSortDesc: true,
    token: window.sessionStorage.token
  },
  mutations: {
    UPDATE_QUERY(state, queryUpdate) {
      state.currentQuery[queryUpdate.key] = queryUpdate.value;
    },
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
    SET_SORT_BY(state, newSortBy) {
      state.storedSortBy = newSortBy;
    },
    SET_SORT_DESC(state, newSortDesc) {
      state.storedSortDesc = newSortDesc;
    },
    SPLICE_DOC(state, docToSplice) {
      let indexOfDoc = state.docs.findIndex(
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
      let indexOfDoc = state.docs.indexOf(docToToggle);
      state.docs[indexOfDoc].selected = !state.docs[indexOfDoc].selected;
    },
    EMPTY_JOBS_QUEUE(state) {
      state.jobs = [];
    },
    EMPTY_DOCS_QUEUE(state) {
      state.docs = [];
    },
    UPDATE_DOC(state, existingDoc, docToAdd) {
      Object.assign(existingDoc, docToAdd);
    }
  },
  actions: {
    updateDoc({ commit, state }, docToAdd, jobId, fileNumber) {
      var matchingDocs = state.docs.filter(
        doc => Number(doc.mailpiece_id) === Number(docToAdd.mailpiece_id)
      );
      if (matchingDocs.length > 0) {
        console.log("doc already exists: ", matchingDocs);
        commit("UPDATE_DOC", matchingDocs[0], docToAdd);
      } else {
        let formattedFileNumber =
          fileNumber > 9 ? "" + fileNumber : "0" + fileNumber;
        let newId = prefix_config + jobId + "_O" + formattedFileNumber + "_0";
        docToAdd["widgetDocId"] = newId;
        docToAdd["select"] = "select html goes here";
        docToAdd["selected"] = false;
        docToAdd["pull"] = "pull html goes here";
        docToAdd["boolean"] = "boolean html goes here";
        docToAdd["viewpdf"] = "viewpdf html goes here";
        commit("PUSH_DOC", docToAdd);
      }
    },
    spliceMatchingDocs({ commit, state }, idToMatch) {
      var matchingDocs = state.docs.filter(
        doc => Number(doc.mailpiece_id) === Number(idToMatch)
      );

      if (matchingDocs.length > 0) {
        console.log("doc already exists: ", matchingDocs);
        commit("SPLICE_DOC", matchingDocs[0]);
      }
    },
    addDoc({ commit, state }, docToAdd, jobId, fileNumber) {
      console.log("add doc called with docToAdd " + docToAdd);
      let formattedFileNumber =
        fileNumber > 9 ? "" + fileNumber : "0" + fileNumber;
      let newId = prefix_config + jobId + "_O" + formattedFileNumber + "_0";

      docToAdd["widgetDocId"] = newId;
      docToAdd["select"] = "select html goes here";
      docToAdd["selected"] = false;
      docToAdd["pull"] = "pull html goes here";
      docToAdd["boolean"] = "boolean html goes here";
      docToAdd["viewpdf"] = "viewpdf html goes here";
      commit("PUSH_DOC", docToAdd);
    },
    addJob({ commit, state }, jobToAdd) {
      if (!(jobToAdd in state.jobs)) {
        commit("PUSH_JOB", jobToAdd);
      } else {
        console.log("job already exists: ", jobToAdd);
      }
    },
    removeDoc({ commit }, docToRemove) {
      commit("SPLICE_DOC", docToRemove);
    },
    removeJob({ commit }, jobToRemove) {
      commit("SPLICE_JOB", jobToRemove);
    },
    setPerPage({ commit }, perPageToSet) {
      commit("SET_PER_PAGE", perPageToSet);
    },
    setSortBy({ commit }, sortByToSet) {
      commit("SET_SORT_BY", sortByToSet);
    },
    setSortDesc({ commit }, sortDescToSet) {
      commit("SET_SORT_DESC", sortDescToSet);
    },
    setCurrentPage({ commit }, currentPageToSet) {
      commit("SET_CURRENT_PAGE", currentPageToSet);
    },
    toggleSelectedDocs({ commit, state }, docsToToggle) {
      for (let doc of docsToToggle) {
        if (!doc.selected) {
          commit("TOGGLE_SELECTED_DOC", doc);
        } else if (state.selectedDocs.length === state.docs.length) {
          commit("TOGGLE_SELECTED_DOC", doc);
        }
      }
    },
    toggleSelectedJob({ commit }, jobToToggle) {
      commit("TOGGLE_SELECTED_JOB", jobToToggle);
    },
    emptyJobsQueue({ commit }) {
      commit("EMPTY_JOBS_QUEUE");
    },
    emptyDocsQueue({ commit }) {
      commit("EMPTY_DOCS_QUEUE");
    },
    updateQuery({ commit }, queryUpdate) {
      commit("UPDATE_QUERY", queryUpdate);
    }
  },
  getters: {
    idsOfDocsInStore: state => {
      return state.docs.map(doc => Number(doc.mailpiece_id));
    },
    docsLength: state => {
      return state.docs.length;
    },
    getDocsForFile: state => {
      return state.docs;
    },
    getDocWithId: state => id => {
      return state.docs.find(doc => Number(doc.mailpiece_id) === Number(id));
    },
    getSelectedStateOfId: (state, id) => {
      let matchingDocs = state.docs.filter(
        doc => Number(doc.mailpiece_id) === Number(id)
      );
      if (matchingDocs.length > 0) return matchingDocs[0].selected;
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

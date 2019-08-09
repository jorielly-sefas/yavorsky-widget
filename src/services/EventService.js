import axios from "axios";
import { FormPlugin } from "bootstrap-vue";

const loginData = new FormData();
loginData.set("user", "hcollin@sefas.com");
loginData.set("appid", "YU1mwM6SUbEapBlytGSc9HH7rfTCMoGlQ98uc3hAhcI3");

const apiClient = axios.create({
  baseURL: `/producerrest`, //proxied by webpack-dev-server
  // When pulling multiple documents the time to complete the call to /flask/projector/documents/PPQA... 
  // rises linearly with # of documents selected
  timeout: 100000,
  withCredentials: true
});

const columnsForJobs = "";
const columnsForFiles =
  "offset,VPF_path,VPF_ind_path,images_path,overlay_path,removal_mark,mailpiece_id,oaccd,SuprvLgnid";

export default {
  login() {
    return apiClient.post("/login", loginData);
  },
  getJobs() {
    return apiClient.get("/flask/producer/stages/preprintqa/jobs");
  },
  getInitialDocs(fileid, storedPerPage) {
    return apiClient.get(
      "/flask/projector/documents/" +
      fileid +
      "?fieldList='" +
      columnsForFiles +
      "'&pageSize=" +
      1000 + //replace with this.$store.currentPageSize
        "&key=" +
        fileid
    );
  },
  getDocs(fileid, storedPerPage, storedCurrentPage, storedCurrentQuery) {
    // if (
    //   storedPerPage * (storedCurrentPage - 1) >=
    //   this.$store.state.docs.length
    // ) {
    //   let newCurrentPage = this.$store.state.docs.length / storedPerPage;
    //   this.$store.dispatch(
    //     "setCurrentPage",
    //     this.$store.state.docs.length / newCurrentPage
    //   );
    // }
    var formattedQuery = "";
    console.log("getDocs")
    for (var key in storedCurrentQuery) {
      if (storedCurrentQuery[key]) {
        if (formattedQuery)
          formattedQuery += " AND "
        formattedQuery += key + ":(" + storedCurrentQuery[key] + ")";
      }

    }
    return apiClient.get(
      "/flask/projector/documents/" +
        fileid +
        "?fieldList='" +
        columnsForFiles +
        // Pagination wasn't working and was casuing issues as well so I've disabled it
        "'&pageSize=" +
        100 +
        //storedPerPage +
        // "&page=" +
        // storedCurrentPage +
        "&key=" +
        fileid +
        "&query=" +
        formattedQuery
    );
  },
  pullDoc(fileid, data,func) {
    return apiClient.post("/flask/projector/documents/" + fileid, data).then(function(){func()});
  },
  pullDocs(fileid, docsToPull) {
    // for (let doc of docsToPull) {
    //   apiClient.put("/flask/projector/documents/" + fileid, docsToPull);
    // }
  },
  viewDocsOldSchool(fileid, docid) {
    return apiClient.get("/pdfpreview/" + fileid + "/" + docid);
  },
  viewDocs(fileid, docid) {
    // return apiClient.get(
    //   "/flask/projector/actions/VIEW_PDF?IVPFPath=" +
    //     vpfPath +
    //     "&IVPFOffset=" +
    //     offset
    // );
    return apiClient.get("/pdfpreview/" + fileid + "/" + docid);
  },
  approveJobs(jobsToApprove) {
    const formData = new FormData();
    if (jobsToApprove.length > 1) {
      jobsToApprove.forEach(function(item, index, array) {
        console.log("job: " + item + " index: " + index + " array: " + array);
        formData.append("jobid", item.jobId + ",");
        formData.append("fileNumber", item.fileNumber + ",");
        formData.append("version", item.version + ",");
      });
    } else {
      formData.set("jobid", jobsToApprove[0].jobId);
      formData.set("fileNumber", jobsToApprove[0].fileNumber);
      formData.set("version", jobsToApprove[0].version);
    }
    return apiClient.get("/flask/producer/actions/PPQACONFIRM", formData);
  },
  rejectJobs(jobsToReject) {
    const formData = new FormData();
    if (jobsToReject.length > 1) {
      jobsToReject.forEach(function(item, index, array) {
        console.log("job: " + item + " index: " + index + " array: " + array);
        formData.append("jobid", item.jobId + ",");
        formData.append("fileNumber", item.fileNumber + ",");
        formData.append("version", item.version + ",");
      });
    } else {
      formData.set("jobid", jobsToReject[0].jobId);
      formData.set("fileNumber", jobsToReject[0].fileNumber);
      formData.set("version", jobsToReject[0].version);
    }
    return apiClient.get("/flask/producer/actions/PPQAREJECT", formData);
  }
};

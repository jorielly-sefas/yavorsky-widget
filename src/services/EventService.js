import axios from "axios";

const loginData = new FormData();
loginData.set("user", "hcollin@sefas.com");
loginData.set("appid", "YU1mwM6SUbEapBlytGSc9HH7rfTCMoGlQ98uc3hAhcI3");

const apiClient = axios.create({
  baseURL: `/producerrest`, //proxied by webpack-dev-server
  timeout: 10000,
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
      storedPerPage + //replace with this.$store.currentPageSize
        "&key=" +
        fileid
    );
  },
  getDocs(fileid, storedPerPage, storedCurrentPage) {
    return apiClient.get(
      "/flask/projector/documents/" +
      fileid +
      "?fieldList='" +
      columnsForFiles +
      "'&pageSize=" +
      storedPerPage + //replace with this.$store.currentPageSize
        "&page=" +
        storedCurrentPage +
        "&key=" +
        fileid
    );
  },
  pullDocs(fileid, docsToPull) {
    return apiClient.get("/flask/projector/documents/" + fileid, docsToPull);
  },
  viewPdfs(fileid, vpfPath, offset) {
    return apiClient.get(
      "/flask/projector/actions/VIEW_PDF?IVPFPath=" +
        vpfPath +
        "&IVPFOffset=" +
        offset
    );
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

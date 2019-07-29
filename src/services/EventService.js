import axios from "axios";
import { mapState } from "vuex";

const loginData = new FormData();
loginData.set("user", "hcollin@sefas.com");
loginData.set("appid", "YU1mwM6SUbEapBlytGSc9HH7rfTCMoGlQ98uc3hAhcI3");

const apiClient = axios.create({
  baseURL: `/712/api/v1.0/producer_ws/`, //proxied by webpack-dev-server
  timeout: 10000,
  withCredentials: true
});

export default {
  computed: function() {
    mapState([
      "columnsForJobs",
      "columnsForFiles",
      "currentPageSize",
      "currentPage"
    ]);
  },
  login() {
    return apiClient.post("/login", loginData);
  },
  getJobs() {
    return apiClient.get("/flask/producer/stages/preprintqa/jobs");
  },
  getDocs(fileid) {
    return apiClient.get(
      "/flask/projector/documents/" +
        fileid +
        "?fieldList='" +
        this.$store.columnsForFiles() +
        "'&pageSize=" +
        this.$store.currentPageSize() +
        "&key=" +
        fileid
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

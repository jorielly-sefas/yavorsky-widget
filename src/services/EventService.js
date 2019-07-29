import axios from "axios";

const loginData = new FormData();
loginData.set("user", "hcollin@sefas.com");
loginData.set("appId", "YU1mwM6SUbEapBlytGSc9HH7rfTCMoGlQ98uc3hAhcI3");

const apiClient = axios.create({
  baseURL: `/api/v1.0/producer_ws/`, //proxied by webpack-dev-server
  data: loginData,
  timeout: 10000
});

export default {
  login() {
    return apiClient.post("/login");
  },
  getJobs() {
    return apiClient.get(
      "/api/v1.0/producer_ws/flask/producer/stages/preprintqa/jobs"
    );
  },
  getDocs(fileid) {
    return apiClient.get(
      "/api/v1.0/producer_ws/flask/projector/documents/" +
        fileid +
        "?fieldList='" +
        this.$store.columnsForFiles +
        "'&pageSize=" +
        this.$store.currentPageSize +
        "&key=" +
        fileid
    );
  }
};

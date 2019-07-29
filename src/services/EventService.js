import axios from "axios";

const loginData = new FormData();
loginData.set("user", "hcollin@sefas.com");
loginData.set("appid", "YU1mwM6SUbEapBlytGSc9HH7rfTCMoGlQ98uc3hAhcI3");

const apiClient = axios.create({
  baseURL: `/712/api/v1.0/producer_ws/`, //proxied by webpack-dev-server
  timeout: 10000,
  withCredentials: true
});

export default {
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
        this.$store.columnsForFiles +
        "'&pageSize=" +
        this.$store.currentPageSize +
        "&key=" +
        fileid
    );
  }
};

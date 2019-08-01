import Vue from "vue";
import Router from "vue-router";
import Jobs from "./views/Jobs.vue";
import File from "./views/File.vue";

Vue.use(Router);

export default new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "jobs",
      name: "jobs",
      component: Jobs
    },
    {
      path: "file/:jobId/:fileNumber/:version/:fileId",
      name: "file",
      component: File,
      props: true
    }
  ]
});

import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import File from "./views/File.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "about",
      component: About
    },
    {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/file/:id",
      name: "file",
      component: File,
      props: true
    }
  ]
});

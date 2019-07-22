import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Test from "./views/Test.vue";
import VueBootstrapTable from "vue2-bootstrap-table2";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "table",
      component: VueBootstrapTable
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: About
    },
    {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/test",
      name: "test",
      component: Test
    }
  ]
});

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueBootstrapTable from "@/components/VueBootstrapTable.vue";
import Home from "@/views/Home";
import About from "@/views/About";
import File from "@/views/File";
import store from "@/store";
import { BTable, BModal } from "bootstrap-vue";
Vue.component("b-table", BTable);
Vue.component("b-modal", BModal);

require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/js/bootstrap.bundle.min.js");
require("jquery/dist/jquery.min.js");

var vm = new Vue({
  el: "#app",
  router,
  render: h => h(App),
  store,
  components: {
    VueBootstrapTable,
    Home,
    About,
    File,
    BTable,
    BModal
  }
}).$mount("#app");

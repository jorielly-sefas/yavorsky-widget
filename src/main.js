import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueBootstrapTable from "@/components/VueBootstrapTable.vue";
import Jobs from "@/views/Jobs";
import File from "@/views/File";
import store from "@/store";
import { BTable, BModal, BPagination, BFormInput } from "bootstrap-vue";
Vue.component("b-table", BTable);
Vue.component("b-modal", BModal);
Vue.component("b-pagination", BPagination);
Vue.component("b-form-input", BFormInput);

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
    Jobs,
    File,
    BTable,
    BModal,
    BPagination,
    BFormInput
  }
}).$mount("#app");

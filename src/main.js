import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueBootstrapTable from "@/components/VueBootstrapTable.vue";
import Home from "@/views/Home";
import About from "@/views/About";
import File from "@/views/File";

require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/js/bootstrap.bundle.min.js");
require("jquery/dist/jquery.min.js");

var vm = new Vue({
  el: "#app",
  router,
  render: h => h(App),
  components: {
    VueBootstrapTable,
    Home,
    About,
    File
  },
  methods: {
    pullDocs: function() {
      this.$emit("pull-docs", this.filteredValuesSorted);
    }
  }
}).$mount("#app");

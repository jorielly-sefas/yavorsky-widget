import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueBootstrapTable from "@/components/VueBootstrapTable.vue";
import Home from "@/views/Home";
import About from "@/views/About";
import Axios from "axios";
import qs from "qs";

require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/js/bootstrap.bundle.min.js");
require("jquery/dist/jquery.min.js");

var renderfu = function(colname, entry) {
  return (
    '<div class="btn-group" role="group" >' +
    '  <button type="button" class="btn btn-sm btn-primary"><span class="glyphicon glyphicon-ok" aria-hidden="false"></span></button>' +
    '  <button type="button" class="btn btn-sm btn-danger"><span class="glyphicon glyphicon-remove" aria-hidden="false"></span></button>' +
    "</div><span>" +
    JSON.stringify(entry) +
    "</span>"
  );
};

var handleRow = function(event, entry) {
  console.log("CLICK ROW: " + JSON.stringify(entry));
};

var vm = new Vue({
  el: "#app",
  router,
  render: h => h(App),
  components: {
    VueBootstrapTable,
    Home,
    About
  }
}).$mount("#app");

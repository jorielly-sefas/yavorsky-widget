import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueBootstrapTable from "@/components/VueBootstrapTable.vue";
import Axios from "axios";
import qs from "qs";

Vue.config.productionTip = false;

const loginData = new FormData();
loginData.set("user", "hcollin@sefas.com");
loginData.set("appId", "YU1mwM6SUbEapBlytGSc9HH7rfTCMoGlQ98uc3hAhcI3");
const loginHeaders = {
  "Content-Type": "application/x-www-form-urlencoded"
};

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

new Vue({
  router,
  components: {
    VueBootstrapTable
  },
  data: {
    logging: [],
    showFilter: true,
    showPicker: true,
    showSelect: true,
    paginated: false,
    multiColumnSortable: true,
    handleRowFunction: handleRow,
    columnToSortBy: "name",
    jobs: [],
    oldApi: {
      apiUrl: "http://10.6.80.2:9081/api/v1.0/producer_ws/",
      loginUrl: "http://10.6.80.2:9081/api/v1.0/producer_ws/login",
      user: "hcollin@sefas.com",
      appId: "YU1mwM6SUbEapBlytGSc9HH7rfTCMoGlQ98uc3hAhcI3",
      sessionId: ""
    },
    ajax: {
      enabled: false,
      url: "http://172.16.213.1:9430/data/test",
      method: "POST",
      delegate: true
    },
    columns: [
      {
        title: "Job ID",
        name: "jobId"
      },
      {
        title: "File Name",
        name: "filename",
        filterable: false,
        editable: true
      },
      {
        title: "Customer",
        name: "inputDepartment"
      },
      {
        title: "Type",
        name: "inputDocumentType"
      },
      {
        title: "Communications",
        name: "numberOfMailPieces"
      },
      {
        title: "Received",
        name: "jobReceivedDate"
      },
      {
        title: "Updated",
        name: "lastActionDate"
      }
    ],
    values: []
  },
  mounted: function() {},
  created: function() {
    var self = this;
    this.$on("cellDataModifiedEvent", function(
      originalValue,
      newValue,
      columnTitle,
      entry
    ) {
      self.logging.push(
        "cellDataModifiedEvent - Original Value : " +
          originalValue +
          " | New Value : " +
          newValue +
          " | Column : " +
          columnTitle +
          " | Complete Entry : " +
          entry
      );
    });
    this.$on("ajaxLoadedEvent", function(data) {
      this.logging.push("ajaxLoadedEvent - data : " + data);
    });
    this.$on("ajaxLoadingError", function(error) {
      this.logging.push("ajaxLoadingError - error : " + error);
    });
    const loginData = new FormData();
    loginData.append("user", "hcollin@sefas.com");
    loginData.append("appid", "YU1mwM6SUbEapBlytGSc9HH7rfTCMoGlQ98uc3hAhcI3");
    Axios({
      method: "POST",
      url: "http://10.6.80.2:9081/api/v1.0/producer_ws/login",
      withCredentials: true,
      data: loginData
    })
      .then(function(response) {
        console.log(response.data);
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
    Axios({
      method: "GET",
      url:
        "http://10.6.80.2:9081/api/v1.0/producer_ws/flask/producer/stages/preprintqa/jobs",
      withCredentials: true,
      data: loginData
    })
      .then(response => {
        console.log(response.data.results);
        for (var job of response.data.results) {
          // let jobData = response.data.JOB;
          // try { jobData["lastActionDate"] = response.data.PROCHISTORY[response.data.PROCHISTORY.length-1]["actionDate"]; } catch(e) {}
          self.jobs.push(job);
          self.values.push(job);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
    getOldApi: function() {
      var self = this;
      const loginData = new FormData();
      loginData.append("user", "hcollin@sefas.com");
      loginData.append("appid", "YU1mwM6SUbEapBlytGSc9HH7rfTCMoGlQ98uc3hAhcI3");
      Axios({
        method: "POST",
        url: "http://10.6.80.2:9081/api/v1.0/producer_ws/login",
        withCredentials: true,
        data: loginData
      })
        .then(function(response) {
          console.log(response.data);
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
      Axios({
        method: "GET",
        url: "http://10.6.80.2:9081/api/v1.0/producer_ws/joblist/preprintqa",
        withCredentials: true,
        data: loginData
      })
        .then(function(response) {
          console.log(response.data["RESU"]["JOBS"]);
          console.log(response.data["RESU"]["JOBS"]);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    refreshTable: function() {
      this.$refs.exampleTable.refresh();
    },
    setNewPageSize: function() {
      this.$refs.exampleTable.setPageSize(1);
    },
    approveJob: function() {
      var self = this;
      var selected = self.values.filter(function(data) {
        return data.selected === true;
      });
      selected.forEach(function(element) {
        console.log(vm.values.indexOf(element));
        console.log(element);
        self.logging.push(vm.values.indexOf(element));
        self.logging.push(element);
        Axios({
          method: "GET", //TODO: fix hardcoded reference to file number 1
          url:
            "http://10.6.80.2:9081/api/v1.0/producer_ws/action/" +
            element.jobId +
            "/01?action=confirm",
          withCredentials: true,
          data: loginData
        })
          .then(function(response) {
            vm.values.splice(vm.values.indexOf(element), 1);
            vm.values.indexOf(element).selected = false;
            console.log(response.data);
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    },
    rejectJob: function() {
      var self = this;
      var selected = self.values.filter(function(data) {
        return data.selected === true;
      });
      selected.forEach(function(element) {
        console.log(vm.values.indexOf(element));
        console.log(element);
        self.logging.push(vm.values.indexOf(element));
        self.logging.push(element);
        Axios({
          method: "GET", //TODO: fix hardcoded reference to file number 1
          url:
            "http://10.6.80.2:9081/api/v1.0/producer_ws/action/" +
            element.jobId +
            "/01?action=reject",
          withCredentials: true,
          data: loginData
        })
          .then(function(response) {
            vm.values.splice(vm.values.indexOf(element), 1);
            vm.values.indexOf(element).selected = false;
            console.log(response.data);
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    },
    addItem: function() {
      var self = this;
      var item = {
        id: this.values.length + 1,
        name: "name " + (this.values.length + 1)
      };
      this.values.push(item);
    },
    toggleFilter: function() {
      this.showFilter = !this.showFilter;
    },
    togglePicker: function() {
      this.showPicker = !this.showPicker;
    },
    toggleSelect: function() {
      this.showSelect = !this.showSelect;
    },
    togglePagination: function() {
      this.paginated = !this.paginated;
    }
  },
  render: h => h(App)
}).$mount("#app");

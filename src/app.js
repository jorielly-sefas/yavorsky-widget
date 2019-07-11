import VueBootstrapTable from "./VueBootstrapTable.vue";
import Axios from "axios";
import qs from 'qs';

const loginData = new FormData();
loginData.set('user', 'hcollin@sefas.com');
loginData.set('appId', 'YU1mwM6SUbEapBlytGSc9HH7rfTCMoGlQ98uc3hAhcI3');
const loginHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

const myOldApi = Axios.create({
  baseUrl: "http://10.6.80.2:9081/api/v1.0/producer_ws/login",
  timeout: 10000,
  data: loginData,
  headers: loginHeaders,
  withCredentials: true,
  Accept: "application/json"
});

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
        name: "HostFileName",
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
        name: "NumberOfMailPieces"
      },
      {
        title: "Received",
        name: "JobReceivedDate"
      },
      {
        title: "Updated",
        name: "lastActionDate"
      }
    ],
    values: []
  },
  mounted: function() {
  },
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
      method: 'POST',
      url: 'http://10.6.80.2:9081/api/v1.0/producer_ws/login',
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
      method: 'GET',
      url: 'http://10.6.80.2:9081/api/v1.0/producer_ws/joblist/preprintqa',
      withCredentials: true,
      data: loginData
    }).then(response => {
      console.log(response.data.RESU.JOBS)
      for (var job of response.data.RESU.JOBS) {
        Axios({
          method: 'GET',
          url: 'http://10.6.80.2:9081/api/v1.0/producer_ws/jobinfo/'+ job["pullItemId"].split('/')[0],
          withCredentials: true,
          data: loginData
        }).then(response => {
          console.log(response);
          let jobData = response.data.JOB;
          try { jobData["lastActionDate"] = response.data.PROCHISTORY[response.data.PROCHISTORY.length-1]["actionDate"]; } catch(e) {}
          self.jobs.push(jobData);
          self.values.push(jobData);
        }).catch(function(error) {
          console.log(error);
        })
      }
    }).catch(function(error) {
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
        method: 'POST',
        url: 'http://10.6.80.2:9081/api/v1.0/producer_ws/login',
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
        method: 'GET',
        url: 'http://10.6.80.2:9081/api/v1.0/producer_ws/joblist/preprintqa',
        withCredentials: true,
        data: loginData
      }).then(function(response) {
        console.log(response.data['RESU']['JOBS']);
        console.log(response.data['RESU']['JOBS']);
      })
      .catch(function(error) {
        console.log(error);
      });
      // var formData = new FormData();
      // formData.set('user', 'hcollin@sefas.com');
      // formData.set('appId', 'YU1mwM6SUbEapBlytGSc9HH7rfTCMoGlQ98uc3hAhcI3');
      // var headers = {
      //   "Content-Type": "application/x-www-form-urlencoded"
      // };
      // myOldApi
      //   .post(this.oldApi.loginUrl, {
      //     data: formData,
      //     headers: headers
      //   })
      //   .then(function(response) {
      //     console.log(response.data);
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });
      // // var data = "user=hcollin%40sefas.com&appid=YU1mwM6SUbEapBlytGSc9HH7rfTCMoGlQ98uc3hAhcI3";

      // var xhr = new XMLHttpRequest();
      // xhr.withCredentials = true;

      // xhr.addEventListener("readystatechange", function () {
      //   if (this.readyState === 4) {
      //     console.log(this.responseText);
      //   }
      // });

      // xhr.open("POST", "http://10.6.80.2:9081/api/v1.0/producer_ws/login");
      // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      // xhr.setRequestHeader("Accept", "*/*");
      // xhr.setRequestHeader("Host", "10.6.80.2:9081");
      // xhr.setRequestHeader("accept-encoding", "gzip, deflate");
      // xhr.setRequestHeader("content-length", "75");
      // xhr.send(data);
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
          method: 'POST', //TODO: fix hardcoded reference to file number 1
          url: 'http://10.6.80.2:9081/api/v1.0/producer_ws/action/' + self.values.indexOf(element).jobId + '/01?action=confirm',
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
        self.logging.push(vm.values.indexOf(element));
        self.logging.push(element);
        vm.values.splice(vm.values.indexOf(element), 1);
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
  }
});

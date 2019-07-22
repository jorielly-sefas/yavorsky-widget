<template>
<div class="container-fluid">
    <h1>Job Approval Widget</h1>
    <div id="app">
        <div class="row">
            <div class="col-4" style="float:left;">
                <button @click="rejectJob" class="btn btn-outline-primary">Reject Job</button>
                <button @click="approveJob" class="btn btn-primary"><i class="glyphicon glyphicon-plus-sign"></i>Approve Job</button>
            </div>
            <vue-bootstrap-table
                    ref="exampleTable"
                    :columns="columns"
                    :values="values"
                    :show-filter="showFilter"
                    :show-column-picker="showPicker"
                    :paginated="paginated"
                    :multi-column-sortable="multiColumnSortable"
                    :ajax="ajax"
                    :row-click-handler=handleRowFunction
                    :filter-case-sensitive=false
                    :selectable="showSelect"
            >
                <!--<template v-slot:name="slotProps">
                    <b>NAME:</b> {{slotProps.value.name}}
                </template>
                <template v-slot:description="slotProps">
                    <b>DESC:</b> {{slotProps.value.description}}
                </template>-->
            </vue-bootstrap-table>
        </div>
    </div>

</div>
</template>
<script>
import VueBootstrapTable from '@/components/VueBootstrapTable.vue'

export default {
  name: 'about',
  components: {
    VueBootstrapTable
  },
  data: function() {
return {
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
};
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
  }
}
</script>

<template>
  <div class="container-fluid">
    <h1>Job Approval Widget</h1>
    <div id="app">
      <div class="row">
        <div class="col-4" style="float:left;">
          <button @click="rejectJob" class="btn btn-outline-primary">
            Reject Job
          </button>
          <button @click="approveJob" class="btn btn-primary">
            <i class="glyphicon glyphicon-plus-sign"></i>Approve Job
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-4" style="float:left;">
          <span class="statistics"
            >{{ jobs ? jobsLength : 0 }} Jobs in Queue</span
          >
          <span class="statistics" v-if="selected.length > 0"
            >{{ selected.length }} Selected</span
          >
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
          :row-click-handler="handleRowFunction"
          :filter-case-sensitive="false"
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
<style>
.btn {
  margin-right: 16px;
}
.statistics {
  margin-right: 16px;
}
</style>
<script>
import VueBootstrapTable from "@/components/VueBootstrapTable.vue";
import Axios from "axios";
import EventService from "@/services/EventService.js";
import { mapState, mapGetters } from "vuex";
import store from "@/store";

const loginData = new FormData();
loginData.set("user", "hcollin@sefas.com");
loginData.set("appId", "YU1mwM6SUbEapBlytGSc9HH7rfTCMoGlQ98uc3hAhcI3");

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
  let fileNumber =
    entry.fileNumber > 9 ? "" + entry.fileNumber : "0" + entry.fileNumber;
  this.$router.push({
    name: "file",
    params: {
      id: "PPQA_00" + entry.jobId + "_O" + fileNumber + "_0",
      job: entry
    }
  });
};

export default {
  name: "about",
  components: {
    VueBootstrapTable
  },
  store,
  data: function() {
    return {
      logging: [],
      showFilter: true,
      showPicker: true,
      showSelect: true,
      paginated: false,
      multiColumnSortable: true,
      handleRowFunction: handleRow,
      columnToSortBy: "jobId",
      ajax: {
        enabled: false,
        url: "http://172.16.213.1:9430/data/test",
        method: "POST",
        delegate: true
      },
      columns: [
        {
          title: "File Number",
          name: "fileNumber"
        },
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
  computed: {
    selected() {
      var self = this;
      return self.values.filter(function(data) {
        return data.selected === true;
      });
    },
    ...mapGetters(["jobsLength"]),
    ...mapState(["jobs"])
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
    EventService.login()
      .then(function(response) {
        console.log(response);
        EventService.getJobs()
          .then(function(response) {
            for (var job of response.data.results) {
              this.$store.dispatch("addJob", job);
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
        console.log(self.values.indexOf(element));
        console.log(element);
        self.logging.push(self.values.indexOf(element));
        self.logging.push(element);
        let fileNumber =
          element.fileNumber > 9
            ? "" + element.fileNumber
            : "0" + element.fileNumber;
        Axios({
          method: "GET", //TODO: fix hardcoded reference to file number 1
          url:
            "http://10.6.80.2:9081/api/v1.0/producer_ws/action/" +
            element.jobId +
            "/" +
            fileNumber +
            "?action=confirm",
          withCredentials: true,
          data: loginData
        })
          .then(function(response) {
            self.values.splice(self.values.indexOf(element), 1);
            self.values.indexOf(element).selected = false;
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
        console.log(self.values.indexOf(element));
        console.log(element);
        self.logging.push(self.values.indexOf(element));
        self.logging.push(element);
        let fileNumber =
          element.fileNumber > 9
            ? "" + element.fileNumber
            : "0" + element.fileNumber;
        Axios({
          method: "GET", //TODO: fix hardcoded reference to file number 1
          url:
            "http://10.6.80.2:9081/api/v1.0/producer_ws/action/" +
            element.jobId +
            "/" +
            fileNumber +
            "?action=reject",
          withCredentials: true,
          data: loginData
        })
          .then(function(response) {
            self.values.splice(self.values.indexOf(element), 1);
            self.values.indexOf(element).selected = false;
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
        id: self.values.length + 1,
        name: "name " + (self.values.length + 1)
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
};
</script>

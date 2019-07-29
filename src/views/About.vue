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
import EventService from "@/services/EventService.js";
import { mapState, mapGetters } from "vuex";

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
      fileNumber: entry.fileNumber,
      fileId: "PPQA_00" + entry.jobId + "_O" + fileNumber + "_0",
      jobId: entry.jobId,
      version: entry.version
    }
  });
};

export default {
  name: "about",
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
      columnToSortBy: "jobId",
      jobs: this.$store.state.jobs,
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
      values: this.$store.state.jobs
    };
  },
  computed: {
    selected() {
      var self = this;
      return self.values.filter(function(data) {
        return data.selected === true;
      });
    },
    ...mapGetters(["jobsLength", "jobWithId"]),
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
      .then(response => {
        console.log(response);
        EventService.getJobs()
          .then(response => {
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
  beforeDestroy() {
    this.$store.dispatch("emptyJobsQueue");
  },
  methods: {
    refreshTable: function() {
      this.$refs.exampleTable.refresh();
    },
    setNewPageSize: function() {
      this.$refs.exampleTable.setPageSize(1);
    },
    approveJob: function() {
      const jobsToApprove = {};
      this.selected.forEach(element => {
        let fileNumber =
          element.fileNumber > 9
            ? "" + element.fileNumber
            : "0" + element.fileNumber;
        let jobId = element.jobId;
        let version = element.version;
        jobsToApprove.push({
          jobid: jobId,
          fileNumber: fileNumber,
          version: version
        });
      });
      EventService.approveJobs(jobsToApprove)
        .then(response => {
          console.log(response);
          response.message.forEach(result => {
            if (result.status === 200) {
              this.$store.dispatch("removeJob", jobWithId(result.jobId));
              this.$store.dispatch(
                "toggleSelectedJob",
                jobWithId(result.jobId)
              );
            } else {
              console.log(
                "There was an error approving a job: Status " +
                  result.status +
                  ", " +
                  result.message
              );
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    rejectJob: function() {
      const jobsToReject = {};
      this.selected.forEach(element => {
        let fileNumber =
          element.fileNumber > 9
            ? "" + element.fileNumber
            : "0" + element.fileNumber;
        let jobId = element.jobId;
        let version = element.version;
        jobsToReject.push({
          jobid: jobId,
          fileNumber: fileNumber,
          version: version
        });
      });
      EventService.rejectJobs(jobsToReject)
        .then(response => {
          console.log(response);
          response.message.forEach(result => {
            if (result.status === 200) {
              this.$store.dispatch("removeJob", jobWithId(result.jobId));
              this.$store.dispatch(
                "toggleSelectedJob",
                jobWithId(result.jobId)
              );
            } else {
              console.log(
                "There was an error rejecting a job: Status " +
                  result.status +
                  ", " +
                  result.message
              );
            }
          });
        })
        .catch(error => {
          console.log(error);
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

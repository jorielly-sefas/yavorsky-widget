<template>
  <div class="container-fluid">
    <h1>File {{ fileId }}</h1>
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
          <span class="statistics">Job ID: {{ jobId ? jobId : "N/A" }}</span>
          <ul class="statistics">
            <li>{{ values ? values.length : 0 }} Mailpieces</li>
            <li v-if="(docs ? selectedDocs.length : 0) > 0">
              {{ selectedDocs ? selectedDocs.length : 0 }} Selected
            </li>
            <li v-if="(docs ? pulledDocs.length : 0) > 0">Pulled</li>
            <li
              v-if="haveBooleanActions"
              v-for="action in booleanActions"
              :key="action"
            >
              {{ action.count }} {{ action.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="row">
        <b-table striped selectable :items="values">
          <template slot="select" slot-scope="data" v-html="data.value">
            <checkbox></checkbox>
          </template>
          <template slot="pull" slot-scope="data" v-html="data.value">
            <button>Pull</button>
          </template>
          <template
            v-if="haveBooleanActions"
            v-for="action in booleanActions"
            slot="boolean"
            slot-scope="data"
            v-html="data.value"
          >
            <button :key="action">{{ action.name }}</button>
          </template>
        </b-table>
        <!-- <vue-bootstrap-table
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
          :isFile="true"
          v-on:pull-docs="pullDocs"
          v-on:view-docs="viewDoc"
        >
        <!-- </vue-bootstrap-table> -->
      </div>
    </div>
  </div>
</template>
<script>
import VueBootstrapTable from "@/components/VueBootstrapTable.vue";
import Axios from "axios";
import { mapState, mapGetters } from "vuex";
import EventService from "@/services/EventService.js";

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
};

export default {
  name: "file",
  props: ["jobId", "fileNumber", "version", "fileId"],
  components: {
    VueBootstrapTable
  },
  data: function() {
    return {
      logging: [],
      pulledDocs: [],
      haveBooleanActions: false,
      booleanActions: [],
      showFilter: true,
      showPicker: true,
      showSelect: true,
      paginated: false,
      multiColumnSortable: true,
      handleRowFunction: handleRow,
      columnToSortBy: "name",
      ajax: {
        enabled: false,
        url: "http://172.16.213.1:9430/data/test",
        method: "POST",
        delegate: true
      },
      columns: [
        {
          title: "Mailpiece ID",
          name: "mailpiece_id"
        },
        {
          title: "Offset",
          name: "offset"
        },
        {
          title: "VPF Path",
          name: "VPF_path",
          filterable: false,
          editable: true
        },
        {
          title: "VPF Index Path",
          name: "VPF_ind_path"
        },
        {
          title: "Images Path",
          name: "images_path"
        },
        {
          title: "Overlay Path",
          name: "overlay_path"
        },
        {
          title: "Pulled",
          name: "removal_mark"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["docsLength", "selectedDocs"]),
    ...mapState(["docs"]),
    values: state => state.docs
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
        EventService.getDocs(self.fileId).then(response => {
          for (var document of response.data.results) {
            console.log(document["fields"]);
            var flatDoc = {};
            for (var field of document["fields"]) {
              flatDoc[field["key"]] = field["fieldValue"];
            }
            this.$store.dispatch("addDoc", flatDoc);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  },
  beforeDestroy: function() {
    this.$store.dispatch("emptyDocsQueue");
  },
  methods: {
    refreshTable: function() {
      this.$refs.exampleTable.refresh();
    },
    viewDoc: () => {
      var self = this;
      self.selectedDocs.forEach(function(item, index, array) {
        console.log("entry: " + item + " index: " + index + " array: " + array);
        EventService.viewPdfs(self.fileId, item["VPF_path"], item["offset"])
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    pullDocs: () => {
      var self = this;
      this.selectedDocs
        .forEach(function(item, index, array) {
          console.log(
            "entry: " + item + " index: " + index + " array: " + array
          );
          var docData = [
            {
              oldDoc: {
                fields: [
                  {
                    displayable: true,
                    editable: false,
                    fieldValue: item.mailpiece_id,
                    key: "mailpiece_id",
                    searchable: true,
                    type: "Id"
                  }
                ]
              },
              newDoc: {
                fields: [
                  {
                    displayable: true,
                    editable: true,
                    fieldValue: item.removal_mark === "N" ? "Y" : "N",
                    key: "removal_mark",
                    searchable: false,
                    type: "BooleanFlag"
                  }
                ]
              }
            }
          ];
          console.log(docData);
          EventService.pullDocs(self.fileId, docData);
          Axios({
            method: "POST",
            url:
              "/api/v1.0/producer_ws/flask/projector/documents/" + self.fileId,
            data: docData
          })
            .then(function(response) {
              console.log(response);
              EventService.updateDocs();
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    setNewPageSize: function() {
      this.$refs.exampleTable.setPageSize(1);
    },
    approveJob: function() {},
    rejectJob: function() {},
    // approveJob: function() {
    //   let fileNumber =
    //     element.fileNumber > 9
    //       ? "" + element.fileNumber
    //       : "0" + element.fileNumber;
    //   let jobId = this.job.jobId;
    //   let version = element.version;
    //   jobsToApprove = {
    //     jobid: jobId,
    //     fileNumber: fileNumber,
    //     version: version
    //   };
    //   EventService.approveJobs(jobsToApprove)
    //     .then(response => {
    //       console.log(response);
    //       response.message.forEach(result => {
    //         if (result.status === 200) {
    //           this.$store.dispatch("removeJob", jobWithId(result.jobId));
    //         } else {
    //           console.log(
    //             "There was an error approving a job: Status " +
    //               result.status +
    //               ", " +
    //               result.message
    //           );
    //         }
    //       });
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
    // rejectJob: function() {
    //   let fileNumber =
    //     element.fileNumber > 9
    //       ? "" + element.fileNumber
    //       : "0" + element.fileNumber;
    //   let jobId = element.jobId;
    //   let version = element.version;
    //   let jobsToReject = {
    //     jobid: jobid,
    //     fileNumber: fileNumber,
    //     version: version
    //   };
    //   EventService.rejectJobs(jobsToReject)
    //     .then(response => {
    //       console.log(response);
    //       response.message.forEach(result => {
    //         if (result.status === 200) {
    //           this.$store.dispatch("removeJob", jobWithId(result.jobId));
    //         } else {
    //           console.log(
    //             "There was an error rejecting a job: Status " +
    //               result.status +
    //               ", " +
    //               result.message
    //           );
    //         }
    //       });
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
    // addItem: function() {
    //   var self = this;
    //   var item = {
    //     id: self.values.length + 1,
    //     name: "name " + (self.values.length + 1)
    //   };
    //   self.values.push(item);
    // },
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

<template>
  <div class="container-fluid">
    <h1>Docs in File {{ fileId }}</h1>
    <div id="app">
      <div class="row">
        <div class="col-4" style="float:left;">
          <button @click="rejectJob" class="btn btn-outline-primary">
            Reject Job
          </button>
          <button @click="approveJob" class="btn btn-primary">
            Approve Job
          </button>
        </div>
      </div>
      <div class="row" style="margin-top: 15px;">
        <div class="col-4" style="float:left;">
          <span class="statistics">Job ID: {{ jobId ? jobId : "N/A" }}</span>
          <ul class="statistics">
            <li>{{ values ? values.length : 0 }} Mailpieces</li>
            <li v-if="(docs ? selectedDocs.length : 0) > 0">
              {{ docs ? selectedDocs.length : 0 }} Selected
            </li>
            <li v-if="(docs ? pulledDocs.length : 0) > 0">
              {{ docs ? pulledDocs.length : 0 }} Pulled
            </li>
            <template
              v-if="
                booleanActions.reduce((accumulator, currentValue) => [
                  ...accumulator,
                  ...currentValue.count
                ]) > 0
              "
            >
              <li
                v-for="action in booleanActions"
                :key="'action' + action.index"
              >
                {{ action.count }} {{ action.name }}
              </li>
            </template>
          </ul>
        </div>
      </div>
      <div class="row d-flex margin-15">
        <div class="mr-auto">
          <div style="padding-top: 10px;padding-bottom: 10px;">
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary"
                v-if="(docs ? selectedDocs.length : 0) > 0"
                @click="$emit('multi-pull-placeholder')"
              >
                Pull {{ selectedDocs.length }}
              </button>
              <template
                v-if="haveBooleanActions"
                v-for="action in booleanActions"
              >
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  v-if="(docs ? selectedDocs.length : 0) > 0"
                  @click="$emit('multi-boolean-placeholder')"
                  :key="action"
                >
                  {{ action.name }} {{ selectedDocs.length }}
                </button>
              </template>
              <button
                type="button"
                class="btn btn-outline-primary"
                v-if="(docs ? selectedDocs.length : 0) > 0"
                @click="$emit('view-docs-placeholder')"
              >
                View {{ selectedDocs.length }}
              </button>
            </div>
          </div>
        </div>
        <div class="ml-auto" style="padding-top: 10px;padding-bottom: 10px;">
          <button
            v-if="showColumnPicker"
            type="button"
            class="btn btn-outline-primary dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            style="display: inline; margin-right:0px;"
          >
            Columns
            <span class="caret"></span>
          </button>
          <div
            v-if="showColumnPicker"
            class="dropdown-menu dropdown-menu-right"
          >
            <button
              v-for="field in fields"
              class="dropdown-item"
              @click.stop.prevent="toggleColumn(field)"
            >
              <i v-if="field.visible" class="fa fa-check"></i>
              {{ field.label }}
            </button>
          </div>
        </div>
        <div class="" style="padding-top: 10px;padding-bottom: 10px;">
          <b-input-group prepend="Per Page">
            <b-form-input
              v-model="storedPerPage"
              :placeholder="storedPerPage.toString()"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <b-table
          striped
          outlined
          bordered
          responsive
          :sort-by="storedSortBy"
          :sort-desc="storedSortDesc"
          :per-page.sync="storedPerPage"
          :current-page.sync="storedCurrentPage"
          :items="docs"
          :fields="fields"
          class="margin-15"
          row-hovered=""
          row-unhovered=""
          @sorting-change="updateSort"
        >
          <template slot="top-row" slot-scope="{ fields }">
            <td v-for="field in fields" :key="field.key">
              <input
                v-model.lazy="currentQuery[field.key]"
                :placeholder="field.label"
                style="border:none;"
                class="form-control"
                :id="field.key"
              />
            </td>
          </template>
          <template
            slot="select"
            v-if="showSelect"
            slot-scope="data"
            v-html="data.value"
          >
            <td style="border:none;" :key="data.index">
              <div class="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  :id="'check' + data.index"
                  @input="toggleId(data.item.mailpiece_id)"
                />
                <label
                  class="custom-control-label"
                  :for="'check' + data.index"
                ></label>
              </div>
            </td>
          </template>

          <template slot="viewpdf" slot-scope="data" v-html="data.value">
            <button @click="viewDocs(data.item.mailpiece_id)">View PDF</button>
          </template>
          <template
            slot="pull"
            slot-scope="data"
            v-html="data.value"
            @pull-doc="pullDoc"
          >
            <button @click="pullDoc(data.item.mailpiece_id)">
              Pull
            </button>
          </template>
          <template
            v-if="haveBooleanActions"
            v-for="action in booleanActions"
            slot="boolean"
            slot-scope="data"
            v-html="data.value"
          >
            <button
              :key="action"
              @click="takeBooleanAction(action, data.item.mailpiece_id)"
            >
              {{ action.value }}
            </button>
          </template>
        </b-table>
        <b-pagination
          v-model="storedCurrentPage"
          :total-rows="docs.length"
          :per-page.sync="storedPerPage"
          aria-controls="b-table"
          class="margin-left"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>
<style>
ul.statistics li {
  display: inline-block;
  padding: 10px 1%;
  margin: 0;
}
ul.statistics li:first-child {
  padding-left: 0;
}
ul.statistics li:last-child {
  padding-right: 0;
}
.margin-15 {
  margin-left: 15px;
}
</style>
<script>
import { mapState, mapGetters } from "vuex";
import EventService from "@/services/EventService.js";

const loginData = new FormData();
loginData.set("user", "hcollin@sefas.com");
loginData.set("appId", "YU1mwM6SUbEapBlytGSc9HH7rfTCMoGlQ98uc3hAhcI3");

export default {
  name: "file",
  props: {
    jobId: Number,
    fileNumber: Number,
    version: Number,
    fileId: String
  },
  data: function() {
    return {
      logging: [],
      pulledDocs: [],
      haveBooleanActions: true,
      booleanActions: [{ value: "Boolean1", count: 0, name: "Booleaned" }],
      showFilter: true,
      showPicker: true,
      showColumnPicker: true,
      showSelect: true,
      paginated: false,
      mySortBy: "",
      mySortDesc: "",
      myPerPage: 20,
      myCurrentPage: 0,
      multiColumnSortable: true,
      columnToSortBy: "name",
      ajax: {
        enabled: false,
        url: "http://172.16.213.1:9430/data/test",
        method: "POST",
        delegate: true
      },
      filters: {
        select: "",
        SuprvLgnid: "",
        mailpiece_id: "",
        offset: "",
        VPF_path: "",
        removal_mark: "",
        pull: "",
        boolean: ""
      },
      fields: [
        {
          key: "select",
          sortable: true,
          visible: true,
          label: "Select"
        },
        {
          key: "SuprvLgnid",
          sortable: true,
          visible: true,
          label: "SuprvLoginID"
        },
        {
          key: "mailpiece_id",
          sortable: true,
          visible: true,
          label: "Mailpiece ID"
        },
        {
          key: "offset",
          sortable: true,
          visible: true,
          label: "Offset"
        },
        // {
        //   key: "VPF_path",
        //   sortable: true,
        //   visible: true,
        //   label: "VPF Path"
        // },
        {
          key: "removal_mark",
          sortable: true,
          visible: true,
          label: "Removal Mark"
        },
        {
          key: "pull",
          sortable: true,
          visible: true,
          label: "Pull"
        },
        {
          key: "boolean",
          sortable: true,
          visible: true,
          label: "Boolean"
        },
        {
          key: "viewpdf",
          sortable: true,
          visible: true,
          label: "View PDF"
        }
      ],
      columns: [
        {
          title: "select",
          name: "select"
        },
        {
          title: "Login ID",
          name: "SuprvLgnid"
        },
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
          title: "Oaccd",
          name: "oaccd"
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
        },
        {
          title: "Pull",
          name: "pull"
        },
        {
          title: "Bool",
          name: "boolean"
        }
      ]
    };
  },
  computed: {
    ...mapGetters([
      "docsLength",
      "docsForFile",
      "getSelectedStateOfId",
      "getDocWithId"
    ]),
    ...mapState(["docs"]),
    selectedDocs: {
      set(selectedDocs) {
        this.$store.dispatch("setSelectedDocs", selectedDocs);
      },
      get() {
        return this.$store.getters.getSelectedDocs;
      }
    },
    currentQuery: {
      set(queryUpdate) {
        this.$store.dispatch("updateQuery", queryUpdate);
      },
      get() {
        return this.$store.state.currentQuery;
      }
    },
    storedCurrentPage: {
      set(newCurrentPage) {
        this.$store.dispatch("setCurrentPage", newCurrentPage);
      },
      get() {
        return this.$store.state.storedCurrentPage;
      }
    },
    storedPerPage: {
      set(newPerPage) {
        this.$store.dispatch("setPerPage", newPerPage);
      },
      get() {
        return this.$store.state.storedPerPage;
      }
    },
    storedSortBy: {
      set(newSortBy) {
        this.$store.dispatch("setSortBy", newSortBy);
      },
      get() {
        return this.$store.state.storedSortBy;
      }
    },
    storedSortDesc: {
      set(newSortDesc) {
        this.$store.dispatch("setSortDesc", newSortDesc);
      },
      get() {
        return this.$store.state.storedSortDesc;
      }
    },
    values: state => state.docs
  },
  mounted: function() {
    var self = this;
    let currentParams = {
      jobId: self.jobId,
      fileNumber: self.fileNumber,
      version: self.version,
      fileId: self.fileId
    };
    EventService.login()
      .then(response => {
        console.log(response);
        EventService.getInitialDocs(
          currentParams.fileId,
          currentParams.storedPerPage
        ).then(response => {
          for (var document of response.data.results) {
            console.log(document);
            var flatDoc = {};
            for (var field of document["fields"]) {
              flatDoc[field["key"]] = field["fieldValue"];
            }
            this.$store.dispatch(
              "addDoc",
              flatDoc,
              currentParams.jobId,
              currentParams.fileNumber
            );
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  },
  created: function() {},
  beforeDestroy() {
    this.$store.dispatch("emptyDocsQueue");
  },
  methods: {
    emptyDocs() {
      this.$store.dispatch("emptyDocsQueue");
    },
    viewDoc(id) {
      var item = this.$store.getters.getDocWithId(id);
      EventService.viewPdfs(this.fileId, item.VPF_path, item.offset)
        .then(response => {
          console.log(response);
        })
        .catch(error => console.log(error));
    },
    refreshDocs() {
      var currentParams = {
        jobId: this.$route.params.jobId,
        fileNumber: this.$route.params.fileNumber,
        version: this.$route.params.version,
        fileId: this.$route.params.fileId
      };
      EventService.getDocs(
        currentParams.fileId,
        this.$store.state.storedPerPage,
        this.$store.state.storedCurrentPage,
        this.$store.state.currentQuery
      ).then(response => {
        for (var document of response.data.results) {
          console.log(document);
          var flatDoc = {};
          for (var field of document["fields"]) {
            flatDoc[field["key"]] = field["fieldValue"];
          }
          this.$store.dispatch(
            "addDoc",
            flatDoc,
            currentParams.jobId,
            currentParams.fileNumber
          );
        }
      });
    },
    pullDoc(id) {
      console.log("pull doc method called");
      var item = this.$store.getters.getDocWithId(id);
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
      EventService.pullDoc(this.fileId, docData)
        .then(this.refreshDocs())
        .catch(error => console.log(error));
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
          EventService.pullDoc(self.fileId, docData);
        })
        .catch(function(error) {
          console.log(error);
        });
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
    takeBooleanAction: function(action, id) {
      console.log("boolean " + action + " for " + id);
    },
    toggleFilter: function() {
      this.showFilter = !this.showFilter;
    },
    toggleId: function(mailpiece_id) {
      console.log(
        "toggleSelectedDocs dispatched with ",
        this.$store.state.docs.filter(
          doc => Number(doc.mailpiece_id) === Number(mailpiece_id)
        )
      );
      this.$store.dispatch(
        "toggleSelectedDocs",
        this.$store.state.docs.filter(
          doc => Number(doc.mailpiece_id) === Number(mailpiece_id)
        )
      );
    },
    togglePicker: function() {
      this.showPicker = !this.showPicker;
    },
    toggleColumn: function() {},
    toggleSelect: function() {
      this.showSelect = !this.showSelect;
    },
    togglePagination: function() {
      this.paginated = !this.paginated;
    },
    updateSort(sortCtx) {
      this.storedSortBy = sortCtx.sortBy;
      this.storedSortDesc = sortCtx.sortDesc;
    },
    viewDocs: function(docs) {
      console.log("viewDocs got ", docs);
      EventService.viewDocs(docs);
    }
  },
  watch: {
    storedCurrentPage() {
      this.refreshDocs();
    },
    currentQuery() {
      this.emptyDocs();
      this.refreshDocs();
    }
  }
};
</script>

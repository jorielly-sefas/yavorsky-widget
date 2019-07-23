<template>
<div class="container-fluid">
    <h1>File {{ id }}</h1>
    <div id="app">
        <div class="row">
            <div class="col-4" style="float:left;">
                <button @click="rejectJob" class="btn btn-outline-primary">Reject Job</button>
                <button @click="approveJob" class="btn btn-primary"><i class="glyphicon glyphicon-plus-sign"></i>Approve Job</button>
            </div>
            <div class="col-4" style="float:left;">
                <span class="statistics">{{ job.jobId }}</span>
                <span class="statistics">{{ values.length }} Mailpieces</span>
                <span class="statistics" v-if="selected.length > 0">{{ selected.length }} Selected</span>
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
import VueBootstrapTable from "@/components/VueBootstrapTable.vue";
import Axios from "axios";
import qs from "qs";

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
  let fileNumber = entry.fileNumber > 9 ? "" + entry.fileNumber: "0" + entry.fileNumber;
  let fileId = "PPQA_" + "003410" + "_O" + fileNumber + "_0";
  const loginData = new FormData();
  loginData.append("user", "hcollin@sefas.com");
  loginData.append("appid", "YU1mwM6SUbEapBlytGSc9HH7rfTCMoGlQ98uc3hAhcI3");
  var docData = JSON.stringify([
  {
    "oldDoc": {
      "fields": [
        {
          "displayable": true,
          "editable": false,
          "fieldValue": "000004",
          "key": "mailpiece_id",
          "searchable": true,
          "type": "Id"
        }
      ]
    },
    "newDoc": {
      "fields": [
        {
          "displayable": true,
          "editable": true,
          "fieldValue": "N",
          "key": "removal_mark",
          "searchable": false,
          "type": "BooleanFlag"
        }
      ]
    }
  }
]);
  loginData.append("json", docData)
  Axios({
    method: "POST",
    url: "/api/v1.0/producer_ws/flask/projector/documents/" + fileId,
    withCredentials: true,
    data: loginData
  })
  .then(response => {
    console.log(response.data.results);
    // for (var document of response.data.results) {
    //   console.log(document['fields']);
    //   // let jobData = response.data.JOB;
    //   // try { jobData["lastActionDate"] = response.data.PROCHISTORY[response.data.PROCHISTORY.length-1]["actionDate"]; } catch(e) {}
    //   var flatDoc = {};
    //   for (var field of document['fields']) {
    //     flatDoc[field['key']] = field['fieldValue'];
    //   }
    //   self.jobs.push(flatDoc);
    //   self.values.push(flatDoc);
  })
  .catch(function(error) {
    console.log(error);
  });
  this.$router.push({ name: 'file', params: { id: "PPQA_00" + entry.jobId + "_O" + fileNumber + "_0", job: entry } })
};

export default {
  name: 'file',
  props: ["id", "job"],
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
  }
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
          "http://10.6.80.2:9081/api/v1.0/producer_ws/flask/projector/documents/" + self.id + "?fieldList='offset,VPF_path,VPF_ind_path,images_path,overlay_path,removal_mark,mailpiece_id,oaccd,SuprvLgnid'&pageSize=20&key=" + self.id,
        withCredentials: true,
        data: loginData
      })
        .then(response => {
          // console.log(response.data.results);
          for (var document of response.data.results) {
            console.log(document['fields']);
            // let jobData = response.data.JOB;
            // try { jobData["lastActionDate"] = response.data.PROCHISTORY[response.data.PROCHISTORY.length-1]["actionDate"]; } catch(e) {}
            var flatDoc = {};
            for (var field of document['fields']) {
              flatDoc[field['key']] = field['fieldValue'];
            }
            self.jobs.push(flatDoc);
            self.values.push(flatDoc);
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
          vm.values.splice(self.values.indexOf(element), 1);
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
      id: self.values.length + 1,
      name: "name " + (self.values.length + 1)
    };
    self.values.push(item);
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

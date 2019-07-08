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
        name: "hostFileName",
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
        name: "mailpieces"
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
    values: [
      {
        additionalFields: "None",
        ajVersion: "4",
        configurationSet: "DEFAULT",
        customer: "INTERNAL",
        department: "PRODUCTION",
        documentType: "ECF_JOBS",
        error: "False",
        fileName: "None",
        fileNumber: "0",
        fileSize: "55086",
        groupCount: "0",
        hostClass: "",
        hostFileName: "Sefas Healthcare Newsletter",
        hostFormType: "",
        id: "000182",
        idfName: "",
        inputCustomer: "SEFAS",
        inputDepartment: "HEALTHCARE",
        inputDocumentType: "STATEMENTS",
        inputJob: "True",
        inputSplitName: "@",
        inputSplitNumber: "0",
        jobId: "182",
        jobName: "SFS-HCARE-PAS_COMPOS",
        jobReceivedDate: "Tue Sep 11 13:03:53 EDT 2018",
        jobVersion: "5",
        jpofFileNumber: "0",
        lastActionDate: "Tue Sep 11 13:04:26 EDT 2018",
        lastProcessedGroup: "None",
        locked: "False",
        lockedDate: "None",
        mailpieces: "39",
        memo: "",
        mergeJob: "False",
        numberOfOutputFiles: "0",
        pages: "135",
        prevFileSize: "0",
        prevPages: "0",
        processPool: "",
        reprintCount: "0",
        slaScheduleDate: "None",
        stage: "PREPROCESSINGQA",
        stageStartedDate: "None",
        status: "QUEUED",
        statusErrorFilename: "",
        statusText: "'"
      },
      {
        additionalFields: "None",
        ajVersion: "4",
        configurationSet: "DEFAULT",
        customer: "INTERNAL",
        department: "PRODUCTION",
        documentType: "ECF_JOBS",
        error: "False",
        fileName: "None",
        fileNumber: "0",
        fileSize: "55086",
        groupCount: "0",
        hostClass: "",
        hostFileName: "Privacy Policy",
        hostFormType: "",
        id: "000183",
        idfName: "",
        inputCustomer: "SEFAS",
        inputDepartment: "HEALTHCARE",
        inputDocumentType: "STATEMENTS",
        inputJob: "True",
        inputSplitName: "@",
        inputSplitNumber: "0",
        jobId: "183",
        jobName: "SFS-HCARE-PAS_COMPOS",
        jobReceivedDate: "Tue Sep 11 13:04:18 EDT 2018",
        jobVersion: "5",
        jpofFileNumber: "0",
        lastActionDate: "Tue Sep 11 13:04:37 EDT 2018",
        lastProcessedGroup: "None",
        locked: "False",
        lockedDate: "None",
        mailpieces: "39",
        memo: "",
        mergeJob: "False",
        numberOfOutputFiles: "0",
        pages: "135",
        prevFileSize: "0",
        prevPages: "0",
        processPool: "",
        reprintCount: "0",
        slaScheduleDate: "None",
        stage: "PREPROCESSINGQA",
        stageStartedDate: "None",
        status: "QUEUED",
        statusErrorFilename: "",
        statusText: "'"
      },
      {
        additionalFields: "None",
        ajVersion: "4",
        configurationSet: "DEFAULT",
        customer: "INTERNAL",
        department: "PRODUCTION",
        documentType: "ECF_JOBS",
        error: "False",
        fileName: "None",
        fileNumber: "0",
        fileSize: "55086",
        groupCount: "0",
        hostClass: "",
        hostFileName: "Explanation of Benefits",
        hostFormType: "",
        id: "000184",
        idfName: "",
        inputCustomer: "SEFAS",
        inputDepartment: "HEALTHCARE",
        inputDocumentType: "STATEMENTS",
        inputJob: "True",
        inputSplitName: "@",
        inputSplitNumber: "0",
        jobId: "184",
        jobName: "SFS-HCARE-PAS_COMPOS",
        jobReceivedDate: "Tue Sep 11 13:04:38 EDT 2018",
        jobVersion: "5",
        jpofFileNumber: "0",
        lastActionDate: "Tue Sep 11 13:05:10 EDT 2018",
        lastProcessedGroup: "None",
        locked: "False",
        lockedDate: "None",
        mailpieces: "39",
        memo: "",
        mergeJob: "False",
        numberOfOutputFiles: "0",
        pages: "135",
        prevFileSize: "0",
        prevPages: "0",
        processPool: "",
        reprintCount: "0",
        slaScheduleDate: "None",
        stage: "PREPROCESSINGQA",
        stageStartedDate: "None",
        status: "QUEUED",
        statusErrorFilename: "",
        statusText: "'"
      },
      {
        additionalFields: "None",
        ajVersion: "4",
        configurationSet: "DEFAULT",
        customer: "INTERNAL",
        department: "PRODUCTION",
        documentType: "ECF_JOBS",
        error: "False",
        fileName: "None",
        fileNumber: "0",
        fileSize: "58057",
        groupCount: "0",
        hostClass: "",
        hostFileName: "Plan Activity Statement",
        hostFormType: "",
        id: "000230",
        idfName: "",
        inputCustomer: "SEFAS",
        inputDepartment: "HEALTHCARE",
        inputDocumentType: "STATEMENTS",
        inputJob: "True",
        inputSplitName: "@",
        inputSplitNumber: "0",
        jobId: "230",
        jobName: "SFS-HCARE-PAS_COMPOS",
        jobReceivedDate: "Tue Dec 11 15:20:33 EST 2018",
        jobVersion: "5",
        jpofFileNumber: "0",
        lastActionDate: "Tue Dec 11 15:21:00 EST 2018",
        lastProcessedGroup: "None",
        locked: "False",
        lockedDate: "None",
        mailpieces: "42",
        memo: "",
        mergeJob: "False",
        numberOfOutputFiles: "0",
        pages: "141",
        prevFileSize: "0",
        prevPages: "0",
        processPool: "",
        reprintCount: "0",
        slaScheduleDate: "None",
        stage: "PREPROCESSINGQA",
        stageStartedDate: "None",
        status: "QUEUED",
        statusErrorFilename: "",
        statusText: "'"
      },
      {
        additionalFields: "None",
        ajVersion: "4",
        configurationSet: "DEFAULT",
        customer: "INTERNAL",
        department: "PRODUCTION",
        documentType: "ECF_JOBS",
        error: "False",
        fileName: "None",
        fileNumber: "0",
        fileSize: "58057",
        groupCount: "0",
        hostClass: "",
        hostFileName: "Plan Activity Statement",
        hostFormType: "",
        id: "000238",
        idfName: "",
        inputCustomer: "SEFAS",
        inputDepartment: "HEALTHCARE",
        inputDocumentType: "STATEMENTS",
        inputJob: "True",
        inputSplitName: "@",
        inputSplitNumber: "0",
        jobId: "238",
        jobName: "SFS-HCARE-PAS_COMPOS",
        jobReceivedDate: "Thu Apr 04 12:15:21 EDT 2019",
        jobVersion: "5",
        jpofFileNumber: "0",
        lastActionDate: "Thu Apr 04 12:15:58 EDT 2019",
        lastProcessedGroup: "None",
        locked: "False",
        lockedDate: "None",
        mailpieces: "42",
        memo: "",
        mergeJob: "False",
        numberOfOutputFiles: "0",
        pages: "141",
        prevFileSize: "0",
        prevPages: "0",
        processPool: "",
        reprintCount: "0",
        slaScheduleDate: "None",
        stage: "PREPROCESSINGQA",
        stageStartedDate: "None",
        status: "QUEUED",
        statusErrorFilename: "",
        statusText: "'"
      },
      {
        additionalFields: "None",
        ajVersion: "4",
        configurationSet: "DEFAULT",
        customer: "INTERNAL",
        department: "PRODUCTION",
        documentType: "ECF_JOBS",
        error: "False",
        fileName: "None",
        fileNumber: "0",
        fileSize: "58057",
        groupCount: "0",
        hostClass: "",
        hostFileName: "Plan Activity Statement",
        hostFormType: "",
        id: "000280",
        idfName: "",
        inputCustomer: "SEFAS",
        inputDepartment: "HEALTHCARE",
        inputDocumentType: "STATEMENTS",
        inputJob: "True",
        inputSplitName: "@",
        inputSplitNumber: "0",
        jobId: "280",
        jobName: "SFS-HCARE-PAS_COMPOS",
        jobReceivedDate: "Thu May 09 14:46:16 EDT 2019",
        jobVersion: "5",
        jpofFileNumber: "0",
        lastActionDate: "Thu May 09 14:46:38 EDT 2019",
        lastProcessedGroup: "None",
        locked: "False",
        lockedDate: "None",
        mailpieces: "42",
        memo: "",
        mergeJob: "False",
        numberOfOutputFiles: "0",
        pages: "141",
        prevFileSize: "0",
        prevPages: "0",
        processPool: "",
        reprintCount: "0",
        slaScheduleDate: "None",
        stage: "PREPROCESSINGQA",
        stageStartedDate: "None",
        status: "QUEUED",
        statusErrorFilename: "",
        statusText: "'"
      }
    ]
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
  },
  methods: {
    getOldApi: function() {
      var self = this;
      axios({
        method: 'POST',
        url: 'http://10.6.80.2:9081/api/v1.0/producer_ws/login',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: {
          "user": self.oldApi.user,
          "appId": self.oldApi.appId
        }
      })
      .then(function(response) {
        console.log(response.data);
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
        self.logging.push(vm.values.indexOf(element));
        self.logging.push(element);
        vm.values.splice(vm.values.indexOf(element), 1);
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

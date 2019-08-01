// vue.config.js
module.exports = {
  publicPath: "",
  // indexPath: "distWidget.html",
  filenameHashing: false,
  runtimeCompiler: true,
  // transpileDependencies: ["axios", "vuex", "bootstrap-vue", "vue-router"],
  devServer: {
    allowedHosts: ["10.6.80.13", "services-uswest.skytap.com:29588"],
    disableHostCheck: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    proxy: {
      "/712": {
        target: "http://10.6.80.2:9081",
        changeOrigin: true,
        pathRewrite: {
          "/712": ""
        }
      },
      "/114": {
        target: "http://10.6.80.9:8080",
        changeOrigin: true,
        pathRewrite: {
          "/114": ""
        }
      },
      "/projector": {
        target: "http://10.6.80.9:8080/hcs/rest/api/1/json",
        changeOrigin: true
      },
      "/producerrest": {
        target: "http://10.6.80.12:9081",
        changeOrigin: true
      }
    },
    setup: function(app) {
      app.all("/*", function(req, res, next) {
        // CORS headers
        res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
        res.header(
          "Access-Control-Allow-Methods",
          "GET,PUT,POST,DELETE,OPTIONS"
        );
        // Set custom headers for CORS
        res.header(
          "Access-Control-Allow-Headers",
          "Content-type,Accept,X-Access-Token,X-Key"
        );
        if (req.method == "OPTIONS") {
          res.status(200).end();
        } else {
          next();
        }
      });
    }
  }
};

// vue.config.js
module.exports = {
  devServer: {
    allowedHosts: ["10.6.80.13", "services-uswest.skytap.com:29588"],
    disableHostCheck: true,
    proxy: {
      "http://10.6.80.2:9081/api": {
        target: "http://10.6.80.2:9081/api",
        changeOrigin: true
      }
    }
  }
};

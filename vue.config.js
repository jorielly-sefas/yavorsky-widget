// vue.config.js
module.exports = {
  devServer: {
    index: "", // specify to enable root proxying
    allowedHosts: ["10.6.80.13", "services-uswest.skytap.com:29588"],
    disableHostCheck: true,
    proxy: {
      context: () => true,
      target: "http://localhost:8081/",
      changeOrigin: true
    }
  }
};

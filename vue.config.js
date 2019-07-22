// vue.config.js
module.exports = {
  devServer: {
    allowedHosts: ["10.6.80.13", "services-uswest.skytap.com:29588"],
    disableHostCheck: true,
    proxy: {
      target: "http://10.6.80.13/",
      changeOrigin: true
    }
  }
};

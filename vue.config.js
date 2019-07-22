// vue.config.js
module.exports = {
  devServer: {
    allowedHosts: ["10.6.80.13", "services-uswest.skytap.com:29588"],
    disableHostCheck: true,
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

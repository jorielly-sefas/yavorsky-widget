var vue = require('vue-loader')
var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin")

var cssLoader = ExtractTextPlugin.extract("style-loader", "css-loader")

module.exports = {
    devServer: {
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        },
        proxy: {
            '/wb': {
               target: {
                  host: "0.0.0.0",
                  protocol: 'http:',
                  port: 9081
               },
               pathRewrite: {
                  '^/wb': ''
               }
            }
         }
    },
    entry: {
        app: './src/app.js'
    },
    output: {
        path: './build',
        publicPath: '/build/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                // excluding some local linked packages.
                // for normal use cases only node_modules is needed.
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.css$/,
                loader: cssLoader
            }
        ]
    },
    // vue: {
    //   loaders: {
    //     css: ExtractTextPlugin.extract("css"),
    //     stylus: ExtractTextPlugin.extract("css!stylus")
    //   }
    // },
    devtool: "#source-map",
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    }
}

if (process.env.NODE_ENV === 'production') {

    delete module.exports.devtool
    module.exports.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
        // new ExtractTextPlugin("build.css")
    ]
} else {
    // module.exports.plugins = [
    //   new ExtractTextPlugin("build.css")
    // ]
    // module.exports.devtool = '#source-map'
}

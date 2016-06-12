var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

var srcDir = path.resolve(process.cwd(), 'src');

//获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
    var jsPath = path.resolve(srcDir, 'js/page');
    console.log("-------------------------"+jsPath);
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        console.log(matchs);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'js/page', item);
             console.log("-------------------------"+item);
        }
    });
    console.log(JSON.stringify(files));
    return files;
}

module.exports = {
    cache: true,
    devtool: "source-map",
    entry: getEntry(),
    output: {
        path: path.join(__dirname, "dist/js/"),
        publicPath: "dist/js/",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    },
     module: {
        //各种加载器，即让各种文件格式可用require引用
        loaders: [
         {test: path.resolve(srcDir, "/js/lib/jquery-2.1.1.min.js"), loader: 'expose?jQuery'},
        {
      test: /\.css$/,
      loader: 'style!css?sourceMap'
    },
      {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&mimetype=application/octet-stream"
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: "file"
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&mimetype=image/svg+xml"
    }
        
        ]

    },
    resolve: {
        alias: {
            jquery: srcDir + "/js/lib/jquery-2.1.1.min.js",
            common: srcDir + "/js/common",
            page: srcDir + "/js/page",
            libs: srcDir + "/js/lib"
        }
    },
    plugins: [
        new CommonsChunkPlugin('common.js'),
        new webpack.ProvidePlugin({
          "$" : "jquery",
          "jQuery" : "jquery",
          "jquery" : "jquery",
          "window.jQuery" : "jquery"
       }),
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
                "require.specified": "require.resolve"
            })
    ],
    devtool: '#source-map'
};

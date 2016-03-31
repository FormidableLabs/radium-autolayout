var path = require("path");
var webpack = require("webpack");

var ROOT = process.cwd();
var SRC = path.join(ROOT, "src");

module.exports = {
  cache: true,
  context: SRC,
  output: {
    path: path.join(ROOT, "lib"),
    libraryTarget: "var"
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [SRC],
        loader: "babel-loader"
      }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new webpack.SourceMapDevToolPlugin({filename: "[file].map"})
  ]
};

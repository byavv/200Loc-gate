const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin'),
  DedupePlugin = require('webpack/lib/optimize/DedupePlugin'),
  UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin'),
  CompressionPlugin = require('compression-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  PurifyCssPlugin = require("purifycss-webpack-plugin")
  ;

module.exports = webpackMerge(commonConfig, {
  debug: false,
  output: {
    filename: '[name].[chunkhash:7].js',
    chunkFilename: '[id].[chunkhash:7].js'
  },
  plugins: [
    new DedupePlugin(),
    new UglifyJsPlugin({
      beautify: false,
      mangle: { screw_ie8: true },
      compress: { screw_ie8: true, warnings: false },
      comments: false
    }),
    new CompressionPlugin({
      regExp: /\.css$|\.html$|\.js$/,
      threshold: 2 * 1024
    }),
    new ExtractTextPlugin('assets/styles/[name].[chunkhash:7].css'),
    new PurifyCssPlugin({
      paths: [
        __root("../client/app/**/*.html")
      ]
    })
  ],
  htmlLoader: {
    minimize: true,
    removeAttributeQuotes: false,
    caseSensitive: true,
    customAttrSurround: [
      [/#/, /(?:)/],
      [/\*/, /(?:)/],
      [/\[?\(?/, /(?:)/]
    ],
    customAttrAssign: [/\)?\]?=/]
  },
});

function __root() {
  var _root = path.resolve(__dirname);
  var args = Array.prototype.slice.call(arguments);
  return path.join.apply(path, [_root].concat(args));
}

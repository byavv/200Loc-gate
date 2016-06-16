const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const DefinePlugin = require('webpack/lib/DefinePlugin'),
  DedupePlugin = require('webpack/lib/optimize/DedupePlugin'),
  UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin'),
  CompressionPlugin = require('compression-webpack-plugin')
  ;

module.exports = webpackMerge(commonConfig, {
  output: {
    filename: '[name].[chunkhash:7].bundle.js',
    chunkFilename: '[id].[chunkhash:7].chunk.js',
    publicPath: '/static',
  },
  plugins: [
    new DedupePlugin(),
    new UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true,
        warnings: false
      },
      comments: false
    }),
    new CompressionPlugin({
      regExp: /\.css$|\.html$|\.js$|\.map$/,
      threshold: 2 * 1024
    }),
  ]
});
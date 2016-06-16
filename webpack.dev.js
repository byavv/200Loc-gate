const webpackMerge = require('webpack-merge'),
  webpack = require('webpack'),
  commonConfig = require('./webpack.common.js'),
  ExtractTextPlugin = require('extract-text-webpack-plugin')
  ;

module.exports = webpackMerge(commonConfig, {
  debug: true,
  devtool: 'source-map',
  entry: {
    polyfills: [
      'zone.js/dist/long-stack-trace-zone'
    ]
  },
  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'   
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('assets/styles/[name].css'),
  ]
});
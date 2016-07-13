const webpackMerge = require('webpack-merge'),
  webpack = require('webpack'),
  commonConfig = require('./webpack.common.js'),
  ExtractTextPlugin = require('extract-text-webpack-plugin')
  ;

module.exports = webpackMerge(commonConfig, { 
  devtool: 'inline-source-map',
  debug: true,
  entry: {
    polyfills: [
      'zone.js/dist/long-stack-trace-zone'
    ]
  },
  output: {
    filename: '[name].js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('assets/styles/[name].css'),
  ]
});

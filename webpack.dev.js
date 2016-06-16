const webpackMerge = require('webpack-merge'),
  webpack = require('webpack'),
  commonConfig = require('./webpack.common.js')
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
    chunkFilename: '[id].chunk.js',
    publicPath: '/static',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});
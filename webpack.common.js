const webpack = require('webpack'),
  autoprefixer = require('autoprefixer'),
  path = require('path'),
  DefinePlugin = require('webpack/lib/DefinePlugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  precss = require('precss'),
  fs = require('fs')
  ;
console.log(__root('client', 'app'))
console.log(path.join(__dirname, 'client', 'app'))
console.log(path.resolve(__dirname, "client/app"))
console.log(fs.realpathSync(__dirname + '/client/app'))
module.exports = {
  entry: {
    polyfills: [
      //'core-js/shim',
      'core-js/es6',
      'core-js/es7/reflect',
      'zone.js/dist/zone'
    ],
    vendor: [
      '@angular/common',
      '@angular/core',
      '@angular/http',
      '@angular/platform-browser-dynamic',
      '@angular/router',
      'rxjs/Rx'
    ],
    main: './client/bootstrap.ts'
  },
  output: {
    path: __root('build'),
    publicPath: '/static',
  },
  resolve: {
    root: __root(),
    extensions: ['', '.ts', '.js', '.scss']
  },
  module: {
    loaders: [
      { test: /\.html$/, loader: 'html' },
      { test: /\.css$/, loader: "raw!postcss" },
      { test: /\.scss$/, loader: 'raw!postcss!sass' },
      {
        test: /\.ts$/, loader: 'ts', exclude: [/node_modules/], ignoreDiagnostics: [
          2403, // 2403 -> Subsequent variable declarations
          2300, // 2300 -> Duplicate identifier
          2374, // 2374 -> Duplicate number index signature
          2375, // 2375 -> Duplicate string index signature
          2502  // 2502 -> Referenced directly or indirectly
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({ name: ['vendor', 'polyfills'] }),
    new HtmlWebpackPlugin({
      template: 'client/index.html',
      chunksSortMode: 'dependency'
    }),
    new DefinePlugin({
      ENV: JSON.stringify(process.env.NODE_ENV)
    }),
    new CopyWebpackPlugin([
      { from: 'client/assets', to: 'assets' }
    ]),
  ],
  postcss: () => {
    return [
      autoprefixer({ browsers: ['last 2 versions'] }),
      precss
    ];
  },
};

function __root() {
  var _root = path.resolve(__dirname);
  var args = Array.prototype.slice.call(arguments);
  return path.join.apply(path, [_root].concat(args));
}
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

module.exports = {
  target: 'web',
  entry: {
    main: [__root('../client/bootstrap.ts')],
    polyfills: [
      'core-js/shim',
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
    ]
  },
  output: {
    path: __root('../build'),
    publicPath: '/static',
    pathinfo: false,
  },
  externals: [__root('node_modules')],
  resolve: {
    root: [__root("node_modules")],
    extensions: ['', '.ts', '.js', '.scss'],
    cache: true
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
      template: __root('../client/index.html'),
      chunksSortMode: 'dependency'
    }),
    new DefinePlugin({
      ENV: JSON.stringify(process.env.NODE_ENV)
    }),
    new CopyWebpackPlugin([
      { from: __root('../client/assets'), to: 'assets' }
    ]),
  ],
  postcss: () => {
    return [
      autoprefixer({ browsers: ['last 2 versions'] }),
      precss
    ];
  },
  /* node: {
     global: 'window',
     crypto: 'empty',
     module: false,
     clearImmediate: false,
     setImmediate: false
   }*/
};

function __root() {
  var _root = path.resolve(__dirname);
  var args = Array.prototype.slice.call(arguments);
  return path.join.apply(path, [_root].concat(args));
}
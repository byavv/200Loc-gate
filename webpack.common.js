const webpack = require('webpack'),
  autoprefixer = require('autoprefixer'),
  path = require('path'),
  DefinePlugin = require('webpack/lib/DefinePlugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin')
  ;

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
    path: __root('build')
  },
  resolve: {
    root: __root('client'),
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.html$/, loader: 'raw' },
      { test: /\.scss$/, loaders: ['raw', 'postcss', 'sass'] },
      {
        test: /\.ts$/,
        loader: 'ts',
        exclude: [
          /node_modules/
        ],
        query: {
          ignoreDiagnostics: [
            2403, // 2403 -> Subsequent variable declarations
            2300, // 2300 -> Duplicate identifier
            2374, // 2374 -> Duplicate number index signature
            2375, // 2375 -> Duplicate string index signature
            2502  // 2502 -> Referenced directly or indirectly
          ]
        },
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({ name: ['vendor', 'polyfills'] }),
    new HtmlWebpackPlugin({
      template: './client/index.html',
      chunksSortMode: 'dependency'
    }),
    new DefinePlugin({
      ENV: JSON.stringify(process.env.NODE_ENV)
    })
  ],
  // thirdparty loader-configs
  postcss: () => {
    return [autoprefixer];
  }
};

function __root() {
  var args = Array.prototype.slice.call(arguments);
  return path.join.apply(path, [__dirname].concat(args));
}
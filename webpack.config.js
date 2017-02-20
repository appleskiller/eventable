var webpack = require('webpack');

module.exports = {
  entry: {
    "test/eventable.spec": "./test/eventable.spec.ts",
    eventable: "./src/eventable.ts"
    // "karma-bundle": "./karma-bundle.ts"
  },
  output: {
    filename: '[name].js',
    path: __dirname + "/dist"
  },
  resolve: {
     extensions: ['.webpack.js', '.web.js', '.ts', '.js']
  },
  externals: {
    "lodash": "_"
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ],
  },
  devtool: "source-map"
}
var webpack = require('webpack');

module.exports = {
  entry: {
    eventable: "./src/eventable.ts"
  },
  output: {
    filename: 'dist/[name].js'
  },
  resolve: {
     extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
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
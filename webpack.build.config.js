var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './src/javascript/app.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader'
        ]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  plugins: [
    // new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new HtmlWebpackPlugin({
      favicon: './src/favicon.ico',
      title: 'NetKAN Status'
    }),
    new webpack.optimize.UglifyJsPlugin({
      // <- uglifyjs options here
    })
  ]
};

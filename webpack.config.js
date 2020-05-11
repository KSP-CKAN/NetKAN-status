var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  entry: './src/javascript/app.jsx',
  devtool: 'source-map',
  watch: true,
  output: {
    path: __dirname + '/dist',
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
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.png$/,
        loader: 'url-loader',
        options: {
          esModule: false
        }
      }
    ]
  },
  plugins: [
    // new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new HtmlWebpackPlugin({
      title: 'NetKAN Status'
    })
  ]
};

var webpack = require('webpack');
var path = require('path')

module.exports = {
  entry: [
    './app/App.js'
  ],

  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.min.js',
    publicPath: '/'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules|server/,
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }

}
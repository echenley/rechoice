/* eslint-env node */

const path = require('path')
const webpack = require('webpack')
const nodeModules = path.resolve(__dirname, 'node_modules')

module.exports = {
  devtool: 'eval-source-map',

  entry: [
    'babel-polyfill',
    'webpack-dev-server/client?http://localhost:7003',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    path.resolve(__dirname, 'example', 'index'),
  ],

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'example'),
        ],
      },
      {
        test: /\.json$/,
        use: 'json-loader',
        exclude: nodeModules,
      },
      {
        test: /\.svg$/,
        use: 'file-loader',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'resolve-url-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'resolve-url-loader',
          'sass-loader?sourceMap',
        ],
        exclude: nodeModules,
      },
    ],
  },
}

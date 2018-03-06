/* eslint-disable no-console */

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.config')

const port = config.entry[1].slice(-4)

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: { colors: true, chunks: false },
}).listen(port, 'localhost', (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`Listening at http://localhost:${port}/`)
})

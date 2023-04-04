const express = require('express')
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const webpackMiddleware = require('webpack-dev-middleware')


var compiler = webpack(webpackConfig);
const app = express()

app.use(webpackMiddleware(compiler, {
    /* Options */
    writeToDisk: true
}));

app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
}))

app.listen(3000, function () {
    console.log('server is listening...')
})


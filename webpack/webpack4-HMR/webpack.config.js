const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
module.exports = {
    entry: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/index.js'],
    output: {
        filename: '[name].[hash].js',
        chunkFilename: '[name].[chunkHash].js',
        path: path.resolve(__dirname, './dist')
    },
    devtool: "none",
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
}
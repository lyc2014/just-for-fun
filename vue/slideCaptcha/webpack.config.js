const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const  { VueLoaderPlugin } = require('vue-loader')
module.exports = {
  mode: 'development',
  entry: './src/main.js',
  stats: 'minimal',
  output: {
    path: path.resolve(__dirname, './dist')
  },
  devServer: {
    port: 9000,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/i,
        use: ['vue-loader']
      },
      {
        test: /\.js$/i,
        use: ['babel-loader']
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html')
    }),
    new VueLoaderPlugin()
  ]
}
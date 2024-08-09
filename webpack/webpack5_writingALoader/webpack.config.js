const path = require('path')
const SimpleHtmlWebpackPlugin = require('./plugins/SimpleHtmlWebpackPlugin.js')
module.exports = {
  mode: 'development',
  context: __dirname,
  entry: './src/index.js',
  output: {
    filename: '[name].js'
  },
  resolve: {
    alias: {
      '@images': path.resolve(__dirname, 'src/assets/imgs')
    }
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, './loaders')],
    extensions: ['.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.png$/,
        use: ['simpleFileLoader']
      },
      {
        test: /\.txt$/i,
        use: ['exportTxtLoader', 'addTxtLoader']
      },
      {
        test: /\.css$/i,
        use: ['simpleStyleLoader', 'simpleCssLoader', 'cssUrlLoader']
      }
    ]
  },
  plugins: [
    new SimpleHtmlWebpackPlugin()
  ]
}
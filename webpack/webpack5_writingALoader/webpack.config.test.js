const path = require('path')
module.exports = {
  mode: 'development',
  context: __dirname,
  entry: './test/index.js',
  output: {
    path: path.resolve(__dirname, './testDist'),
    filename: '[name].js'
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, './testLoader')]
  },
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: ['dataSharingLoader1', 'dataSharingLoader2']
      }, 
      {
        test: /\.text$/i,
        use: ['dataSharingLoader1', 'loaderDependencies']
      },
      {
        test: /\.css$/i,
        use: ['mycssloader']
      }
    ]
  },
  watch: false
}
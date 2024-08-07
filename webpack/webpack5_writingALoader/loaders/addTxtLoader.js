// const LoaderUtils = require('loader-utils')
// const { urlToRequest, isUrlRequest } = LoaderUtils
module.exports = function addTxtLoader (content) {
  content += 'add something'
  return content
}
const LoaderUtils = require('loader-utils')
const path = require('path')
const  { urlToRequest, isUrlRequest } = LoaderUtils
module.exports = function simpleCssLoader (source) {
  const callback = this.async()
  // .+?  任意字符 一次或者多次
  const urlRegex = /url\(['"]?(.+?)['"]?\)/g
  let result = source
  let matchCount = 0
  let processedCount = 0
  const checkComplete = () => {
    if (processedCount === matchCount) {
      callback(null, result)
    }
  }

  let match
  while ((match = urlRegex.exec(source)) !== null) {
    matchCount++;
    const originalUrl = match[1];
    // const context = this.context;
    const absoultePath = path.resolve(path.dirname(this.resourcePath), originalUrl)

    this.loadModule(absoultePath, (err, source) => {
      if (err) return callback(err)
      const matchPath = source.match(/module\.exports\s*=\s*([^;]+);?$/)
      const stardedUrl = matchPath[1].replace(/\\\\/, '/').split('"')[1]
      result = result.replace(originalUrl, stardedUrl);
      if (match === null) {
        callback(null, result)
      }
    })
  }
}
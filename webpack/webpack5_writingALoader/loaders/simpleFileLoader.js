const path = require('path')

module.exports = function (source) {
  const filename = path.basename(this.resourcePath)
  const outputPath = path.join('assets', filename)

  this.emitFile(outputPath, source)
  return `module.exports = ${JSON.stringify(outputPath)};`
}
// 不适用raw的话 图片可能失效
module.exports.raw = true;
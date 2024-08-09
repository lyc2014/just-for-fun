const path = require('path')
const fs = require('fs')
module.exports = function (content) {
  var callback = this.async()
  var dataPath = path.resolve(__dirname, '../statics/data.txt')

  /**
   * if data.txt file changed, webpack will recompile
   */
  this.addDependency(dataPath)

  fs.readFile(dataPath, 'utf-8', function (err, data) {
    if (err) return callback(err)
    callback(null, data + '\n' + content)
  })
}
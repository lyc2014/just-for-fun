module.exports = function requireLoader (content) {
  const script = `
    const a = require('./a.js')
    console.log(a)
    console.log("this is requireLoader's content")
    module.exports = ${JSON.stringify(content)}
  `
  return script
}
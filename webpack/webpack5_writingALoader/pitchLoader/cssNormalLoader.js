module.exports = function (source) {
  const callback = this.async()
  // return `module.exports = ${JSON.stringify(content)}`
  console.log('source', source)
  const importRegex = /@import\s+['"](.+?)['"];/g;
  const allMatches = [...source.matchAll(importRegex)];
  if (allMatches.length === 0) {
    return callback(null, `
        module.exports = ${JSON.stringify(source)}
      `);
  }
  let code = source
  let deps = []
  allMatches.forEach(match => {
    code = code.replace(match[0], '')
    deps.push(match[1])
  })
  const depContentStr = deps.map(url => {
    return `require("${url}")`
  }).join('\r\n')
  const script = `
    ${depContentStr}
    module.exports = ${JSON.stringify(code)}
  `
  callback(null, script)
}
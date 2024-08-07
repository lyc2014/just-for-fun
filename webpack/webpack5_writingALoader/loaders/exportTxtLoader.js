module.exports = function exportTxtLoader (content) {
  return `module.exports = ${JSON.stringify(content)}`
}
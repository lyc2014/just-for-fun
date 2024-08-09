module.exports = function dataSharingLoader1 (content, param1, param2) {
  console.log('content', content)
  console.log('param1', param1)
  console.log('param2', param2)
  return `module.exports = ${JSON.stringify(content)}`
}
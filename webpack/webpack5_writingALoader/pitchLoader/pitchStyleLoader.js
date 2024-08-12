function pitchStyleLoader(source) {console.log('normal')}

pitchStyleLoader.pitch = function (remainingRequest, previousRequest, data) {
  console.log('pitch')
  remainingRequest = remainingRequest.replace(/\\/g, "\\\\")
  const  script = `
    const style = require("!!${remainingRequest}")
    const styleEl = document.createElement('style')
    styleEl.innerHTML = style
    document.head.appendChild(styleEl)
  `
  return script
}
module.exports = pitchStyleLoader
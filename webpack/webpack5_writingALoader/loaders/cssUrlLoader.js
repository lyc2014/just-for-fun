const LoaderUtils = require('loader-utils')
const path = require('path')
const  { urlToRequest, isUrlRequest } = LoaderUtils

module.exports = function cssUrlLoader (content) {
  const webpack = this._compiler
  const aliases = webpack.options.resolve.alias || {}
  /**
   * 正则解释
   *       url: 匹配字面文本"url"
   *       \s*: 匹配零个或者多个空白字符
   *       \(：匹配左括号(
   *       \s*：再次匹配零个或多个空白字符
   *       (['"]?)：捕获组1，匹配单引号或双引号（如果有的话），?表示这个引号可选的，？表示可以出现零次或者一次
   *       ([^'"()]+)：捕获组2，[^...] 这个形式表示一个否定字符集，匹配一个或者多个不是引号和括号的字符 
   *                  + 表示一次或者多次。通常这表示url本身。注意[]里面的（）不需要转义字符。
   *       \1：反向引用到第一个捕获组，确保如果开始有引号，结束也要有相同的引号。
   *       \s*: 再次匹配零个或多个空白字符
   *       \): 匹配右括号 )
   *       g: 全局标志，表示要匹配所有出现的地方，而不仅仅是第一个
   */
  const urlRegex = /url\s*\(\s*(['"]?)([^'"()]+)\1\s*\)/g;
  const newContent = content.replace(urlRegex, (match, quote, url) => {
    /**
     * .content{background: url('../imgs/x.png')}
     * match : url('../imgs/x.png')
     * quote: '
     * url: ../imgs/x.png
     */
    if (!url.startsWith('data:') && !url.startsWith('http')) {
      var urlReq = urlToRequest(url)
      if (urlReq.startsWith('@')) {
        const aliasKey = Object.keys(aliases).find(key => urlReq.startsWith(key))
        if (aliasKey) {
          const aliasPath = aliases[aliasKey]
          const afterPath = urlReq.slice(aliasKey.length)
          urlReq = path.join(aliasPath, afterPath)
          // this.context = css's absolutePath
          // return a relative path which from this.context to urlReq
          // const relativePath = this.utils.contextify(this.context, urlReq)
          return `url('${urlReq}')`
        } else return match 
      } else return match
    } else return match
  })
  console.log('newContent', newContent)
  return newContent
}
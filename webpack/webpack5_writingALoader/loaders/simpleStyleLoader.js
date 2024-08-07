module.exports = function simpleStyleLoader (content) {
  /**
   * body {
        font-family: "Arial", sans-serif;
        color: #333;
     }
     变成
     body {  font-family: \"Arial\", sans-serif;  color: #333;}
   */
  const escapedSource = content.replace(/\r\n/g, '').replace(/"/g, '\\"');
  return `
    console.log('哈哈哈')
    var css = "${escapedSource}";
    var style = document.createElement('style');
    style.textContent = css;
    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(style);
    module.exports = ${JSON.stringify(content)}
  `
}
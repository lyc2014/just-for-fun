const path = require('path');

module.exports = function(source) {
  const { resourcePath, context } = this;
  const callback = this.async();

  // 用于存储所有的依赖
  const dependencies = [];

  // 处理 @import
  const importRegex = /@import\s+['"](.+?)['"];/g;
  // 处理 url()
  const urlRegex = /url\(['"]?(.+?)['"]?\)/g;

  // 组合两个正则表达式的结果
  const allMatches = [...source.matchAll(importRegex), ...source.matchAll(urlRegex)];

  // 如果没有依赖，直接返回源代码
  if (allMatches.length === 0) {
    return callback(null, `
        module.exports = ${JSON.stringify(source)}
      `);
  }

  // 处理所有依赖
  Promise.all(allMatches.map(match => 
    new Promise((resolve, reject) => {
      const depPath = match[1];
      // 使用 webpack 的 resolve 功能来解析路径
      this.resolve(context, depPath, (err, result) => {
        if(err) reject(err);
        else resolve({ original: match[0], depPath, resolvedPath: result });
      });
    })
  )).then(results => {
    let code = source;

    results.forEach(({ original, depPath, resolvedPath }) => {
      // 添加依赖到 webpack 的依赖图
      this.addDependency(resolvedPath);
      
      // 将依赖路径转换为相对路径
      const relativePath = path.relative(path.dirname(resourcePath), resolvedPath).replace(/\\/g, '/');
      
      // 替换原始引用为 webpack 可以处理的格式
      if (original.startsWith('@import')) {
        // code = code.replace(original, `@import "${relativePath}";`);
        code = code.replace(original, ``);
      } else {
        code = code.replace(original, `url("${relativePath}")`);
      }

      // 将依赖信息添加到数组中
      dependencies.push({ depPath, resolvedPath });
    });

    // 将处理后的内容包装在一个模块中
    const result = `
      const cssArray = [];
      let n = 0;
      ${dependencies.map(dep => {
        return  `
           cssArray[n] = require(${JSON.stringify(dep.resolvedPath)});
           n++
        `
      }).join('\n')}
      const content = cssArray.join('\\n')
      module.exports = content + ${JSON.stringify(code)};
    `;
    callback(null, result);
  }).catch(callback);
};
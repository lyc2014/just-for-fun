const { Compilation, sources  } = require('webpack')
module.exports = class SimpleHtmlWebpackPlugin {
  constructor (options = []) {
    this.options = options
    this.filename = options.filename || 'index.html'
  }
  apply (compiler) {
    compiler.hooks.thisCompilation.tap('SimpleHtmlWebpackPlugin', (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: 'SimpleHtmlWebpackPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
        },
        (assets, callback) => {
          const jsFiles = Object.keys(assets).filter(filename => filename.endsWith('.js'))
          const htmlContent = this.generateHtml(jsFiles);
          compilation.emitAsset(
            this.filename,
            new sources.RawSource(htmlContent)
          );
          callback()
        }
      )
    })
  }
  generateHtml(jsFiles) {
    const title = this.options.title || 'Webpack App';
    const scripts = jsFiles.map(file => `<script src="${file}"></script>`).join('\n');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
        </head>
        <body>
          <div id="app"></div>
          <div class="content">
            哈哈哈
          </div>
          <div class="bg" style="width: 400px; height: 500px"></div>
          ${scripts}
        </body>
      </html>
    `;
  }
}
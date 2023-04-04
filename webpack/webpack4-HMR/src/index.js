console.log('this is index.js')
var content = document.getElementById('content')
import('./chunk.js').then(module => {
    content.innerHTML = module.default.innerHtml
})
if (module.hot) {
    module.hot.accept('./chunk.js', function () {
        const chunk = require('./chunk.js')
        content.innerHTML = chunk.default.innerHtml
    })
}
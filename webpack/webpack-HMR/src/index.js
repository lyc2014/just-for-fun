const chunk = require('./chunk.js')
import('./chunk2').then((module) => {console.log(module)})
console.log(chunk.name)
if (module.hot) {
    module.hot.accept(
        function (err, {moduleId, module}) {
            if (err) {
                console.error(err)
            }
            console.log('moduleId11', moduleId)
            console.log('module', module)
        } // Function to handle errors when evaluating the new version // Function to handle errors when evaluating the new version
    );
}

console.log('呵呵呵this is entry index.js')
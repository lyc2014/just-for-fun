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
console.log('哈哈哈this is chunk.js')
module.exports = {
    name: 'this is chunk.js'
}
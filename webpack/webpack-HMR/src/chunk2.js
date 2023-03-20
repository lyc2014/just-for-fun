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
console.log('this is chunk2.js')
export default {
    name: 'this is chunk2434a.111js'
}
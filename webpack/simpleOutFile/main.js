console.log('this is main.js')
const rea = require('./rea.js')
console.log('this is end of main.js')
import('./a.js').then(dynamic => {
    dynamic.default()
})
require(['./r.js'], function (r) {
    console.log(r.name)
})
/**
 * 1、创建一个新的空对象
 * 2、设置原型链
 * 3、将构造函数的this改指向新对象obj并执行函数代码
 * 4、如果构造函数中没有人为返回一个对象类型的值，则返回这个新对象obj。否则直接返回this。
 */

// 构造函数
function Person(name, age) {
    this.userName = name
    this.userAge = age
}
Person.prototype.sayAge = function () {
    console.log(this.userAge)
}
// new操作函数newFun
function newFun() {
    var obj = {}
    Constructor = [].shift.call(arguments)
    obj.__proto__ = Constructor.prototype
    var ret = Constructor.apply(obj, arguments)
    return typeof ret === 'oject' ? ret : obj
}
var s1 = newFun(Person, 'lyc2014', 20)
console.log(s1.userName)
console.log(s1.sayAge())
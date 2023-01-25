function MyExtend (son, father) {
    // make son.prototype === __proto__ ===> father.prototype
    var saveSonProto = {}
    for (var k in son.prototype) {
        saveSonProto[k] = {
            value: son.prototype[k]
        }
    }
    son.prototype = Object.create(father.prototype, saveSonProto)
    son.prototype.constructor = son
    //the use of __proto__ is controversial and discouraged.
    son.__proto__ = father
}
function MySuper (_sonThis, father) {
    var argus = [].slice.call(arguments, 2)
    father.apply(_sonThis, argus)
}

function Point(x, y) {
    this.x = x
    this.y = y
}
Point.prototype.getPointPosition = function () {
    console.log('x: ', this.x)
    console.log('y: ', this.y)
}

function PointColor (x, y, color) {
    MySuper(this, Point, x, y)
    this.color = color
}

PointColor.prototype.getColor = function () {
    console.log('color: ', this.color)
}

MyExtend(PointColor, Point)

var pointColorInst = new PointColor(5, 8, 'red')
console.log(pointColorInst)
console.log(pointColorInst.getPointPosition())
console.log(pointColorInst.getColor())

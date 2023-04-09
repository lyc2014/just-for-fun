## 概述

通过 Event() addEventListener() dispatchEvent（）理解浏览器的事件、事件冒泡、事件捕获。

## 事件理解

比如 “取钱” 是一个 “事件”，var withdraw = new Event("取钱") 注册了一个“取钱”事件， 小明、小红和小李都可以取钱，谁取钱就是谁触发这个事件，例如小明取钱: xiaoming.dispatchEvent(withdraw), 小红取钱: xiaohong.dispatchEvent(withdraw). 如果我们想在某人完成“取钱”后做一些事情，可以使用 addEventListener 在某人身上注册一些事情, 可以实现监听的效果，某人完成事件后触发这些事情。比如 xiaoming.addEventListener('取钱', function () {/*一些事情*/})

现在我们对什么是事件，什么是事件触发，什么是事件监听有了初步的认识。

## 捕获冒泡的理解。

<image src="./event1.jpg" />

举个例子，用户光标移到son蓝色区域点击鼠标左键，浏览器会创建一个允许冒泡的 click 事件  let click = new Event('click', { bubbles: true })。然后事件会从整个文档树的根节点开始向下传递，直至目标元素(son), 这个阶段称为 捕获阶段。它类似会从上而下这么触发事件：
...

```javascript
grandFather.dispatchEvent('click', '捕获阶段') //**这里捕获阶段参数是为了方便理解写上去的**

father.dispatchEvent('click', '捕获阶段') 

son.dispatchEvent('click')

```

冒泡阶段，冒泡行为指的是：事件从触发目标元素开始向上冒泡，直到传递到文档树的根节点(document)为止。 

事件是否能冒泡，是注册事件的时候的参数决定的 如 new Event('click', { bubbles: true })， bubbles为true会触发冒泡。哪个去触发这个注册好的事件 都会发生冒泡行为。捕获阶段 =》 目标 =》 冒泡阶段

```javascript
son.dispatchEvent('click')

father.dispatchEvent('click', '冒泡阶段') // **这里冒泡阶段参数是为了方便理解写上去的**

grandFather.dispatchEvent('click', '冒泡阶段')
```

也就是说用户 "点击" 这个动作引起这个捕获行为，冒泡因为是浏览器默认的click事件是允许冒泡的，下面举个例子解释这段话意思。
点击 ----> 捕获    new事件 ---> 冒泡

```javascript
// 注册一个不允许冒泡的事件
const sendEvent = new Event("sendMsg", { bubbles: false })
var son = document.getElementById('son')
// son 触发这个事件。 这里不是用户去“点击”，不会出现捕获行为，并且
// sendMsg 这个事件是不允许冒泡的的， 所以只有目标源触发了这个事件。
son.addEventListener('sendMsg', () => { console.log('只有目标源触发了事件') })
son.dispatchEvent(sendEvent)
```

## 需要介绍一下 addEventListener

[节点].addEventListener('事件名称', '事件callback, 即listener', {
    capture: true | false
})

或者 

[节点].addEventListener('事件名称', '事件callback, 即listener', useCapture: true | false)

capture: 表示 listener 是否会在该类型的事件捕获阶段传播到该 EventTarget 时触发。

也就是当 capture：true  或者 useCapture：true 时， 第二次参数的 listener 是给捕获阶段触发的事件注册的，冒泡阶段不会触发，如果是 false 则反之。如果节点是目标源则不受这个参数影响。
/**
 * 节流适用于那些在一段时间内需要持续执行的操作，但为了优化性能，希望控制执行频率的场景。
 * 节流会让函数在规定的时间间隔内至少执行一次，而不是每次触发都执行。
 * 
 * 经典例子：窗口滚动事件
 */

/**
 * 第一种：1. fn1触发后进入倒计时，倒计时过程中节流，中间的fnN都被抛弃，到时间后执行fn1
 *        2. fn1执行完后，过一大段时间，如进入了fn8, fn8不会直接执行，也要开始进入倒计时，依此逻辑节流。
 */

function throttle1 (interval, fn) {
  let timer = null
  return function _throttle (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        fn.apply(this, args)
      }, interval)
    }
  }
}
/**
 * 第二种：1. fn1触发会立即执行，往后一段时间s内如继续触发fnN都会被拦截，当过了这段时间再触发f8会立即执行
 *        2. 这种逻辑不需要定时器，需要一个闭包变量  判断间隔时间即可
 */
function throttle2(interval, fn) {
  let lastTime = 0
  return function _throttle (...args) {
    let nowTime = +new Date()
    if (interval <= nowTime - lastTime) {
      fn.apply(this, args)
      lastTime = nowTime
    }
  }
}

/**
 * 第三种：例如要求interval为5s, fn1触发时会立即执行 
 *         5s之内再次触发fn2，fn2会在fn1开始执行那个点的5s后执行，
 *         并且如果后续还继续触发 fn3 fn4  这些行为都会被抛弃
 *         如果 在 5s 后才触发fn2， 那么fn2会立即执行
 */

function throttle3(interval, fn) {
  let timer = null
  let lastTime = 0

  return function _throttle (...args) {
    const nowTime = +new Date()
    const remainTime = interval - (nowTime - lastTime)
    // 超过interval 则直接执行。
    if (remainTime <= 0) {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
      lastTime = nowTime
      fn.apply(this, args)
      return
    }
    // 没超interval 并且目前没有定时任务的，remainTime后执行 
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        lastTime = +new Date()
        fn.apply(this, args)
      })
    }
  }
}

/**
 * 这三种方法 合起来  1、 leading = false  trailing = true 时 为  第一种 throttle1
 *                  2、 leading = true   trailing = false 时 为  第二种  throttle2
 *                  3、 leading = true  trailing = true  时 为 第三种  throttle3
 */                
function throttle (
  fn,
  interval = 50,
  options = { leading: true, trailing: true }
) {
  const { leading, trailing, resultCallback } = options
  // 两个闭包属性
  let lastTime = 0
  let timer = null

  const _throttle = function (...args) {
    return new Promise((resolve, reject) => {
      const nowTime = new Date().getTime()
      if (!lastTime && !leading) lastTime = nowTime

      const remainTime = interval - (nowTime - lastTime)
      if (remainTime <= 0) {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }

        const result = fn.apply(this, args)
        if (resultCallback) resultCallback(result)
        resolve(result)
        lastTime = nowTime
        return
      }
      if (trailing && !timer) {
        timer = setTimeout(() => {
          timer = null
          lastTime = !leading ? 0 : new Date().getTime()
          const result = fn.apply(this, args);
          if (resultCallback) resultCallback(result);
          resolve(result);
        }, remainTime)
      }
    })
  }
  _throttle.cancel = function() {
    if (timer) clearTimeout(timer);
    timer = null;
    lastTime = 0;
  };
  return _throttle
}
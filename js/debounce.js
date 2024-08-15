/**
 * 应用场景： 防抖适用于那些只有在事件停止触发后才需要执行一次的场景。
 *           如果事件在短时间内持续触发，只执行最后一次事件。
 *           经典例子：搜索输入框
 */

/**
 * 防抖 参考节流throttle.js 的  第二种节流方法 throttle2，加一个清除定时器即可
 */
function debounce(func, wait) {
  let timer = null
  return function _debounce(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    })
  }
}
<script setup>
import { onMounted, ref } from 'vue'
import img0 from '../assets/img.jpg';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';
import img5 from '../assets/img5.jpg';
/* props default*/
const PI = Math.PI
const l = ref(42)  // block length
const r = ref(10)  // block radius
const w = ref(310) // canvas width
const h = ref(155) // canvas height
const L = ref(l.value + r.value * 2 + 3)
const sliderText = ref('Slide filled right')
const loadBlock = ref(false)
const block = ref(null)
const block_x = ref(undefined)
const block_y = ref(undefined)
const canvas = ref(null)
const canvasCtx = ref(null)
const blockCtx = ref(null)
const imgs = ref([img0, img1, img2, img3, img4, img5])
const img = ref(undefined)
const handleMoveEvent = ref(null)
const handleMoveEndEvent = ref(null)
const isMouseDown = ref(false)
const originX = ref(undefined)
const originY = ref(undefined)
const sliderLeft = ref(0)
const containerActive = ref(false)
const sliderMaskWidth = ref(0)
const trail = ref([])
const success = ref(false)
const timestamp = ref(null)
const accuracy = ref(5)
onMounted(() => {
  initDom()
  initImg()
  bindEvents()
})
function initDom () {
  canvasCtx.value = canvas.value.getContext("2d")
  blockCtx.value = block.value.getContext("2d")
}
function initImg () {
  const imgLcl = createImg(() => {
    // 图片加载完毕后关闭遮罩
    loadBlock.value = false
    canvasCtx.value.drawImage(imgLcl, 0, 0, w.value, h.value)
    drawBlock()
    blockCtx.value.drawImage(imgLcl, 0, 0, w.value, h.value)
    let x = block_x.value
    let y = block_y.value
    let _y = y - r.value * 2 -1;
    let ImageData = blockCtx.value.getImageData(x, _y, L.value, L.value)
    block.value.width = L.value;
    blockCtx.value.putImageData(ImageData, 0, _y)
  })
  img.value = imgLcl
}
function createImg (onload) {
  const img = document.createElement('img');
  img.crossOrigin = "Anonymous"
  img.onload = onload
  img.onerror = () => {
    img.src = getRandomImg()
  }
  img.src = getRandomImg()
  return img
}
function drawBlock () {
  block_x.value = getRandomNumberByRange(
    L.value + 10,
    w.value - (L.value + 10)
  )
  block_y.value = getRandomNumberByRange(
    10 + r.value * 2,
    h.value - (L.value + 10)
  )
  draw(canvasCtx.value, block_x.value, block_y.value, 'fill')
  draw(blockCtx.value, block_x.value, block_y.value, 'clip')
}
function draw (ctx, x, y, operation) {
  let lv = l.value
  let rv = r.value
  ctx.beginPath()
  ctx.moveTo(x, y);
  ctx.arc(x + lv / 2, y - rv + 2, rv, 0.72 * PI, 2.26 * PI);
  ctx.lineTo(x + lv, y);
  ctx.arc(x + lv + rv - 2, y + lv / 2, rv, 1.21 * PI, 2.78 * PI);
  ctx.lineTo(x + lv, y + lv);
  ctx.lineTo(x, y + lv);
  ctx.arc(x + rv - 2, y + lv / 2, rv + 0.4, 2.76 * PI, 1.24 * PI, true);
  ctx.lineTo(x, y);
  ctx.lineWidth = 2;  // 线条大小
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"; // 线条样式
  ctx.stroke();
  ctx[operation]();
  // Bug Fixes 修复了火狐和ie显示问题
  ctx.globalCompositeOperation = "destination-over";
}
// 随机生成 img src
function getRandomImg () {
  // return require('../assets/img.jpg')
  const len = imgs.value.length
  return len > 0
    ? imgs.value[getRandomNumberByRange(0, len - 1)]
    : "https://source.unsplash.com/300x150/?book,library";
}
function getRandomNumberByRange (start, end) {
  return Math.round(Math.random() * (end - start) + start)
}
function bindEvents () {
  document.addEventListener("mousemove", handleMoveEvent.value)
  document.addEventListener("mouseup", handleMoveEndEvent.value)
}
function sliderDown (event) {
  if (success.value) return
  originX.value = event.clientX
  originY.value = event.clientY
  isMouseDown.value = true
  timestamp.value = +new Date()
}
handleMoveEvent.value = throttle(function (e, type="mouse") {
  if (!isMouseDown.value) return false;
  const moveX = 
    type === 'mouse'
      ? e.clientX - originX.value
      : 0
  const moveY =
    type === 'mouse'
      ? e.clientY - originY.value
      : 0
  if (moveX < 0 || moveX + 38 >= w.value) return false
  sliderLeft.value = moveX + "px"
  /**
   * 这里使用 (w.value - 40 - 20) / (w.value - 40) 原因是：
   * 让上面的图片跟下面拖块按照小于1的比例一起移动，而不是移动同样距离
   * 形成的效果：上面的图片 移动距离和速度比下面慢  形成拖拽的效果
   * 重点： 小于1的数字 * moveX
  */
  let blockLeft = ((w.value - 40 - 20) / (w.value - 40)) * moveX;
  block.value.style.left = blockLeft + "px"

  containerActive.value = true
  sliderMaskWidth.value = moveX + "px"
  trail.value.push(moveY)
})
handleMoveEndEvent.value = throttle(function (e, type="mouse") {
  if (!isMouseDown.value) return false
  isMouseDown.value = false
  if (type === "mouse" && e.clientX === originX.value) return false

  containerActive.value = false
  timestamp.value = +new Date() - timestamp.value
  if (verify()) {
    console.log('成功了')
  }
})
function verify () {
  const left = parseInt(block.value.style.left)
  return Math.abs(left - block_x.value) <= accuracy.value
}
function throttle(
  fn,
  interval = 50,
  options = { leading: true, trailing: true }
) {
  const { leading, trailing, resultCallback } = options;
  let lastTime = 0;
  let timer = null;

  const _throttle = function(...args) {
    return new Promise((resolve, reject) => {
      const nowTime = new Date().getTime();
      if (!lastTime && !leading) lastTime = nowTime;

      const remainTime = interval - (nowTime - lastTime);
      if (remainTime <= 0) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }

        const result = fn.apply(this, args);
        if (resultCallback) resultCallback(result);
        resolve(result);
        lastTime = nowTime;
        return;
      }

      if (trailing && !timer) {
        timer = setTimeout(() => {
          timer = null;
          lastTime = !leading ? 0 : new Date().getTime();
          const result = fn.apply(this, args);
          if (resultCallback) resultCallback(result);
          resolve(result);
        }, remainTime);
      }
    });
  };

  _throttle.cancel = function() {
    if (timer) clearTimeout(timer);
    timer = null;
    lastTime = 0;
  };

  return _throttle;
}
</script>
<template>
  <div class="slide-verify" style="width:310px;">
    <div :class="{'slide-verify-loading': loadBlock}"></div>
    <canvas :width="w" :heigth="h" ref="canvas"></canvas>
    <div class="slide-verify-refresh-icon"></div>
    <canvas
      class="slide-verify-block"
      ref="block"
      :width="w"
      :heigth="h"></canvas>
    <div class="slide-verify-slider">
      <div
        :style="{ width: sliderMaskWidth }"
        class="slide-verify-slider-mask">
        <div
          class="slide-verify-slider-mask-item"
          @mousedown="sliderDown"
          :style="{ left: sliderLeft }"
        >
          <div class="slide-verify-slider-mask-item-icon"></div>
        </div>
      </div>
      <span class="slide-verify-slider-text">向右滑动-></span>
    </div>
  </div>
</template>
<style scoped>
.slide-verify {
  position: relative;
}
/* 图片加载样式 */
.slide-verify-loading {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(255,255,255, 0.9);
  z-index:999;
  animation: loading 1.5s infinite;
}
@keyframes loading {
  0% {
    opacity: 0.7;
  }
  100% {
    opacity: 9;
  }
}
.slide-verify-block {
  position: absolute;
  left: 0;
  top: 0;
}
.slide-verify-refresh-icon {
  position: absolute;
  right: 0;
  top: 0;
  width: 34px;
  height: 34px;
  cursor: pointer;
  background: url("../assets/icon_light.png") 0 -437px;
}
.slide-verify-slider{
  position: relative;
  text-align: center;
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-top: 15px;
  background: #f7f9fa;
  color: #45494c;
  border: 1px solid #e4e7eb;
}
.slide-verify-slider-mask {
  position: absolute;
  left: 0;
  top: 0;
  height: 40px;
  border: 0 solid #1991fa;
  background: #d1e9fe;
}
.slide-verify-slider-mask-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  background: #fff;
  box-shadow: 0 0 3px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: background 
}
.slide-verify-slider-mask-item:hover {
  background: #1991fa;
}
.container-success .slide-verify-slider-mask-item {
  height: 38px;
  top: -1px;
  border: 1px solid #52ccba;
  background-color: #52ccba !important;
}
</style>
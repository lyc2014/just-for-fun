const jimp = require('jimp')
const fs = require('fs')
const path = require('path')

async function createCaptcha(bgPath) {
  try {
    // 读取背景图片
    const background = await jimp.read(bgPath)

    // 获取背景图片的尺寸
    const width = background.getWidth()
    const height = background.getHeight()

    // 定义滑块大小（可以根据需要调整）
    const blockSize = 50;

    // 随机选择滑块位置，确保不会超出图片边界
    const x = Math.floor(Math.random() * (width - blockSize))
    const y = Math.floor(Math.random() * (height - blockSize))

    // 创建一个新的图片作为滑块
    const block = new jimp(blockSize, blockSize)

    // 将图片背景对应位置的内容复制到滑块上
    block.blit(background, 0, 0, x, y, blockSize, blockSize)

    // 在背景图片上创建缺口
    background.scan(x, y, blockSize, blockSize, function (dx, dy, idx) {
      this.bitmap.data[idx + 3] = 128  // 设置透明度为半透明
    })

    // 保存处理后的背景图片和滑块图片
    await background.writeAsync(path.resolve(__dirname, `./captchaImg/bg_${x}_${y}.png`));
    await block.writeAsync(path.resolve(__dirname, `./captchaImg/block_${x}_${y}.png`));

    return { x, y };
  } catch (error) {
    console.error('Error creating captcha:', error)
  }
}

createCaptcha(path.resolve(__dirname, '../src/assets/img.jpg')).then(({ x, y }) => {
  console.log(`Slider position: (${x}, ${y})`)
})
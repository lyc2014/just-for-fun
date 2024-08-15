### 步骤

1. initDom()  初始化dom
2. initImg()  初始化图片
   - 本地一个图片数组imgs[], 然后随机获取里面图片
   - ctx.drawImage(img, 0x坐标, 0y坐标, 宽度, 长度)，将图画在画布上
   - drawBlock 画入"缺块"
     - 取 block的x 坐标，在 L ~ (w-L)之间找，为了防止太贴边再加个10 (L+10) ~ (w - (L+10)) 之间找
     - 取block的y坐标，上面要预够画圆的直径， 下面要预够缺块实际宽度L 防太贴边 加 10。即： (r*2 + 10) ~ (h - (L + 10)) 之间
     - 先画上面的圆 ctx.arc(100, 75, 50, 0.72 * Math.PI, 2.28 * Math.PI) 参数依次为：x坐标，y坐标，半径，起始点相对于水平线的弧度，终点弧度，弧度都是逆时针方向计算。粗略：ctx.arc(x + lv / 2, y - rv + 2, rv, 0.72 * PI, 2.26 * PI);  后面还可以设置一个参数顺时针画还是逆时针画  默认是顺时针
     - 再画正方形上面的边 ctx.lineTo(x + lv, y);
     - 再画右边的圆 ctx.arc(x + lv + rv - 2, y + lv / 2, rv, 1.21 * PI, 2.78 * PI);
     - 再画正方形右边线和下面线 ctx.lineTo(x + lv, y + lv);ctx.lineTo(x, y + lv);
     -  画坐标圆 ctx.arc(x + rv - 2, y + lv / 2, rv + 0.4, 2.76 * PI, 1.24 * PI, true);
     -  设置线条长度样式 ctx.stroke(); 再 填充
3. 拖拽逻辑
   - 在拖块上设置 @mousedown ， 摁下去就 拖拽状态激活 active，获取起始x,y 在全屏 document上设置  addEventListener("mousemove") .addEventListener("mouseup")  mousemove并且是 active 状态执行拖拽逻辑  mouseup 关闭拖拽状态 并且判断是否成功。
   - css上 增加拖块的left距离  增加进度条的width   也增加上面图片的left



### 参数讲解

l: 缺块正方形部分的 宽(长)

r: 缺块圆部分的半径

w: 画布图片的 宽 width

h: 画布图片的 高 hight

L = l + 2r + 3 即 缺块实际宽 = 原宽 + 圆的直径 + 3 (不知为何+3)
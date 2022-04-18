---
title: 微信小程序 canvas 的经验及踩坑
tags: [wx-mini-program canvas]
---

记录工作中遇到的有关 微信小程序 canvas 的问题。



## 1. canvas 画布在不同手机屏幕下的自适应

### 场景

在微信小程序中，可能会遇到需要将canvas画布的宽度和高度随着不同手机屏幕去更改，在此讨论一下我遇到的问题：画布的顶部以及底部固定高度，画布高度占剩余空间，宽度为手机屏幕高度。

### 实现

```js
const { windowWidth, windowHeight, statusBarHeight } = wx.getSystemInfoSync();

let height = windowHeight - (65 + 110 + 44 + statusBarHeight);
this.setData({
  canvasWidth: windowWidth,
  canvasHeight: height,
});
```

```html
<canvas
  type="2d"
  id="canvas"
  style="width: {{canvasWidth}}px; height: {{canvasHeight}}px;"
  >
</canvas>
```

## 2. 绘制图片

### 场景

绘制图片时，要将图片完全绘制在画布上，并且让其在画布中处于居中的位置，因此要考虑图片的宽高比与画布的宽高比，以及图片与画布的宽高的关系，从而得出所画图片的起始坐标以及缩放后的宽高。

### 实现

```js
/** 
 * 根据宽高比确定图片的宽高
 * 参数列表: cWidth, cHeight, iWidth, iHeight 画布区域的宽高 图片的宽高
 * 返回值: { iScaleWidth, iScaleHeight } 缩放后图片的宽高
 */
const getImageInfo = (cWidth, cHeight, iWidth, iHeight) => {
  let iScaleWidth = null;
  let iScaleHeight = null;
  let cRadio = cWidth / cHeight;
  let iRadio = iWidth / iHeight;
  if (iRadio > cRadio) {
    iScaleWidth = cWidth;
    iScaleHeight = (cWidth/iWidth) * iHeight;
  } else {
    iScaleHeight = cHeight;
    iScaleWidth = (cHeight/iHeight) * iWidth;
  }
  return {
    iScaleWidth,
    iScaleHeight,
  }
}

export default getImageInfo;
```

```js
/**
 * 参数列表: cWidth cHeight iWidth iHeight 画布区域宽高 缩放后图片宽高
 * 返回值: { x, y } 起始坐标
 */

const getStartCoordinate = (cWidth, cHeight, iScaleWidth, iScaleHeight) => {
  let x = 0;
  let y = 0;
  let cRadio = cWidth / cHeight;
  let iRadio = iScaleWidth / iScaleHeight;
  if (iRadio > cRadio) {
    y = Math.abs((cHeight - iScaleHeight) / 2);
  } else {
    x = Math.abs((cWidth - iScaleWidth) / 2);
  }
  return {
    x,
    y,
  }
}

export default getStartCoordinate;

```

```js
onReady() {
  // 获取 canvas 节点
  const query = wx.createSelectorQuery();
  query.select('#canvas').fields(
    {
      node: true,
      size: true,
    }
  ).exec(this.init.bind(this));
},
init(res) {
  const canvas = res[0].node;
  // 获取上下文对象
  const ctx = canvas.getContext('2d');
  const dpr = wx.getSystemInfoSync().pixelRatio;
  // 根据不同手机的像素比缩放
  canvas.width = res[0].width * dpr;
  canvas.height = res[0].height * dpr;
  ctx.scale(dpr, dpr);
  
  // 创建图片
  const img = canvas.createImage();
  img.src = 'https://monkey-static.tiku.100tal.com/homework/20210802/0915048D-A2D5-4EE5-9E0D-3FF716FFA93D.jpeg';

  // 图片的真实宽高(可以通过wx.getImageInfo来获取，此处简略)
  let iWidth = 904;
  let iHeight = 1280;

  // 得到缩放后的宽高
  let { iScaleWidth, iScaleHeight } = getImageInfo(this.data.canvasWidth, this.data.canvasHeight, iWidth, iHeight);
  // 得到起始坐标位置
  let { x, y } = getStartCoordinate(this.data.canvasWidth, this.data.canvasHeight, iScaleWidth, iScaleHeight);

  // 一定要避坑，一定要让图片先加载，不然真机显示不出来
  img.onload = () => {
    ctx.drawImage(img, x, y, iScaleWidth, iScaleHeight);
  }
},
```


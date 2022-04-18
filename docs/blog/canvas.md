---
title: canvas经验记录
tags: [canvas]
---
## 一、记录工作中遇到的有关canvas的问题。

### 1. canvas中插入图片后，无法去出图片
```js
const url = 'https://qz-search-test.oss-cn-beijing.aliyuncs.com/xes_souti/paisou/images/202103/12/ffbd9f34bf8f26e2843255571a910f47.jpeg'
const img = new Image()
canvas = document.createElement('canvas')
ctx = canvas.getContext('2d')

img.onload = function () {
    ctx.drawImage(img, 0, 0)
    canvas.toDataURL('image/png')
}
img.src = url
document.body.appendChild(img)
```
### <text color="#ff0000">报错信息：</text>
Uncaught DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.

### 相关的解决方法:

给img标签添加 img.crossOrigin = "Anonymous"

### 原因:

canvas无法执行toDataURL方法：污染的画布无法输出。受限于 CORS 策略，会存在跨域问题，虽然可以使用图像（比如append到页面上）但是绘制到画布上会污染画布，一旦一个画布被污染,就无法提取画布的数据，比如无法使用使用画布toBlob(),toDataURL(),或getImageData()方法;当使用这些方法的时候 会抛出一个安全错误

### 2. 图片跨域问题

### canvas中插入图片跨域问题

```js
const url = 'https://cdn-image.tipaipai.com/YWpVeFRGaGxQdEM2ZFpiWWw1aDJyUFpiOUNjRERQc09kZ09XS3U0QVZqcGZhRWJzSnZGaWRyemJGWlZRTks5UGVTZXpxbWRUckZSY3A3YWoxQm1ISUdrc2dGdjJnZ1E2dUhHbFJ4a2dnVHhaZUtoWjcxL1lsSkkwSWloeFY1cEZmTHAwSWlaOVI1TEtrbDB1MDVUM2pLUT09?hid=4071&rid=41c577238760c310&t=1623407273289'
const img = new Image()
canvas = document.createElement('canvas')
ctx = canvas.getContext('2d')
img.crossOrigin = "Anonymous"
img.onload = function () {
    ctx.drawImage(img, 0, 0)
    canvas.toDataURL('image/png')
}
img.src = url
document.body.appendChild(img)
```


### <text color="#ff0000">报错信息：</text>

Access to image at 'https://cdn-image.tipaipai.com/YWpVeFRGaGxQdEM2ZFpiWWw1aDJyUFpiOUNjRERQc09kZ09XS3U0QVZqcGZhRWJzSnZGaWRyemJGWlZRTks5UGVTZXpxbWRUckZSY3A3YWoxQm1ISUdrc2dGdjJnZ1E2dUhHbFJ4a2dnVHhaZUtoWjcxL1lsSkkwSWloeFY1cEZmTHAwSWlaOVI1TEtrbDB1MDVUM2pLUT09?hid=4071&rid=41c577238760c310&t=1623407273289' from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.


### 相关的解决方法:

使用crossOrigin属性，首先确认图片地址支持cors
其次，如果使用CDN图片，给图片加时间戳或者获取失败的时候加时间戳后请求

参考：
[https://www.jianshu.com/p/c3aa975923de](https://www.jianshu.com/p/c3aa975923de)
[https://blog.csdn.net/NeroWZL/article/details/109240816](https://blog.csdn.net/NeroWZL/article/details/109240816)

### 3. 在canvas中drawimage时，图片不清晰
### 原因
若canvas尺寸和图片尺寸差距过大（canvas>>>img），canvas在drawimage时会对图片进行裁切导致分辨率下降。

### 解决方法
将canvas的width、height扩大为原来的N倍，使用scale使canvas尺寸保持原比例。

## 二、解决canvas绘制的图像模糊的问题
### 1. 场景

```js
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
ctx.font = '20px Arial'
ctx.fillText('Am I Sharp?', 10, 300)
ctx.fillText('Am I Sharp Also?', 10, 450)
```

画布中的文字有锯齿，模糊，如图所示：
![模糊图片](https://qz-test.oss-cn-beijing.aliyuncs.com/xes_souti/assets/common/images/blog/dim.png)

### 2. 原因

因为canvas不是矢量图，而是像图片一样是位图模式的。canvas高清屏幕下，两倍屏为例，浏览器会以2个像素点的宽度渲染一个像素点，因此图片会模糊。

### 解决方法:

```
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const backingStore = ctx.backingStorePixelRatio ||
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1
const pixelRatio = (window.devicePixelRatio || 1) / backingStore
canvas.style.width = `${canvas.width}px`
canvas.style.height = `${canvas.height}px`
canvas.width *= pixelRatio
canvas.height *= pixelRatio

ctx.font = `${20 * pixelRatio}px Arial`
ctx.fillText('Am I Sharp?', `${pixelRatio * 10}`, `${pixelRatio * 300}`)
ctx.fillText('Am I Sharp Also?', `${pixelRatio * 10}`, `${pixelRatio * 450}`)
```
修改后，如图所示：
![模糊图片](https://qz-test.oss-cn-beijing.aliyuncs.com/xes_souti/assets/common/images/blog/distinct.png)

也可以引入[hidpi-canvas-polyfill](https://github.com/jondavidjohn/hidpi-canvas-polyfill) ,实现原理如上代码。

参考：[https://www.html5rocks.com/en/tutorials/canvas/hidpi/](https://www.html5rocks.com/en/tutorials/canvas/hidpi/)


## 三、图片压缩上传遇到的问题总结
### 1. 示例
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>图片压缩上传示例</title>
</head>
<body>
  <div class="upload-wrapper">
    <input id="input" type="file" />
  </div>
</body>
</html>
```
#### 通过toDataURL压缩

注意： toDataURL(mimeType, quality）
1. 通过toDataURL压缩， 如果需要压缩，toDataURL('image/jpeg'）*必须是jpeg或者webp*, quality默认值 0.92
2. quality并不是压缩后与压缩前的比例

```js
const inputEle = document.getElementById('input')
inputEle.onchange = (event) => {
  const file = event.target.files[0]
  getBase64Data(file)
    .then(compressImageByToDataURL)
}
function compressImageByToDataURL(data) {
  const canvasEle = document.createElement('canvas')
  const ctx = canvasEle.getContext('2d')
  const imgEle = document.createElement('img')
  imgEle.onload = function(e) {
    canvasEle.width = this.width
    canvasEle.height = this.height
    ctx.drawImage(imgEle, 0, 0, this.width, this.height)
    const quality = 0.8
    const base64Data = canvasEle.toDataURL('image/jpeg', quality)
    document.getElementById('testImage').src = base64Data
  }
  imgEle.src = data
}
function getBase64Data(file) {
  return new Promise((resolve, reject) => {
    try {
      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        resolve(e.target.result)
      }
      fileReader.readAsDataURL(file)
    } catch (error) {
      reject(error)
    }
  })
}
```
#### 通过drawImage的width和height参数去压缩
```js
//  设置最大宽度或者高度，根据比例缩小（非质量比例）
function compressByMaxWidth(data, maxWidth) {
  const canvasEle = document.createElement('canvas')
  const ctx = canvasEle.getContext('2d')
  const imgEle = document.createElement('img')
  imgEle.onload = function(e) {
    const ratio = this.width / this.height
    const maxHeight = maxWidth / ratio
    const width = this.width > maxWidth ? maxWidth: this.width
    const height = this.height > maxHeight ? maxHeight: this.height
    canvasEle.width = width
    canvasEle.height = height
    ctx.drawImage(imgEle, 0, 0, width, height)
    const base64Data = canvasEle.toDataURL('image/jpeg', 1)
    document.getElementById('testImage').src = base64Data
  }
  imgEle.src = data
}
```
#### 通过base64图片转为图片对象
注意：*注意ios10及以下手机不支持canvas.toBlob方法*，建议使用下面的方式
```js
function dataURLtoFile(base64Data, filename) {
  const arr = base64Data.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  // atob() 方法用于解码使用 base-64 编码的字符串。
  // base-64 编码使用方法是 btoa() 。
  const decodeData = atob(arr[1])
  const n = decodeData.length
  let u8arr = new Uint8Array(n)
  while(n--){
      u8arr[n] = decodeData.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}
```
#### ios竖拍照片上传后90度旋转问题

图片上传后，竖拍的照片发生90度旋转，发生于ios和部分三星手机，原因是因为*缺少了Orientation参数*，解决办法：

[exif js库](https://github.com/exif-js/exif-js)

[如果是阿里云oss的图片，通过auto-orient,1调整](https://help.aliyun.com/document_detail/44691.html?spm=a2c4g.11186623.6.748.60786deduPpEH0)

## 三、当使用html2canvas图片截取错位问题总结
### 1. 示例

截出的canvas有偏差的示例代码

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    #capture {
      border: 1px solid red;
      border-radius: 10px;
      transition: 1s all;
      position:absolute;
      top: 0;
      left: 0;
    }
  </style>
</head>
<body>
  <div id="capture" style="padding: 10px; background: hsl(50, 89%, 65%)">
    <h4 style="color: #000; ">Hello world!</h4>
  </div>
  <div id="container" style="margin-top: 200px;">
  </div>
  <button id="btn">点击</button>
  <script src="./html2canvas.js"></script>
  <script>
    document.getElementById('btn').addEventListener('click', function() {
      document.getElementById('capture').style.top = (Math.random() * 100) + 'px'
      document.getElementById('capture').style.left = (Math.random() * 100) + 'px'
      html2canvas(document.querySelector("#capture")).then(canvas => {
        document.getElementById('container').appendChild(canvas)
      });
    }, false)
  </script>
</body>
</html>
```

![示例图片](https://qz-test.oss-cn-beijing.aliyuncs.com/xes_souti/assets/common/images/blog/html2canvas.png)

### 2. 原因

当截取的元素上有transition的过渡效果，html2canvas获取到的截取元素属性会以开始未变化之前的属性进行赋值，所以出现了图片截取不正确的情况。

### 3. 解决办法

html2canvas方法执行在过渡效果之后(监听transitionend过度结束事件)。

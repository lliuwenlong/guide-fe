---
title: svg经验记录
tags: [svg]
---

记录工作中遇到的有关 svg 的问题。

## 1. 使用 svg 模拟手写数字效果

### 场景

模拟手写效果完成数字等的书写。

### 实现

通过 path 的 stroke 属性完成路径动画，模拟手写效果。 
1.设置 path 样式
<path stroke="#333" fill="none" stroke-width="5"/> 
2.获取 path 总长度 path.getTotalLength(); =>return number; 
3.设置定时器调整 path 的 stroke-dasharray 和 stroke-dashoffset 属性

```javascript
path.style.strokeDasharray = length;
path.style.strokeDashoffset = length;
let length = path.getTotalLength();
let timer = setInterval(() => {
  if (Math.abs(path.style.strokeDashoffset) < 10) {
    clearInterval(timer);
  }
  path.style.strokeDashoffset -= length / 300;
}, 1);
```
### 参考链接

https://www.w3cplus.com/svg/svg-animation-guide.html
https://juejin.cn/post/6844903507082870791
https://github.com/chanind/hanzi-writer
---
title: CSS经验记录
tags: [Vue, CSS]
---

记录工作中遇到的有关CSS的问题。

## 1. flex container 的 direction 是 column 时， flex item 里的 div 设置百分宽度失败
### 原因
百分高度计算的方法：“如果父框的高度不确定，则按 auto 计算”

### 相关链接：
[解决方法](https://stackoverflow.com/questions/33636796/chrome-safari-not-filling-100-height-of-flex-parent)  
[jsfiddle](https://jsfiddle.net/zhautj5x/3/)  
[标准](https://www.w3.org/TR/CSS22/visudet.html#the-height-property)

## 2. 样式维护问题

### 场景
局部组件的class因为恰好和其他页面的class重名，结果导致样式覆盖，影响了其他页面的展示

### 解决
局部组件内的class应该只定义组件相关样式，必须加上`scope`限制作用域，如果有需要复用的class，应当提取到公共css内


## 3. 三方组件样式重置

### 场景描述
引用在第三方ui库，根据实际设计稿场景需要调整

### 解决
1）去掉sscoped 不推荐  
2）新建去掉scoped的style  
3）/deep/ 或者 >>> 或者 ::deep  
```
<style scoped lang="scss">
.authority {
  padding: 20px;
  height: 100%;
  background: #fff;
}
::v-deep .el-tree-node__content {
  height: 35px;
}
</style>

```
[相关链接](https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B7%E7%94%A8%E6%9C%AC%E5%9C%B0%E5%92%8C%E5%85%A8%E5%B1%80%E6%A0%B7%E5%BC%8F)

## 3. 不定宽高、水平垂直居中

### 场景描述
图片水平垂直居中

### 方法
#### flex布局
```
 .app {
    width: 200px;
    height: 200px;
    border: 1px solid red;
    display: flex;
    justify-content: center;
    align-items: center;
}
.app  img{
    max-width: 100%;
    max-height: 100%;
}
 <div class="app">
    <img src="https://s.tiku.100tal.com/xes_souti/paisou/images/202008/30/d05d47f72c3197d9fd848886a9a09314.jpeg" alt="" />
</div>
<div class="app">
    <img src="https://s.tiku.100tal.com/xes_souti/paisou/images/202009/02/6b0a06d6873b576a0f59db2f10782a3e.jpeg" alt="" />
</div>
```

#### 内联块元素

```
.app01 {
    width: 200px;
    height: 200px;
    border: 1px solid red;
    text-align: center;
    line-height: 200px;
}
.app01  img{
    max-width: 100%;
    max-height: 100%;
}
<div class="app01">
    <img src="https://s.tiku.100tal.com/xes_souti/paisou/images/202008/30/d05d47f72c3197d9fd848886a9a09314.jpeg" alt="" />
</div>
<div class="app01">
    <img src="https://s.tiku.100tal.com/xes_souti/paisou/images/202009/02/6b0a06d6873b576a0f59db2f10782a3e.jpeg" alt="" />
</div>
```

#### table cell

```
.app02 {
    width: 200px;
    height: 200px;
    border: 1px solid red;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}
.app02  img{
    max-width: 100%;
    max-height: 100%;
}
<div class="app02">
    <img src="https://s.tiku.100tal.com/xes_souti/paisou/images/202008/30/d05d47f72c3197d9fd848886a9a09314.jpeg" alt="" />
</div>
<div class="app02">
    <img src="https://s.tiku.100tal.com/xes_souti/paisou/images/202009/02/6b0a06d6873b576a0f59db2f10782a3e.jpeg" alt="" />
</div>
```

## 5.position: sticky 定位

### 场景描述
position: sticky; 基于用户的滚动位置来定位。

sticky 的本意是粘糊糊的，但在 css 中的表现更像是吸附。常见的吸顶、吸底、甚至是回到顶部按钮（移动端网站的头部返回栏，底部切换栏之类）的效果用这个属性非常适合。

### 举例

```
.back{
  position: sticky;
  float: right;
  top: 0;
  border-radius: 50%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3E %3Cpath fill='%23ffffff' d='M177 159.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 255.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 329.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.5 24.6-9.5 34-.1z'%3E%3C/path%3E %3C/svg%3E") center no-repeat dodgerblue;
  background-size: 50%;
  width: 50px;
  height: 50px;
  transform: translateY(calc(100vh));
}
```
### 注意点

使用sticky实现吸顶，需注意父元素overflow不能设为hidden（设置hidden则无法滚动），且还需考虑position:sticky;的兼容性

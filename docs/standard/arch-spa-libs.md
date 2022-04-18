---
title: 公共库清单（包含二、三方库）
sidebar_label: 公共库清单
---

## 一、公共库列表
| 公共库 | 作用描述 | gitlab | 内源Owner | 备注 |
|--------|----------|--------|-----------|------|
| 涂鸦   | | | | |

## 二、三方库列表

| 三方库 | 作用描述 | GitHub/官网 | 二方库 | 内源Owner | 备注 |
|--------|----------|-------------|--------|-----------|------|
| Vue | 渐进式JavaScript框架 | [GitHub](https://github.com/vuejs/vue)，[官网](https://cn.vuejs.org/) | | | |
| Vue Router | Vue.js 官方的路由管理器 | [GitHub](https://github.com/vuejs/vue-router)，[官网](https://router.vuejs.org/zh/) | | | |
| iView | Vue UI 组件库 | [GitHub](https://github.com/view-design/ViewUI)，[官网](https://www.iviewui.com/) | | | |
| Element | 基于 Vue 2.0 的桌面端组件库 | [GitHub](https://github.com/ElemeFE/element)，[官网](https://element.eleme.cn/) | | | 开源维护显现疲态 |
| Ant Design Vue Pro | 开箱即用的MS系统工具箱 | [GitHub](https://github.com/vueComponent/ant-design-vue-pro.git) | [gitlab](https://git.100tal.com/jituan_middleplatform_fe/ant-design-vue-pro.git) | | |
| Axios | HTTP请求库 | [GitHub](https://github.com/axios/axios) | | | |
| Immutable | 不可变数据类型 | [GitHub](https://github.com/immutable-js/immutable-js) | | | |
| Fabric | 轻量级Canvas绘图库 | [GitHub](https://github.com/fabricjs/fabric.js) | | | |
| dayjs | 轻量级时间包装库 | [GitHub](https://github.com/iamkun/dayjs) | | | 2.8KB，可以作为moment（71.2KB），luxon（20.5KB）的替代库 |
| date-fns | 轻量级时间包装库 | [GitHub](https://github.com/date-fns/date-fns) | | | 18KB，API更函数化（[对比](https://www.npmtrends.com/date-fns-vs-dayjs-vs-luxon-vs-moment)） |
| Ramda | 轻量级函数式编程 | [GitHub](https://github.com/ramda/ramda) | | | |

## 三、二方库工作流

二方库存在的目的主要有两个，一是修复三方库中存在的Bug；二是统一维护，保持生产依赖的稳定性。

需要注意的是：如果在三方库的基础上，做自主开发计划和的新特性开发，则不属于三方库的范畴。原则上，二方库相比原三方库的增量代码仅需要包含三方库中未修复的Bug部分，三方库中包含合并修复后，即删除二方库中的相应代码。

基本工作模式是卖主模式，即以原三方库为主，本地修复为辅进行的代码。

版本号命名模式采用4位版本号：原三方库三位 + `fix-1`
本地修复后，建议将代码提交到原三方库中，回馈社区。

本地分支同时设置GitHub和gitlab两个远程仓库，前者是为了同步到最新，后者是二方库代码管理。相关命令如下：

```bash
git remote rename origin github
git remote add origin https://git.100tal.com/jituan_middleplatform_fe/ant-design-vue-pro.git
git push -u origin --all
git push -u origin --tags
```

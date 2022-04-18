---
title: 构建实践
sidebar_label: 构建实践
---

构建是现代前端项目工作流中的关键组成部分，构建目标直接影响了项目的用户体验：
1. 资源加载的速度；
2. 代码运行的性能。

Vue的[Vue CLI](https://cli.vuejs.org/zh/)和React的[Create React App](https://create-react-app.dev)对构建都提供了最佳实践，只需要根据部署的服务器和运行的客户端做简单的调整即可，从下面两个方向去思考：
1. 确定编译范围和实施流程
2. 打包输出结果需要适配多种环境

## 一、案例
### 1.1 基于XBase的客户端开发

XBase的JavaScript运行环境是确定的单一版本Chromium 78，资源统一在本地，所以直接指定目标浏览器版本为Chromium 78，Vue Cli中针对网络加载的部分优化策略也可以调整，以提升JavaScript/CSS解析的效率。核心相关的具体配置如下：

`.browserslistrc`中的配置如下：
```rc
chrome 78
```
browserlist不支持Chromium，用chrome做等价表述。

`vue.config.js`中的相关配置如下：
```js
module.exports = {
  css: {
    sourceMap: true,
  },

  chainWebpack: (config) => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: false }));

    config.module
      .rule('media')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: false }));

    config.module
      .rule('fonts')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: false }));
  },
};
```


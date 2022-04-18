---
title: 发布经验记录
tags: [运维,发布]
---
## 一、k8s发布遇到的相关问题
1. 已打开的页面，在项目发布中点击无反应；sentry捕获404资源
### 现象
```
ChunkLoadError
Loading chunk chunk-52f5b46d failed.
```

### 原因
k8s发布原理，删除已有内容。再发布新的

### 解决方法
基于[K8S+OSS]实现的前端静态资源CDN部署  
1.当选择“oss”模板时   
2.vue项目配置文件中的publicpath修改为 
```
publicPath: "https://static0.xesimg.com/xiaosongshu/k8s-oss-prod/"
```
参考：
[未来云文档](https://cloud.tal.com/docs/k8s/quick_start/k8s-oss.html#%E5%9F%BA%E4%BA%8E-k8s-oss-%E5%AE%9E%E7%8E%B0%E7%9A%84%E5%89%8D%E7%AB%AF%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90cdn%E9%83%A8%E7%BD%B2)
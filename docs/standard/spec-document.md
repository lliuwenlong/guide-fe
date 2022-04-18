---
title: 文档规范
sidebar_label: 文档规范
---

## 一、README文档

1. 目的：快速上手
2. 对象：架构工程师、开发工程师


## 二、TODO文档

1. 目的：记录技术债务
2. 对象：架构工程师、开发工程师


## 三、CHANGELOG文档规范

1. 目的：汇总版本变更信息，根据Git提交信息自动生成


## 四、常用配置文件
### 4.1 .npmrc
在和package.json同目录的.npmrc文件中配置仓库地址，避免对全局.npmrc配置的依赖，也减少对全局.npmrc配置的污染。示例如下：
```shell
registry=https://registry.npm.taobao.org/
@peiyou:registry=https://npm.100tal.com
@udc:registry=http://udc-npm.100tal.com
```

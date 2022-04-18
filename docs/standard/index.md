---
title: FE-GUIDE Beta
sidebar_label: FE-GUIDE Beta
---

把工作中遇到的项目规范、项目实践和其他性能优化等问题持续总结为最佳实践，从软件工程的视角进行总结记录以沉淀价值，服务于构建一个现代化的代码库/项目。


## 一、起步
基于官方标准工具（Vue的[Vue CLI](https://cli.vuejs.org/zh/)和React的[Create React App](https://create-react-app.dev)），拷贝下行代码并粘贴回车即可一键创建集成规范和最佳实践的模板项目。

### 1.1 一键创建Vue2.0项目

使用集成最佳实践的模板创建空项目：
```shell
vue create --preset direct:https://git.100tal.com/jituan_middleplatform_talfer/startup-vue2-app.git#master --clone <my-project-name>
```

使用集成最佳实践的模板创建包含Real World的项目（注意项目中包含反例）：
```shell
vue create --preset direct:https://git.100tal.com/jituan_middleplatform_talfer/startup-vue2-app.git#demo --clone <my-project-name>
```

### 1.2 一键创建Vue3.0项目

使用集成最佳实践的模板创建空项目：
```shell
vue create --preset direct:https://git.100tal.com/jituan_middleplatform_talfer/startup-vue3-app.git#master --clone <my-project-name>
```

使用集成最佳实践的模板创建包含Real World的项目（注意项目中包含反例）：
```shell
vue create --preset direct:https://git.100tal.com/jituan_middleplatform_talfer/startup-vue3-app.git#demo --clone <my-project-name>
```


## 二、动机

### 2.1 简单易用
每一个行配置和示例代码精挑细想，服务每一行代码的编写

### 2.2 聚焦关键
寻找每一个关键环节的最佳实践，聚焦于每一个短板，从细节上整体提升项目质量

### 2.3 一起驱动
同侪共建，汇聚所有伙伴一点一滴的思考，欢迎Merge Request，持续进步。


## 三、共建
1. 打开页面右上角“GitLab”链接；
2. 点击“Request Access”按钮申请权限，联系邬明亮/胡继伟通过；
3. 克隆“jituan_middleplatform_talfer/fe-guide”代码仓库；
4. 参考[Git规范](spec-git.md)中的分支规范签出分支；
5. 参考代码库中README.md在本地编辑和测试；
6. 参考[Git规范](spec-git.md)中的合并规范请求合并。

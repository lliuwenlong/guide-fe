---
title: Vue过滤器经验记录
tags: [Vue, Filter]
---

过滤器简化UI，简化显示数据（ViewModel）的预处理。记录工作中遇到的有关vue过滤器的问题。

## 1. 常用自定义过滤器`dtf`

### 作用
格式化时间字符串。

### 使用方法
`dtf`或`dtf('yyyy-MM-dd')`，[API参考](https://moment.github.io/luxon/docs/manual/formatting.html#formatting-with-tokens--strings-for-cthulhu-)。

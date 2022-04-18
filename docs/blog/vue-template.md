---
title: Vue模板经验记录
tags: [Vue, Template]
---

项目中遇到的有关vue template的问题。

## 1. template中只包含简单的表达式
### 原因
复杂表达式会让你的模板过重且难以维护。我们应该尽量描述应该出现的是什么，而非如何计算那个值。

```javascript
    {{
        fullName.split(' ').map(function (word) {
        return word[0].toUpperCase() + word.slice(1)
        }).join(' ')
    }}
```
### 解决方法
尽量写成有语义的计算属性或方法、filter，从而使得代码可以重用

```javascript
    computed: {
        normalizedFullName: function () {
            return this.fullName.split(' ').map(function (word) {
                return word[0].toUpperCase() + word.slice(1)
            }).join(' ')
        }
    }
```

## 2. `style`标签中必须添加`lang`属性

原因：否则有可能会报错（升级`vue-cli@3.0.5`版本是个暴露点，但应该不是这个原因）。

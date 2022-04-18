---
title: 版本规范
sidebar_label: 版本规范
---


为了让我们所开发的软件的版本管理有章可循，避免版本管理的盲目以及因此造成的维护困难和给使用者带来的使用困惑，因此我们参照社区较为通行的做法——遵循[语义化版本 2.0.0](https://semver.org/lang/zh-CN/)，制定本规范。

## 一、版本号的构成

1. 版本号一般由数字 1-9 和 . 组成，不应包含多余的信息，如前端不要加字母 v。
2. 版本号格式为：`<主版本号>.<次版本号>.<修订号>(-<先行版本号>+<版本编译元数据>)`

其中，主版本号、次版本号、修订号是必须的（例如，可以是1.0.0，但不能是1.0），且必须是非负整数每个元素必须以数值来递增。

而先行版本号、版本编译元数据是可选的，它们都由一连串以英文句点（.）相连接的标识符来修饰，每个标识符只能由字母数字字符
（[a-zA-Z0-9]）组成，且禁止留白。


## 二、版本号变更规则

2.1 主版本号
当你做了不兼容的 API 修改时，需要升主版本号。每次递增时，次版本号和修订号都要归零。

2.2 次版本号
当你做了向下兼容的功能性新增时，需要升次版本号。每次递增时，修订号都要归零。

2.3 修订号
当你做了向下兼容的问题修正时，需要升修订号。

2.4 先行版本号
版本过渡时，若代码变更较大，包括增加新特性和对接口进行调整，一般会预先布 alpha、beta、rc等先行版本。例如：1.0.0-alpha.0、1.0.0-alpha.1，被标上先行版本号则表示这个版本并非稳定版本。

2.5 版本编译元数据
若有的话，可以被标注在修订版或先行版本号之后，先加上一个加号连接。

2.5 版本号变更确认
1. 以0.1.0 作为新项目的初始化开发版本
2. 对于受项目经理监管的项目，主版本号、次版本号的提升要经过项目经理的许可。
3. 标记版本号的软件发行后，禁止改变该版本软件的内容。任何修改都必须以新版本发行。
4. 版本的优先级关系（版本大小比较关系）：<br />
    `0.9.99 < 0.10.0 <1.0.0-alpha.0 < 1.0.0-alpha.1 < 1.0.0-beta.0 < 1.0.0-beta.1 = 1.0.0-beta.1+exp.sha.5114f85 < 1.0.0-rc.1 < 1.0.0-rc.2 < 1.0.0 = 1.0.0+20130313144700 < 2.0.0 < 2.1.0 < 2.1.1`

**注意：**

当判断版本的优先层级时，版本编译元数据应该被忽略。因此当两个版本只有在版本编译元数据有差别时，属于相同的优先层级。


## 三、Tag Name规范
Tag Name与版本号保持一致。


## 四、参考
1. [语义化版本 2.0.0](https://semver.org/lang/zh-CN/)

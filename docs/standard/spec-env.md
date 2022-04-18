---
title: 环境变量实践
sidebar_label: 环境变量实践
---

## 一、概述
环境变量是业务的个性/敏感信息，比如数据库连接密码、API地址等；而项目配置是业务的通用逻辑信息，比如Java项目的依赖注入、FE项目中样式的配置信息——判断一个变量是否需要抽象为环境变量最简单的方式是：如果代码要开源，这个变量是否能暴露出去。

最简单的使用方法是，在单一项目中区分生产（`production`）、预发布（`staging`）、QA测试（`qa`）、自动测试（`test`）和开发（`development`）等各个环境，将差异和敏感信息分别记录在环境配置文件中，在代码中使用时，将其当作最简单的变量替换——实现在各种环境（至少要确保生产、预发布、QA测试3个环境）中使用同一份代码，或使用同一份构建出的代码（仅应该环境变量的替换部分存在差异）——代码运行在不同的环境中以满足不同的需求，或承载不同的业务。

在业务代码中不应该对`NODE_ENV`进行使用，环境变量应该通过环境配置文件`.env`来解耦和隔离区分。

在工作中，往往需要引入`qa`和`staging`等更多环境，并且这些环境在构建上需要使用`production`模式进行构建，以保持一致性。

但`NODE_ENV`已经在Vue-Cli等构建工具中使用，并对`production`、`test`和`development`等多种模式内置使用。

如果在业务代码中对`NODE_ENV`的模式值进行判断，会出现无法区分`production`和`qa`、`staging`等环境的现象。

不可避免的是，在`qa`、`staging`和`production`模式下构建时，`node_modules`中的文件，可能也存在对`NODE_ENV`的模式值进行判断，结果会存在些许的差异

### 1.1 Title的设置
Title虽小，确实专业的前端项目必备的因素，由于其是静态的，用环境变量完成Title的静态化设置是一个合适的选择，方法如下：
> 进一步，在路由的变化中，设置正确的`document.title`有利于用户对历史记录的使用。

`public/index.html`模板文件中`<title>`设置如下：
```html
<title><%= VUE_APP_TITLE %></title>
```

`.env.development`文件内容如下：
```
NODE_ENV=development
VUE_APP_TITLE=QEagles (Development)
```

`.env.qa`文件内容如下：
```
NODE_ENV=production
VUE_APP_TITLE=QEagles (QA)
```

`.env.production`文件内容如下：
```
NODE_ENV=production
VUE_APP_TITLE=QEagles
```

### 1.2 历史项目和官方构建工具的兼容
可能历史项目中存在业务代码中，对`NODE_ENV`的判断，更新为官方工具时，保持环境变量的一致性是重中之重。最简单的方法是进行代码的更新，干净彻底。如果历史项目比较重，可以参考下面思路。

#### Hack：
1. 在构建中，使用环境配置文件中的声明；
2. 在业务代码生成前，通过DefinePlugin注入新的`qa`和`staging`等环境变量。

#### 强调：
**虽然如下方法可Hack解决`qa`和`staging`的构建，但**强烈不推荐**、不应该在代码中使用，用正确的方式解决问题挺好的（强烈不推荐，此处案例代码省略）。


## 二、案例

### 2.1 重构前
代码如下所示：
```javascript
let queConfig = {
  development: {
    clientId: 'ABCDEFGHIJK',
  },
  test: {
    clientId: 'ABCDEFGHIJK',
  },
  production: {
    clientId: 'online-audio',
  },
};
let query = `clientId=${queConfig[process.env.NODE_ENV].clientId}`;
```

### 2.2 重构后
`.env.development`文件内容如下：
```
NODE_ENV=development
VUE_APP_UPLOAD_ASSIST_CLIENT_ID=ID-111-AAA
```

`.env.qa`文件内容如下：
```
NODE_ENV=production
VUE_APP_UPLOAD_ASSIST_CLIENT_ID=ID-333-CCC
```

`.env.production`文件内容如下：
```
NODE_ENV=production
VUE_APP_UPLOAD_ASSIST_CLIENT_ID=ID-333-EEE
```

代码如下所示：
```javascript
let query = `clientId=${process.env.VUE_APP_UPLOAD_ASSIST_CLIENT_ID}`;
```

## 三、参考
1. [12factor 配置](https://12factor.net/zh_cn/config)

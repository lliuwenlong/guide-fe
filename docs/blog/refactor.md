---
title: 优化重构经验记录
tags: [Vue, 优化, 重构]
---

记录工作中遇到的有关优化的问题。

## 1. 第三方依赖语法转化配置

### 原因
IE11 不能运行项目，检查发现是luxon中的报错，不支持`Object.assign`方法。
默认情况下 babel-loader 会忽略所有 node_modules 中的文件。

### 相关的解决方法
1. 针对ES6语法的第三方库（不提供build版本的情况下），在 `vue.config.js` 中配置 `transpileDependencies` 选项，列出来需要转换的第三方库，为该依赖通过 Babel 显式开启语法转换和根据使用情况检测 polyfill。
2. 在`babel.config.js文件中`显式设置`polyfills`配置；
3. 使用`useBuiltIns: 'entry'`配置，在入口文件添加 import '@babel/polyfill'，根据 browserslist 目标导入所有 polyfill。
4. 在 `package.json` 中设置 `browserslist`字段 (或一个单独的 `.browserslistrc` 文件)，指定项目的目标浏览器的范围。这个值会被 `@babel/preset-env` 用来确定需要转译的 JavaScript 特性。

## 结论
1. `transpileDependencies` 选项仅适用于ES6语法的第三方库；
2. `polyfills`配置过于琐碎，于工作上一般是后置的（发现Bug再处理），存在不确定性；
3. `useBuiltIns: 'entry'`配置一劳永逸，入口文件多了一行业务不相关代码。
4. 在 `package.json` 中设置 `browserslist`字段。

### 证据
1. 显式配置`mainFields: ['module', 'main']`和`transpileDependencies: ['luxon'],`，强制引用 luxon package.json 中配置的`"module": "src/luxon.js"`，这两个选项需要同时配置，否则会报错；

### 实例代码

```javascript
// 配置vue.config.js
transpileDependencies: ['@brandy/form-component', '@brandy/jsBridge'],
configureWebpack: {
    resolve: {
        mainFields: ['browser', 'module', 'main'],
    },
},

// 配置babel.config.js
presets: [
    ['@vue/app', {
        useBuiltIns: 'entry',
    }],
],
```

### 参考
1. [Cli Polyfill](https://cli.vuejs.org/zh/guide/browser-compatibility.html#polyfill);
2. [resolve.mainFields](https://webpack.js.org/configuration/resolve/#resolve-mainfields);
3. [browserslist queries](https://github.com/browserslist/browserslist#queries)
4. [@babel/preset-env how-it-works](https://new.babeljs.io/docs/en/next/babel-preset-env.html#how-it-works)


## 2. '串行化列表请求'

### 出现场景
请求同一个端口时，出现在上一个请求还没返回来就直接进行下一个请求，列表中返回的数据会有影响，可能不是最新请求的数据。所以在遇到这种情况时，最好是中止上一次请求。

### 中止时机（定时器、Ajax请求等异步操作清理）
在遇到使用定时器或者串列化列表请求时，中止请求以及清理定时器的时机一定要在`下次请求或者创建之前以及销毁组件`时，如果销毁不及时会造成请求连续中止不了情况，避免内存泄漏。

### 示例代码

```javascript
import { CancelToken } from 'axios';


// 列表中判断是否需要中止请求
if (this.cancelFetchInstanceList) {
    this.cancelFetchInstanceList();
    this.cancelFetchInstanceList = null;
}

// 请求中传入
request({
    url: '/ecsspringrbqBack/instance/instanceList',
    params: payload,
    cancelToken: new CancelToken((cancel) => {
        this.cancelFetchInstanceList = cancel;
    }),
}).then((data) => {
    // 是否需要清理定时器
    if (this.timeout) {
        clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
        this.fetchInstanceListByPage(true);
    }, 10000);
}

// 组件销毁时
beforeDestroy() {
    clearTimeout(this.timeout);
    if (this.cancelFetchInstanceList) {
        this.cancelFetchInstanceList('activeCancellation');
        this.cancelFetchInstanceList = null;
    }
}

```

## 3. 兼容性问题

### Edge兼容性问题
文本的内容如果有‘.’或者是手机号，会显示成链接的样式，并且可以点击。请放在 pre 标签中显示。

### IE11 input兼容问题
在IE11上，给input添加watcher，如果input的value初始值设置为null时，会在生命周期初期就触发watcher。只有在将input的value的初始值设置为字符串或数字时才会避免触发watcher。后期可考虑使用强类型typescript，避免forbidden behaviors。

## 4. form表单提交的优化
```javascript
// 之前提交
data: {
    name: this.form.name,
    size: this.form.disk,
    des: this.form.des,
}

// 优化之后
data: this.form
```

把this.form值直接赋给data，原因（从语文的角度理解）：
1. 把form的数据上报，完成数据持久化；
2. 让逻辑线性化，避免双路交叉。

## 5. 在mavonEditor这个编辑器里上传图片，同一张图片不能上传两次

#### 解决方法

上传图片后，将`<input type="file" />` 元素的value值置空即可

## 6. 预防XSS攻击

eg: `‘“<img src=1 onerror="alert(1)">`

在使用输入框（input及textarea)时，尽量设置标点符号的校验，如果无校验，要添加xss过滤，防止xss攻击。
如果使用markdown，要在markdown解析完成以前进行xss过滤。

数据根据最后的展示，分平数据（原样输出）和富文本数据（需要当作HTML使用，在浏览器中解析成DOM结构）。

一、输出编辑框时：
1. 输出到input或textarea时，直接输出即可；
2. 输出到富文本编辑器时，进行xss过滤后再赋值。

二、输出显示时：
1. 一般禁用Vue的v-html指令操作（VUE会按需自动编码，即进行escape操作）；
2. 如果需要富文本的显示，进行xss过滤后再显示；

三、输入提交时：
1. 富文本数据（比如富文本编辑框中的值），进行xss过滤；

四、输入存库时：
提醒后段API同学进行上述的处理，即：
1. 富文本数据（从富文本编辑器过去的值）进行xss过滤，再编码后入库；
2. 所有的数据编码后入库。

附加：
jsxss过滤库（https://jsxss.com/zh/try.html）

## 7. SVG层级关系（渲染顺序）

svg文档片段中的元素具有隐式绘制顺序，SVG文档片段中的第一个元素首先被"绘制"，后续元素绘制会在先绘制的元素之上。
即：标签越靠后，层级越高，越优先触发事件。
并且，svg不支持dom元素中的z-index，实际测试也不生效，如果想解决覆盖的问题，可以把小的svg排序，配合point-events的属性，处理成只接收元素内部或边界的鼠标时间，解决不规则图形非元素内部边界的问题；

## 8. 缓存问题
浏览器分*协商缓存*和*强效缓存*两种，在新版本的浏览器中，*强效缓存*从`from cache`变成了`from disk cache`和`from memery cache`。
在SPA的项目中，html文件需要使用协商缓存，其他静态资源使用强效缓存（原因：所有静态资源的URL都是唯一的）。

```nginx
location /console {
    add_header Cache-Control no-cache;

    if ($request_uri ~ .*\.(js|css|woff|eot|woff2|ttf|svg|png|jpg|jpeg|gif|ico)$) {
        add_header Cache-Control max-age=315360000;
    }
}
```

## 9. “重”资源异步加载
`import`直接饮用，对整体bundle的影响较大，针对个别“重”资源，比如ueditor、g2、codemirror等三方库，可以使用`import()`动态加载，以从bundle中分离，示例如下：

```javascript
Promise.all([
    import(/* webpackChunkName: "codemirror" */ 'codemirror'),
    import(/* webpackChunkName: "codemirror" */ 'jsonlint'),
    import(/* webpackChunkName: "codemirror" */ 'codemirror/mode/javascript/javascript'),
    import(/* webpackChunkName: "codemirror" */ 'codemirror/addon/display/placeholder'),
    import(/* webpackChunkName: "codemirror" */ 'codemirror/addon/lint/lint'),
    import(/* webpackChunkName: "codemirror" */ 'codemirror/addon/lint/json-lint'),
    import(/* webpackChunkName: "codemirror" */ 'codemirror/lib/codemirror.css'),
    import(/* webpackChunkName: "codemirror" */ 'codemirror/theme/dracula.css'),
    import(/* webpackChunkName: "codemirror" */ 'codemirror/addon/lint/lint.css'),
]).then(([CodeMirror, jsonlint]) => {
    // do somethine
});
```

## 10. 在三星S8 和 ios设备中，点击播放按钮会直接调出全屏视频播放器。

#### 解决方法
```
<audio src="" playsinline  webkit-playsinline="true"></audio>
```

## 11.同时打开两个登录，界面A、界面B，同一账号登录成功。选择界面A切换为另一个账号，打开界面B，点击tab切换，界面展示用户名还是旧账号；

### 解决办法
监听storage数据更新

```javascript
created() {
    this.refreshUsername = () => {
        const identity = JSON.parse(localStorage.getItem('CONSOLE_USER_IDENTITY'));
        if (identity && identity.username) {
            this.username = identity.username;
        }
    };
    this.refreshUsername();
    window.addEventListener('storage', this.refreshUsername);
}

beforeDestroy() {
    window.removeEventListener('storage', this.refreshUsername);
}
```

## 12. 页面展示问题

### 推测

### 现象
当出现展示一行动态内容时，在子项宽度不确定的情况下，不建议使用 `justify-content: space-between` 的方式进行项目对齐，这样会造成明显的页面抖动；

## 13. svg开发时组件设计缺陷
当svg中有图形存在时，事件只能通过冒泡的方式捕获，或者直接在子元素（path标签）上捕获，
这就带来一个问题，数据用来渲染子组件，事件起始捕获在子组件上（开闭原则），后续事件响应放在了父组件中，而数据的变更算法理应在子组件上(单一职责原则)，
这就涉及到了多次父子传值的问题。
在最初代码设计上就要考虑到是否需要合理引入vuex或其他公共模块设计来避免过于频繁的父子组件传值的问题

## 14.tree组件
组件提供的APIhold不住业务场景，当修改数据触发checkbox的选中时无法生效。indeterminate是tree组件内部实现半选状态的值，需要在外部更改此值来更改状态。
### 代码：
```javascript
setChecked(treeNode, checked) {
    let parentNode = null;
    for (let i = 0, len = this.treeData.length; i < len; i += 1) {
        const node = this.treeData[i];
        if (node.children.find(item => item.title === treeNode.title)) {
            parentNode = node;
            break;
        }
    }
    if (checked) {
        const otherNode = parentNode.children.find(item => !item.checked);
        parentNode.indeterminate = otherNode && otherNode.title !== treeNode.title;
        parentNode.checked = parentNode.children.filter(item => !item.checked).length === 1;
    } else {
        const otherNode = parentNode.children.find(item => item.checked);
        parentNode.indeterminate = otherNode && otherNode.title !== treeNode.title;
        parentNode.checked = false;
    }
    Object.assign(treeNode, { checked });
}
```

## 15. 增强代码的健壮性

### 现象
在做条件判断时，有时容易直接判断某个对象的具体属性是否满足要求，比如 `data.resultBean.namespace.length > 0` 这里很容易发生报错

### 寻找状态赋值的更优解（能不能不做这个判断)

### 解决
在不确定的情况下，尽量先判断对象是否存在，再判断对象上的属性是否满足条件 `data.resultBean && data.resultBean.namespace && data.resultBean.namespace.length > 0` 保证代码的健壮性

## 16. edge浏览器上传附件时，只有上传完成后，才会有有进度条显示，上传过程中不显示进度条

原因：
onUploadProgress该回调函数在edge中不是实时执行的，所以无法监测到上传的百分比。
### 解决
在edge下可采用loading动画的方式来表示文件上传中

## 17. 在vue public目录下直接引入第三方文件，会报错Uncaught SyntaxError: Unexpected token <
### 解决
在vue中直接引入js文件，必须使用绝对路径，否则这类引用会经webpack处理



## 18. 环境变量及模式

### 解决问题
发版过程中存在很多的发版环境，例如测试环境、开发环境等，我们需要根据不同的环境做相应的调整。
### 解决方法
1.增加模式 test
vue-cli-service build --mode test 会在 test 模式下加载可能存在的 .env、.env.test 和 .env.test.local 文件然后构建出生产环境应用。
env.test

```
NODE_ENV=production
VUE_APP_API_BASE_URL=http://39.107.112.223:8008/
```

2.增加变量 test
以 VUE_APP_ 开头的变量会被 webpack.DefinePlugin 静态嵌入到客户端侧的包中
VUE_APP_SERVER_MODE=test vue-cli-service build --modern --mode production


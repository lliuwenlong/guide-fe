---
title: 模版规范
sidebar_label: 模版规范
---


## 一、标记规范化

文字、图片、链接、表单和提交按钮都是所有Web真正需要的元素，也是在Web上创建所有东西的基础。初始的标记做得不好，将要写很多不必要的CSS和JavaScript来弥补。初始标记做得好，你就能写出更具可扩展性和可维护性的CSS和JavaScript。所以，**HTML标记规范化**非常重要。

在开发中采用模块化的方案，管理标记产生的模板和流程，控制标记和标记中CSS类名。

用户生成的内容无法控制标记，也无法自动添加CSS类名，可以根据规则将这部分内容结构化后使用。


## 二、编码规范

### 2.1 编码
1. 用不带BOM头的UTF-8编码。
2. 换行符统一使用`LF`。
3. 使用有效的HTML代码，否则很难达到性能上的提升。

### 2.2 文档类型定义
文档类型使用HTML5标准。HTML5是目前所有HTML文档类型中的首选：`<!DOCTYPE html>`。简洁且向后兼容，不推荐HTML 4.01中DTD的定义。

```html
<!-- 不推荐 -->
<title>Test</title>
<article>This is only a test.
```

```html
<!-- 推荐 -->
<!DOCTYPE html>
<meta charset="utf-8">
<title>Test</title>
<article>This is only a test.</article>
```


### 2.3 标记/属性/属性值

#### 2.3.1 语义化
HTML的语义化即是对标记的正确使用。根据HTML各个元素的用途准确使用，使用元素 (“标签”、“标记”) 要知道为什么去使用它们和是否正确。例如，用heading元素构造标题，`p`元素构造段落, `a`元素构造锚点等。

根据HTML各个元素的用途而去使用是很重要的，它涉及到文档的可访问性、重用和代码效率等问题。

```html
<!-- 不推荐 -->
<div onclick="goToRecommendations();">All recommendations</div>
```

```html
<!-- 推荐 -->
<a href="recommendations/">All recommendations</a>
```

常用HTML标记表

| 标记 | 原单词 | 说明 | 语义化（Y/N） |
|:----:|--------|------|:-------------:|
| header | header | 定义头部 | Y |
| footer | footer | 定义尾部 | Y |
| section | section | 定义节 | Y |
| article | article | 定义文章，或完整结构体 | Y |
| h1-h6 | head | 定义 HTML 标题 | Y |
| p | paragraph | 定义段落 | Y |
| ul | unordered list | 定义无序列表 | Y |
| ol | ordered list | 定义有序列表 | Y |
| li | list item | 定义列表的项目 | Y |
| dl | definition list | 定义定义列表 | Y |
| dt | definition term | 定义定义列表中的项目 | Y |
| dd | definition description | 定义定义列表中项目的描述 | Y |
| table | table | 定义表格 | Y |
| thead | table head | 定义表格中的表头内容 | Y |
| tbody | table body | 定义表格中的主体内容 | Y |
| th | table head cell | 定义表格中的表头单元格 | Y |
| tr | table row | 定义表格中的行 | Y |
| td | table data cell | 定义表格中的单元 | Y |
| a | anchor | 定义锚 | Y |
| img | image | 定义图像 | Y |
| div | division | 定义文档中的节 | N |
| span | span | 定义文档中的节 | N |

#### 2.3.2 大小写
所有的代码都用小写字母，包括元素名、属性、属性值（除了文本和`CDATA`）。

```html
<!-- 不推荐 -->
<A HREF="/">Home</A>
```
```html
<!-- 推荐 -->
<img src="google.png" alt="Google">
```


#### 2.3.3 多媒体后备方案
为多媒体提供备选内容。

对于多媒体，如图像，视频，通过`canvas`读取的动画元素，确保提供备选方案。 对于图像使用有意义的备选文案（`alt`） 对于视频和音频使用有效的副本和文案说明。

提供备选内容是很重要的，原因：给盲人用户以一些提示性的文字，用`alt`告诉他这图像是关于什么的，给可能没理解视频或音频的内容的用户以提示。

（图像的`alt`属性会产生冗余，如果使用图像只是为了不能立即用CSS而装饰的 ，就不需要用备选文案了，可以写`alt=""`。）

```html
<!-- 不推荐 -->
<img src="spreadsheet.png">
```

```html
<!-- 推荐 -->
<img src="spreadsheet.png" alt="电子表格截图">
```

#### 2.3.4 关注点分离
将表现和行为分开。严格保持结构 （标记），表现 （样式），和行为 （脚本）分离, 并尽量让这三者之间的交互保持最低限度。

确保文档和模板只包含HTML结构， 把所有表现都放到样式表里，把所有行为都放到脚本里。此外，尽量使脚本和样式表在文档与模板中有最小接触面积，即减少外链。

将表现和行为分开维护很重要，因为更改HTML文档结构和模板会比更新样式表和脚本更花费成本。

```html
<!-- 不推荐 -->
<!DOCTYPE html>
<title>HTML sucks</title>
<link rel="stylesheet" href="base.css" media="screen">
<link rel="stylesheet" href="grid.css" media="screen">
<link rel="stylesheet" href="print.css" media="print">
<h1 style="font-size: 1em;">HTML sucks</h1>
<p>I’ve read about this on a few sites but now I’m sure:
  <u>HTML is stupid!!1</u>
<center>I can’t believe there’s no way to control the styling of
  my website without doing everything all over again!</center>
```

```html
<!-- 推荐 -->
<!DOCTYPE html>
<title>My first CSS-only redesign</title>
<link rel="stylesheet" href="default.css">
<h1>My first CSS-only redesign</h1>
<p>I’ve read about this on a few sites but today I’m actually
  doing it: separating concerns and avoiding anything in the HTML of
  my website that is presentational.
<p>It’s awesome!
```

#### 2.3.5 实体引用
不要用实体引用。

不需要使用类似`&mdash;`、`&rdquo;`和`&#x263a;`等的实体引用, 假定团队之间所用的文件和编辑器是同一编码（UTF-8）。

在HTML文档中具有特殊含义的字符（例如 `<`和`&`)为例外， 噢对了，还有 “不可见” 字符 （例如no-break空格）。

```html
<!-- 不推荐 -->
欧元货币符号是 &ldquo;&eur;&rdquo;。
```

```html
<!-- 推荐 -->
欧元货币符号是 “€”。
```

#### 2.3.6 可选标记
不要省略可选标记，如果出于优化文件大小的考虑，可以使用工具优化可选标记，哪些是可选标记可以参考[HTML5 specification](http://www.whatwg.org/specs/web-apps/current-work/multipage/syntax.html#syntax-tag-omission)。


```html
<!-- 不推荐 -->
<!DOCTYPE html>
<title>Saving money, saving bytes</title>
<p>Qed.
```
```html
<!-- 推荐 -->
<!DOCTYPE html>
<html>
    <head>
        <title>Spending money, spending bytes</title>
    </head>
    <body>
        <p>Sic.</p>
    </body>
</html>
```


#### 2.3.7 type属性
在样式表和脚本的标记中忽略`type`属性，在样式表（除非不用 CSS）和脚本（除非不用 JavaScript）的标记中 不写`type`属性。

HTML5默认`type`为[`text/css`](http://www.whatwg.org/specs/web-apps/current-work/multipage/semantics.html#attr-style-type)和[`text/javascript`](http://www.whatwg.org/specs/web-apps/current-work/multipage/scripting-1.html#attr-script-type)类型，所以没必要指定。即便是老浏览器也是支持的。

```html
<!-- 不推荐 -->
<link rel="stylesheet" href="//www.google.com/css/maia.css" type="text/css">
```

```html
<!-- 推荐 -->
<link rel="stylesheet" href="//www.google.com/css/maia.css">
```

```html
<!-- 不推荐 -->
<script src="//www.google.com/js/gweb/analytics/autotrack.js" type="text/javascript"></script>
```

```html
<!-- 推荐 -->
<script src="//www.google.com/js/gweb/analytics/autotrack.js"></script>
```

#### 2.3.8 使用`label`的`for`属性
```html
<!-- 不推荐 -->
<label>蓝色</label><input type="radio" name="color" value="#0000ff">
```

```html
<!-- 推荐 -->
<label for="radio-blue">蓝色</label><input type="radio" id="radio-blue" name="color" value="#0000ff">
<label>蓝色<input type="radio" name="color" value="#0000ff"></label>
```

### 2.4 排版

#### 2.4.1 缩进
每次缩进2个空格。不要用TAB键或多个空格来进行缩进。

```html
<ul>
  <li>Fantastic</li>
  <li>Great</li>
</ul>
```

#### 2.4.2 行尾空格
删除行尾白空格。行尾空格没必要存在。

```html
<!-- 不推荐 -->
<p>What? 
```

```html
<!-- 推荐 -->
<p>Yes please.
```

#### 2.4.3 格式
每个块元素、列表元素或表格元素都独占一行，每个子元素都相对于父元素进行缩进。

独立元素的样式, 将块元素、列表元素或表格元素都放在新行。另外，需要缩进块元素、列表元素或表格元素的子元素。

如果出现了列表项左右空文本节点问题，可以试着将所有的`li`元素都放在一行。

```html
<blockquote>
    <p><em>Space</em>, the final frontier.</p>
</blockquote>
```


### 2.5 注释
1. 用注释来解释代码：它包括什么，它的目的是什么，它能做什么，为什么使用这个解决方案？
2. 按组写注释，按照功能的类别来对一组样式表写统一注释。独立成行。
3. 只用`TODO`来强调代办事项，不要用其他的常见格式，例如`@@`。
  1. 可附加联系人（用户名或电子邮件列表），用括号括起来，例如`TODO(contact)`。
  2. 可在冒号之后附加活动条目说明等，例如`TODO: 活动条目说明`。
```html
{# TODO(cha.jn): 重新置中 #}
<center>Test</center>
```

```html
<!-- TODO: 删除可选元素 -->
<ul>
    <li>Apples</li>
    <li>Oranges</li>
</ul>
```


### 2.6 其他

#### 2.6.1 协议
省略嵌入式资源协议声明，即省略图像、媒体文件、样式表和脚本等URL协议头部声明`http:`和`https:`，如果不是这两个声明的URL则不省略。

省略协议声明，使URL成相对地址，防止内容混用问题（[Mixed Content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)），避免小文件重复下载。
```html
<!-- 不推荐 -->
<script src="http://www.google.com/js/gweb/analytics/autotrack.js"></script>
```

```html
<!-- 推荐 -->
<script src="//www.google.com/js/gweb/analytics/autotrack.js"></script>
```

##### 进一步说明
自动扩展URL：
1. 用户在浏览器或者地址href中不需要输入完整的URL地址，浏览器会自动扩展。
2. 协议的自动扩展是为了兼容http和https两种协议。

```html
// 如下href地址
<li><a href="//zhiyucloud.facethink.com/tools/OSSClientSetup.exe">客户端工具</a></li>
```

自动扩展两种方式：
1. 主机名扩展<br />
浏览器通常可以在没有帮助的情况下，将主机名扩展为完整的主机名，比如yahoo会自动构建为www.yahoo.com。
如果找不到与yahoo匹配的站点，有些浏览器会在放弃之前尝试几种扩展方式。
浏览器通过简单的技巧来节省你的时间，减少找不到的可能。

2. 历史扩展<br />
浏览器将以前用户访问过的URL历史存储起来，当输入的URL与历史记录的前缀匹配，就会提供一些完整的选项供你选择。
如用户输入http时下拉框就会出现很多匹配链接。


## 三、参考
1. [Google HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html)
2. [再谈语义化](http://www.chinaz.com/web/2011/1123/222135.shtml)

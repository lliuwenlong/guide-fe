---
title: 路由实践
sidebar_label: 路由实践
---

## 一、路由设计

### 1.1 原则
1. 简洁一致，路由设计和使用保持简洁和一致；
2. [RESTful](https://zh.wikipedia.org/wiki/表现层状态转换)，将路由简化抽象为RESTful的URL，即每一个URL可独立启动对应应用程序的状态和功能；
3. 无状态，刷新浏览器后可完整还原页面的状态和功能，不依赖于之前的页面操作。

### 1.2 规范
1. 路径（path）全小写，和文件夹的命名一致，格式使用kebab-case格式；
2. 路由统一使用描述地址的对象执行跳转，在`:to`参数和编程跳转两种形式中保持一致；
3. 路由打包名字（webpackChunkName）设置唯一，和当前路由声明的基础路径部分保持一致（可以不包含父路径），是代码分割的默认粒度；
4. 路由`name`的要求是**全局唯一**，容易记忆且完善的命名规则是把`path`部分的`/`用`.`替换后直接付给`name`，方便准确的和`params`联合使用。
5. 用query代替path中嵌套的查询参数，直观显示路由结构。


## 二、案例总结

### 2.1 简化`path`路由声明

用`query`代替`path`声明中嵌套的查询参数`params`，直观显示路由结构，避免隐式混淆。

#### 1、路由声明示例对比
用`params`参数路由声明如下，特别需要注意的是`path: 'detail/:id'`不能简化为`path: ':id'`，原因是：简化后的路径可能会被`path: ':page(\\d+)?/:keyword?'`提前匹配截获；`/:keyword?'`部分是可选的，`/1`满足`path: ':id'`和`path: ':page(\\d+)?/:keyword?'`两者的模式，会被第一个匹配。
```
// router.ts 示例如下
export default {
  path: '/ecs-rabbit',
  name: 'ecs-rabbit',
  component: () => import(/* webpackChunkName: "ecs-rabbit" */ './app.vue'),
  children: [
    {
      path: ':page(\\d+)?/:keyword?',
      component: () => import(/* webpackChunkName: "ecs-rabbit" */ './views/index.vue'),
    },
    {
      path: 'detail/:id',
      component: () => import(/* webpackChunkName: "ecs-rabbit" */ './views/detail.vue'),
    },
  ],
};
```
用`query`参数简化后的路由声明如下：
```
// router.ts 示例如下
export default {
  path: '/ecs-rabbit',
  component: () => import(/* webpackChunkName: "ecs-rabbit" */ './app.vue'),
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "ecs-rabbit" */ './views/index.vue'),
    },
    {
      path: ':id',
      component: () => import(/* webpackChunkName: "ecs-rabbit" */ './views/detail.vue'),
    },
  ],
};
```

#### 2. 参数获取示例对比
```
// 用params数据获取page
this.page.current = parseInt(this.$route.params.page, 10) || 1;

// 用query参数获取page
this.page.current = parseInt(this.$route.query.page, 10) || 1;
```

#### 3. 参数传送示例对比
`params`形式传参要求顺序，`query`形式传参顺序无关。

```
// 用params形式传参，直接在路由中传递（如：http://localhost:8080/console/ecs-rabbit/1/test ）
this.$router.push(`/ecs-rabbit/${page}/${this.keyword}`);

// 用query形式传参，作为参数传递（如：http://localhost:8080/console/ecs-rabbit?page=1&keyword=test ）
this.$router.push(`/ecs-rabbit?page=${page}&keyword=${this.keyword}`);
或
this.$router.push({
    path: '/ecs-rabbit',
    query: {
        page,
        keyword: this.keyword,
    },
});
```


### 2.2 用路由参数简/优化分页

分页是一个常见的需求，顺畅的操作顺序是：点击页码按钮 -> 路由响应变化 -> 列表页面更新。简单说：分页即一个新的页面URL，超链接跳转是最自然和间接的实现方式。

#### 1. 曲折的实现示例
在某些实现中，实现顺序可能是：点击页码按钮 -> 响应点击事件 -> 发送页码事件 -> watch页面事件 -> 列表页面更新。分页在URL上没有体现，代码逻辑不自然，和操作顺序不一致，然后一刷新没了😢。曲折的分页组件示例代码如下：
```html
<template>
  <nav>
    <ul class="pagination">
      <li
        v-for="page in pages"
        :key="page"
        :class="paginationClass(page)"
        @click.prevent="changePage(page)"
      >
        <a class="page-link" href v-text="page" />
      </li>
    </ul>
  </nav>
</template>
<script>
{
  methods: {
    changePage(goToPage) {
      if (goToPage === this.currentPage) return;
      this.$emit('update:currentPage', goToPage);
    },
  },
}
</script>
```

曲折的列表组件示例代码如下，`v-model:current-page`的使用是另一处坏味道：
```html
<template>
  <div>
    ......
    <Pagination v-model:current-page="currentPage" :pages="pages" />
    ......
  </div>
</template>
<script>
{
  watch: {
    currentPage(newValue) {
      this.fetchArticles();
    },
  },
}
</script>
```

#### 2. 简洁的实现示例
代码的直观性和自然性，是用户操作心智和代码实现心智的顺序匹配。

用路由参数简化后的分页组件实现示例如下，用`router-link`替代`a`，删除`changePage`方法，并得到了使用体验上的优化：
```html
<template>
  <nav>
    <ul class="pagination">
      <li
        v-for="page in pages"
        :key="page"
        :class="paginationClass(page)"
      >
        <router-link class="page-link" :to="`?page=${page}`">{{ page }}</router-link>
      </li>
    </ul>
  </nav>
</template>
```

简化后的列表组件实现代码如下（重复部分可以进一步优化，此处目的是为表达对`$route`监听的处理）：
```html
<template>
  <div>
    ......
    <Pagination :current-page="currentPage" :pages="pages" />
    ......
  </div>
</template>
<script>
{
  watch: {
    $route() {
      this.currentPage = parseInt(this.$route.query.page || '1', 10);
      this.fetchArticles();
    },
  },
  mounted() {
    this.currentPage = parseInt(this.$route.query.page || '1', 10);
    this.fetchArticles();
  },
}
</script>
```

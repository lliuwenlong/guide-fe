---
title: Vue路由经验记录
tags: [Vue, Router]
---

记录工作中遇到的有关router的问题。

## 1. `beforeRouteUpdate`触发问题

**触发条件：在当前路由改变，并且该组件被复用时调用**

### 原因
不同路由同对一个组件存在复用，如下例所示从路由1进入路由2时，不会触发`beforeRouteUpdate`方法。

### 解决
1. 让两者路由兼容，使其在同一个路由中匹配，避免上面的场景出现；

### Todo
有可能在别名路由中也会存在上面的问题，未测试。

### 其他
1. `beforeRouteUpdate`只能在绑定路由的组件中使用，其他组件中不会响应；

### 使用发生场景
1. 在列表页有分页以及在当前页需要进行查询搜索条件时，url路由配置时候需要注意

### 示例代码
```javascript
// 更改前
{
    // 路由1
    path: '',
    component: () => import(/* webpackChunkName: "ecs-seahare" */ './views/index.vue'),
},
{
    // 路由2
    path: ':page(\\d+)/:keyword?',
    component: () => import(/* webpackChunkName: "ecs-seahare" */ './views/index.vue'),
},

// 更改后
{
    // 注意路由之间会相互冲突
    path: ':page(\\d+)/:keyword?',
    component: () => import(/* webpackChunkName: "ecs-seahare" */ './views/index.vue'),
},
```

## 2. 被复用组件状态更新问题

### 表现
项目中的左侧菜单在部分页面跳转时，没有相应改变当前高亮项目，依旧是前一个页面的高亮状态

### 原因
`router-view` 内的页面跳转，会复用相同组件，当前菜单高亮方法 `currentHighlight` 在组件内 `created` 周期中调用，因为组件实例复用，组件的生命周期钩子不会再被调用，高亮方法没有执行。

### 分析尝试
`currentHighlight` 方法在适当时机调用是解决问题的关键，如果在组件的生命周期内调用方法会因为组件的复用而不被执行，因为是路由发生变化，因此尝试在组件内使用导航守卫提供的`beforeRouteEnter` 调用 `currentHighlight` 方法

``` javascript
beforeRouteEnter(to, from, next) {
    next((vm) => {
        vm.currentHighlight();
    });
},
```

但方法依然没有被调用执行，为了验证 `beforeRouteEnter` 可以使用的组件场景，进行了三种情况的测试；

* 在 `router.js` 内引用的组件，**可以使用**
* 在 `router.js` 内引用的组件的子组件，**无法使用！**
* 没有在 `router.js` 内引用的组件，**无法使用！**

因此，只有在 `router.js` 里直接引用的组件实例内可以使用 `beforeRouteEnter`等组件钩子方法，其他组件内都不能使用，菜单组件属于没有被 `router.js` 引用的组件，因此只能采用其他方式调用 `currentHighlight` 方法；

### 解决
在被复用组件内，使用 `watch` 观察 `$route` 的变化，触发 `currentHighlight` 方法，可以解决

```javascript
watch: {
        $route() {
            this.currentHighlight();
        },
    },
```

参考：[Vue Router官方说明](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#响应路由参数的变化)

## 3. 路由组件传参

常见路由传参：

```javascript
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}

const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User },
  ]
})
```

组件和路由高度耦合，使用id时必须由通过路由获取。

通过`props`解耦：

```javascript
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}

const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },
  ]
})
```

其它组件也可通过传入id的方式使用`User`组件。

## 4. 组件设置inheritAttrs为false

默认情况下父作用域的不被认作 props 的特性绑定（即没有被子组件继承）将会“回退”且作为普通的 HTML 特性应用在子组件的根元素上。

```javascript
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}

<User :id="0" :hahaha="'hahaha'" />
```

此时`hahaha`属性会显示在User组件的根元素上，为避免如此，设置`inheritAttrs`为`false`。如果想在子元素中获得这些额外属性，通过`$attr`获取。

## 5. router-link的生成LI标签

router-link默认渲染成带有正确链接的`<a>`标签，可以通过配置 tag 属性生成别的标签。

```javascript
<router-link tag="li" to="{name: 'foo'}">
  <a>/foo</a>
</router-link>
```
在这种情况下，`<a>`将作为真实的链接 (它会获得正确的 href 的)，而 "激活时的CSS类名" 则设置到外层的 LI。
## 6. 路由跳转后滚动条未回到顶部,可采用路由的一个方法解决

```javascript
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    return { x: 0, y: 0 };
  }
})
```


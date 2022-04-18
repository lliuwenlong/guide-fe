---
title: Mock经验记录
tags: [Vue, Mock]
---

记录工作中遇到的有关Mock的问题。

## 1. mockjs加载时机

在import mockjs之后再挂载；

#### 原因
最初在import所有业务代码之后，才import mockjs，（import本身也是一个Promise，所以涉及到加载的时机）导致异步请求时，先走原本请求不到的接口，已经显示请求失败了，才开始走mockjs；
调整后的代码

```
const app = new Vue({
    data: {
        isExpire: false,
    },
    router,
    render: h => h(App),
});
if (process.env.NODE_ENV === 'development') {
    import('./mock').then(() => {
        app.$mount('#app');
    });
} else {
    app.$mount('#app');
}
```

## 2. 设置参数错误（POST）导致mock失败

#### 原因
 大小写不匹配

```
...
const data = mock.mock('/zhiyuadminBack/manageusers/getPassUsers', 'post', {
    code: '0',
    result: 'success',
    msg: '成功',
...
```

追踪源码发现，必须为小写才能请求成功；因为mock的options会和request请求中的参数大小写不匹配导致无法send() xhr对象

```
 function find(options) {

    for (var sUrlType in MockXMLHttpRequest.Mock._mocked) {
        var item = MockXMLHttpRequest.Mock._mocked[sUrlType]
        if (
           // 注意⚠️  断点处 debugger;  原请求参数中被转为小写，而mock中如果为大写，无法match()
            (!item.rurl || match(item.rurl, options.url)) &&
            (!item.rtype || match(item.rtype, options.type.toLowerCase()))
        ) {
            // console.log('[mock]', options.url, '>', item.rurl)
            return item
        }
    }
```



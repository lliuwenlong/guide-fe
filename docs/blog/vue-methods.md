---
title: Vue Methods 中的this
tags: [Vue, JavaScript]
---
在使用vue时，通常在methods中定义方法。

methods中定义的方法，无法使用call, apply, 或者bind改变其 `this`指向。

```js
  mounted() {
    window.addEventListener('resize', this.resize)
    this.resize.call(window)
  },
  methods: {
    resize() {
      console.log(this) // output：always Vue Component
    }
  }
```

##### 原因

vue在初始化时，通过bind实现this强绑定，为了避免错误调用报错。

```js
function initMethods (vm: Component, methods: Object) {
  const props = vm.$options.props
  for (const key in methods) {
    // ...
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm)
  }
}
```

最后，看一下vue bind方法的兼容源码

```js
function polyfillBind (fn: Function, ctx: Object): Function {
  function boundFn (a) {
    const l = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
 
  boundFn._length = fn.length
  return boundFn
}
 
function nativeBind (fn: Function, ctx: Object): Function {
  return fn.bind(ctx)
}
 
export const bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind
```
在上面的方法中为什么要根据`arguments`来分别使用不同的方式实现?

>在MDN中，call是在ECMAScript第一版的规范里面规定的，而apply是在第三版的规范里面出现的。后来估计方便开发者处理参数引入了apply，但也导致apply的性能不如call


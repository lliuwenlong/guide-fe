---
title: Vue经验记录
tags: [Vue]
---

记录项目中遇到的有关Vue的问题，点滴积累，点滴优化——记录是知识的源头。

## 1. props的规范写法

### 原因
无论我们的组件props属性写成数组还是对象，vue都会帮我们把属性值转化为{type: val}的形式。

```javascript
function normalizeProps (options: Object, vm: ?Component) {
    const props = options.props
    if (!props) return
    const res = {}
    let i, val, name
    if (Array.isArray(props)) {
        i = props.length
        while (i--) {
            val = props[i]
            if (typeof val === 'string') {
                name = camelize(val)
                res[name] = { type: null }
            } else if (process.env.NODE_ENV !== 'production') {
                warn('props must be strings when using array syntax.')
            }
        }
    } else if (isPlainObject(props)) {
        for (const key in props) {
            val = props[key]
            name = camelize(key)
            res[name] = isPlainObject(val)
                ? val
                : { type: val }
        }
    } else if (process.env.NODE_ENV !== 'production') {
        warn(
            `Invalid value for option "props": expected an Array or an Object, ` +
            `but got ${toRawType(props)}.`,
            vm
        )
    }
    options.props = res
}
```

### 解决方法

将所有子组件的props属性写成如下形式,免去vue内部的转换，并可以校验我们的传值是否正确。

```javascript
props: {
    [propName]: {
        type: val,
        default: val,
        ...
    }
}
```

## 2. props默认值设置
``` javascript
props: {
    start: {
        type: Date,
        default: example,
    },
},
```

报错 `Invalid default value for prop "start": Props with type Object/Array must use a factory function to return the default value.`
// 数组／对象的默认值应当由一个工厂函数返回

props是date类型 不能直接赋值，因此改为

``` javascript
props: {
    start: {
        type: Date,
        default() {
            return example;
        },
    },
},
```

## 3. 模态框双向绑定处理
`v-modal`会在组件内对传入值进行突变。
采用`$emit`方式，通过事件抛给父组件处理，简写为`.sync`。
是否可以替代`v-modal`。

## 4. `$refs`

### 生效时机 结论
经过测试，`$refs`最早在`mounted`中生效。

### 使用注意
在使用$refs获取组件的时候，如果想获取一个组件列表，只能是在使用v-for组件上使用。如果是手动在两个及其以上组件上写相同的ref属性，那么在获取的时候只能获取到最后一个。

### 使用方法
可以在父组件里面使用this.$refs[xxx]获取子组件，调用子组件的方法/获取子组件的一些属性~。

## 5. vue项目中引入vue-awesome-swiper

#### 场景

在搜索框中进行学生报告的搜索，对应会显示该学生的学生报告。报告信息中有一项是学生课堂表现精彩瞬间的轮播图，由swiper实现。出现问题：刷新后第一个学生的精彩瞬间显示正常，接着搜索第二个学生的报告时，精彩瞬间的第一张图片是第一个学生的。

#### 验证
（1）查看后端返回数据是否正常：正常。
（2）watch做深度的监听，看返回的图片路径是否进行更换：更换。

#### 结论
vue-awesome-swiper 这个组件本身的问题

#### 解决方法
在每次切换学生报告的时候做swiper组件的重新渲染。用v-if做一个状态的判断。

## 6. v-model绑定的数据，数据更新后，并没有同步到视图上

``` javascript
// 结束端口号的校验，为空或小于起始端口号的时候使结束端口号的值等于起始端口号的值
startPort: [
    {
        required: true,
        type: 'number',
        validator: (rule, value, callback) => {
            if (!Number.isInteger(+this.form.startPort) || !Number.isInteger(+this.form.endPort)){
                callback(new Error('取值范围为1到65535的整数，结束端口不能小于起始端口'));
            }
            if (!this.form.endPort || this.form.endPort < this.form.startPort) {
                this.form.endPort = this.form.startPort;
            }
            callback();
        },
        trigger: 'blur',
    },
],
```

改为：

``` javascript
startPort: [
    {
        required: true,
        type: 'number',
        validator: (rule, value, callback) => {
            if (!Number.isInteger(+this.form.startPort) || !Number.isInteger(+this.form.endPort)){
                callback(new Error('取值范围为1到65535的整数，结束端口不能小于起始端口'));
            }
            if (!this.form.endPort || this.form.endPort < this.form.startPort) {
                this.$nextTick(() => {
                    this.form.endPort = this.form.startPort;
                });
            }
            callback();
        },
        trigger: 'blur',
    },
],
```

### nextTick用法：

在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

#### 问题描述：
对结束端口号进行判断：对结束端口号的值进行判断，在小于起始端口号的值或是为空时，校验要让结束端口号等于起始端口号的值。在结束端口号与起始端口号值相同时，删除结束端口号为空。再次校验时，在未加this.$nextTick()前，结束端口号的数据更新了，但是视图上的结束端口号的内容仍为空。

### 原因：

- Vue 异步执行 DOM 更新，Vue 实现响应式并不是数据发生变化之后 DOM 立即变化。在DOM更新前，watcher 会对比前后两个的数值是否发生变化，然后确定是否通知视图进行重新渲染，如果同一个 watcher 被多次触发，只会被推入到队列中一次。在我的这个问题中，就相当于watcher被触发了两次，第一次是 null ，接着又把结束端口号赋值为起始端口号。那么加入到队列中的就是赋值为起始端口号后的结束端口号。那么，现在删除前后的值就是一样的，watcher检测到的就是没有变化，不会通知视图更新，所以页面上没有看到效果。
- this.$nextTick()在 DOM 更新完成后就会调用。就是先会把 null 做一个 DOM 的更新，然后再执行 $nextTick 中赋值的语句，此时 watcher 就监听到前后不一样的值(null 和 结束端口号的新值)，然后通知 view 进行一个重新的渲染。

https://cn.vuejs.org/v2/guide/reactivity.html#异步更新队列

## 7. 深度watch

```javascript
watch: {
    inputValues: {
        handler: 'getData',
        immediate: true,
        deep: true,
    }
}
```

`immediate`属性可以使handler在组件创建时立即执行一次，但是要避免有数据依赖`created`和`mounted`。
`deep`属性可以使该监听器监听对象中属性的变化。

## 8. 竖直menu动态传入，设置默认选项不生效问题。

### 原因
### 解决方法
在mounted之后再传入menu数组，在nextTick中调用updateActiveName即可。

## 9. vue响应式监测变化注意事项
由于 Vue 会在初始化实例时对属性执行 getter/setter 转化过程，所以属性必须在 data 对象上存在才能让 Vue 转换它，这样才能让它是响应的。
可以使用 `Vue.set(object, key, value)` 方法将响应属性添加到嵌套的对象上
或可以使用 `vm.$set` 实例方法
向一个已有对象添加多个属性，可以创建一个新的对象，让它包含原对象的属性和新的属性：
`this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })`
// 代替 `Object.assign(this.someObject, { a: 1, b: 2 })`

#### 备注：
this.$set(array, index, val);
对于数组，是用splice方法实现的
this.$set(object, property, val);
对于该属性已经在对象上有定义的，那么只需要直接设置该属性的值即可，这将自动触发响应，因为已存在的属性是响应式的
对于给对象添加一个全新属性的，用dep.notify() 触发响应。这就是添加全新属性触发响应的原理。

## 10. key属性

也可以用于强制替换元素/组件而不是重复使用它。

### 例子：
```
<zoom-element-tool :zoom="zoom" :key="fragment.source" view-height="800px" />
```
当组件中的key属性发生变化的时候会完整地触发组件的生命周期钩子，所以需要reload时可以用key实现。

在使用v-for的过程中尽可能的不要使用index作为key值的绑定，根据情况可以避免出现动态增删组件时的重复使用组件。了解一下ES6的 Symbol~

## 11. 关于keep-alive

keep-alive是缓存的vnode, 在组件patch的过程中，组件的createComponent时候，如果检测到是keep-alive过的组件，并且有缓存的vnode的组件实例返回，则不会执行 mounted 等一系列的钩子方法。


## 12. PWA 本地安装应用名称设置
PWA 应用，在浏览器的地址栏中点击安装，即可将其安装到本地，成为一个“Native App”。其应用名称可以在`vue.config.js`中参考如下设置。
> 尽量第一次设置正确，应用名不会自动更新。

```javascript
module.exports = {
    pwa: {
        name: 'QEagles',
        themeColor: '#4DBA87',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
    },
};
```

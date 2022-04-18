---
title: 批注复杂组件拆分思考
tags: [React, vue]
---

马良批注组件拆分思考

## 痛点

批注业务要跑的快，就要拆的优雅，痛点在于业务逻辑的重用，在组件之间复用状态逻辑很困难

## 从远处看

#### Vue 3, "Reactive (Closure-based) OOP"

Vue 为组件挑选的语义是「对象」：Composition API 的setup 只会调用一次并返回一个对象合并到 Counter 组件上，这个对象与其成员全都是持久的引用，包括保存在 inc 闭包中的状态 count 也是持久的。渲染则是对组件上的template 域的具象化。 

Vue 核心的附加语义是「响应式（reactive）」：状态 count 是一个响应式对象，inc 进行状态更改的方式是对 count 直接修改，状态更改的结果是执行所有观察者（watcher）的逻辑，包括重渲染和执行副作用（watchEffect) ，都是基于这个语义纳入数据流。

Vue 运行时的核心 dependency tracking（依赖追踪），可以说起到了一箭双雕的作用：一方面使得这些语义对用户相对 implicit（隐式），依赖都是自动收集的，大大降低了用户的心智负担。另一方面对运行时又足够 explicit（显式），使得 Vue 的模板重渲染自动就可以做到非常精准与很高的性能。总结起来，Vue 在组件方面的心智模型仍然是「拥有数据与行为且自响应式的对象」


#### React, "Purely (Untyped and Monadic) FP"

React 为组件挑选的语义是「函数」，每次渲染都是对 Counter 这个函数的一次真实调用。每次 useState 都会执行并从 React 那取出当前的状态给 count，每次也都会创建一个新的 inc 函数（故其闭包中捕获的也是新的 count 值）。

React 核心的附加语义是「上下文（context），通俗得说就是某个外部的运行环境」：状态 count 每次都要从 React 上下文中取出，inc 对状态更改的方式是用 setCount 更新上下文里的内容，状态更改的结果是这个函数会被重新调用，调用时函数就会从新的上下文中获得新的状态、进行重渲染和安排上（schedule）副作用（useEffect) 。

React 在组件方面的心智模型是「副作用受上下文托管的纯函数」

#### 目前「大前端」社区里最主要的两条道路分歧：

- 可变 + 变更追踪。包括 Vue，Svelte，Angular，SwiftUI，对传统 Imperative Programming（包括 OOP）思路的一种增强，加入了 Reactivity

- 不可变 + 引用相等性。包括 React，Elm，Flutter，Jetpack Compose，传统 Functional Programming 在 UI 开发领域的发扬光大，只不过 React 是用一种比较「超越 JS 语言」的方式去实现得。







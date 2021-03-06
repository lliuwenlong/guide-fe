---
title: 拥抱Hooks
tags: [React, vue]
---


## Why Hooks(为什么) ？

#### 1. 在组件之间复用状态逻辑很难

没有提供将可复用性行为“附加”到组件的途径（例如，把组件连接到 store）。

我们解决此类问题的方案，比如 props 和 高阶组件。但是这类方案需要重新组织我们的组件结构，这可能会很麻烦，使代码难以理解。

我们的应用应用，由 providers，consumers，高阶组件，render props 等其他抽象层组成的组件会形成“嵌套地狱”。

我们需要为共享状态逻辑提供更好的原生途径


#### 2. 复杂组件变得难以理解

我们经常维护一些组件，组件起初很简单，但是逐渐会被状态逻辑和副作用充斥。每个生命周期常常包含一些不相关的逻辑。

例如，组件常常在不同生命周期处理同样的逻辑，还要在不同的生命周期中清除，相互关联且需要对照修改的代码被进行了拆分，而完全不相关的代码却在同一个方法中组合在一起。如此很容易产生 bug，并且导致逻辑不一致。

在多数情况下，不可能将组件拆分为更小的粒度，因为状态逻辑无处不在。这也给测试带来了一定挑战。同时，这也是很多人将 React 与状态管理库结合使用的原因之一。

与状态库结合，引入了了更多的抽象概念，需要你在不同的文件之间来回切换，使得复用变得更加困难。


前端的组件现在更多的不是为业务负责，而是为特殊的业务场景负责，业务属性隔离的越优雅，拆分的颗粒度越大，可复用性和可测试性越好


引入 Hooks 的概念，函数组件就具备了状态管理、生命周期管理等能力，几乎可以实现原来的 Class 组件具有的所有能力

我们可以使用 Hook 从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用。

Hook 使你在无需修改组件结构的情况下复用状态逻辑。 这使得在组件间或社区内共享 Hook 变得更便捷。

我们还可以使用 reducer 来管理组件的内部状态，使其更加可预测。

在 React 中，Hooks 就是把某个目标结果钩到某个可能会变化的数据源或者事件源上，那么当被钩到的数据或事件发生变化时，产生这个目标结果的代码会重新执行，产生更新后的结果



## How Hooks(怎么做) ？

从 Class 组件到函数组件的转变，不仅仅是一个写法的区别，更是整个开发思路的转变。

我们需要学会用 Hooks 的角度去思考问题

以绑定窗口大小的场景为例，

如果有多个组件需要在用户调整浏览器窗口大小时，重新调整布局

大家会怎么做？

在组件中去监听窗口大小的变化，以便在布局上做调整。那么我们就得在类组件的不同生命周期中做事件监听的绑定和解绑 ？？





## What Hooks(做什么) ?

vue2-example-hooks

vue3-example-hooks

react-example-hooks


## Strategy(渐进策略)

避免任何“大规模重写”，尤其是对于现有的、复杂的 class 组件。

具备FP特征的，可以开始“用 Hook 的方式思考”，在迭代中进化，抽离组件库
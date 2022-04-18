---
title: javascript异步总结
tags: [async, await, promise, 宏任务, 微任务]
---
## 一、记录工作中遇到的有关异步的问题。

### 1.Event Loop
宏任务（macro-task）: 同步代码，setTimeout 回调函数, setInterval 回调函数, setImmediate（浏览器暂时不支持，只有IE10支持，具体可见MDN）, I/O, UI rendering；
微任务（micro-task）: process.nextTick, Promise 回调函数，Object.observe，MutationObserver
其执行的顺序是这样的：

首先 JavaScript 引擎会执行一个宏任务，注意这个宏任务一般是指主干代码本身，也就是目前的同步代码
1.执行过程中如果遇到微任务，就把它添加到微任务任务队列中
2.宏任务执行完成后，立即执行当前微任务队列中的微任务，直到微任务队列被清空
3.微任务执行完成后，开始执行下一个宏任务
4.如此循环往复，直到宏任务和微任务被清空
参考链接
[事件循环](https://juejin.cn/post/6844903764202094606)
[setImmediate](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setImmediate)

### 2.javascript实现Sleep函数
```javascript
  function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two seconds later, showing sleep in a loop...');

  // Sleep in loop
  for (let i = 0; i < 5; i++) {
    if (i === 3)
      await sleep(2000);
    console.log(i);
  }
}

demo();
```
desscripion:
await 表达式会暂停当前 async function 的执行，等待 Promise 处理完成。若 Promise 正常处理(fulfilled)，其回调的resolve函数参数作为 await 表达式的值，继续执行 async function。

若 Promise 处理异常(rejected)，await 表达式会把 Promise 的异常原因抛出。

另外，如果 await 操作符后的表达式的值不是一个 Promise，则返回该值本身。
[code](https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep)
[扩展](https://juejin.cn/post/6857725993633710087)
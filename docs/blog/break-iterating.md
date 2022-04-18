---
title: JavaScript迭代及中断
tags: [JavaScript]
---
使用forEach时如何中断循环呢？

#### forEach不可中断

尝试return语句

```js
[1,2,3,4,5].forEach(item => {
  console.log(item);
  if(item === 2){
    return;
  }
})
```
--木有效果

Why? 

> 引自MDN  
> There is no way to stop or break a forEach() loop other than by throwing an exception. If you need such behavior, the forEach() method is the wrong tool.  
> 注意： 没有办法中止或者跳出 forEach() 循环，除了抛出一个异常。如果你需要这样，使用 forEach() 方法是错误的。
若你需要提前终止循环，你可以使用:
>- A simple for loop  
>- for...of / for...in  
>- Array.prototype.every()  
>- Array.prototype.some()  
>- Array.prototype.find()  
>- Array.prototype.findIndex()

forEach的实现方式用代码表示出来可以写成如下结构

```js
const arr = [1, 2, 3, 4, 5];
for (let i = 0; i < arr.length; i++) {
  (function(item) {
    console.log(item);
    if (item === 2) return;
  })(arr[i])
}
```
使用return语句相当于在每个自执行函数中结束当前函数

>Note:  
forEach does not wait for promises.

```js
let ratings = [5, 4, 5];
let sum = 0;

let sumFunction = async function(a, b) {
  return a + b
}

ratings.forEach(async function(rating) {
  sum = await sumFunction(sum, rating)
})

console.log(sum)
// Naively expected output: 14
// Actual output: 0
```


#### MDN推荐方式

```js
const arr = [1, 2, 3, 4, 5];

// for循环，break终止循环
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
  if (arr[i] === 2) break;
}

// for...of的循环，可以由break或return终止。
for (const i of arr) {
  console.log(i);
  if (i === 2) break;
}

// every在碰到return false的时候，中止循环。
arr.every(item => {
  console.log(item);
  if (item === 2) {
    return false
  } else {
    return true
  }
})

// some在碰到return ture的时候，中止循环。
arr.some(item => {
  console.log(item);
  if (item === 2) {
    return true
  } else {
    return false
  }
})
```


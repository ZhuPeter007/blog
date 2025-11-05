# 上下文、执行栈


上下文，说的很高端，但实际上就是函数运行环境,，执行上下文的类型分为三种：

+ 全局执行上下文：只有一个，浏览器中的全局对象就是 `window`对象，`this` 指向这个全局对象
+ 函数执行上下文：存在无数个，只有在函数被调用的时候才会被创建，每次调用函数都会创建一个新的执行上下文
+ `Eval `函数执行上下文： 指的是运行在 `eval `函数中的代码，很少用而且不建议使用

一般来说，我们只看前两个就够了，一个是`window`全局上下文，一个是`function`函数调用上下文



## 生命周期
上下文也是有生命周期的，创建阶段 → 执行阶段 → 回收阶段，下面拿个例子说明吧

```javascript
let a = 'Hello World!';

function first() {
  console.log('Inside first function');
  second();
  console.log('Again inside first function');
}

function second() {
  console.log('Inside second function');
}

first();

console.log('Inside Global Execution Context');
```

来吧，先是全局上下文的创建阶段，到底干了啥？**js引擎预解析：**

+ 首先，全局上下文把出现的变量`a`开辟空间，但是不能访问（暂时是`undefined`）
+ 定义的函数`first`、`second`也放到内存了，但是也一样，暂时不能调用
+ 在全局上下文出现的`first()`（13行）、`console.log()`（15行）算调用函数，暂不执行调用，再等等吧



接着是全局上下文的执行阶段，**js引擎逐行执行可执行代码：**

从上往下一行行执行：

第1行：先给`a`赋值，现在可以访问，并且不是`undefined`了

第13行：函数调用，`window.first()`，创建`first`函数上下文

执行`first`函数上下文：

第4行：打印

第5行：函数调用，`window.second()`，创建`second`函数上下文

执行`second`函数上下文：

第10行：打印

回收`second`函数上下文；

第6行：打印

回收`first`函数上下文；

第15行：打印



到这里全局上下文就结束了，开始回收全局上下文












# 浏览器的事件循环


事件循环，其实就是渲染主线程、消息队列、其他线程三个人物间的故事

## 三人物间基本运作
浏览器会在消息队列里存放很多的任务，渲染主线程会逐步的取这些任务，是同步的直接执行，是异步的撂倒其他线程

:::danger
切记，任何对Dom直接的操作，都会当作绘制任务加入消息队列！！（添加事件监听不算，因为没直接操作）

:::





很好理解，比如给一个按钮添加点击监听：

```javascript
button.addEventListener('click',()=>{
  text.innerHTML='666'
  sleep(1000)
})
```



那么点击按钮后，会发生什么？先思考思考

~~答案是：先睡一秒，然后text的内容变成666~~

为什么会这样？下面解释解释：

<details class="lake-collapse"><summary id="ue7ee02f5"><span class="ne-text">浏览器整个渲染流程</span></summary><p id="uf85f305e" class="ne-p"><br></p><p id="u4681f9c4" class="ne-p"><img src="/public/JSKBImgs/13/1.png" width="886" id="u62b6b77d" class="ne-image"></p><p id="ub4b975de" class="ne-p"><span class="ne-text">第一步，浏览器认出来这是一个按钮的监听函数，不能一直等，交给其他线程去，让其他线程去监听事件</span></p><p id="u80729cd2" class="ne-p"><span class="ne-text">第二步，鼠标点击被其他线程监听到了，好，把要执行的回调函数放到消息队列，渲染主线程读取这个回调函数</span></p><p id="u118684cc" class="ne-p"><span class="ne-text">第三步，渲染主线程一看，text.innerHTML='666'，对Dom直接进行操作了，那么再新建一个绘制任务，放到消息队列里去，接着渲染主线程再看，sleep(1000)，好，睡一秒，然后再去消息队列取任务。</span></p></details>




## 消息队列优先级


实际的浏览器中，不止一个队列，众多的队列完成更多复杂的任务，队列也有优先级，按照现代浏览器，我们接触最多的有三种：

| 名称 | 任务 | 优先级 | 示例 |
| --- | --- | --- | --- |
| 微队列 | 存放要最快执行的任务 | 高 | Promise.resolve.then(  ) |
| 交互队列 | 用户点击，滚鼠标，按键盘等待 | 中 | @click =  |
| 延时队列 | 存放计时器的回调函数 | 低 | setTimeout( ) |






好下面出一个题目：

```javascript
setTimeout(function(){
  console.log('2')
},1000)

sleep(1000)

console.log('1')
```



就说控制台打印的结果吧，是1，2还是2，1，为什么？

~~答案：1，2~~

为什么会这样？下面解释解释：

<details class="lake-collapse"><summary id="udf0a63cd"></summary><p id="u8ee265e8" class="ne-p"><img src="/public/JSKBImgs/13/2.png" width="1040" id="Lx3n9" class="ne-image"></p><p id="udc955b8b" class="ne-p"><span class="ne-text">第一步，浏览器开始读代码，遇到了一个定时器，不能傻傻的等啊，所以直接丢给其他进程，再往下读，好，睡1秒，再往下读，打印 1</span></p><p id="u00905459" class="ne-p"><span class="ne-text">第二步，其他线程等定时器，时间到了，把定时器的回调函数送到延时队列里去</span></p><p id="ua085c7f2" class="ne-p"><span class="ne-text">第三步，渲染主线程已经打印 1了，全局 Js 代码执行完了，没任务了，这时候的依次看哪个队列有任务，好，找到了延时队列，有回调函数的任务，执行，打印 2</span></p></details>




## 面试题
### 阐述一下 Js 的事件循环
事件循环又叫做消息循环，是浏览器渲染主线程的工作方式。在 chrome 的源码中，它开启一个不会结束的 for 循环，每次循环从消息队列中取出第一个任务执行，而其他线程只需要在合适的时候将任务加入到队列未尾即可。过去把消息队列简单分为宏队列和微队列，这种说法目前已无法满足复杂的浏览器环境，取而代之的是一种更加灵活多变的处理方式。

根据 W3C 官方的解释，每个任务有不同的类型，同类型的任务必须在同一个队列，不同的任务可以属于不同的队列。不同任务队列有不同的优先级，在一次事件循环中，由浏览器自行决定取哪一个队列的任务。但浏览器必须有一个微队列，微队列的任务一定具有最高的优先级，必须优先调度执行。



### 异步的联系
单线程是异步产生的原因

事件循环是异步实现的方式

这里要讲`async`和`await`：

+ 函数前面一旦加上了`async`，会默认返回函数类型的`promise`对象
+ 不管`await`后面跟着的是什么，`await`都会阻塞后面的代码



### 题目示例
直接上代码，说出控制台打印顺序：

```javascript
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}

async function async2() {
  console.log('async2')
}

console.log('script start')

setTimeout(function () {
  console.log('settimeout')
})

async1()

new Promise(function (resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})

console.log('script end')
```



**过程分析：**

1. 执行整段代码，遇到 `console.log('script start') `直接打印结果，输出 `script start`
2. 遇到定时器了，它是宏任务，先放着不执行
3. 遇到 `async1()`，执行 `async1` 函数，先打印` async1 start`，下面遇到`await`怎么办？先执行 `async2`，打印` async2`，然后阻塞下面代码（即加入微任务列表），跳出去执行同步代码
4. 跳到 `new Promise` 这里，直接执行，打印` promise1`，下面遇到 `.then()`，它是微任务，放到微任务列表等待执行
5. 最后一行直接打印` script end`，现在同步代码执行完了，开始执行微任务，即` await`下面的代码，打印` async1 end`
6. 继续执行下一个微任务，即执行 `then` 的回调，打印 `promise2`
7. 上一个宏任务所有事都做完了，开始下一个宏任务，就是定时器，打印 `settimeout`



**正确顺序：**

`<font style="background-color:rgba(27, 31, 35, 0.05);">script start</font>`

`<font style="background-color:rgba(27, 31, 35, 0.05);">async1 start</font>`

`<font style="background-color:rgba(27, 31, 35, 0.05);">async2</font>`

`<font style="background-color:rgba(27, 31, 35, 0.05);">promise1</font>`

`<font style="background-color:rgba(27, 31, 35, 0.05);">script end</font>`

`<font style="background-color:rgba(27, 31, 35, 0.05);">async1 end</font>`

`<font style="background-color:rgba(27, 31, 35, 0.05);">promise2</font>`

`<font style="background-color:rgba(27, 31, 35, 0.05);">settimeout</font>`


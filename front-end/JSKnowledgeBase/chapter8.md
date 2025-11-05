# 事件模型、事件委托


一般来说我们只用两种模型：

## 原始事件模型
在html语句中就能使用

```javascript
<input type="button" onclick="fun()">
```

或者在js文件中：

```javascript
var btn = document.getElementById('.btn');
btn.onclick = fun;
```

缺点：加载事件速度太快，可能导致DOM没渲染完就执行，导致事件加载不出来

事件冒泡（由`DOM` -> `document`）可以，但是不能事件捕捉（`document` -> `DOM`）

还有，同一个元素只能绑定一个事件，如果绑定多个，事件会进行覆盖

## 标准事件模型
这种用的场景很多，比如：

```javascript
addEventListener(eventType, handler, useCapture)
removeEventListener(eventType, handler, useCapture)
```

这就是获取元素后，给元素添加监听事件的写法

好处是同一元素能绑定多个事件

但是你是否好奇，为啥还有个参数`useCapture`？

这就不得不提标准事件类型的三个过程了：

+ **事件捕获阶段**：

事件从document一直<u>向下传播到目标元素的父元素,</u> 依次检查经过的节点是否绑定了事件监听函数

+ **事件处理阶段**：

事件<u>到达目标元素</u>, 触发目标元素的监听函数

+ **事件冒泡阶段**：

事件从<u>目标元素的父元素</u>冒泡到document, 依次检查经过的节点是否绑定了事件监听函数

其实添加监听事件函数中的参数`useCapture`，它是`boolen`类型，意思是是否在**事件捕获阶段直接**进行处理，不必等到**事件处理阶段**，不填的话默认`false`



举个例子：

```javascript
var btn = document.getElementById('.btn');
btn.addEventListener(‘click’, showMessage,true);
btn.removeEventListener(‘click’, showMessage);
```

猜猜点击元素`btn`后，会不会执行`showMessage`？

答案是不会执行`showMessage`

为什么不会呢，难道移除事件监听函数`removeEventListener`是摆设吗？

其实还真的是摆设，因为前文说了，参数`useCapture`默认是`false`，你在`removeEventListener`里没有传`useCapture`，默认为false了，这怎么行呢？

本来`addEventListener`，参数传了`true`，在事件捕获阶段就监听，监听到了就执行

而`removeEventListener`，参数没传，默认`false`，不在事件捕获阶段监听，执不执行都管不到啊



关于标准事件模型，还有个执行时机问题，如下：

```html
<div id='div'>
  <p id='p'>点我</p>
</div>
```

```javascript
var div = document.getElementById('div');
var p = document.getElementById('p');

function onClickFn (event) {
  var tagName = event.currentTarget.tagName;  // HTML标签名
  var phase = event.eventPhase;  // 事件阶段值，1是捕获阶段，2是处理阶段，3是冒泡阶段
  console.log(tagName, phase);
}

div.addEventListener('click', onClickFn, false);
p.addEventListener('click', onClickFn, false);
```

你说，当点击了p标签后，控制台怎么输出？

答案是：

P ，2

DIV ，3



我们分析一下，首先`div`和`p`俩元素都添加了事件监听，是标准的事件模型，同时参数`useCapture`都是`flase`，着意味着事件捕获阶段不立即执行函数

点击`p`标签后，按上文的3个阶段走：

+ **事件捕获阶段**：`document` -> `div` 

先到`div`这，一看`useCapture`是`false`，不执行，继续向下

再向下是目标元素元素，事件捕获阶段结束

+ **事件处理阶段**：`div` -> `p`

现在是到`p`元素这，执行`p`上绑定的事件函数`onClickFn`，控制台输出：P ，2

函数已执行，事件处理阶段结束

+ **事件冒泡阶段**：`div` -> `document`

向上冒泡到`div`，一看有绑定的有监听函数，立即执行，控制台输出：DIV ，3

`div`继续向上冒泡，有监听函数就执行，直到`document`

到`document`了，已经是终点了，事件冒泡结束



现在你已经知道了这整个流程，我们把当初的js两行代码变变，`useCapture`参数变成`true`：

```javascript
div.addEventListener('click', onClickFn, true);
p.addEventListener('click', onClickFn, true);
```

按照我们上面的思路，一步一步走，得出结果吧，过程这里不再展示

答案是：

DIV ，1

P ，2

`P`元素这为什么是2不是1，细想是能想明白的，因为事件捕获阶段只到`p`的父元素`div`这，再往下就到目标元素`p`元素了，是事件处理阶段



## 事件代理
这个也许你用过，但是并没有意识到自己在用

事件代理简单理解就是，本该a元素响应的事件，交给b元素去响应

场景示例：

```html
<ul id="list">
  <li> 1 </li>
  <li> 2 </li>
  <li> 3 </li>
  <li> 4 </li>
  ......
  <li> n </li>
</ul>
```

喏，一个列表，里面有n个子项，假设每个子项所需响应的事件函数都不一样，怎么办？



**麻烦的做法：**给每一个子项都去添加事件监听函数

```javascript
// 获取目标元素
const lis = document.getElementsByTagName("li")

// 添加事件监听
lis[0].onclick = function1(){}
lis[1].onclick = function2(){}
lis[2].onclick = function3(){}
...
```

子项少了还好，子项多了怎么办？而且每个子项都绑定事件监听，内存开销也大啊

更更致命的是，如果突然增加了子项，新的子项是不会自动绑定监听函数的



**更好的做法：**给`ul`添加事件监听，判断具体事件触发情况来找到子元素，执行相关操作

```javascript
// 给父层元素绑定事件
document.getElementById('list').addEventListener('click', function (e) {
  // 兼容性处理
  var event = e || window.event;
  var target = event.target || event.srcElement;
  // 判断是否匹配目标元素
  if (target.nodeName.toLocaleLowerCase === 'li') {
    //执行相关操作
    console.log('the content is: ', target.innerHTML);
  }
});
```

由于是给`ul`添加事件监听，所以不怕子项的增加或者减少


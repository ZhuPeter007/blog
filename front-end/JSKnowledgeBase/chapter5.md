# this指向问题、手搓new


js里有一个难点就是`this`关键字的理解了，相信在之前的原型、继承里你已经感受到了

绝大多数情况下，函数的调用方式决定了`this`的值，而且只能在函数内部使用，总指向调用它的对象

什么意思呢，举个例子：

```javascript
function baz() {
    console.log( this );
    bar();
}

function bar() {
    console.log( this );
    foo();
}

function foo() {
    console.log( this );
}

baz();
```

来吧，猜猜打印的结果吧

你是不是以为是：`_f_ baz``_f_ bar``_f_ foo`？

恭喜你错了，真正结果全是`window{...}`

前文已经说了，this不看你函数是怎么定义的，看的是谁来调用函数

当我们在js文件中写`函数()`，比如以上代码的3、8、15行，你会说这也没人调用函数啊，就是直接执行嘛

那你又错了，真实的js引擎是怎么运行的?

其实是在你看不见的地方，默默的使用`window`对象，你写的各种函数，各种属性，都在`window`上

第15行，你以为`baz()`，实际上是`window.baz()`，其他函数也是同理

这里就证明了：<u><font style="color:#DF2A3F;">this不看你函数是怎么定义的，看的是谁来调用函数</font></u>（本文第三遍说了）



那么以下代码你也就不会感到疑惑了：

```javascript
var name = 'Jenny';
function person() {
  return this.name;
}
console.log(person());  //Jenny
```

`name`在哪里？挂到`window`上了嘛

## new绑定
如果碰到了new关键字，那确实不一样了，不过还是那句话，”不看怎么写，只看谁来用“

```javascript
function test() {
  this.x = 1;
}

var obj = new test();
obj.x // 1
```

如果硬要从底层看的话，在第5行，`var obj = new test()`，`new`干了这几件事：

1. 使用`Object`建一个新的空对象`{}`
2. 改变原型链，新对象的`__proto__`指向构造函数的`prototype`
3. 执行构造函数，给新的空对象`{}`添加实例属性。（其实是执行`新的空对象.constructor()`，之前的原型那里你已经学过了，新的空对象的构造函数指向的是`test()`，等价于执行`新的空对象.test()`）

走完了整个流程，`this.x`中的属性`x`没出现在`window`上，而是`obj`上，所以我们会说`new`关键字改变了`this`的指向（~~<font style="color:#585A5A;">在我看来精扯几把蛋</font>~~）

### 手搓new
```javascript
function mynew(Func, ...args) {
  // 1.创建一个新对象
  const obj = {}
  // 2.新对象原型指向构造函数原型对象
  obj.__proto__ = Func.prototype
  // 3.将构建函数的this指向新对象
  let result = Func.apply(obj, args)
  // 4.根据返回值判断
  return result instanceof Object ? result : obj
}
```



## call()、apply()、bind()
这些家伙也能改变`this`指向，`call()`的用法在继承那里已经讲过了，这里不再讲了



`apply()`也类似：

`function.apply( thisArg , [参数1，参数2......])`

与`call()`相比基本不变，只是参数要使用`[]`包起来



`bind()`也没跑：

`function.bind( thisArg , 参数1，参数2......)`

不需要`[]`包裹参数，但是`bind()`不会像`call()`一样，立即就改变了`this`指向

而是会返回一个新`function`，这个新`function`已经把`this`指向改了



## ES6时代
说实话，`this`是个很烦人的东西，一会儿指向这个，一会指向那个，难以分清

看看人家`python`多精简，代码少，还容易看懂

估计是也有人很烦`this`，于是ES6有了箭头函数，它改变了之前我们的看法：“<u>不看怎么写，只看谁来用</u>”，跟我们反着来：<u><font style="color:#DF2A3F;">写在箭头函数里的</font></u>`this`<u><font style="color:#DF2A3F;">，不在看谁调用它了，它从被写下开始就确定了指向</font></u>

举个例子吧：

```javascript
const obj = {
  sayThis: () => {
    console.log(this);
  }
};

obj.sayThis(); // window
const globalSay = obj.sayThis;
globalSay(); // window
```

`obj.sayThis()`，是`obj`调用的，但是`sayThis()`是匿名函数，它里面的`this`不指向`obj`

那指向谁呢？是`window`，为何是它？

js引擎看到普通函数不会管什么，但是看到匿名函数，那得好好管管

一看，函数里出现`this`，而且没有定义这个`this`，没给他赋值，不行，直接用`window`给替换了



这招其实挺坑B的，比如监听事件：

```javascript
const button = document.getElementById('mngb');

button.addEventListener('click', ()=> {
  this.innerHTML = 'clicked button'
})
```

后果是什么？`window.innerHTML = 'clicked button'`！

这也是为什么我们都用匿名函数当监听函数的第二个参数了










# 原型这一块


在学原型的过程中，有三个东西是要牢记的：`__proto__`、`constructor`、`prototype`，先别管为什么，牢记两点：

1、`__proto__`和`constructor`属性是<font style="color:#DF2A3F;">对象所独有</font>的

2、`prototype`属性是<font style="color:#DF2A3F;">函数所独有</font>的，每个函数一个



## （1）先说说`__proto__`（读“dunder proto”）
它类似于链表中的指针，是<font style="color:#DF2A3F;">对象独有</font>的

**作用：用来找父对象的工具**

当访问一个对象的属性时，如果该对象内部不存在这个属性，那么就会去它的`__proto__`属性所指向的那个对象（父对象）里找，如果父对象也不存在这个属性，则继续往父对象的`__proto__`属性所指向的那个对象（爷对象）里找，如果还没找到，则继续往上找...…直到`object`（祖宗），接下来能不能在往上？能！`object`往上是`null`（原始人），再往上就已经不是“人”了，到此结束，`null`是所有原型链的终点。

正是因为`__proto__`，所以所有的对象都有`toString`方法，它来自于`object`



## （2）再讲讲`prototype`
别忘了它是<font style="color:#DF2A3F;">函数独有</font>的，函数是对象，但对象不一定是函数，它是从一个函数指向一个对象。它的含义是函数的原型

```javascript
function Foo(){...};
let fl = new Foo();

console.log(f1.__proto__ === Foo.prototype)  //true
```

以上代码已经说明了，子对象`f1`的`__proto__`，和它父对象（`Foo`函数）的`prototype`是一样的，从数据结构的角度去解读，那就是叶子节点`f1`的父指针（`__proto__`），指向了父节点`Foo`的共享仓库（`prototype`）

既然指向了共享仓库（`prototype`），那么叶子节点`f1`是可以拿到父亲`Foo`放在里面的一切东西，同样的，父节点也有自己的`__proto__`，指向爷节点的`prototype`，所有子节点能拿到爷节点的共享仓库....太爷，太太爷都是一样的...

`toString`也不是凭空产生的，普通的对象里根本没有写这个方法，为什么能凭空调用？原因是它已经被祖宗`object`贡献到了共享仓库，后代们只需要用`__proto__`一步步向上找，找到了`object`的`prototype`，就能用了

```javascript
function Foo(){};
Foo.prototype.a = 1;
var f1 = new Foo;
var f2 = new Foo;

console.log(Foo.prototype.a);//1
console.log(f1.a);//1
console.log(f2.a);//1
```

值得说的是，任何函数在创建的时候，其实会默认同时创建该函数的prototype对象，里面只放你贡献出来的属性或方法



## （3）再谈谈`constructor`（<font style="color:#DF2A3F;">功力浅薄，内容暂时不正确，待回头更改</font>）
`constructor`比较特殊，在谈它之前，先说说`Function()`吧



:::danger
以下内容可能存在错误纰漏

:::

众所周知，每个对象`__proto__`都连向父母的`prototype`，

但是`Functio`不是这样的，它自己的`__proto__`连向自己的`prototype`

`Function()`是js的基石之一，实际上所有函数（包括普通函数、箭头函数、类、`Object()`）本质上都是 Function构造函数的实例。

js引擎在创建对象时，并不会直接用`Function`，而是用`Function`的实例：`Object`，通过`Object`的构造方法`Object()`来创建对象



在前文的代码中：

```javascript
function Foo(){};
```

这里隐蔽的执行了一些操作：

1、js引擎利用`Object`创建了一个新对象`Foo`（内容是空的，物理上只是开辟了磁盘空间）

2、经过js引擎运作，`Foo`开始有自己的`<font style="color:rgb(0, 0, 0);">prototype</font>`<font style="color:rgb(0, 0, 0);">了，</font>这个`propotype`里面有一个东西是`constructor`构造函数，而且构造函数指向`Foo`（原因可以自己想想）

（因为`Foo`的实例也是对象，但是自身没有`constructor`，js引擎在创建`Foo`实例时只能用父亲`Foo.prototyp.constructor()`，也就是`Foo()`）

```javascript
console.log(Foo.prototype.constructor === Foo);//true
```

3、正式把`Foo`的`<font style="color:rgb(0, 0, 0);">__proto__</font>`挂到父亲`<font style="color:rgb(0, 0, 0);">Function</font>`的`<font style="color:rgb(0, 0, 0);">prototype</font>`上去，`Function`就是这个新对象的父亲

其他注意：`Function.prototype.__proto__ === Object.prototype`--->`true`





好的，现在到了这段代码：

```javascript
var f1 = new Foo;
```

<font style="color:rgb(0, 0, 0);">1、同样的，js引擎利用</font>`<font style="color:rgb(0, 0, 0);">Object</font>`<font style="color:rgb(0, 0, 0);">创建了一个新对象</font>`<font style="color:rgb(0, 0, 0);">f1</font>`

<font style="color:rgb(0, 0, 0);">2、把</font>`<font style="color:rgb(0, 0, 0);">f1</font>`<font style="color:rgb(0, 0, 0);">的</font>`<font style="color:rgb(0, 0, 0);">__proto__</font>`<font style="color:rgb(0, 0, 0);">挂到父亲</font>`<font style="color:rgb(0, 0, 0);">Foo</font>`<font style="color:rgb(0, 0, 0);">的</font>`<font style="color:rgb(0, 0, 0);">prototype</font>`<font style="color:rgb(0, 0, 0);">上</font>

<font style="color:rgb(0, 0, 0);">3、你，没有构造函数！对，就是你</font>`<font style="color:rgb(0, 0, 0);">f1</font>`<font style="color:rgb(0, 0, 0);">，因为你不是函数，只是个普通对象，没有</font>`<font style="color:rgb(0, 0, 0);">prototype</font>`<font style="color:rgb(0, 0, 0);">。但是天无绝人之路，</font>`<font style="color:rgb(0, 0, 0);">f1</font>`<font style="color:rgb(0, 0, 0);">虽然是普通对象，但是可利用</font>`<font style="color:rgb(0, 0, 0);">__proto__</font>`<font style="color:rgb(0, 0, 0);">找到父亲的</font>`<font style="color:rgb(0, 0, 0);">prototype</font>`<font style="color:rgb(0, 0, 0);">上，也许父亲的共享仓库里有构造方法，</font>`<font style="color:rgb(0, 0, 0);">f1</font>`<font style="color:rgb(0, 0, 0);">能调用一下</font>

:::danger
以上内容可能存在错误和纰漏

:::



<font style="color:rgba(17, 17, 51, 0.5);">当我们通过 </font>`<font style="color:rgba(17, 17, 51, 0.5);background-color:rgba(175, 184, 193, 0.2);">new 构造函数()</font>`<font style="color:rgba(17, 17, 51, 0.5);"> 创建一个对象实例时：</font>

1. <font style="color:rgba(17, 17, 51, 0.5);">JS 引擎会创建一个新对象。</font>
2. <font style="color:rgba(17, 17, 51, 0.5);">将这个新对象的</font><font style="color:rgba(17, 17, 51, 0.5);"> </font>`<font style="color:rgba(17, 17, 51, 0.5);background-color:rgba(175, 184, 193, 0.2);">__proto__</font>`<font style="color:rgba(17, 17, 51, 0.5);"> </font><font style="color:rgba(17, 17, 51, 0.5);">指向构造函数的</font><font style="color:rgba(17, 17, 51, 0.5);"> </font>`<font style="color:rgba(17, 17, 51, 0.5);background-color:rgba(175, 184, 193, 0.2);">prototype</font>`<font style="color:rgba(17, 17, 51, 0.5);">。</font>
3. <font style="color:rgba(17, 17, 51, 0.5);">执行构造函数，用</font><font style="color:rgba(17, 17, 51, 0.5);"> </font>`<font style="color:rgba(17, 17, 51, 0.5);background-color:rgba(175, 184, 193, 0.2);">this</font>`<font style="color:rgba(17, 17, 51, 0.5);"> </font><font style="color:rgba(17, 17, 51, 0.5);">给新对象添加实例属性。</font>

<font style="color:rgba(17, 17, 51, 0.5);">当我们访问一个对象的属性或方法时（比如 </font>`<font style="color:rgba(17, 17, 51, 0.5);background-color:rgba(175, 184, 193, 0.2);">obj.prop</font>`<font style="color:rgba(17, 17, 51, 0.5);">）：</font>

1. <font style="color:rgba(17, 17, 51, 0.5);">先在对象自身查找。</font>
2. <font style="color:rgba(17, 17, 51, 0.5);">找不到，则通过</font><font style="color:rgba(17, 17, 51, 0.5);"> </font>`<font style="color:rgba(17, 17, 51, 0.5);background-color:rgba(175, 184, 193, 0.2);">__proto__</font>`<font style="color:rgba(17, 17, 51, 0.5);"> </font><font style="color:rgba(17, 17, 51, 0.5);">去它的原型对象上找。</font>
3. <font style="color:rgba(17, 17, 51, 0.5);">还找不到，继续通过原型的</font><font style="color:rgba(17, 17, 51, 0.5);"> </font>`<font style="color:rgba(17, 17, 51, 0.5);background-color:rgba(175, 184, 193, 0.2);">__proto__</font>`<font style="color:rgba(17, 17, 51, 0.5);"> </font><font style="color:rgba(17, 17, 51, 0.5);">向上查找。</font>
4. <font style="color:rgba(17, 17, 51, 0.5);">一直找到 </font>`<font style="color:rgba(17, 17, 51, 0.5);background-color:rgba(175, 184, 193, 0.2);">Object.prototype</font>`<font style="color:rgba(17, 17, 51, 0.5);"> 为止（它的 </font>`<font style="color:rgba(17, 17, 51, 0.5);background-color:rgba(175, 184, 193, 0.2);">__proto__</font>`<font style="color:rgba(17, 17, 51, 0.5);"> 是 </font>`<font style="color:rgba(17, 17, 51, 0.5);background-color:rgba(175, 184, 193, 0.2);">null</font>`<font style="color:rgba(17, 17, 51, 0.5);">），这就形成了</font>**<font style="color:rgba(17, 17, 51, 0.5);">原型链</font>**<font style="color:rgba(17, 17, 51, 0.5);">。</font>

```javascript
p1 (实例)
  └── __proto__ → Person.prototype
                    └── __proto__ → Object.prototype
                                      └── __proto__ → null
```

## （4）重要
在引用类型object中，存在两个小类，一个是纯对象，另一个是函数对象

+ 其中纯对象继承至`Object`，`Object` 对象直接继承根源对象`null`
+ 而函数对象继承至`Function`

而`Object` 对象直接继承自 `Function `对象



详情看下面的代码：

```javascript
person1.__proto__ === Person.prototype1
```



```javascript
Person.__proto__ === Function.prototype1
```



```javascript
ObjectPerson.prototype.__proto__ === Object.prototype1
```



```javascript
Object.__proto__ === Function.prototype1
```



```javascript
Object.prototype.__proto__ === null
```



## 原型链
知道`__proto__`和`prototype`其实就理解原型链了，以下代码为例：

```javascript
function Parent() {
  this.name = 'parent1';
  this.play = [1, 2, 3]
}
function Child() {
  this.type = 'child2';
}
Child.prototype = new Parent(); //Child继承Parent
const son1 =new Child() //创建Child的实例
```

由下到上，步步寻找：

:::success
son1.__proto__  -->  Child.prototype

Child.prototype .__proto__  -->  Parent.prototype

Parent.prototype .__proto__  -->  Object. prototype

Object.prototype .__proto__  -->  null

:::




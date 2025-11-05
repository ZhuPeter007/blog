# 继承的实现（6种方式）


js通过原型和原型链来实现继承，但真要说所有的继承方法，那一共有以下六种：

+ <font style="color:rgb(44, 62, 80);">原型链继承</font>
+ <font style="color:rgb(44, 62, 80);">构造函数继承（借助 call）</font>
+ <font style="color:rgb(44, 62, 80);">组合继承</font>
+ <font style="color:rgb(44, 62, 80);">原型式继承</font>
+ <font style="color:rgb(44, 62, 80);">寄生式继承</font>
+ <font style="color:rgb(44, 62, 80);">寄生组合式继承</font>

下面一个一个讲：



## 1.原型链继承：
这种比较简单，子函数对象的`prototype`去跟父函数对象要

```javascript
function Parent() {
  this.name = 'parent1';
  this.play = [1, 2, 3]
}
function Child() {
  this.type = 'child2';
}
Child.prototype = new Parent();
console.log(new Child())
```

你可能会问为啥会用`Child.prototye =  new Parent()`，

而不是用`Child.prototype.__proto__ =  Parent.prototype`？

恭喜你，发现了盲点：

对于`Parent`，我们发现它有如下代码：

```javascript
this.name = 'parent1';
this.play = [1, 2, 3]
```

这里的`this`指向的是`Parent`的实例，并不是`Parent.prototype`，所以，`Parent.prototype`里是没有`name`和`play`属性的，`Child.prototype`自然也继承不到，更别提`Child`的实例了

这不是我们想要的

我们想要的是，`Parent`把自己的`name`和`play`属性贡献出来，放到`Parent.prototype`里，然后`Child`就能通过`Child.prototype.__proto__`指向`Parent.prototype`，拿到`name`和`play`



归根结底，是我们希望`Child`能拿到`Parent`的属性，那么用`Child.prototye =  new Parent()`就另辟蹊径，达到了目的。

`new Parent()`返回的是经过构造函数`Parent()`返回的新对象，通俗讲，它返回的是一个`匿名对象`：

```javascript
{
    name:"parent1",
    play:[1,2,3]
}
```

这个返回的结果直接赋值到了`Child.prototye`，你说妙不妙

而且更妙的是：`匿名对象`的父函数对象是`Parent`，也就是说，`匿名对象.__proto__ === Parent.prototype`

那么现在`Child.prototye`是这个状况：

```javascript
{
  name:'parent1',
  play:[1,2,3],
  __proto__:Parent.prototype
}
```

就完成了我们想要的：`Child.prototye.__proto__`正确指向`Parent.prototype`，且`Parent`的属性放到了`Child.prototye`里，我们能正常访问，`Child`也能正常继承给它的实例



不过`Child.prototye =  new Parent()`也有弊端：

```javascript
var s1 = new Child();
var s2 = new Child();
s1.play.push(4);
console.log(s1.play, s2.play); // [1,2,3,4]
```

这里`new Child()`，返回的东西是什么？返回的是这个匿名对象：

```javascript
{
  type:'child2',
  __proto__:Child.prototype
}
```

这就坏了，我们创建了两个实例`s1`和`s2`，他们原型链相同，内存空间是共享，我在`s1`身上整条原型链的某一个属性做了手脚，`s2`也跟着变了，这也不奇怪`console.log(s1.play, s2.play)`为何结果相同了。



## 2.构造函数继承：
先说说`call`，它能干什么？（`<font style="color:#1DC0C9;">call</font>`<font style="color:#1DC0C9;">的源码现在还用不着接触</font>）

`call`的作用是：调用一个函数，并改变这个函数内部的`this` 指向

用法：`function.call(thisArg, arg1, arg2, ...)`

+ `function`：你要调用的函数
+ `thisArg`：你希望函数内部的 this 指向谁
+ `arg1, arg2, ...`：你要传给函数的参数（`function`需要的参数）

现在你已经知道了怎么用，就直接看代码吧：

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.sayHello = function (){
    console.log('你好,我是',name)
  }
}

function Student(name, age, grade) {
  // 改变this指向，继承Person
  Person.call(this, name, age);
  this.grade = grade;
}

const s1 = new Student('小明', 20, '大三');
console.log(s1); // { name: '小明', age: 20, grade: '大三' }
s1.sayHello() // 你好,我是小明
```

下面重点看这里，`call`的作用图解：(实际上就是改变自己的构造函数，有点类似于java的`super()`)

![](/public/JSKBImgs/4/1.png)

![](/public/JSKBImgs/4/2.png)

不过，也有缺点，`call`只是改变了`this`指向，它没有把父函数对象`Person.prototype`的内容传给子对象`Student`，这回导致以后的子孙对象只知道父亲`Student`，而找不到爷爷`Person`，如下代码：

```javascript
//原代码中添加这个：
Person.prototype.getName = function () {
  return this.name;
}

const s2 = new Student('小明', 20, '大三');
console.log(s2.getName());  // 直接报错
```



## 3.组合继承
为了解决上面两种继承方式的缺点，现在把他们组合到一起，代码如下：

```javascript
function Parent () {
  this.name = 'Parent';
  this.play = [1, 2, 3];
}
function Child() {
  // 只继承Parent原始的属性
  Parent.call(this);
  this.type = 'Child';
}

//给Parent的原型上做点手脚
Parent.prototype.getName = function () {
  return this.name;
}

// 现在继承Parent.prototype上的属性
Child.prototype = new Parent();
// 注意：现在Child.prototype里的构造函数不是Child()，而是Parent()

// 手动挂上指向自己的构造函数Child()
Child.prototype.constructor = Child;


var s3 = new Child();
var s4 = new Child();
s3.play.push(4);
console.log(s3.play, s4.play);  // 不互相影响
console.log(s3.getName()); // 正常输出'parent'
```

这样看是不是完美了？

但是从性能上来讲，执行17行的`Child.prototype = new Parent();`

和执行第7行的`Parent.call(this);`

我们都在这个过程中使用了`Parent()`，<font style="color:#8A8F8D;">（在</font>`<font style="color:#8A8F8D;">call</font>`<font style="color:#8A8F8D;">的源码里确实使用了）</font>

也就是说，执行这两行代码消耗了两个`Parent()`构造出对象的内存

这里是可以优化的



## 4.原型式继承（了解，看看代码就行）
```javascript
let parent4 = {
  name: "parent4",
  friends: ["p1", "p2", "p3"],
  getName: function() {
    return this.name;
  }
};

let person4 = Object.create(parent4);
person4.name = "tom";
person4.friends.push("jerry");

let person5 = Object.create(parent4);
person5.friends.push("lucy");

console.log(person4.name); // tom
console.log(person4.name === person4.getName()); // true
console.log(person5.name); // parent4
console.log(person4.friends); // ["p1", "p2", "p3","jerry","lucy"]
console.log(person5.friends); // ["p1", "p2", "p3","jerry","lucy"]
```

看清楚了吗，我们使用了`Object.create()`，这是最纯粹，最直接的方式了

`Object.create(proto)` 的作用是：创建一个新对象，并把这个新对象的原型（`__proto__`）指向 `proto`

至于问题嘛，跟原型链继承一样，用的同一个地址，有篡改风险



## 5.寄生式继承（了解，看看代码就行）
为了解决上面原型式继承中，使用的原型是同一个地址的问题，我们先使用浅克隆的办法，例子如下：

```javascript
let parent5 = {
  name: "parent5",
  friends: ["p1", "p2", "p3"],
  getName: function() {
    return this.name;
  }
};

function clone(original) {
  let clone = Object.create(original);
  clone.getFriends = function() {
    return this.friends;
  };
  return clone;
}

let person5 = clone(parent5);

console.log(person5.getName()); // parent5
console.log(person5.getFriends()); // ["p1", "p2", "p3"]
```

问题上跟原型链继承、原型式继承一样，没有彻底解决，只是在性能上优化了一下



## 6.寄生组合式继承（最优）
集以上百家之长，补百家之短，过程中用到了浅克隆、`Object.create()`、`call`

看代码，一切尽在不言中

```javascript
function clone (parent, child) {
  // 这里改用 Object.create 就可以减少组合继承中多进行一次构造的过程
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}

function Parent6() {
  this.name = 'parent6';
  this.play = [1, 2, 3];
}
Parent6.prototype.getName = function () {
  return this.name;
}
function Child6() {
  Parent6.call(this);
  this.friends = 'child5';
}

clone(Parent6, Child6);

Child6.prototype.getFriends = function () {
  return this.friends;
}

let person6 = new Child6();
console.log(person6); //{friends:"child5",name:"child5",play:[1,2,3],__proto__:Parent6}
console.log(person6.getName()); // parent6
console.log(person6.getFriends()); // child5
```

## 总结
讲了这么多，就行想让你知道继承的底层原理，在真正的js引擎里，使用的是最后一种：寄生组合式继承

不过我们不需要手搓继承了，ES6已经给你准备好了，就是`extends`关键字（需要用`class`）

看看怎么用的：

```javascript
class Person {
  constructor(name) {
    this.name = name
  }
  // 原型方法
  // 即 Person.prototype.getName = function() { }
  // 下面可以简写为 getName() {...}
  getName = function () {
    console.log('Person:', this.name)
  }
}
class Gamer extends Person {
  constructor(name, age) {
    // 子类中存在构造函数，则需要在使用“this”之前首先调用 super()。
    super(name)
    this.age = age
  }
}
const asuna = new Gamer('Asuna', 20)
asuna.getName() // 成功访问到父类的方法
```

和java类似，都有`constructor()`、`super()`，使用方便




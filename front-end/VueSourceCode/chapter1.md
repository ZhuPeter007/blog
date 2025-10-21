# 第一章 数据驱动

Vue最大的特点就不必说了，响应式数据嘛，在Vue2中，只要data中的数据发生变化，那在渲染的页面中也会发生变化，这里我们抽象一些：

**<font style="color:#FF5733;">UI =  render ( state ) </font>**

我们能看到，状态`state`是输入，页面`UI`是输出，状态输入一旦变化了，页面输出也随之而变化。我们把这种特性称之为数据驱动视图。

我们的Vue，在这个公式中扮演了`render()`这个角色，现在我们的问题在于：Vue是怎么知道`state`变化的？

## 一、让数据变透明，可观测
这里就引出了一个东西：`Object.defineProperty`

薛定谔的猫大家都知道，非观测状态下这该死的猫是即死又活的，那保存在浏览器中的内存数据呢？

其实也是不确定的，因为我们看不见，就像是薛定谔那该死的套在黑盒子里的猫

但是有了`Object.defineProperty`就不一样了，有了它我们就能把“黑盒子”换成“透明盒子”，数据什么时候改了，什么时候读了都看得一清二楚



多说无益，上代码：

```javascript
let car = {
  'brand':'BMW',
  'price':3000
}
// 定义一辆车，BMW牌，卖3000块
```



现在出来一个新问题，在某不知名地方，执行了这个代码：`car.price=100`，对此我们并不知情

而我们不仅想要知情，还要对它阻拦，怎么做呢？



```javascript
let car = {}
let val = 3000

Object.defineProperty(car, 'price', {
  enumerable: true,
  configurable: true,
  get(){
    console.log('price属性被读取了')
    return val
  },
  set(newVal){
    console.log('price属性被修改了')
    val = newVal
  }
})
```



我们使用了`Object.defineProperty`，往`car`上添加了一个“被做了手脚”的`price`属性

现在我们再浏览器中调试一下：

![](https://cdn.nlark.com/yuque/0/2025/png/42807293/1758897704980-e4252438-e6b0-43e9-ade7-92d8d8eb0ef1.png)

果然，数据变动的一清二楚，从之前的“黑盒子”变成了“透明盒子”



现在，我们该考虑手写一个工具了，把数据的“黑盒子”变成“透明盒子”，让数据真正成为可观测状态

直接上源码：

```javascript
// 源码位置：src/core/observer/index.js

export class Observer {
  constructor (value) {
    this.value = value
    // 给value新增一个__ob__属性，值为该value的Observer实例
    // 相当于为value打上标记，表示它已经被转化成响应式了，避免重复操作
    def(value,'__ob__',this)

    // 当value为数组时的逻辑，源码里有，这里不再展示
    if (Array.isArray(value)) {
      // ...
    }
    else {
      this.walk(value)
    }
  }

  walk (obj: Object) {
    // 获取obj中所有的键名，keys现在是个数组
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      //都送到defineReactive函数里去
      defineReactive(obj, keys[i])
    }
  }
}
/**
 * 使一个对象转化成可观测对象
 * @param { Object } obj 对象
 * @param { String } key 对象的key
 * @param { Any } val 对象的某个key的值（真正源码里有，现在暂时用不着）
 */
function defineReactive (obj,key,val) {
  // 如果只传了obj和key，那么val = obj[key]
  if (arguments.length === 2) {
    val = obj[key]
  }
  // 不是原始类型，递归走你
  if(typeof val === 'object'){
      new Observer(val)
  }
  // 是原始类型，开始对其变成可观测状态
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    
    get(){
      console.log(`${key}属性被读取了`);
      return val;
    },
    
    set(newVal){
      if(val === newVal){
          return
      }
      console.log(`${key}属性被修改了`);
      val = newVal;
    }
  })
}
```



这样写了`Observer`类后，我们只需new一个对象就行了（<font style="color:#8A8F8D;">提示：构造函数传参必须是对象</font>）

```javascript
let car = new Observer({
  'brand':'BMW',
  'price':3000
})
```



是不是轻轻松松？但是问题又来了，我们能观测数据了，但是要怎么通知页面呢？

页面中使用了这些数据，总不能说随意一个数据变动了，整个页面都去刷新吧

我们想要的是，<u>页面中谁用了我这个数据，谁去刷新</u>，这才是合适的



## 二、谁在用我，收集依赖
那么合适的做法是，给每一个数据准备一个数组，谁用到了数据，谁就加到数组里去

当数据变化时，按照数组去一个个通知他们：依赖的数据变了，要刷新了

好，就这样，现在只有两个问题了，**何时收集依赖**？**何时通知依赖更新**？

很简单吗，前文里我们给数据加了`getter`和`seeter`，他们一定会用到`getter`，那就这时候把他们加入数组

同样的，不管他们用不用`setter`，只要触发了`setter`，就通知他们刷新



好了，现在问题都通了，只需要弄一个依赖管理工具，在`getter`和`setter`执行它不同的操作就行了

下面直接上代码：

```javascript
// 源码位置：src/core/observer/dep.js

export default class Dep {
  constructor () {
    this.subs = []
  }

   // 添加一个依赖
  depend () {
    // 暂时先记住这个window.target，到了后文你就知道为什么要有这个东西了
    if (window.target) {
      this.subs.push(window.target)
    }
  }
  // 删除一个依赖
  removeSub (sub) {
    remove(this.subs, sub)
  }
 
  // 通知所有依赖更新
  notify () {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// 删除数组中指定的数据依赖
export function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
```



嗯不错，现在我们有依赖管理工具`Dep`这个类了，我们再对前文的代码里改改：

```javascript
//...Observer类不变...

function defineReactive (obj,key,val) {
  // 如果只传了obj和key，那么val = obj[key]
  if (arguments.length === 2) {
    val = obj[key]
  }
  // 不是原始类型，递归走你
  if(typeof val === 'object'){
      new Observer(val)
  }

  // 是原始类型，开始对其变成可观测状态
  
  // 先实例化一个依赖管理器，生成一个依赖管理数组dep
  const dep = new Dep()
  
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    
    get(){
      console.log(`${key}属性被读取了`);
      // 在getter中收集依赖
      dep.depend()
      return val;
    },
    
    set(newVal){
      if(val === newVal){
          return
      }
      console.log(`${key}属性被修改了`);
      val = newVal;
      // 在setter中通知依赖更新
      dep.notify()   
    }
  })
}
```

完美，成功的在`getter`中完成依赖收集，在`seeter`中完成依赖刷新

那么，问题到这里依然没有结束，前文中为了好理解，我们以数据的视角出发，解决了“谁在用我”

我们换个视角，探讨下使用了数据的“我”是谁



## 三、依赖的真相
也许你会说，”我“就是页面中的`DOM`元素，可事实并非如此

真实的vue源码里，有`Watcher`这个类和`parsePath`这个柯里化函数

而`Watcher`的实例，就是“我”了

数据变化了，先通知`Watcher`实例，由`Watcher`实例再去通知真正的视图层

我们先看看对`Watcher`和`parsePath`的代码定义吧：

```javascript
export default class Watcher {
  constructor (vm,expOrFn,cb) {
    this.vm = vm;
    this.cb = cb;
    this.getter = parsePath(expOrFn)
    this.value = this.get()
  }
  get () {
    window.target = this;
    const vm = this.vm
    let value = this.getter.call(vm, vm)
    window.target = undefined;
    return value
  }
  update () {
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }
}

/**
 * Parse simple path.
 * 把一个形如'data.a.b.c'的字符串路径所表示的值，从真实的data对象中取出来
 * 例如：
 * data = {a:{b:{c:2}}}
 * parsePath('a.b.c')(data)  // 2
 */
const bailRE = /[^\w.$]/  // 这个正则是剔除无效字符，只留数字,字母,下划线,空格,小数点,和$
export function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
```

这四十行代码是不容易懂的，不过我可以帮你带入一下：

首先创建`Watcher`实例，这个阶段里，执行`Watcher`的构造函数

（1）

期间执行`this.getter = parsePath(expOrFn)`，第一次用到了函数`parsePath`，`parsePath`的注释很清楚了，但是它是柯里化函数，for循环中的`segments`参数被确定了，然后返回这个参数确定的for循环函数<font style="color:#8A8F8D;">（35~40行，暂且称他为二级函数）</font>

这个二级参数的作用，按键值对的思想，是根据`obj`的连续键，返回对应值，举个例子：

![](https://cdn.nlark.com/yuque/0/2025/png/42807293/1759071410352-be23a87d-bc21-489d-9135-8333e5a77c7e.png)

有上面这个样的数据，我把`data.family.father.name`当参数，放到`parsePath()`里，现在`segments`参数内容是这样的：`["data","family","father","name"]`，而包含整个`segments`的二级函数

返回给了谁呢？再去构造函数里看，哦，返回给了`this.getter`，就是`Watcher`实例的`getter`属性，那么只要`实例.getter(data)`就得到了`"张三"`<font style="color:#8A8F8D;">（前提是data在此期间连续键没变，值变了不要紧）</font>

（2）

期间再去执行` this.value = this.get()`，`get()`在哪里？哦，原来就在`Watcher`类里，注意第九行`window.target = this`，<u><font style="color:#DF2A3F;">这是伏笔</font></u>

再往下`let value = this.getter.call(vm, vm)`，又用到了`getter`函数，而且还用`call`改变了`this`指向（`this`替换成`vm`）

不过很显然，现在的`getter`里没有`this`，但终究是调用了`getter()`，传参还是`vm`

那好吧，执行`this.getter(vm)`，这里陷入到了`getter`的for循环里，好在一切顺利，执行了for循环中的`obj = obj[segments[i]]`

等等，执行了什么？`obj[segments[i]]`？？

还记得之前数据可观测的问题吗，如果`obj`是个可观测数据呢？这会触发`obj`的`get`函数啊

就这样，`obj`的`get`函数被“不小心”触发了，回顾回顾之前的get函数：

```javascript
    get(){
      console.log(`${key}属性被读取了`);
      // 在getter中收集依赖
      dep.depend()
      return val;
    },
```

好好好，真是波折，又闯到了`dep.depend()`里面去了，回顾回顾`depend()`函数：

```javascript
   // 添加一个依赖
  depend () {
    if (window.target) {
      this.subs.push(window.target)
    }
  }
```

终于，前面的伏笔到这里起作用了

`Watcher`实例的`get()`中是这样的：`window.target = this`

而现在呢？`this.subs.push(window.target)`

（3）

那么总结一下：经过这么波折的路程，最终是`Watcher`实例进入了依赖数组`subs`中，这意味着什么？

意味着依赖的真相就是`Watcher`实例，前文‘“我”是谁’中的“我”，就是`Watcher`实例

每当改动数据时，会调用数据的`set`函数，而`set`函数里又会执行`dep.notify()`，会遍历`sub`数组中的`Watcher`实例， 可以用下图总结：

![](https://cdn.nlark.com/yuque/0/2025/png/42807293/1759235468889-0fe27368-7f28-4dcc-97e4-73085b2cfc8d.png)



## 四、不足的地方
以上方案可以实现对<u>对象类型</u>的数据，进行一整套“可观测”服务

但是，仍有不完美的地方，有以下两点：

1、删去对象的一个属性，怎么办？

2、增加一个对象的属性，怎么办？

无论增加还是减少，我们是观测不到的

当然，Vue也注意到了这一点，为了解决这一问题，Vue增加了两个全局API:`Vue.set`和`Vue.delete`

这些都是后话了，目前而言











<update />

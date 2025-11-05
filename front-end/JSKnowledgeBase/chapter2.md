# 深浅拷贝、闭包、作用域链

## 深浅拷贝
对于深浅拷贝，主要用在对象和数组身上，记住下面一句话就行了

`浅拷贝拷地址，共享内存，原数据动了，浅拷贝会动`

`深拷贝拷数据，开辟内存，原数据动了，深拷贝不会动`

当然这里也有坑，前文说到，js两大数据类型：`基本（原始）数据类型`，`引用数据类型`

有一个方法是`typeof(参数)`，返回参数的类型，但是它并不可靠，现仍存在著名的两个bug：

```javascript
typeof(null)  //"object"，不是null
typeof(函数名) //"function"，不是object
```



知道了这两个历史bug，那么就有一个十分经典的手搓深度拷贝的递归函数：

```javascript
//obj是要拷贝的目标对象，至于hash，可以理解为一个键值对的缓存容器
function deepClone(obj, hash = new WeakMap()) {
  //处理历史残留typeof(null)的bug
  if (obj === null) return obj; 
  //处理复杂对象--Date对象
  if (obj instanceof Date) return new Date(obj);
  //处理复杂对象--正则对象
  if (obj instanceof RegExp) return new RegExp(obj);
  //处理历史残留typeof(函数名)的bug，还处理了简单数据类型
  if (typeof obj !== "object") return obj;

  //好了，到了这一步，把简单数据类型和一些特殊的object对象处理完了，接着处理正常object对象

  //这个对象在hash键值对容器里存的有，就直接返回，免得再此创建
  if (hash.get(obj)) return hash.get(obj);
  //走到这，说明hash没有这个键值对，使用obj的构造方法，obj是数组，咱就是数组，obj是Set，咱就是Set
  let cloneObj = new obj.constructor();
  //那就存入hash键值对容器，键是obj，值是cloneObj
  hash.set(obj, cloneObj);

  //好了，能走到这里，足以说明此时的obj是个hash容器里没出现过的object对象，用for循环拆解其属性
  for (let key in obj) {
    //js中是有继承这一说的，这里我不要父类祖类的属性，只要自己的属性
    if (obj.hasOwnProperty(key)) {
      //调用自身，等待deepClone返回咱的复制体，完成本层的object对象拷贝
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  //返回上层的object对象拷贝
  return cloneObj;
}
```

## 闭包
这里是不易读懂的，尤其是柯里化函数，有点不像人了，举个例子：求立方体体积

```javascript
//上过小学的都知道，求体积需要长(length)宽(width)高(height)三个量

// 一般函数写法：
function getVolume(length,width,height){
  return length*width*height
}
//用法
getVolume(10,20,30) //6000


//柯里化函数写法：
function getVolume(length) {
  return function(width) {
    return function(height) {
      return length * width * height
    }
  }
}
//用法：
getVolume(10)(20)(30)

//箭头函数柯里化写法：
const getVolume = length => width => height => length * width * height
//用法：
getVolume(10)(20)(30)
```

所谓柯里化的原理和思想，是分步拆解参数完成，上面的例子里能看到，要完成计算体积的任务，需要三个参数，而柯里化求体积函数每步只传递一个参数，返回一个函数（返回的函数里已被填充了传递的参数）

使用再看`getVolume(10)(20)(30)`，其实过程是这样的

1.`getVolume(10)`-->`10`被当作参数`length`-->返回的是：

```javascript
function(width) {
  return function(height) {
    return 10 * width * height
  }
}
```

2.`getVolume(10)(20)`-->`20`被当作参数`width`-->返回的是：

```javascript
function(height) {
  return 10 * 20 * height
}
```

3.`getVolume(10)(20)(30)`-->`30`被当作参数`height`-->返回的是：

```javascript
10 * 20 * 30
```

## 作用域链
这个不必多说了，能自信的说出打印结果，并粘到浏览器控制台上一看，是对的，就直接过吧

```javascript
var a = 2;
function foo(){
  console.log(a)
}
function bar(){
  var a = 3;
  foo();
}
bar()
```

所谓作用域链，就是Javascript引擎会尝试在当前作用域下去寻找该变量，如果没找到，再到它的上层作用域寻找，以此类推直到找到该变量或是已经到了全局作用域，这个过程像一个链子一样一环一环的


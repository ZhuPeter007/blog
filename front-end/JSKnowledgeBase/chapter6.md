# typeof 与 instanceof


已经学习过了数据类型、也知道了对象、原型链，现在可以接触`typeof`和`instanceof`这两个关键字了

## typeof
用法：`typeof 变量`，返回变量的基本类型

功能：这个关键字会返回变量的确切类型，如下：

```javascript
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
typeof null // 'object'
typeof [] // 'object'
typeof {} // 'object'
typeof console // 'object'
typeof console.log // 'function'
```

其中`typeof null`为`object`的著名bug就不再说了，如果想判断是否为null，直接用`===null`

而如果想判断一个变量是否存在，可以用`if(typeof 变量 !== undefined)`，而不是`if(变量)`

当然还有一个简单的办法，就是`if(变量||'')`



## instanceof
用法：`<font style="color:#74B602;">object</font> <font style="color:#F38F39;">instanceof</font> <font style="color:#01B2BC;">constructor</font>`，返回布尔值`true`/`false`

+ 其中`<font style="color:#74B602;">object</font>`是实例对象
+ 其中`<font style="color:#01B2BC;">constructor</font>`是构造函数

功能：检测`<font style="color:#01B2BC;">constructor</font>`的 `prototype` 属性是否出现在`<font style="color:#74B602;">object</font>`的原型链上，使用示例：

```javascript
let Car = function() {}

let benz = new Car()
benz instanceof Car // true

let car = new String('xxx')
car instanceof String // true

let str = 'xxx'
str instanceof String // false
```



至于原理，代码在这里先贴出来：

```javascript
//left:上述的object参数
//right:上述的constructor参数

function myInstanceof(left, right) {
  // 这里先用typeof来判断基础数据类型，如果是，直接返回false
  if(typeof left !== 'object' || left === null) return false;
  // getProtypeOf是Object对象自带的API，能够拿到参数的原型对象
  let proto = Object.getPrototypeOf(left);
  while(true) {                  
    if(proto === null) return false;
    if(proto === right.prototype) return true;//找到相同原型对象，返回true
    proto = Object.getPrototypeof(proto);
  }
}
```

其实就顺着`object`的原型链找到和`constructor`相同的原型对象而已



一般场景下，`typeof` 与 `instanceof`就够我们用了，特殊情况下，缺点如下：

`typeof`：

只能简单但判断引用类型是`object`还是`function`，其他的判断不了（如正则、时间、数组等）

`instanceof`：

只返回`true`/`false`，不会返回应用类型的具体类型，且判断不了简单数据类型



有没有结合`typeof` 和`instanceof`为一体的方法呢？有的，就是需要手搓：

```javascript
function getType(obj){
  let type  = typeof obj;
  if (type !== "object") {    // 先进行typeof判断，如果是基础数据类型，直接返回
    return type;
  }
  // 对于typeof返回结果是object的，再进行如下的判断，正则返回结果
  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1'); 
}
```

使用如下：

```javascript
getType([])     // "Array" typeof []是object，因此toString返回
getType('123')  // "string" typeof 直接返回
getType(window) // "Window" toString返回
getType(null)   // "Null"首字母大写，typeof null是object，需toString来判断
getType(undefined)   // "undefined" typeof 直接返回
getType()            // "undefined" typeof 直接返回
getType(function(){}) // "function" typeof能判断，因此首字母小写
getType(/123/g)      //"RegExp" toString返回
```


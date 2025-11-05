# 第一章 数据类型

## 有什么类型
JavaScript中的数据类型如下：

![](/public/JSKBImgs/1/1.png)

其中`简单类型`是栈内存，值引用；`引用类型`是堆内存，地址引用。

这当然没什么好说的，值得说的是在number类型中的特殊值：`Infinity`、`-Infinity`、`NaN`

如果问引用数据类型有什么，`对象`、`数组`、`Set`、`Map`、`正则`、`Date`、`函数`、`promise`都是引用数据类型

要记的话，就一句话：（7个原始，n个引用）

## 类型转换
### 先看number之间的转换：
![](/public/JSKBImgs/1/2.png)

还有一个小点，`console.log(0.3-0.2)`，它的运行结果并不是0.1，而是0.099998，原因是`number`里又分`int`和`float`这种小的类型

还有一些小坑：

`Number(参数)`这种方法，会尝试把一整个参数转成`Number`类型，成功返回`Number`，失败返回`NaN`



### 再看看字符串的转换：
任何类型与字符串用“+”连接，最终都是字符串

```javascript
let str1='青天有月来几时'+123
let str2='我今停杯一问之'
str3=str1+str2
console.log(str3);
```

结果是 `"青天有月来几时123我今停杯一问之"`





### 看看布尔值转换：
```javascript
Boolean(undefined) // false
Boolean(null) // false
Boolean(0) // false
Boolean(NaN) // false
Boolean('') // false
Boolean({}) // true
Boolean([]) // true
Boolean(new Boolean(false)) // true
```

这里有没有坑呢？其实细心点就发现了，布尔值转换后为true的那几个，本质上是引用类型object，也就是对象，对象就不可能是空，不为空就是true了



### 对于`===`和`==`的比较：
三等于除了比较内容，还比较数据类型，双等于会隐式类型转换，所以只比较内容

#### 1、基本数据类型
这有一个很好的例子：

```javascript
'55'==55
true==1
true=='牛'
undefined == null
' \t\r\n' == 0
```

结果一律为`true`



但是问

```javascript
false == null
false == undefined
undefined ===(三等于) null
//含有NaN的任何比较（包括NaN==NaN，NaN!=NaN，NaN===NaN，NaN!==NaN）
```

结果一律为`false`

#### 2、引用数据类型obj
无论双等于还是三等于，也无论是数组、对象、函数、集合，比较的是地址，不是值

```javascript
const obj1 = { name: "Alice" };
const obj2 = { name: "Alice" };
const obj3 = obj1;

console.log(obj1 === obj2); // false（不同内存地址）
console.log(obj1 === obj3); // true（同一内存地址）
```

### 对于算术运算时的隐式转换：
先看看具体例子吧:

```javascript
'5' - '2' // 3
'5' * '2' // 10
true - 1  // 0
false - 1 // -1
'1' - 1   // 0
'5' * []    // 0
false / '5' // 0
'abc' - 1   // NaN
null + 1 // 1
undefined + 1 // NaN
```

这是有迹可循的，加减乘除运算遵循以下规则：

#### 1.尝试把运算符两侧的变量变成Number类型，此过程中：
`true -> 1`

`false -> 0`

`null  -> 0`

`undefined = NaN`

`空字符串"" -> 0`

`普通字符串：尝试把整个内容转换为Number，结果是Number或NaN`

`引用类型如[]、{}：优先valueOf()，失败后用toString()，接着把得到的整个String转换为Number，比如const obj = {...,valueOf:()=>33}，这里的对象重写了来自Object的valueOf方法，转化后就是数字33`

#### 2.计算值，此过程中：
`进行加号运算，一方是字符串：尝试把另一方toString()，然后拼接`

`NaN具有粘黏性：只要出现一方是NaN，另一方是Number，结果必定NaN`

#### 3.运算完成，得到最终结果
## 数据结构
### 数组
常用的方法一定要记得，

`shift()`------------------删除元素，在首 

`unshift()` ---------------增加元素，在首

`pop()`---------------------删除元素，在尾

`posh()`--------------------增加元素，在尾

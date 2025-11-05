# ES6--Promise


`Promise`是ES6才出现的东西，是异步编程的一种解决方案，再此之前，我们使用回调函数解决异步：

```javascript
doSomething(function(result) {
  doSomethingElse(result, function(newResult) {
    doThirdThing(newResult, function(finalResult) {
      console.log('得到最终结果: ' + finalResult);
    }, failureCallback);
  }, failureCallback);
}, failureCallback);
```

这就非常难受了，代码也不容易看，还形成了回调函数地狱，不过`Promise`出来后，就直接用`函数.then()`形成链式调用，十分的优雅和实用



我们使用`new Promise( 参数function )`（参数要求是一个函数）来创建`Promise`对象，这个`Promise`对象有三个状态：

+ `pending`（进行中）
+ `fulfilled`（已成功）
+ `rejected`（已失败）

```javascript
const promise = new Promise(function(resolve, reject) {
  //...业务代码
});
```

如上，我们知道`Promise`构造函数的参数是一个函数，而且这个函数里有两个传参：`resolve`、`reject`

这两个参数实际上也是函数，那这函数是干啥的？其实是改变本`Promise`对象的状态：

+ `resolve`：`peding`（进行中） ----> `fulfilled`（已成功）
+ `reject`：`peding`（进行中） ----> `rejected`（已失败）



我们都知道，`Promise`对象自带一些方法，比如`.then()`、`.catch()`、`.finally()`，我们也经常用，

但是我们不知道的，是这些方法和`promise`对象状态之间的关系，下面一个一个说

## 基本的三个用法
### then()
`.then()`是实例状态发生改变时的回调函数，在`.then()`的使用中，我们会在小括号内传入一个函数作为参数，那么实际上`.then()`是需要两个参数的：

`.then( resolved的回调函数，rejected的回调函数 )`

只不过我们经常只传`resolved的回调函数`：

```javascript
getJSON("/posts.json").then(function(json) {
  return json.post;
}).then(function(post) {
  // ...
});
```

这里`getJSON("/posts.json")`执行后返回一个`Promise`对象，且状态已经改变了

然后我们使用`then()`的`resolved`回调（就是`then`小括号内的函数）

当然我们能看到`.then()`支持链式调用，这是因为`.then()`会返回一个新的`Promise`对象



当然现在也有不用`then`的，以我实习时写的代码为例：

```javascript
// ajax 请求二次封装
const request = (data = {}) => {

  return new Promise((resolve, reject) => {
    jQuery.ajax({
      url:'/wp-admin/admin-ajax.php',
      type: 'POST',
      data: data,
      dataType: 'json',

      success: (response) => {
        typeof success === 'function' && success(response);
        resolve(response);
      },

      error: (xhr,status, error) => {
        console.error('请求失败:', xhr,status,error);
        reject(xhr);
      }
    });
  });
}
```

注意到第13行的代码：`resolved(response)`：

1. 我们调用的`request`返回的是一个`Promise`对象
2. 我们AJAX请求成功了，执行success的回调函数
3. success回调函数中有一行代码：`resolve(response)`
4. 执行`resolve(response)`，改变本`Promise`对象的状态，`peding`---> `fulfilled`
5. 而参数`response`本质是AJAX的成功响应，此时`response`值直接放到了本`Promise`对象身上
6. 然后没了，是的，没有`resolve`的回调函数



使用代码是这样的：

```javascript
const res = await request(data)
console.log(res.data)
```

这里的`res.data`就是来自服务器返回的`response`，它从服务器来，执行`resolve(response)`先到`request`对象身上，再提供我们用`res`接受`request`，现在到了`res`身上



### catch()
我们知道了`.then()`需要两个回调函数作为参数，那`.catch()`就好理解了

`.catch()`等价于`.then(null, rejection)`或是`.then(undefined, rejection)`

就是执行`rejected`的回调函数    <font style="color:#8A8F8D;">  即</font>`<font style="color:#8A8F8D;">peding</font>`<font style="color:#8A8F8D;">（进行中） ----> </font>`<font style="color:#8A8F8D;">rejected</font>`<font style="color:#8A8F8D;">（已失败）</font>

不过值得要说的是，`Promise`对象的错误有冒泡性质，如果对`Promise`链式调用的话，前面的错误会一层层往后传递，直到遇到`.catch()`或者`.finally()`



### finally()
`finally()`用于指定不管`Promise`对象最后状态如何，都会执行的操作，这没什么好说的



## Promise自带的函数
以上的`.then()`、`.catch()`、`.finally()`都是`Promise`实例的方法，下面是一些`Promise`自带的方法了，直接`Promise.函数名()`来调用



### Promise.all()
`Promise.all()`方法用于将多个`Promise`实例，包装成一个新的`Promise`实例

```javascript
const p = Promise.all([p1, p2, p3]);
```

如上代码，多个`Promise`实例用数组包裹

我们知道`Promise`是有三个状态的，那合成后的`Promise`呢？

其实是根据传入的`Promise`参数状态决定，判断如下：

`p1.fulfilled && p2.fulfilled && p3.fulfilled` ---> `p.fuilled`（全部成功才算成功）

`p1.rejected || p2.rejected || p3.rejected` ---> `p.rejected`（一个失败就算失败）



### Promise.race()
`Promise.race()`方法同样是将多个`Promise`实例，包装成一个新的`Promise`实例，但是和`.all()`不同的是，自身的三个状态不再去看传入的`Promise`实例了，而是比赛

是的，每错，就是比赛，哪一个实例先改变了状态，本`Promise`对象的状态就按它改变后的来



### Promise.allSettled()
`Promise.allSettled()`方法接受一个数组包裹的`Promise`实例作为参数，包装成一个新的 Promise 实例，

只有等到所有这些参数实例都返回结果，不管是`fulfilled`还是`rejected`，包装实例才会结束，我们经常是搭配`await`使用



### Promise.resolve()
把参数内的东西转为`Promise`对象并返回，把返回对象的状态变成`fulfilled`



### Promise.reject()
`Promise.reject(reason)`方法也会返回一个新的 `Promise` 实例，该实例的状态为`rejected`













<font style="color:#8A8F8D;"></font>




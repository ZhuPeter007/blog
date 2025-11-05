# 老朋友AJAX


`AJAX`全名呢叫(Async Javascript and XML)

功能：可以在不重新加载整个网页的情况下，与服务器交换数据，并且更新部分网页

关于`AJAX`的各种基本的概念就不再这里说了，虽然我们常用，但是不一定知道它的底层原理，现在我们试着像`jQuery`那样用`$.ajax()`，来封装一个类似的`AJAX`请求，代码如下：

```javascript
//使用示例
ajax({
  type: 'post',
  dataType: 'json',
  data: {},
  url: 'https://xxxx',
  success: function(text,xml){//请求成功后的回调函数
    console.log(text)
  },
  fail: function(status){////请求失败后的回调函数
    console.log(status)
  }
})


//封装一个ajax请求
function ajax(options) {
  //创建XMLHttpRequest对象
  const xhr = new XMLHttpRequest()


  //初始化参数的内容
  options = options || {}
  options.type = (options.type || 'GET').toUpperCase()
  options.dataType = options.dataType || 'json'
  const params = options.data

  //发送请求
  if (options.type === 'GET') {
    xhr.open('GET', options.url + '?' + params, true)
    xhr.send(null)
  } else if (options.type === 'POST') {
    xhr.open('POST', options.url, true)
    xhr.send(params)

    //接收请求
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let status = xhr.status
        if (status >= 200 && status < 300) {
          options.success && options.success(xhr.responseText, xhr.responseXML)
        } else {
          options.fail && options.fail(status)
        }
      }
    }
  }
```

实际上，还是可以使用`promise`进行二次封装的，更方便

```javascript
//上述代码不变......

// ajax 请求封装
const request = (data = {}) => {
  return new Promise((resolve, reject) => {
    ajax({
      url:'/wp-admin/admin-ajax.php',
      type: 'POST',
      data: data,
      dataType: 'json',
      success: (response) => {
        typeof success === 'function' && success(response);
        //
        resolve(response);
      },

      error: (xhr) => {
        console.error('请求失败:', xhr);
        typeof error === 'function' && error(xhr);
        //
        reject(xhr);
      }
    });
  });
}
```

使用示例：

```javascript
const resp = await request(data)
console.log(resp)
```


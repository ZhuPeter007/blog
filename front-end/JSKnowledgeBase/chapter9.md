# BOM浏览器对象模型


`BOM`全称（Browser Object Model），即浏览器对象模型，浏览器的全部内容可以看成`DOM`，整个浏览器可以看成`BOM`

`BOM`提供了很多浏览器的交互的方法和属性，比如进行页面的后退，前进，刷新，浏览器的窗口发生变化，滚动条的滚动，以及获取客户的一些信息如：浏览器品牌版本，屏幕分辨率

在代码中，使用`window`就行，它就是浏览器的实例，有很多方法也许你用过，但并不知道这就是`BOM`



## 控制窗口
关于浏览器窗口控制方法如下：

+ `moveBy(x,y)`：从当前位置水平移动窗体x个像素，垂直移动窗体y个像素，x为负数，将向左移动窗体，y为负数，将向上移动窗体
+ `moveTo(x,y)`：移动窗体左上角到相对于屏幕左上角的(x,y)点
+ `resizeBy(w,h)`：相对窗体当前的大小，宽度调整w个像素，高度调整h个像素。如果参数为负值，将缩小窗体，反之扩大窗体
+ `resizeTo(w,h)`：把窗体宽度调整为w个像素，高度调整为h个像素
+ `scrollTo(x,y)`：如果有滚动条，将横向滚动条移动到相对于窗体宽度为x个像素的位置，将纵向滚动条移动到相对于窗体高度为y个像素的位置
+ `scrollBy(x,y)`： 如果有滚动条，将横向滚动条向左移动x个像素，将纵向滚动条向下移动y个像素

## <font style="color:rgb(44, 62, 80);">window.location</font>
`<font style="color:rgb(71, 101, 130);background-color:rgba(27, 31, 35, 0.05);">url</font>`<font style="color:rgb(44, 62, 80);">地址如下：</font>

```plain
http://foouser:barpassword@www.wrox.com:80/WileyCDA/?q=javascript#contents
```

<font style="color:rgba(255, 255, 255, 0.3);background-color:rgb(40, 44, 52);">1</font>

`<font style="color:rgb(71, 101, 130);background-color:rgba(27, 31, 35, 0.05);">location</font>`<font style="color:rgb(44, 62, 80);">属性描述如下：</font>

| <font style="color:rgb(44, 62, 80);">属性名</font> | <font style="color:rgb(44, 62, 80);">例子</font> | <font style="color:rgb(44, 62, 80);">说明</font> |
| --- | --- | --- |
| <font style="color:rgb(44, 62, 80);">hash</font> | <font style="color:rgb(44, 62, 80);">"#contents"</font> | <font style="color:rgb(44, 62, 80);">utl中#后面的字符，没有则返回空串</font> |
| <font style="color:rgb(44, 62, 80);">host</font> | <font style="color:rgb(44, 62, 80);">www.wrox.com:80</font> | <font style="color:rgb(44, 62, 80);">服务器名称和端口号</font> |
| <font style="color:rgb(44, 62, 80);">hostname</font> | <font style="color:rgb(44, 62, 80);">www.wrox.com</font> | <font style="color:rgb(44, 62, 80);">域名，不带端口号</font> |
| <font style="color:rgb(44, 62, 80);">href</font> | <font style="color:rgb(44, 62, 80);">http://www.wrox.com:80/WileyCDA/?q=javascript#contents</font> | <font style="color:rgb(44, 62, 80);">完整url</font> |
| <font style="color:rgb(44, 62, 80);">pathname</font> | <font style="color:rgb(44, 62, 80);">"/WileyCDA/"</font> | <font style="color:rgb(44, 62, 80);">服务器下面的文件路径</font> |
| <font style="color:rgb(44, 62, 80);">port</font> | <font style="color:rgb(44, 62, 80);">80</font> | <font style="color:rgb(44, 62, 80);">url的端口号，没有则为空</font> |
| <font style="color:rgb(44, 62, 80);">protocol</font> | <font style="color:rgb(44, 62, 80);">http:</font> | <font style="color:rgb(44, 62, 80);">使用的协议</font> |
| <font style="color:rgb(44, 62, 80);">search</font> | <font style="color:rgb(44, 62, 80);">?q=javascript</font> | <font style="color:rgb(44, 62, 80);">url的查询字符串，通常为？后面的内容</font> |


除了 `<font style="background-color:rgba(27, 31, 35, 0.05);">hash</font>`之外，只要修改`<font style="background-color:rgba(27, 31, 35, 0.05);">location</font>`的一个属性，就会导致页面重新加载新`<font style="background-color:rgba(27, 31, 35, 0.05);">URL</font>`

`<font style="background-color:rgba(27, 31, 35, 0.05);">location.reload()</font>`，此方法可以重新刷新当前页面。这个方法会根据最有效的方式刷新页面，如果页面自上一次请求以来没有改变过，页面就会从浏览器缓存中重新加载

如果要强制从服务器中重新加载，传递一个参数`<font style="background-color:rgba(27, 31, 35, 0.05);">true</font>`即可



## window.<font style="color:rgb(44, 62, 80);">navigator</font>
`<font style="background-color:rgba(27, 31, 35, 0.05);">navigator</font>` 对象主要用来获取浏览器的属性，区分浏览器类型。属性较多，且兼容性比较复杂



## window.<font style="color:rgb(44, 62, 80);">screen</font>
保存的纯粹是客户端能力信息，也就是浏览器窗口外面的客户端显示器的信息，比如像素宽度和像素高度



## <font style="color:rgb(44, 62, 80);">window.history</font>
`<font style="background-color:rgba(27, 31, 35, 0.05);">history</font>`对象主要用来操作浏览器`<font style="background-color:rgba(27, 31, 35, 0.05);">URL</font>`的历史记录，可以通过参数向前，向后，或者向指定`<font style="background-color:rgba(27, 31, 35, 0.05);">URL</font>`跳转

常用的属性如下：

+ `<font style="background-color:rgba(27, 31, 35, 0.05);">history.go()</font>`

接收一个整数数字或者字符串参数：向最近的一个记录中包含指定字符串的页面跳转，

```javascript
history.go('maixaofei.com')
```

<font style="color:rgba(255, 255, 255, 0.3);background-color:rgb(40, 44, 52);">1</font>

当参数为整数数字的时候，正数表示向前跳转指定的页面，负数为向后跳转指定的页面

```javascript
history.go(3) //向前跳转三个记录
history.go(-1) //向后跳转一个记录
```

<font style="color:rgba(255, 255, 255, 0.3);background-color:rgb(40, 44, 52);">1  
</font><font style="background-color:rgb(40, 44, 52);">2</font>

+ `<font style="background-color:rgba(27, 31, 35, 0.05);">history.forward()</font>`：向前跳转一个页面
+ `<font style="background-color:rgba(27, 31, 35, 0.05);">history.back()</font>`：向后跳转一个页面
+ `<font style="background-color:rgba(27, 31, 35, 0.05);">history.length</font>`：获取历史记录数


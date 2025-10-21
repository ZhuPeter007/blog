# 第二章 虚拟DOM
为什么会有虚拟DOM这个东西？

因为在真实的浏览器中，操作真实的DOM是需要消耗性能的

真实的 DOM 节点数据会占据更大的内存，当我们频繁的去做 DOM 更新，会产生一定的性能问题

还记得上一章的公式吗？

**<font style="color:rgb(255, 0, 0);">UI = render(state)</font>**

我们的Vue扮演的是`<font style="color:#DF2A3F;">render()</font>`的角色，但是你有没有想过，在收集完依赖后，难道只要对数据进行了改动，就不分青红皂白的抓住依赖去暴力更新DOM？

诚然，DOM操作不可避免，但是我们可以用最小的代价，根据数据改动情况，只更新那些特定的DOM

而不是把整个依赖数组全都更新一遍

这里虚拟DOM就参与进来了，我们用 js 模拟出一个 DOM 节点，称之为虚拟 DOM 

当数据发生变化时，我们对比变化前后的虚拟DOM节点，通过DOM-Diff算法计算出需要更新的地方，然后去更新需要更新的视图。这就是它最大的意义了



## 一、VNode类
在Vue源码里，虚拟DOM就是一个类的实例，类名是`VNode`，多少无益，上代码：

```javascript
// 源码位置：src/core/vdom/vnode.js

export default class VNode {
  constructor (
    tag?: string,    				//标签名
    data?: VNodeData,				//元素具体数据信息
    children?: ?Array<VNode>, //直接子元素数组
    text?: string,					//节点文本
    elm?: Node,							//对应的真实DOM
    context?: Component,		//对应的Vue实例
    componentOptions?: VNodeComponentOptions,  //对应组件的option选项
    asyncFactory?: Function
  ) {
    //当前节点的标签名，如div、a、span
    this.tag = tag
    //当前节点的子节点数组(没有孙子节点)
    this.children = children
    //当前节点的父节点
    this.parent = undefined
    //当前节点具体的一些数据信息，如class、style、id和v-model、v-show或者onClick等等
    this.data = data
    //当前虚拟节点对应的真实dom节点
    this.elm = elm
    
    //是原生HTML还是普通文本，innerHTML的时候为true，textContent的时候为false
    this.raw = false
    //当前节点的文本
    this.text = text
    //是否是静态节点(没有数据插入)
    this.isStatic = false
    //是否作为跟节点插入
    this.isRootInsert = true
    //是否是注释节点
    this.isComment = false
    //是否为克隆节点
    this.isCloned = false
    //是否有v-once指令(只渲染一次，后续不更新)
    this.isOnce = false

    //当前节点对应的组件的实例
    this.componentInstance = undefined
    //当前组件节点对应的Vue实例
    this.context = context
    //函数式组件对应的Vue实例
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    //对应组件的option选项
    this.componentOptions = componentOptions
    //节点的key属性，被当作节点的标志，用以优化
    this.key = data && data.key
    //当前节点的命名空间(namespace)
    this.ns = undefined
    
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  get child (): Component | void {
    return this.componentInstance
  }
}
```

一定要记得这几个属性：`tag`、`data`、`elm`、`text`、`context`、`isStatic`等等



和真实的DOM一样，一个VNode实例也会分成以下类型：

+ 注释节点-----------------------`this.isComment = true`
+ 文本节点-----------------------`this.raw = true`
+ 元素节点-----------------------`this.raw = false`
+ 组件节点-----------------------`this.componentOptions`不为`undefined`
+ 函数式组件节点----------------`this.fnContext、this.fnOptions、this.fnScopeId`不为`undefined`
+ 克隆节点-----------------------`this.isCloned = true`



来来来，一个都跑不掉，一个一个讲：

### 1、注释节点
这个最简单，代码如下：

```javascript
const node = new VNode()
node.isComment = true
node.text = '我被注释了'
```

只需要两个属性：`isComment`、`text`

`isComment`为标志，代表这个节点被注释了，`text`是注释内容



### 2、文本节点
这个比上面的还简单，代码如下：

```javascript
const node = new VNode()
node.tag = undefined
node.data = undefined
node.children = undefined
node.text = '这是一段文本'
```

只需要一个属性：`text`

`text`用来表示具体的文本信息，其他默认就可以了



### 3、克隆节点
这个稍微有点意思，就是把一个已经存在的节点复制一份出来

它主要是为了做模板编译优化时使用，这个后面我们会说到，先手写一个克隆VNode实例，代码如下：

```javascript
export function cloneVNode (vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  // 主要是这一个，把它设为true
  cloned.isCloned = true
  return cloned
}
```



### 4、元素节点
最正常的节点，上有老（父节点）下有小（子节点），自身还带`class`、`id`、`v-if`、`v-for`、`ref`、`onClick`等等数据

来个伪代码吧，看懂就行：

```html
<div id='a'>
  <span>难凉热血</span>
</div>
```

```javascript
//模拟上面的节点
{
  tag:'div',
  data:{},
  children:[
    {
      tag:'span',
      text:'难凉热血'
    }
  ]
}
```



### 5、组件节点
类似元素节点，但是跟元素节点不一样的是多了两个不为undefined的属性：

`componentOptions`--------------组件的option选项，含有组件的props等

`componentInstance`-------------当前组件节点对应的Vue实例



### 6、函数式组件节点
相比于上面的组件节点，它在上面的基础上又有两个不为`undefined`的属性：

`fnContext`------------函数式组件对应的Vue实例

`fnOptions`------------组件的option选项



## 二、DOM-Diff
以上6种虚拟DOM类型就是为此刻铺垫的，DOM-Diff算法，旨在不要一刀切的更新DOM，而是比较前后虚拟DOM的状态，按需更新DOM

还有一个专业的叫法，我们把这比较虚拟DOM的过程称为`patch`，翻译过来就是补丁

在这个过程里，我们会按照旧虚拟DOM各个状态，而找到新虚拟DOM变更的地方，给对应地方做处理

不过这些都不重要，我们先站到浏览器的角度想想，找到一个DOM变更的地方后，接下来要做什么？

和数据库类似，无外增删改查，在DOM操作上，就那么仨操作：

+ 新增DOM，在VNode上创建节点
+ 删除DOM，在VNode上删除节点
+ 更新DOM，在VNode上更新节点

一个都跑不了，一个一个讲：



### 1、新增DOM
什么时候会触发新增DOM呢？

记得`v-for`吗，他需要一个数组数据来循环遍历，如果给这个数组增加数据，那就触发新增DOM了

那么是不是还得想想新增插入什么类型的DOM？

上文的6种虚拟DOM里，就三种能新增插入：<u>元素节点</u>、<u>文本节点</u>、<u>注释节点</u>

只要我们先判断要插入的每种DOM类型，然后去对应的新增DOM方法里就ok了

在vue源码里也确实是这样做的：

```javascript
// 源码位置: /src/core/vdom/patch.js
function createElm (vnode, parentElm, refElm) {
    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag
  
    //有标签名，那文本节点和注释节点就排除了，直接创建元素节点
    if (isDef(tag)) {
      vnode.elm = nodeOps.createElement(tag, vnode)   
      // 创建元素节点的子节点
      createChildren(vnode, children, insertedVnodeQueue)
      // 插入到DOM中
      insert(parentElm, vnode.elm, refElm)
    }
      
    // 有注释节点的标准，直接创建注释节点
    else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text)
      // 插入到DOM中
      insert(parentElm, vnode.elm, refElm)
    }
      
    // 创建文本节点
    else {
      vnode.elm = nodeOps.createTextNode(vnode.text)
      // 插入到DOM中
      insert(parentElm, vnode.elm, refElm)
    }
  }
```



### 2、删除DOM
同样的，`v-for`需要一个数组数据来循环遍历，给这个数组删除数据，那就触发删除DOM了

这个很简单，事先写个`removeNode()`函数，到时候调用就行了

Vue里这样做的：

```javascript
function removeNode (el) {
  // 获取父节点
  const parent = nodeOps.parentNode(el)
  
  if (isDef(parent)) {
    // 调用父节点的removeChild方法
    nodeOps.removeChild(parent, el)  
  }
}
```



### 3、更新DOM
这个是最常见的操作，随便给元素弄个`v-model`，绑定的数据一变，跟着变呗

但是，在更新之前，我们说过VNode6种类型，并不是每一种虚拟DOM都要更新的，举个例子：

```html
<div class='text1'>我有{{data}}匹马</div>

<div class='text2'>我有一匹马</div>

<!-- <div class='text2'>我是一匹马</div> -->
```

你说第二种、第三种div，你更新它干吗？

对于静态节点（即`VNode.isStatic = true`），别管它，直接跳过



那第一种div呢，要更新吗？

这取决于里面的`data`，如果变了就更新，不变不更新

不要以为这是废话，如果执行这个代码：

```javascript
data = data + 1 - 1
```

根据之前所学的`Object.defineProperty`，我们触发了`data`的`set`函数，通知DOM更新

但是到了DOM更新函数里一看，好家伙，这新VNode和老VNode的文本一毛一样，还跟更新啥啊



看看源码吧：

```javascript
function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
  // vnode与oldVnode是否完全一样？若是还更新啥啊，退出程序
  if (oldVnode === vnode) {
    return
  }

  // vnode与oldVnode是否都是静态节点？若是还更新啥啊，退出程序
  if (isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ){
    return
  }
    
  const elm = vnode.elm = oldVnode.elm
  const oldCh = oldVnode.children
  const ch = vnode.children
  
  // vnode有text属性？若没有：
  if (isUndef(vnode.text)) {
    // vnode的子节点与oldVnode的子节点是否都存在？
    if (isDef(oldCh) && isDef(ch)) {
      // 若都存在，判断子节点是否相同，不同则更新子节点
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    }
    // 若只有vnode的子节点存在
    else if (isDef(ch)) {
      /**
       * 判断oldVnode是否有文本？
       * 若没有，则把vnode的子节点添加到真实DOM中
       * 若有，则清空Dom中的文本，再把vnode的子节点添加到真实DOM中
       */
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    }
    // 若只有oldnode的子节点存在
    else if (isDef(oldCh)) {
      // 清空DOM中的子节点
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    }
    // 若vnode和oldnode都没有子节点，但是oldnode中有文本
    else if (isDef(oldVnode.text)) {
      // 清空oldnode文本
      nodeOps.setTextContent(elm, '')
    }
    // 上面两个判断一句话概括就是，如果vnode中既没有text，也没有子节点，那么对应的oldnode中有什么就清空什么
  }
  // 若有，vnode的text属性与oldVnode的text属性是否相同？
  else if (oldVnode.text !== vnode.text) {
    // 若不相同：则用vnode的text替换真实DOM的文本
    nodeOps.setTextContent(elm, vnode.text)
  }
}
```

这还有个流程图来描述更新节点的操作：

![](https://cdn.nlark.com/yuque/0/2025/png/42807293/1760241633163-b63d1f4e-353a-49b7-9eac-4e506f9d04ae.png)

当然，这看似完美，实则还有改进空间，比如当前元素一样，不更新，那下一步是去比较子元素，如果子元素也一样，接着往下比较，直到到达数据结构中树的叶子节点为止，

这个过程是递归还是for循环呢？怎么去优化？



## 三、更新DOM之子节点更新
前文的“更新DOM”是指更新本层DOM，只关注本层DOM的变化，但实际的patch过程中，我们要从对应依赖的根节点开始，层层往下比较，同一层更新操作完了就进入下一层，直到最底层

但不管怎么往下层比较，还是绕不过循环这个操作的

那我们干脆一些好了，先上个循环的伪代码：

```javascript
// 外层循环：新子节点数组
for (let i = 0; i < newChildren.length; i++) {
  const newChild = newChildren[i];

  // 内层循环：老子节点数组
  for (let j = 0; j < oldChildren.length; j++) {
    const oldChild = oldChildren[j];

    // 找到新老数组中对应的子节点
    if (newChild === oldChild) {
      // 。。。
      // 在这里进行更新子DOM的操作
    }
  }
}
```

就是那么朴素，其中要说明的是，更新子DOM的操作

有几种呢？其实也很简单，还是增删改查那一套：

+ 创建子节点
+ 删除子节点
+ 更新子节点
+ 移动子节点（本质是创建和删除的复合操作）

就这四个操作，一个一个讲吧：



### 1、创建子节点
什么时候创建呢？老子节点数组没有，新子节点数组有

![](https://cdn.nlark.com/yuque/0/2025/png/42807293/1760245511970-f784829b-e551-4e7b-a647-5e8f49e8fa75.png)

就这样，发现了新子节点`child3`，前面的`child1`、`child2`都处理完了，顺理成章的把`child4`插到了已处理完的子节点的后面，注意此插入后的`child4`状态还是<u><font style="color:#DF2A3F;">未处理</font></u>

但这样是不是想简单了呢？如果按上面的想法，<u><font style="color:#DF2A3F;">把</font></u>`<u><font style="color:#DF2A3F;">新子节点</font></u>`<u><font style="color:#DF2A3F;">插到</font></u>`<u><font style="color:#DF2A3F;">已处理完子节点</font></u>`<u><font style="color:#DF2A3F;">的后面</font></u>会造成什么后果？

会变成这样的后果：

![](https://cdn.nlark.com/yuque/0/2025/png/42807293/1760245490135-0fc32b60-da87-433d-bef7-5d5f299c71a0.png)

DOM顺序错了，所以啊所以，<u><font style="color:#DF2A3F;">不能插入到</font></u>`<u><font style="color:#DF2A3F;">已处理子节点</font></u>`<u><font style="color:#DF2A3F;">后面，而是要插到</font></u>`<u><font style="color:#DF2A3F;">未处理子节点</font></u>`<u><font style="color:#DF2A3F;">前面</font></u>

这也算一个坑吧



### 2、删除子节点 
这个不用细讲了，老子节点数组有，新子节点数组没有，不用讲什么顺序，直接删就完了，=



### 3、更新子节点
这个也不用细讲，执行上一章节的“[更新DOM](#WQvzc)”就完了



### 4、移动子节点
这里也要遵循创建子节点的原则：<u><font style="color:#DF2A3F;">不能插入到</font></u>`<u><font style="color:#DF2A3F;">已处理子节点</font></u>`<u><font style="color:#DF2A3F;">后面，而是要插到</font></u>`<u><font style="color:#DF2A3F;">未处理子节点</font></u>`<u><font style="color:#DF2A3F;">前面</font></u>

![](https://cdn.nlark.com/yuque/0/2025/png/42807293/1760250951891-2ffa8058-7468-47ea-9500-d21eb4f2093e.png)

一插一删之间，就完成了移动子节点

那在源码里是怎么做的？

```javascript
// 源码位置： /src/core/vdom/patch.js

// 如果在oldChildren里找不到当前循环的newChildren里的子节点
if (isUndef(idxInOld)) {
    // 新增节点并插入到合适位置
    createElm(newStartVnode,
              insertedVnodeQueue,
              parentElm,
              oldStartVnode.elm,
              false,
              newCh,
              newStartIdx)
}

// 如果在oldChildren里找到了当前循环的newChildren里的子节点
else {
    vnodeToMove = oldCh[idxInOld]
    // 如果两个节点相同
    if (sameVnode(vnodeToMove, newStartVnode)) {
        // 调用patchVnode更新节点
        patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
        oldCh[idxInOld] = undefined
        // canmove表示是否需要移动节点，如果为true表示需要移动，则移动节点，如果为false则不用移动
        canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
    }
}
```

首先判断在oldChildren里能否找到当前循环的newChildren里的子节点，

如果找不到，那就是新增节点并插入到合适位置；

如果找到了，先对比两个节点是否相同，

若相同则先调用patchVnode更新节点，更新完之后再看是否需要移动节点



回到最初的伪代码：双层`for`循环是否有时间复杂度问题？

不用想，那肯定是有的，怎么办？去优化（看番外篇）




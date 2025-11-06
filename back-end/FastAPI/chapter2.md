# FastAPI中的两个核心组件
在 FastAPI 中，有两个核心组件是其强大功能的基础，分别是 `Starlette` 和 `Pydantic`。

它们分别负责底层的 Web 服务器功能和数据验证功能。

> Starlette相关链接：https://hellowac.github.io/starlette-zh-cn/
>
> Pydantic相关链接：https://pydantic.com.cn/
>

以下是这两个组件的详细介绍：



## Starlette
Starlette 是 FastAPI 的底层 Web 框架，提供了高性能的异步 Web 服务器功能。它是 FastAPI 的基石，负责处理 HTTP 请求和响应。

Starlette 的主要特点：

+ **异步支持**：Starlette 是一个异步框架，支持 Python 的 `async` / `await` 语法，能够处理高并发请求。
+ **高性能** ： 基 于 ASGI （ Asynchronous Server Gateway Interface ） ， 性 能 接 近 Node.js 和 Go。
+ **功能丰富**：支持中间件、异常处理、静态文件服务、WebSockets 等。
+ **轻量级**：Starlette 的设计简洁，易于扩展和集成。



在 FastAPI 中，Starlette 负责：

+ 接收 HTTP 请求并将其分发到对应的路由。
+ 处理请求头、请求体和响应头。
+ 提供中间件支持，用于处理跨域请求、身份验证等通用功能。



## Pydantic
Pydantic 是一个基于 Python 类型提示的数据验证和设置管理库。FastAPI 利用 Pydantic 来实现数据验证和序列化功能。



Pydantic 的主要特点：

+ **类型提示**：Pydantic 使用 Python 的类型提示功能，通过定义数据模型来验证输入数据。
+ **自动验证**：当数据（如请求体、查询参数等）传递到 FastAPI 应用时，Pydantic 会自动验证这些数据是否符合预期的类型和格式。
+ **错误处理**：如果数据验证失败，Pydantic 会生成详细的错误信息，帮助开发者快速定位问题。
+ **序列化**：Pydantic 不仅可以验证数据，还可以将数据序列化为 JSON 格式，方便返回给客户端。



在 FastAPI 中，Pydantic 的作用包括：

+ 定义请求体的结构。例如：

```python
from pydantic import BaseModel

class Item(BaseModel)name: str
    description: str = None
    price: float
    tax: float = None
```

+ 自动验证请求体中的数据是否符合模型定义。
+ 将模型数据序列化为 JSON，用于返回响应。



FastAPI 将 Starlette 和 Pydantic 无缝结合，创建了一个强大的 API 开发框架：

1.  Starlette 负责处理 HTTP 请求和响应的底层逻辑。
2.  Pydantic 负责验证和序列化数据。
3.  FastAPI 在两者之上提供了一个简洁的接口，让开发者可以专注于业务逻辑，而无需关心底层细节。

例如，以下是一个简单的 FastAPI 示例：

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float
    
@app.post("/items/")
async def create_item(item: Item)
    return item
```

在这个例子中：

+ Starlette 处理 HTTP 请求和响应。
+ Pydantic 验证 Item 模型中的数据是否符合预期。
+ FastAPI 将两者结合，提供了一个简洁的 API 开发体验。

总结来说，Starlette 和 Pydantic 是 FastAPI 的两个核心组件，分别负责底层的 Web 功能和数据验证功能。它们的结合使得 FastAPI 既高性能又易于使用。


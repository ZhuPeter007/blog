# FastAPI介绍

## 什么是FastAPI


> FastAPI官网：https://fastapi.tiangolo.com/zh/


FastAPI 是一个现代、快速（高性能）的 Web 框架，用于构建 API。它基于 Python

3.7+ 的类型提示功能，使用了 Starlette 作为底层 Web 服务器和 Pydantic 用于数据验证。以下是 FastAPI 的一些主要特点和优势：

+ FastAPI 基于 Starlette，是一个异步框架，性能接近 Node.js 和 Go，能够处理高并发请求。



+ FastAPI 自动为你的 API 生成交互式文档（使用 OpenAPI 标准）。它支持两种文档风格：
    - Swagger UI ：一个交互式的文档界面，可以方便地查看和测试 API。
    - ReDoc ：另一种优雅的文档界面。



+ 这些文档是自动生成的，基于代码中的注释和类型提示，无需额外编写文档。   



+ 类型提示和数据验证：
    - FastAPI 利用 Python 的类型提示功能，结合 Pydantic 进行数据验证。
    - 当你定义 API 的输入参数时，FastAPI 会自动验证这些参数是否符合预期的类型和格式。如果不符合，会返回清晰的错误信息。

 

+ FastAPI 原生支持异步编程 `(async/await)`，可以显著提升性能，尤其是在处理 I/O 密集型任务时。

 

+ 你可以使用`async`定义路由处理函数， 同时也可以与异步数据库（ 如SQLAlchemy）无缝集成。



+ FastAPI 的代码简洁明了，易于上手。它提供了丰富的功能，但不需要复杂的配置。
    - 例如，创建一个简单的 GET 请求：

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello, FastAPI!"}
```



## FastAPI适用场景
FastAPI 非常适合构建高性能的 RESTful API、微服务、实时应用等。它特别适合需要快速开发、自动文档和高性能的项目。总之，FastAPI 是一个功能强大且易于使用的 Web 框架，特别适合现代的 API 开发。






# 中间件
在 *FastAPI*中，**中间件**（ **Middleware** ）是一种强大的功能，用于在请求处理流程的

特定阶段插入自定义逻辑。它可以在请求到达路由处理函数之前或响应返回客户端之前

执行代码，从而实现诸如身份验证、日志记录、跨域资源共享（**CORS**）等功能。

中间件可以分为两种：

+ **请求**中间件：在请求到达路由处理函数之前执行。可以用于身份验证、日志记录、请求头修改等。
+ **响应**中间件：在响应返回客户端之前执行。可以用于修改响应头、添加全局响应处理逻辑等。

## 1、使用
在 **FastAPI** 中，中间件通过装饰器 `@app.middleware` 定义。

中间件函数接收一个`Request `对象和一个 `call_next` 函数。 `call_next` 函数用于调用下一个中间件或最终的路由处理函数。

示例：

```python
from fastapi import FastAPI, Request
from fastapi.responses import Response
import uvicorn
import time

app = FastAPI()

# 中间件的使用
@app.middleware("http")
async def m2(request: Request, call_next):
    # 请求代码块
    print("请求代码块2")
    
    response = await call_next(request)
    response.headers["author"] = "bai"
    
    # 响应代码块
    print("响应代码块2")
    return response
    
@app.middleware("http")
async def m1(request: Request, call_next):
    # 请求代码块
    print("请求代码块1")
    
    # 检查 request.client 是否为 None
    # if request.client is None or request.client.host in["127.0.0.1", "localhost"]:
    # return Response(
    #	 status_code=403,
    #	 content="visit Forbidden",
    # )
    
    if request.url.path in ["/user"]:
        return Response(
            status_code=403,
            content="visit Forbidden",
        )
    
    start = time.time()
    
    response = await call_next(request)
    
    print("响应代码块1")
    time.sleep(2)
    end = time.time()
    response.headers["X-Process-Time"] = str(end - start)
    return response

@app.get("/user")
@app.get("/")
async def get_user():
    print("get_user函数执行")
    return {
        "msg": "ok",
        "data": {
            "user": "current user",
        },
        "code": 200,
    }

if __name__ = "__main__":
    uvicorn.run(app="main:app", host="127.0.0.1", port=8000,reload=True)
```



## 2、处理跨域
FastAPI也可以用来处理跨域请求，处理法方式有两种，一种是自己写中间件，另一种是使用 fastAPI 官方提供的组件来实现

```python
from fastapi import FastAPI, Request
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 方法1：手写
# 处理跨域请求中间件
# @app.middleware("http")
# async def add_cors_middleware(request: Request, call_next):
#	 response = await call_next(request)
#	 response.headers["Access-Control-Allow-Origin"] = "*"
#	 return response

orgins = ["http: /127.0.0.1:5500/"]

# 方法2：使用官方提供的跨域组件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # *表示允许所有来源
    # allow_origins=orgins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/user")
async def get_user():
    return {
    "msg": "ok",
    "data": {
        "user": "current user",
    },
    "code": 200,
    }
    
if __name__ = "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000,reload=True)
```




# 第一个接口
创建虚拟环境

在项目目录中，使用以下命令创建虚拟环境：

```python
python  venv .venv
```



这里 .venv 是虚拟环境的名称，你可以根据需要更改它。创建虚拟环境：



安装`fastAPI` 和 `uvicorn` 两个Python包，在命令行依次运行一下命令：

```shell
pip install fastAPI

pip install uvicorn0.20.0
```

> 这里 uvicorn 因为一些与 fastAPI 的问题，最新的 uvicorn 无法正常的热重
>
> 载项目，经过测试，发现0.20版本的没有问题。
>

之后创建一个main.py的Python文件，并写入代码：

```python
from fastapi import FastAPI
import uvicorn

# 创建一个FastAPI实例
app = FastAPI()

@app.get('/')
async def home():
    return {"msg": "hello world"}

if __name__ = '__main__':
uvicorn.run(app='main:app', host='0.0.0.0', port=8000, reload=True)
```

运行：

```shell
python main.py
```

出现以下命令，基本上代表着创建成功：

```shell
(.venv) PS D:\code\python\pycharm\fastAPI\study\1\07-请求与响应>
python .\main.py
INFO: Will watch for changes in these directories:
['D:\\code\\python\\pycharm\\fastAPI\\study\\1\\07-请求与响应']
INFO: Uvicorn running on http: /127.0.0.1:8000 (Press
CTRL+C to quit)
INFO: Started reloader process [27904] using WatchFiles
INFO: Started server process [25668]
INFO: Waiting for application startup.
INFO: Application startup complete.
```


# ORM操作
因为一些设计原因，FastAPI其本身并没有自带的orm模型，因此需要开发者自行选择

orm 模 型 和 迁 移 工 具 。 在 这 里 课 程 需 要 ， 我 这 里 选 择 跟 课 程 通 过 ， 选 择

`tortoise` ORM模型和 `aerich` 数据库迁移工具

安装所需要的包：

```shell
pip install tortoise-orm
pip install asyncmy aiomysql
pip install aerich
pip install tomli_w tomlkit
```

进行数据库文件的创建，比如说：`models.py`

> 接下来所有的代码我都是根据我所创建的文件来写的，可能跟你的有些许不同，如
>
> 果遇到某些代码不认识，请自行查阅AI
>

在`models.py` 中写数据库模型：

```python
from tortoise.models import Model
from tortoise import fields


# 选课


# 学生表
class Student(Model):
    id = fields.IntField( pk=True)
    name = fields.CharField( max_length=32, description="学生姓名")
    pwd = fields.CharField( max_length=32, description="学生密码")
    sno = fields.IntField( description = "学号")

    # 1对多的关系
    clas = fields.ForeignKeyField("models.Clas" , related_name="students")

    # 多对多的关系
    courses = fields.ManyToManyField("models.Course" , related_name="students")

# 班级表
class Clas(Model):
    name = fields.CharField(max_length=32 , description="班级名称")

# 课程表
class Course(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=32, description="课程名称")
    teacher = fields.ForeignKeyField("models.Teacher" , related_name="courses")
    address=fields.CharField(max_length=32, description="课程地址" , default="")


# 教师表
class Teacher(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=32, description="教师姓名")
    pwd = fields.CharField(max_length=32, description="教师密码")
    tno = fields.IntField(description="教师工号")
```

然后在主文件` main.py` 中这样进行导入

```python
from fastapi import FastAPI
import uvicorn
from tortoise.contrib.fastapi import register_tortoise

# 导入数据库配置文件
from settings import TORTOISE_ORM

app = FastAPI()

# 数据库配置和注册
# fastAPI一旦运行，这个就开始运行了
register_tortoise(
    app = app,
    config = TORTOISE_ORM,)

@app.get("/")
async def root():
    return {"msg": "ok", "code": 200}

    
if __name__ = "__main__":
    uvicorn.run(app="main:app",
                host="127.0.0.1", 
                port=8000,
                reload=True)
```

之后是关于数据库连接配置的文件`settings.py`

```python
TORTOISE_ORM = {
    "connections": {
        "default": {
            "engine": "tortoise.backends.mysql", # 指定数据库引擎为MySQL
            "credentials": {
                "host": "127.0.0.1", # 数据库主机地址，本地地址
                "port": 3306, # 数据库端口，默认的MySQL端口
                "user": "root", # 数据库用户名
                "password": "123456", # 数据库密码
                "database": "fastapiDB", # 要连接的数据库名称
                "minsize": 1, # 连接池最小连接数
                "maxsize": 5, # 连接池最大连接数
                "charset": "utf8mb4", # 字符集设置为utf8mb4，支持存储更多的字符，比如表情符号
                "echo": True, # 是否输出SQL语句日志，开发时通常开启，生产环境关闭
            },
        }
    },
    "apps": {
        "models": {
            # 指定包含模型的模块路径，这里假设模型位于名为models的模块中,"aerich.models"是aerich自动生成的模型，一定要有
            "models": ["models","aerich.models",], 
            # 指定默认使用的数据库连接配置
            "default_connection": "default", 
        },
    },
    "use_tz": False, # 是否使用时区，默认False，不使用时区
    "timezone": "Asia/Shanghai", # 设置时区为上海，通常与use_tz一起使用
}    
```

代码完成之后，接下来需要在终端中操作，首先就是激活虚拟环境：

```shell
.venv\Scripts\activate
```

### 1、初始化配置
只需要使用一次：

```shell
aerich.exe init -t settings.TORTOISE_ORM # TORTOISE_ORM配置的位置  
```

成功：

![](/public/FastAPIImgs/4/1.png)



### 2、初始化数据库
 一般只需要使用1次：

```shell
 aerich.exe init-db  
```

 成功：  

![](/public/FastAPIImgs/4/2.png)



### 3、更新模型并进行迁移  
修改 `model` 类，重新生成迁移文件，比如添加一个字段，之后，使用命令



#### 生成迁移文件：
```shell
aerich.exe migrate
```

 成功：  

![](/public/FastAPIImgs/4/3.png)



#### 执行迁移：
```shell
 aerich.exe upgrade  
```

成功：

![](/public/FastAPIImgs/4/4.png)



#### 如果后悔了，执行撤回或降级：  
```shell
 aerich.exe downgrade  
```

成功：

![](/public/FastAPIImgs/4/5.png)


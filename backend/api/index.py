# Vercel Flask 入口：重新导出 Flask app 实例
# Vercel Python 运行时自动扫描 api/ 目录，找到此文件并加载 app 对象
from app import app  # noqa: F401

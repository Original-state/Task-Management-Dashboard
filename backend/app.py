"""
Flask 主入口 - 任务管理 API
本地运行：cd backend && python app.py（监听 5000 端口）
生产运行：gunicorn app:app --bind 0.0.0.0:$PORT
"""

import os
from flask import Flask
from flask_cors import CORS
from db import init_db  # pyright: ignore[reportImplicitRelativeImport]

app = Flask(__name__)
_ = CORS(app)  # 允许跨域，前后端分离开发必须

# 初始化数据库
init_db(app)

# 注册 API 路由蓝图
from routes import api_bp  # pyright: ignore[reportImplicitRelativeImport]
app.register_blueprint(api_bp, url_prefix="/api")


@app.route("/api/health")
def health_check():
    """健康检查接口"""
    return {"status": "ok", "message": "Task Master API is running"}


if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "1") == "1"
    app.run(debug=debug, host=host, port=port)

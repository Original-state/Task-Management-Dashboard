"""
Flask 主入口 - 任务管理 API
运行方式：cd backend && python app.py（监听 5000 端口）
"""

from flask import Flask
from flask_cors import CORS
from db import init_db

app = Flask(__name__)
CORS(app)  # 允许跨域，前后端分离开发必须

# 初始化数据库
init_db(app)

# 注册蓝图（稍后添加）
# from routes import api_bp
# app.register_blueprint(api_bp, url_prefix="/api")


@app.route("/api/health")
def health_check():
    """健康检查接口"""
    return {"status": "ok", "message": "Task Master API is running"}


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)

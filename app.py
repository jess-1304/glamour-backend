from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database import db
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

from routes.auth import auth_bp
from routes.productos import productos_bp

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(productos_bp, url_prefix="/api/productos")

@app.route("/")
def index():
    return {"mensaje": "Glamour Bisutería API ✅"}

if __name__ == "__main__":
    app.run(debug=True)
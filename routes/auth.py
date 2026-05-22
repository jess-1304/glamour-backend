from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import bcrypt
from database import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/registro", methods=["POST"])
def registro():
    data = request.get_json()
    
    if db.usuarios.find_one({"email": data["email"]}):
        return jsonify({"error": "El email ya está registrado"}), 400
    
    password_hash = bcrypt.hashpw(
        data["password"].encode("utf-8"), 
        bcrypt.gensalt()
    )
    
    nuevo_usuario = {
        "nombre": data["nombre"],
        "email": data["email"],
        "password": password_hash,
        "rol": data.get("rol", "cliente")
    }
    
    db.usuarios.insert_one(nuevo_usuario)
    return jsonify({"mensaje": "Usuario registrado exitosamente"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    
    usuario = db.usuarios.find_one({"email": data["email"]})
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    if not bcrypt.checkpw(data["password"].encode("utf-8"), usuario["password"]):
        return jsonify({"error": "Contraseña incorrecta"}), 401
    
    token = create_access_token(
        identity=str(usuario["_id"]),
        additional_claims={
            "rol": usuario["rol"],
            "nombre": usuario["nombre"],
            "email": usuario["email"]
        }
    )
    
    return jsonify({
        "token": token,
        "rol": usuario["rol"],
        "nombre": usuario["nombre"]
    }), 200
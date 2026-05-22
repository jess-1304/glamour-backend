from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt
import bcrypt
from database import db

auth_bp = Blueprint("auth", __name__)

def serializar(doc):
    doc["_id"] = str(doc["_id"])
    return doc

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
        "nombre":   data["nombre"],
        "email":    data["email"],
        "password": password_hash,
        "rol":      data.get("rol", "cliente"),
        "telefono": data.get("telefono", ""),
        "documento": data.get("documento", ""),
        "direccion": data.get("direccion", ""),
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
            "rol":    usuario["rol"],
            "nombre": usuario["nombre"],
            "email":  usuario["email"]
        }
    )
    
    return jsonify({
        "token":  token,
        "rol":    usuario["rol"],
        "nombre": usuario["nombre"]
    }), 200

# ── GET clientes (solo admin) ─────────────────────────────
@auth_bp.route("/clientes", methods=["GET"])
@jwt_required()
def get_clientes():
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    clientes = list(db.usuarios.find({"rol": "cliente"}))
    return jsonify([serializar(c) for c in clientes]), 200

# ── GET perfil del usuario autenticado ────────────────────
@auth_bp.route("/perfil", methods=["GET"])
@jwt_required()
def get_perfil():
    user_id = get_jwt()["sub"]
    from bson import ObjectId
    usuario = db.usuarios.find_one({"_id": ObjectId(user_id)})
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404
    usuario.pop("password", None)
    return jsonify(serializar(usuario)), 200

# ── PUT actualizar perfil ─────────────────────────────────
@auth_bp.route("/perfil", methods=["PUT"])
@jwt_required()
def actualizar_perfil():
    user_id = get_jwt()["sub"]
    from bson import ObjectId
    data = request.get_json()
    campos = {}
    for campo in ["nombre", "telefono", "documento", "direccion"]:
        if campo in data:
            campos[campo] = data[campo]
    db.usuarios.update_one({"_id": ObjectId(user_id)}, {"$set": campos})
    return jsonify({"mensaje": "Perfil actualizado"}), 200
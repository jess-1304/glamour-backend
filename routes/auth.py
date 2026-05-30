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
    """
    Registro de nuevo usuario
    ---
    tags:
      - Auth
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - nombre
            - email
            - password
          properties:
            nombre:
              type: string
              example: "María García"
            email:
              type: string
              example: "maria@glamour.com"
            password:
              type: string
              example: "miPassword123"
            rol:
              type: string
              enum: [admin, cliente]
              example: "cliente"
            telefono:
              type: string
              example: "3001234567"
            documento:
              type: string
              example: "1234567890"
            direccion:
              type: string
              example: "Calle 45 #23-10, Bucaramanga"
    responses:
      201:
        description: Usuario registrado exitosamente
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Usuario registrado exitosamente"
      400:
        description: El email ya está registrado
    """
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
    """
    Inicio de sesión
    ---
    tags:
      - Auth
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              example: "maria@glamour.com"
            password:
              type: string
              example: "miPassword123"
    responses:
      200:
        description: Login exitoso, retorna token JWT
        schema:
          type: object
          properties:
            token:
              type: string
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            rol:
              type: string
              example: "cliente"
            nombre:
              type: string
              example: "María García"
      404:
        description: Usuario no encontrado
      401:
        description: Contraseña incorrecta
    """
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


@auth_bp.route("/clientes", methods=["GET"])
@jwt_required()
def get_clientes():
    """
    Listar todos los clientes (solo admin)
    ---
    tags:
      - Auth
    security:
      - Bearer: []
    responses:
      200:
        description: Lista de clientes
        schema:
          type: array
          items:
            type: object
            properties:
              _id:
                type: string
                example: "664f1a2b3c4d5e6f7a8b9c0d"
              nombre:
                type: string
                example: "María García"
              email:
                type: string
                example: "maria@glamour.com"
              telefono:
                type: string
              documento:
                type: string
              direccion:
                type: string
      403:
        description: No autorizado — se requiere rol admin
      401:
        description: Token inválido o expirado
    """
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    clientes = list(db.usuarios.find({"rol": "cliente"}))
    return jsonify([serializar(c) for c in clientes]), 200


@auth_bp.route("/perfil", methods=["GET"])
@jwt_required()
def get_perfil():
    """
    Obtener perfil del usuario autenticado
    ---
    tags:
      - Auth
    security:
      - Bearer: []
    responses:
      200:
        description: Datos del perfil (sin contraseña)
        schema:
          type: object
          properties:
            _id:
              type: string
              example: "664f1a2b3c4d5e6f7a8b9c0d"
            nombre:
              type: string
              example: "María García"
            email:
              type: string
              example: "maria@glamour.com"
            rol:
              type: string
              example: "cliente"
            telefono:
              type: string
            documento:
              type: string
            direccion:
              type: string
      404:
        description: Usuario no encontrado
      401:
        description: Token inválido o expirado
    """
    user_id = get_jwt()["sub"]
    from bson import ObjectId
    usuario = db.usuarios.find_one({"_id": ObjectId(user_id)})
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404
    usuario.pop("password", None)
    return jsonify(serializar(usuario)), 200


@auth_bp.route("/perfil", methods=["PUT"])
@jwt_required()
def actualizar_perfil():
    """
    Actualizar perfil del usuario autenticado
    ---
    tags:
      - Auth
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            nombre:
              type: string
              example: "María García López"
            telefono:
              type: string
              example: "3009876543"
            documento:
              type: string
              example: "0987654321"
            direccion:
              type: string
              example: "Carrera 10 #5-20, Bucaramanga"
    responses:
      200:
        description: Perfil actualizado exitosamente
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Perfil actualizado"
      401:
        description: Token inválido o expirado
    """
    user_id = get_jwt()["sub"]
    from bson import ObjectId
    data = request.get_json()
    campos = {}
    for campo in ["nombre", "telefono", "documento", "direccion"]:
        if campo in data:
            campos[campo] = data[campo]
    db.usuarios.update_one({"_id": ObjectId(user_id)}, {"$set": campos})
    return jsonify({"mensaje": "Perfil actualizado"}), 200
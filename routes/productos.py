from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from bson import ObjectId
from database import db

productos_bp = Blueprint("productos", __name__)

def serializar(producto):
    producto["_id"] = str(producto["_id"])
    return producto

@productos_bp.route("/", methods=["GET"])
def get_productos():
    """
    Listar todos los productos
    ---
    tags:
      - Productos
    responses:
      200:
        description: Lista de productos
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
                example: "Collar Dorado"
              precio:
                type: number
                example: 45000
              stock:
                type: integer
                example: 10
              categoria:
                type: string
                example: "Collares"
              emoji:
                type: string
                example: "💍"
              codigo:
                type: string
                example: "COL-001"
    """
    productos = list(db.productos.find())
    return jsonify([serializar(p) for p in productos]), 200


@productos_bp.route("/<id>", methods=["GET"])
def get_producto(id):
    """
    Obtener un producto por ID
    ---
    tags:
      - Productos
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID del producto (MongoDB ObjectId)
        example: "664f1a2b3c4d5e6f7a8b9c0d"
    responses:
      200:
        description: Datos del producto
        schema:
          type: object
          properties:
            _id:
              type: string
              example: "664f1a2b3c4d5e6f7a8b9c0d"
            nombre:
              type: string
              example: "Collar Dorado"
            precio:
              type: number
              example: 45000
            stock:
              type: integer
              example: 10
            categoria:
              type: string
              example: "Collares"
            emoji:
              type: string
              example: "💍"
            codigo:
              type: string
              example: "COL-001"
      404:
        description: Producto no encontrado
    """
    producto = db.productos.find_one({"_id": ObjectId(id)})
    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404
    return jsonify(serializar(producto)), 200


@productos_bp.route("/", methods=["POST"])
@jwt_required()
def crear_producto():
    """
    Crear un nuevo producto (solo admin)
    ---
    tags:
      - Productos
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - nombre
            - precio
            - stock
            - categoria
            - codigo
          properties:
            nombre:
              type: string
              example: "Pulsera de Oro"
            precio:
              type: number
              example: 35000
            stock:
              type: integer
              example: 20
            categoria:
              type: string
              example: "Pulseras"
            emoji:
              type: string
              example: "✨"
            codigo:
              type: string
              example: "PUL-001"
    responses:
      201:
        description: Producto creado exitosamente
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Producto creado"
            id:
              type: string
              example: "664f1a2b3c4d5e6f7a8b9c0d"
      403:
        description: No autorizado — se requiere rol admin
      401:
        description: Token inválido o expirado
    """
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    
    data = request.get_json()
    nuevo = {
        "nombre": data["nombre"],
        "precio": data["precio"],
        "stock": data["stock"],
        "categoria": data["categoria"],
        "emoji": data.get("emoji", "💍"),
        "codigo": data["codigo"]
    }
    resultado = db.productos.insert_one(nuevo)
    return jsonify({"mensaje": "Producto creado", "id": str(resultado.inserted_id)}), 201


@productos_bp.route("/<id>", methods=["PUT"])
@jwt_required()
def editar_producto(id):
    """
    Editar un producto existente (solo admin)
    ---
    tags:
      - Productos
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID del producto (MongoDB ObjectId)
        example: "664f1a2b3c4d5e6f7a8b9c0d"
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            nombre:
              type: string
              example: "Collar Plateado"
            precio:
              type: number
              example: 38000
            stock:
              type: integer
              example: 15
            categoria:
              type: string
              example: "Collares"
            emoji:
              type: string
              example: "🌟"
            codigo:
              type: string
              example: "COL-002"
    responses:
      200:
        description: Producto actualizado exitosamente
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Producto actualizado"
      403:
        description: No autorizado — se requiere rol admin
      401:
        description: Token inválido o expirado
      404:
        description: Producto no encontrado
    """
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    
    data = request.get_json()
    db.productos.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"mensaje": "Producto actualizado"}), 200


@productos_bp.route("/<id>", methods=["DELETE"])
@jwt_required()
def eliminar_producto(id):
    """
    Eliminar un producto (solo admin)
    ---
    tags:
      - Productos
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID del producto (MongoDB ObjectId)
        example: "664f1a2b3c4d5e6f7a8b9c0d"
    responses:
      200:
        description: Producto eliminado exitosamente
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Producto eliminado"
      403:
        description: No autorizado — se requiere rol admin
      401:
        description: Token inválido o expirado
      404:
        description: Producto no encontrado
    """
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    
    db.productos.delete_one({"_id": ObjectId(id)})
    return jsonify({"mensaje": "Producto eliminado"}), 200
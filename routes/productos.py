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
    productos = list(db.productos.find())
    return jsonify([serializar(p) for p in productos]), 200

@productos_bp.route("/<id>", methods=["GET"])
def get_producto(id):
    producto = db.productos.find_one({"_id": ObjectId(id)})
    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404
    return jsonify(serializar(producto)), 200

@productos_bp.route("/", methods=["POST"])
@jwt_required()
def crear_producto():
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
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    
    data = request.get_json()
    db.productos.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"mensaje": "Producto actualizado"}), 200

@productos_bp.route("/<id>", methods=["DELETE"])
@jwt_required()
def eliminar_producto(id):
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    
    db.productos.delete_one({"_id": ObjectId(id)})
    return jsonify({"mensaje": "Producto eliminado"}), 200
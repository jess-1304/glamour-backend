from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from bson import ObjectId
from database import db
import cloudinary.uploader
from config.cloudinary import *

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

    nombre    = request.form.get("nombre")
    precio    = request.form.get("precio")
    stock     = request.form.get("stock")
    categoria = request.form.get("categoria")
    emoji     = request.form.get("emoji", "💍")
    codigo    = request.form.get("codigo")

    if not all([nombre, precio, stock, categoria, codigo]):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    imagen = request.files.get("imagen")
    imagen_url = None

    if imagen:
        resultado = cloudinary.uploader.upload(
            imagen,
            folder="glamour/productos"
        )
        imagen_url = resultado.get("secure_url")

    nuevo = {
        "nombre":     nombre,
        "precio":     float(precio),
        "stock":      int(stock),
        "categoria":  categoria,
        "emoji":      emoji,
        "codigo":     codigo,
        "imagen_url": imagen_url
    }

    resultado_db = db.productos.insert_one(nuevo)
    return jsonify({
        "mensaje":    "Producto creado",
        "id":         str(resultado_db.inserted_id),
        "imagen_url": imagen_url
    }), 201


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
@productos_bp.route("/bulk-update", methods=["PUT"])
@jwt_required()
def bulk_update_imagenes():
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403

    actualizaciones = request.get_json()
    contador = 0

    for item in actualizaciones:
        db.productos.update_one(
            {"codigo": item["codigo"]},
            {"$set": {"imagen_url": item["imagen_url"]}}
        )
        contador += 1

    return jsonify({"mensaje": f"{contador} productos actualizados"}), 200
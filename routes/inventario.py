from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from bson import ObjectId
from datetime import datetime
from database import db

inventario_bp = Blueprint("inventario", __name__)

# ── Helper ────────────────────────────────────────────────
def serializar(doc):
    doc["_id"] = str(doc["_id"])
    return doc

# ── GET movimientos de inventario (solo admin) ────────────
@inventario_bp.route("/", methods=["GET"])
@jwt_required()
def get_movimientos():
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    movimientos = list(db.inventario.find().sort("fecha", -1).limit(200))
    return jsonify([serializar(m) for m in movimientos]), 200

# ── GET alertas de stock crítico ──────────────────────────
@inventario_bp.route("/alertas", methods=["GET"])
@jwt_required()
def get_alertas():
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    productos_bajos = list(db.productos.find({"stock": {"$lte": 5}}))
    return jsonify([serializar(p) for p in productos_bajos]), 200

# ── POST entrada de inventario (solo admin) ───────────────
@inventario_bp.route("/entrada", methods=["POST"])
@jwt_required()
def registrar_entrada():
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403

    data = request.get_json()
    producto_id = data.get("producto_id")
    cantidad    = data.get("cantidad", 0)
    costo       = data.get("costo_unitario", 0)
    proveedor   = data.get("proveedor", "")
    notas       = data.get("notas", "")

    if not producto_id or cantidad <= 0:
        return jsonify({"error": "producto_id y cantidad son requeridos"}), 400

    producto = db.productos.find_one({"_id": ObjectId(producto_id)})
    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404

    # Aumentar stock
    db.productos.update_one(
        {"_id": ObjectId(producto_id)},
        {"$inc": {"stock": cantidad}}
    )

    # Registrar movimiento
    movimiento = {
        "tipo":          "entrada",
        "producto_id":   producto_id,
        "producto_nombre": producto["nombre"],
        "producto_codigo": producto.get("codigo", ""),
        "cantidad":      cantidad,
        "costo_unitario": costo,
        "proveedor":     proveedor,
        "notas":         notas,
        "usuario":       claims.get("nombre", ""),
        "fecha":         datetime.now().isoformat(),
    }
    db.inventario.insert_one(movimiento)

    stock_nuevo = producto["stock"] + cantidad
    return jsonify({
        "mensaje":     "Entrada registrada",
        "stock_nuevo": stock_nuevo
    }), 201

# ── POST salida manual de inventario (solo admin) ─────────
@inventario_bp.route("/salida", methods=["POST"])
@jwt_required()
def registrar_salida():
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403

    data = request.get_json()
    producto_id = data.get("producto_id")
    cantidad    = data.get("cantidad", 0)
    notas       = data.get("notas", "")

    if not producto_id or cantidad <= 0:
        return jsonify({"error": "producto_id y cantidad son requeridos"}), 400

    producto = db.productos.find_one({"_id": ObjectId(producto_id)})
    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404

    if producto["stock"] < cantidad:
        return jsonify({"error": "Stock insuficiente"}), 400

    # Reducir stock
    db.productos.update_one(
        {"_id": ObjectId(producto_id)},
        {"$inc": {"stock": -cantidad}}
    )

    # Registrar movimiento
    movimiento = {
        "tipo":            "salida",
        "producto_id":     producto_id,
        "producto_nombre": producto["nombre"],
        "producto_codigo": producto.get("codigo", ""),
        "cantidad":        cantidad,
        "notas":           notas,
        "usuario":         claims.get("nombre", ""),
        "fecha":           datetime.now().isoformat(),
    }
    db.inventario.insert_one(movimiento)

    stock_nuevo = producto["stock"] - cantidad
    return jsonify({
        "mensaje":     "Salida registrada",
        "stock_nuevo": stock_nuevo
    }), 201

# ── GET movimientos de un producto específico ─────────────
@inventario_bp.route("/producto/<producto_id>", methods=["GET"])
@jwt_required()
def get_movimientos_producto(producto_id):
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    movimientos = list(db.inventario.find(
        {"producto_id": producto_id}
    ).sort("fecha", -1))
    return jsonify([serializar(m) for m in movimientos]), 200
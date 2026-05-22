from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from bson import ObjectId
from datetime import datetime
from database import db

pedidos_bp = Blueprint("pedidos", __name__)

# ── Helper ────────────────────────────────────────────────
def serializar(doc):
    doc["_id"] = str(doc["_id"])
    return doc

def generar_numero_factura():
    anio = datetime.now().strftime("%Y")
    total = db.pedidos.count_documents({})
    return f"FAC-{anio}-{(total+1):04d}"

# ── GET todos los pedidos (solo admin) ────────────────────
@pedidos_bp.route("/", methods=["GET"])
@jwt_required()
def get_pedidos():
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    pedidos = list(db.pedidos.find().sort("fecha", -1).limit(200))
    return jsonify([serializar(p) for p in pedidos]), 200

# ── GET pedidos del cliente autenticado ───────────────────
@pedidos_bp.route("/mis-pedidos", methods=["GET"])
@jwt_required()
def get_mis_pedidos():
    user_id = get_jwt()["sub"]
    pedidos = list(db.pedidos.find({"cliente_id": user_id}).sort("fecha", -1))
    return jsonify([serializar(p) for p in pedidos]), 200

# ── POST crear pedido ─────────────────────────────────────
@pedidos_bp.route("/", methods=["POST"])
@jwt_required()
def crear_pedido():
    claims  = get_jwt()
    user_id = claims["sub"]
    data    = request.get_json()

    items = data.get("items", [])
    if not items:
        return jsonify({"error": "El pedido debe tener al menos un ítem"}), 400

    # Calcular totales y descontar stock
    subtotal = 0
    items_guardados = []
    for item in items:
        producto = db.productos.find_one({"_id": ObjectId(item["producto_id"])})
        if not producto:
            return jsonify({"error": f"Producto {item['producto_id']} no encontrado"}), 404
        if producto["stock"] < item["cantidad"]:
            return jsonify({"error": f"Stock insuficiente para {producto['nombre']}"}), 400

        sub = item["cantidad"] * item["precio_unitario"]
        subtotal += sub
        items_guardados.append({
            "producto_id":     item["producto_id"],
            "nombre":          producto["nombre"],
            "codigo":          producto.get("codigo", ""),
            "cantidad":        item["cantidad"],
            "precio_unitario": item["precio_unitario"],
            "subtotal":        sub,
        })
        # Descontar stock
        db.productos.update_one(
            {"_id": ObjectId(item["producto_id"])},
            {"$inc": {"stock": -item["cantidad"]}}
        )

    descuento = data.get("descuento", 0)
    total     = subtotal - descuento

    nuevo_pedido = {
        "numero_factura": generar_numero_factura(),
        "cliente_id":     user_id,
        "cliente_nombre": claims.get("nombre", ""),
        "cliente_email":  claims.get("email", ""),
        "items":          items_guardados,
        "subtotal":       subtotal,
        "descuento":      descuento,
        "total":          total,
        "estado":         "pendiente",
        "notas":          data.get("notas", ""),
        "fecha":          datetime.now().isoformat(),
    }

    resultado = db.pedidos.insert_one(nuevo_pedido)
    return jsonify({
        "mensaje":        "Pedido creado",
        "id":             str(resultado.inserted_id),
        "numero_factura": nuevo_pedido["numero_factura"],
        "total":          total,
    }), 201

# ── PUT cambiar estado (solo admin) ───────────────────────
@pedidos_bp.route("/<id>/estado", methods=["PUT"])
@jwt_required()
def cambiar_estado(id):
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403

    data   = request.get_json()
    estado = data.get("estado")
    if estado not in ["pendiente", "despachado", "cancelado"]:
        return jsonify({"error": "Estado inválido"}), 400

    db.pedidos.update_one({"_id": ObjectId(id)}, {"$set": {"estado": estado}})
    return jsonify({"mensaje": f"Estado actualizado a {estado}"}), 200

# ── GET clientes (solo admin) ─────────────────────────────
@pedidos_bp.route("/clientes", methods=["GET"])
@jwt_required()
def get_clientes():
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    clientes = list(db.usuarios.find({"rol": "cliente"}))
    return jsonify([serializar(c) for c in clientes]), 200
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


@pedidos_bp.route("/", methods=["GET"])
@jwt_required()
def get_pedidos():
    """
    Listar todos los pedidos (solo admin)
    ---
    tags:
      - Pedidos
    security:
      - Bearer: []
    responses:
      200:
        description: Lista de pedidos ordenados por fecha descendente (máx. 200)
        schema:
          type: array
          items:
            type: object
            properties:
              _id:
                type: string
                example: "664f1a2b3c4d5e6f7a8b9c0d"
              numero_factura:
                type: string
                example: "FAC-2024-0001"
              cliente_id:
                type: string
                example: "664f1a2b3c4d5e6f7a8b9c0e"
              cliente_nombre:
                type: string
                example: "María García"
              cliente_email:
                type: string
                example: "maria@glamour.com"
              items:
                type: array
                items:
                  type: object
                  properties:
                    producto_id:
                      type: string
                    nombre:
                      type: string
                    codigo:
                      type: string
                    cantidad:
                      type: integer
                    precio_unitario:
                      type: number
                    subtotal:
                      type: number
              subtotal:
                type: number
                example: 90000
              descuento:
                type: number
                example: 5000
              total:
                type: number
                example: 85000
              estado:
                type: string
                enum: [pendiente, despachado, cancelado]
                example: "pendiente"
              notas:
                type: string
              fecha:
                type: string
                example: "2024-01-15T10:30:00"
      403:
        description: No autorizado — se requiere rol admin
      401:
        description: Token inválido o expirado
    """
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    pedidos = list(db.pedidos.find().sort("fecha", -1).limit(200))
    return jsonify([serializar(p) for p in pedidos]), 200


@pedidos_bp.route("/mis-pedidos", methods=["GET"])
@jwt_required()
def get_mis_pedidos():
    """
    Obtener pedidos del usuario autenticado
    ---
    tags:
      - Pedidos
    security:
      - Bearer: []
    responses:
      200:
        description: Lista de pedidos del cliente autenticado
        schema:
          type: array
          items:
            type: object
            properties:
              _id:
                type: string
                example: "664f1a2b3c4d5e6f7a8b9c0d"
              numero_factura:
                type: string
                example: "FAC-2024-0001"
              total:
                type: number
                example: 85000
              estado:
                type: string
                enum: [pendiente, despachado, cancelado]
                example: "pendiente"
              fecha:
                type: string
                example: "2024-01-15T10:30:00"
              items:
                type: array
                items:
                  type: object
      401:
        description: Token inválido o expirado
    """
    user_id = get_jwt()["sub"]
    pedidos = list(db.pedidos.find({"cliente_id": user_id}).sort("fecha", -1))
    return jsonify([serializar(p) for p in pedidos]), 200


@pedidos_bp.route("/", methods=["POST"])
@jwt_required()
def crear_pedido():
    """
    Crear un nuevo pedido
    ---
    tags:
      - Pedidos
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - items
          properties:
            items:
              type: array
              description: Lista de productos del pedido
              items:
                type: object
                required:
                  - producto_id
                  - cantidad
                  - precio_unitario
                properties:
                  producto_id:
                    type: string
                    example: "664f1a2b3c4d5e6f7a8b9c0d"
                  cantidad:
                    type: integer
                    example: 2
                  precio_unitario:
                    type: number
                    example: 45000
            descuento:
              type: number
              example: 5000
            notas:
              type: string
              example: "Empacar con cuidado"
    responses:
      201:
        description: Pedido creado exitosamente
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Pedido creado"
            id:
              type: string
              example: "664f1a2b3c4d5e6f7a8b9c0d"
            numero_factura:
              type: string
              example: "FAC-2024-0001"
            total:
              type: number
              example: 85000
      400:
        description: Items vacíos o stock insuficiente
      404:
        description: Producto no encontrado
      401:
        description: Token inválido o expirado
    """
    claims  = get_jwt()
    user_id = claims["sub"]
    data    = request.get_json()

    items = data.get("items", [])
    if not items:
        return jsonify({"error": "El pedido debe tener al menos un ítem"}), 400

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


@pedidos_bp.route("/<id>/estado", methods=["PUT"])
@jwt_required()
def cambiar_estado(id):
    """
    Cambiar el estado de un pedido (solo admin)
    ---
    tags:
      - Pedidos
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        type: string
        required: true
        description: ID del pedido (MongoDB ObjectId)
        example: "664f1a2b3c4d5e6f7a8b9c0d"
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - estado
          properties:
            estado:
              type: string
              enum: [pendiente, despachado, cancelado]
              example: "despachado"
    responses:
      200:
        description: Estado actualizado exitosamente
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Estado actualizado a despachado"
      400:
        description: Estado inválido
      403:
        description: No autorizado — se requiere rol admin
      401:
        description: Token inválido o expirado
    """
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403

    data   = request.get_json()
    estado = data.get("estado")
    if estado not in ["pendiente", "despachado", "cancelado"]:
        return jsonify({"error": "Estado inválido"}), 400

    db.pedidos.update_one({"_id": ObjectId(id)}, {"$set": {"estado": estado}})
    return jsonify({"mensaje": f"Estado actualizado a {estado}"}), 200


@pedidos_bp.route("/clientes", methods=["GET"])
@jwt_required()
def get_clientes():
    """
    Listar clientes desde el módulo de pedidos (solo admin)
    ---
    tags:
      - Pedidos
    security:
      - Bearer: []
    responses:
      200:
        description: Lista de usuarios con rol cliente
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
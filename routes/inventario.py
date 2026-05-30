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


@inventario_bp.route("/", methods=["GET"])
@jwt_required()
def get_movimientos():
    """
    Listar todos los movimientos de inventario (solo admin)
    ---
    tags:
      - Inventario
    security:
      - Bearer: []
    responses:
      200:
        description: Lista de movimientos ordenados por fecha descendente (máx. 200)
        schema:
          type: array
          items:
            type: object
            properties:
              _id:
                type: string
                example: "664f1a2b3c4d5e6f7a8b9c0d"
              tipo:
                type: string
                enum: [entrada, salida]
                example: "entrada"
              producto_id:
                type: string
                example: "664f1a2b3c4d5e6f7a8b9c0e"
              producto_nombre:
                type: string
                example: "Collar Dorado"
              producto_codigo:
                type: string
                example: "COL-001"
              cantidad:
                type: integer
                example: 20
              costo_unitario:
                type: number
                example: 15000
              proveedor:
                type: string
                example: "Joyería Mayorista S.A."
              notas:
                type: string
                example: "Compra mensual"
              usuario:
                type: string
                example: "Admin Principal"
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
    movimientos = list(db.inventario.find().sort("fecha", -1).limit(200))
    return jsonify([serializar(m) for m in movimientos]), 200


@inventario_bp.route("/alertas", methods=["GET"])
@jwt_required()
def get_alertas():
    """
    Obtener productos con stock crítico (≤ 5 unidades)
    ---
    tags:
      - Inventario
    security:
      - Bearer: []
    responses:
      200:
        description: Lista de productos con stock bajo o agotado
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
                example: "Pulsera de Oro"
              codigo:
                type: string
                example: "PUL-001"
              stock:
                type: integer
                example: 3
              categoria:
                type: string
                example: "Pulseras"
              precio:
                type: number
                example: 35000
      403:
        description: No autorizado — se requiere rol admin
      401:
        description: Token inválido o expirado
    """
    claims = get_jwt()
    if claims.get("rol") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    productos_bajos = list(db.productos.find({"stock": {"$lte": 5}}))
    return jsonify([serializar(p) for p in productos_bajos]), 200


@inventario_bp.route("/entrada", methods=["POST"])
@jwt_required()
def registrar_entrada():
    """
    Registrar entrada de stock (solo admin)
    ---
    tags:
      - Inventario
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - producto_id
            - cantidad
          properties:
            producto_id:
              type: string
              example: "664f1a2b3c4d5e6f7a8b9c0d"
            cantidad:
              type: integer
              example: 50
            costo_unitario:
              type: number
              example: 15000
            proveedor:
              type: string
              example: "Joyería Mayorista S.A."
            notas:
              type: string
              example: "Compra mensual de reposición"
    responses:
      201:
        description: Entrada registrada y stock actualizado
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Entrada registrada"
            stock_nuevo:
              type: integer
              example: 60
      400:
        description: producto_id o cantidad inválidos
      404:
        description: Producto no encontrado
      403:
        description: No autorizado — se requiere rol admin
      401:
        description: Token inválido o expirado
    """
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

    db.productos.update_one(
        {"_id": ObjectId(producto_id)},
        {"$inc": {"stock": cantidad}}
    )

    movimiento = {
        "tipo":            "entrada",
        "producto_id":     producto_id,
        "producto_nombre": producto["nombre"],
        "producto_codigo": producto.get("codigo", ""),
        "cantidad":        cantidad,
        "costo_unitario":  costo,
        "proveedor":       proveedor,
        "notas":           notas,
        "usuario":         claims.get("nombre", ""),
        "fecha":           datetime.now().isoformat(),
    }
    db.inventario.insert_one(movimiento)

    stock_nuevo = producto["stock"] + cantidad
    return jsonify({
        "mensaje":     "Entrada registrada",
        "stock_nuevo": stock_nuevo
    }), 201


@inventario_bp.route("/salida", methods=["POST"])
@jwt_required()
def registrar_salida():
    """
    Registrar salida manual de stock (solo admin)
    ---
    tags:
      - Inventario
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - producto_id
            - cantidad
          properties:
            producto_id:
              type: string
              example: "664f1a2b3c4d5e6f7a8b9c0d"
            cantidad:
              type: integer
              example: 5
            notas:
              type: string
              example: "Ajuste por producto dañado"
    responses:
      201:
        description: Salida registrada y stock descontado
        schema:
          type: object
          properties:
            mensaje:
              type: string
              example: "Salida registrada"
            stock_nuevo:
              type: integer
              example: 15
      400:
        description: Stock insuficiente o datos inválidos
      404:
        description: Producto no encontrado
      403:
        description: No autorizado — se requiere rol admin
      401:
        description: Token inválido o expirado
    """
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

    db.productos.update_one(
        {"_id": ObjectId(producto_id)},
        {"$inc": {"stock": -cantidad}}
    )

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


@inventario_bp.route("/producto/<producto_id>", methods=["GET"])
@jwt_required()
def get_movimientos_producto(producto_id):
    """
    Obtener historial de movimientos de un producto específico
    ---
    tags:
      - Inventario
    security:
      - Bearer: []
    parameters:
      - in: path
        name: producto_id
        type: string
        required: true
        description: ID del producto (MongoDB ObjectId)
        example: "664f1a2b3c4d5e6f7a8b9c0d"
    responses:
      200:
        description: Historial de movimientos del producto ordenado por fecha
        schema:
          type: array
          items:
            type: object
            properties:
              _id:
                type: string
                example: "664f1a2b3c4d5e6f7a8b9c0d"
              tipo:
                type: string
                enum: [entrada, salida]
                example: "entrada"
              cantidad:
                type: integer
                example: 20
              costo_unitario:
                type: number
                example: 15000
              proveedor:
                type: string
              notas:
                type: string
              usuario:
                type: string
                example: "Admin Principal"
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
    movimientos = list(db.inventario.find(
        {"producto_id": producto_id}
    ).sort("fecha", -1))
    return jsonify([serializar(m) for m in movimientos]), 200
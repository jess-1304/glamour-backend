from flasgger import Swagger

swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": "apispec",
            "route": "/api/apispec.json",
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/api/docs",
    "swagger_ui_config": {
        "url": "/api/apispec.json"
    }
}

swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "Glamour Bisutería API",
        "description": "API REST para Glamour Bisutería. Autenticación via JWT Bearer Token.",
        "version": "1.0.0",
    },
    "host": "localhost:5000",
    "basePath": "/",
    "schemes": ["http"],
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "JWT Bearer token. Formato: Bearer <token>",
        }
    },
    "tags": [
        {"name": "Auth",       "description": "Autenticación y gestión de usuarios"},
        {"name": "Productos",  "description": "CRUD de productos"},
        {"name": "Pedidos",    "description": "Gestión de pedidos"},
        {"name": "Inventario", "description": "Control de inventario"},
    ],
}


def init_swagger(app):
    Swagger(app, config=swagger_config, template=swagger_template)
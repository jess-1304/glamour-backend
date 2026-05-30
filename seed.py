from database import db

productos = [
  {"nombre":"Collar Dorado Largo","codigo":"P001","categoria":"Collares","precio":12000,"stock":20,"emoji":"📿"},
  {"nombre":"Aretes Plateados Argolla","codigo":"P002","categoria":"Aretes","precio":8000,"stock":15,"emoji":"💎"},
  {"nombre":"Pulsera Cristal Multicolor","codigo":"P003","categoria":"Pulseras","precio":10000,"stock":8,"emoji":"💍"},
  {"nombre":"Anillo Ajustable Dorado","codigo":"P004","categoria":"Anillos","precio":6000,"stock":55,"emoji":"💍"},
  {"nombre":"Cadena Fina Plateada","codigo":"P005","categoria":"Collares","precio":15000,"stock":8,"emoji":"📿"},
  {"nombre":"Dije Corazón Esmaltado","codigo":"P006","categoria":"Dijes","precio":9000,"stock":18,"emoji":"✨"},
  {"nombre":"Pulsera Macramé Perlas","codigo":"P007","categoria":"Pulseras","precio":11000,"stock":42,"emoji":"💍"},
  {"nombre":"Aretes Gota Resina","codigo":"P008","categoria":"Aretes","precio":7000,"stock":18,"emoji":"💎"},
  {"nombre":"Collar Perlas Artificiales","codigo":"P009","categoria":"Collares","precio":18000,"stock":6,"emoji":"📿"},
  {"nombre":"Set Collar+Aretes Dorado","codigo":"P010","categoria":"Sets","precio":25000,"stock":8,"emoji":"🎁"},
  {"nombre":"Tobillera Dorada Flor","codigo":"P011","categoria":"Tobilleras","precio":8000,"stock":60,"emoji":"✨"},
  {"nombre":"Pulsera Rígida Plateada","codigo":"P012","categoria":"Pulseras","precio":13000,"stock":60,"emoji":"💍"},
  {"nombre":"Aretes Chandelier Dorados","codigo":"P013","categoria":"Aretes","precio":10500,"stock":14,"emoji":"💎"},
  {"nombre":"Dije Mariposa Cristal","codigo":"P014","categoria":"Dijes","precio":8500,"stock":16,"emoji":"✨"},
  {"nombre":"Collar Choker Terciopelo","codigo":"P015","categoria":"Collares","precio":9500,"stock":12,"emoji":"📿"},
]

# Eliminar la pulsera dorada de prueba y los existentes
db.productos.delete_many({})
db.productos.insert_many(productos)
print(f"✅ {len(productos)} productos insertados")
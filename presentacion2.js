const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "Glamour Bisutería · Sprint 2";
pres.author = "Jesús González · Marlón Gélvez";

// ── PALETA ──────────────────────────────────────────────────────────
const N  = "0D1117";
const N2 = "161B22";
const N3 = "21262D";
const GO = "C9A84C";
const CY = "38BDF8";
const GR = "4ADE80";
const RD = "F87171";
const PU = "A78BFA";
const WH = "F0F6FC";
const MU = "8B949E";

const mkShadow = () => ({ type:"outer", blur:8, offset:3, angle:135, color:"000000", opacity:0.25 });

// ══════════════════════════════════════════════════════════════════
// SLIDE 1 — PORTADA
// ══════════════════════════════════════════════════════════════════
let s = pres.addSlide();
s.background = { color: N };

s.addShape(pres.shapes.RECTANGLE, { x:7.5, y:0, w:2.5, h:5.625, fill:{ color:CY, transparency:92 }, line:{ type:"none" } });
s.addShape(pres.shapes.RECTANGLE, { x:0, y:4.8, w:10, h:0.825, fill:{ color:N2 }, line:{ type:"none" } });
s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:0.5, w:2.6, h:0.38, fill:{ color:CY, transparency:10 }, line:{ type:"none" } });
s.addText("SPRINT 2 · MAYO 2026", { x:0.5, y:0.5, w:2.6, h:0.38, fontSize:9, bold:true, color:N, align:"center", valign:"middle" });
s.addText("Glamour Bisutería", { x:0.5, y:1.0, w:8, h:1.0, fontSize:56, bold:true, color:GO, fontFace:"Calibri", charSpacing:4 });
s.addText("Backend Real · API REST · MongoDB Atlas · Render.com", { x:0.5, y:2.0, w:8, h:0.5, fontSize:16, color:WH, fontFace:"Calibri" });
s.addText("Sprint 2 · Python Flask · JWT · Inventario · Pedidos · Frontend Conectado", { x:0.5, y:2.5, w:8, h:0.4, fontSize:13, color:MU, fontFace:"Calibri" });
s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:3.05, w:6, h:0.04, fill:{ color:GO }, line:{ type:"none" } });

const roles = [
  { label:"Marlón Gélvez",  role:"PO · SM · Dev Frontend", x:0.5 },
  { label:"Jesús González", role:"BA · Dev Backend · DevOps", x:3.5 },
];
roles.forEach(r => {
  s.addShape(pres.shapes.RECTANGLE, { x:r.x, y:3.25, w:2.7, h:0.75, fill:{ color:N2 }, line:{ color:N3, pt:1 } });
  s.addText(r.label, { x:r.x+0.12, y:3.3,  w:2.5, h:0.28, fontSize:9,  bold:true, color:WH, fontFace:"Calibri" });
  s.addText(r.role,  { x:r.x+0.12, y:3.57, w:2.5, h:0.24, fontSize:7.5, color:MU, fontFace:"Calibri" });
});
s.addText("UTS Bucaramanga · Desarrollo de Aplicaciones Empresariales · Grupo 3", { x:0.3, y:4.85, w:9.4, h:0.38, fontSize:8.5, color:MU, align:"center", fontFace:"Calibri" });
s.addText("github.com/jess-1304/glamour-backend  ·  glamour-backend-6bug.onrender.com", { x:0.3, y:5.18, w:9.4, h:0.3, fontSize:8, color:GO, align:"center", fontFace:"Calibri" });

// ══════════════════════════════════════════════════════════════════
// SLIDE 2 — CONTEXTO SPRINT 2
// ══════════════════════════════════════════════════════════════════
s = pres.addSlide();
s.background = { color:"FFFFFF" };
s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:3.2, h:5.625, fill:{ color:N }, line:{ type:"none" } });
s.addShape(pres.shapes.RECTANGLE, { x:3.2, y:0, w:0.06, h:5.625, fill:{ color:CY }, line:{ type:"none" } });
s.addText("Contexto\ndel Sprint 2", { x:0.2, y:0.8, w:2.8, h:1.5, fontSize:22, bold:true, color:WH, fontFace:"Calibri", align:"left" });
s.addText("Backend Real", { x:0.2, y:2.35, w:2.8, h:0.4, fontSize:13, color:CY, fontFace:"Calibri", bold:true });
const ctxItems = ["7 días (L–V)","15 historias de usuario","Python · Flask · PyMongo","MongoDB Atlas · JWT","Render.com · GitHub Actions"];
ctxItems.forEach((t,i) => {
  s.addShape(pres.shapes.RECTANGLE, { x:0.2, y:2.9+i*0.42, w:2.7, h:0.35, fill:{ color:N2 }, line:{ type:"none" } });
  s.addText(t, { x:0.25, y:2.9+i*0.42, w:2.6, h:0.35, fontSize:9, color:WH, fontFace:"Calibri", valign:"middle" });
});

const cards = [
  { icon:"🎯", title:"Objetivo",
    body:"Migrar de datos simulados en JS a un backend real con Flask y MongoDB Atlas. Exponer endpoints REST con autenticación JWT para conectar el frontend." },
  { icon:"🔧", title:"Stack Técnico",
    body:"Python/Flask · PyMongo · flask-jwt-extended · bcrypt · gunicorn · python-dotenv · Render.com para deploy." },
  { icon:"🚀", title:"Deploy",
    body:"Backend en Render.com (glamour-backend-6bug.onrender.com). Variables de entorno en el panel de Render. CI/CD automático al hacer push a main." },
  { icon:"✅", title:"Resultado",
    body:"15 HUs completadas. API REST funcional con auth, productos, pedidos e inventario. Frontend conectado al backend en producción." },
];
cards.forEach((c,i) => {
  const cx = i%2===0 ? 3.5 : 6.7;
  const cy = i<2 ? 0.5 : 3.0;
  s.addShape(pres.shapes.RECTANGLE, { x:cx, y:cy, w:3.1, h:2.3, fill:{ color:"F8F9FA" }, line:{ color:"E2E8F0", pt:1 }, shadow:mkShadow() });
  s.addText(c.icon,  { x:cx+0.15, y:cy+0.15, w:0.6, h:0.6, fontSize:20 });
  s.addText(c.title, { x:cx+0.8,  y:cy+0.18, w:2.2, h:0.4, fontSize:12, bold:true, color:N, fontFace:"Calibri" });
  s.addText(c.body,  { x:cx+0.1,  y:cy+0.72, w:2.9, h:1.4, fontSize:9, color:"374151", fontFace:"Calibri", align:"left" });
});

// ══════════════════════════════════════════════════════════════════
// SLIDE 3 — 15 HISTORIAS DE USUARIO
// ══════════════════════════════════════════════════════════════════
s = pres.addSlide();
s.background = { color:"FFFFFF" };
s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.8, fill:{ color:N }, line:{ type:"none" } });
s.addText("15 Historias de Usuario — Sprint 2", { x:0.3, y:0.06, w:9.4, h:0.5, fontSize:20, bold:true, color:WH, fontFace:"Calibri" });
s.addText("Backend real conectado al frontend · Python Flask · MongoDB Atlas · JWT · Render.com", { x:0.3, y:0.53, w:9.4, h:0.25, fontSize:9, color:MU, fontFace:"Calibri" });

const huRows = [
  [{ text:"HU-01", color:N, fill:CY }, "JG", "Alta",  "Como equipo quiero crear el repositorio glamour-backend en GitHub con estructura MVC simplificada para separar el backend del frontend."],
  [{ text:"HU-02", color:N, fill:CY }, "JG", "Alta",  "Como dev quiero configurar Flask con CORS, JWT y dotenv para tener una base segura y lista para exponer endpoints REST."],
  [{ text:"HU-03", color:N, fill:CY }, "JG", "Alta",  "Como dev quiero centralizar la conexión a MongoDB Atlas en database.py para evitar múltiples instancias y conflictos de importación circular."],
  [{ text:"HU-04", color:N, fill:GO }, "JG", "Alta",  "Como visitante quiero registrarme con nombre, email, contraseña y rol para poder iniciar sesión con credenciales reales persistidas en MongoDB."],
  [{ text:"HU-05", color:N, fill:GO }, "JG", "Alta",  "Como usuario registrado quiero iniciar sesión y recibir un JWT con mis claims (rol, nombre, email) para autenticarme en rutas protegidas."],
  [{ text:"HU-06", color:N, fill:GO }, "MG", "Alta",  "Como admin quiero crear, listar, editar y eliminar productos con stock, precio, categoría y emoji mediante endpoints REST protegidos con JWT."],
  [{ text:"HU-07", color:N, fill:GO }, "JG", "Alta",  "Como dev quiero registrar pedidos en MongoDB descontando stock automáticamente y generando número de factura único para cada transacción."],
  [{ text:"HU-08", color:N, fill:GO }, "JG", "Alta",  "Como cliente autenticado quiero consultar mis pedidos vía GET /api/pedidos/mis-pedidos para ver mi historial real desde la base de datos."],
  [{ text:"HU-09", color:N, fill:PU }, "MG", "Alta",  "Como admin quiero cambiar el estado de un pedido (pendiente/despachado/cancelado) mediante PUT /api/pedidos/:id/estado para gestionar el flujo de despacho."],
  [{ text:"HU-10", color:N, fill:PU }, "JG", "Alta",  "Como admin quiero registrar entradas de stock a productos con proveedor, cantidad y costo para llevar control de inventario en MongoDB."],
  [{ text:"HU-11", color:N, fill:PU }, "JG", "Media", "Como admin quiero registrar salidas manuales de stock y consultar el historial de movimientos de inventario de cada producto."],
  [{ text:"HU-12", color:N, fill:PU }, "JG", "Alta",  "Como admin quiero recibir alertas de stock crítico (≤5 unidades) en el dashboard para actuar antes de quedarse sin producto."],
  [{ text:"HU-13", color:N, fill:GR }, "MG", "Alta",  "Como dev quiero reemplazar la DB local de JS en el frontend por llamadas a la API REST usando fetch con Bearer token para conectar todo el sistema."],
  [{ text:"HU-14", color:N, fill:GR }, "MG", "Alta",  "Como admin quiero ver el dashboard con estadísticas reales desde MongoDB: total pedidos, ventas, clientes, cancelados y stock crítico."],
  [{ text:"HU-15", color:N, fill:GR }, "MG", "Media", "Como equipo quiero desplegar el backend en Render.com con variables de entorno seguras y confirmar que el frontend en Railway consume la API en producción."],
];

const colW = [0.62, 0.46, 0.58, 8.04];
const headers = ["HU", "Resp.", "Prior.", "Historia de Usuario (Como … quiero … para …)"];

s.addTable(
  [
    headers.map(h => ({ text:h, options:{ bold:true, color:WH, fill:{ color:N }, fontSize:8, align:"center", fontFace:"Calibri" } })),
    ...huRows.map((row,ri) => [
      { text:row[0].text, options:{ bold:true, color:row[0].color, fill:{ color:row[0].fill }, fontSize:7.5, align:"center", fontFace:"Calibri" } },
      { text:row[1],      options:{ fontSize:7.5, align:"center", color:"374151", fill:{ color:ri%2===0?"F8F9FA":"FFFFFF" }, fontFace:"Calibri" } },
      { text:row[2],      options:{ fontSize:7.5, align:"center", color:row[2]==="Alta"?"C0392B":"2980B9", bold:true, fill:{ color:ri%2===0?"F8F9FA":"FFFFFF" }, fontFace:"Calibri" } },
      { text:row[3],      options:{ fontSize:7.5, color:"1F2937", fill:{ color:ri%2===0?"F8F9FA":"FFFFFF" }, fontFace:"Calibri" } },
    ])
  ],
  { x:0.15, y:0.85, w:9.7, colW, border:{ pt:0.5, color:"E5E7EB" } }
);

// ══════════════════════════════════════════════════════════════════
// SLIDE 4 — PLANNING BOARD (HUs por día)
// ══════════════════════════════════════════════════════════════════
s = pres.addSlide();
s.background = { color:N };
s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.75, fill:{ color:N2 }, line:{ type:"none" } });
s.addText("Sprint Planning — Distribución por Día", { x:0.3, y:0.08, w:9, h:0.42, fontSize:20, bold:true, color:WH, fontFace:"Calibri" });
s.addText("Lunes → Viernes · 5 jornadas · Resultado: backend en Render + frontend conectado", { x:0.3, y:0.48, w:9, h:0.24, fontSize:9, color:MU, fontFace:"Calibri" });

const dias = [
  { dia:"LUN", titulo:"Setup Backend\n& DB Atlas",      hus:["HU-01","HU-02","HU-03"], color:CY },
  { dia:"MAR", titulo:"Auth JWT\n& Productos API",      hus:["HU-04","HU-05","HU-06"], color:GO },
  { dia:"MIÉ", titulo:"Pedidos\n& Inventario",          hus:["HU-07","HU-08","HU-09"], color:PU },
  { dia:"JUE", titulo:"Stock, Alertas\n& Deploy Render",hus:["HU-10","HU-11","HU-12"], color:GR },
  { dia:"VIE", titulo:"Frontend API\n& Producción",     hus:["HU-13","HU-14","HU-15"], color:RD },
];

const shortDesc = {
  "HU-01":"Repo glamour-backend",  "HU-02":"Flask + JWT + CORS",
  "HU-03":"database.py central",   "HU-04":"Registro real MongoDB",
  "HU-05":"Login JWT claims",       "HU-06":"CRUD productos REST",
  "HU-07":"Pedidos + descuento stock","HU-08":"GET mis-pedidos",
  "HU-09":"Cambio de estado pedido","HU-10":"Entrada de inventario",
  "HU-11":"Salida + historial",     "HU-12":"Alertas stock crítico",
  "HU-13":"Frontend → API fetch",   "HU-14":"Dashboard real MongoDB",
  "HU-15":"Deploy Render + Railway",
};

dias.forEach((d,i) => {
  const cx = 0.12 + i * 1.96;
  s.addShape(pres.shapes.RECTANGLE, { x:cx, y:0.82, w:1.84, h:0.72, fill:{ color:d.color, transparency:10 }, line:{ type:"none" } });
  s.addText(d.dia,    { x:cx, y:0.83, w:1.84, h:0.32, fontSize:12, bold:true, color:N, align:"center", fontFace:"Calibri" });
  s.addText(d.titulo, { x:cx, y:1.14, w:1.84, h:0.38, fontSize:7,  color:N,  align:"center", fontFace:"Calibri" });
  s.addShape(pres.shapes.RECTANGLE, { x:cx, y:1.56, w:1.84, h:3.78, fill:{ color:N2 }, line:{ color:d.color, pt:1, transparency:60 } });
  d.hus.forEach((hu,hi) => {
    const hy = 1.66 + hi * 0.58;
    s.addShape(pres.shapes.RECTANGLE, { x:cx+0.07, y:hy, w:1.7, h:0.5, fill:{ color:N3 }, line:{ color:d.color, pt:1 } });
    s.addText(hu,               { x:cx+0.1, y:hy+0.04, w:0.75, h:0.22, fontSize:8.5, bold:true, color:d.color, fontFace:"Calibri" });
    s.addText(shortDesc[hu]||"",{ x:cx+0.1, y:hy+0.26, w:1.54, h:0.2,  fontSize:7,   color:MU, fontFace:"Calibri" });
  });
  s.addShape(pres.shapes.RECTANGLE, { x:cx, y:5.15, w:1.84, h:0.3, fill:{ color:d.color, transparency:20 }, line:{ type:"none" } });
  s.addText(`${d.hus.length} HUs`, { x:cx, y:5.15, w:1.84, h:0.3, fontSize:9, bold:true, color:N, align:"center", fontFace:"Calibri" });
});

// ══════════════════════════════════════════════════════════════════
// SLIDE 5 — IMPEDIMENTOS (dailys)
// ══════════════════════════════════════════════════════════════════
s = pres.addSlide();
s.background = { color:"FFFFFF" };
s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.78, fill:{ color:N }, line:{ type:"none" } });
s.addText("⚠️  Impedimentos por Daily — Sprint 2", { x:0.3, y:0.1, w:9, h:0.44, fontSize:20, bold:true, color:WH, fontFace:"Calibri" });
s.addText("10 impedimentos reales detectados y resueltos durante el sprint · Formato Scrum", { x:0.3, y:0.52, w:9, h:0.24, fontSize:9, color:MU, fontFace:"Calibri" });

const obs = [
  {
    dia:"Día 1 · Lunes", color:CY,
    items:[
      { icon:"🔄", title:"ImportError circular auth↔app",
        desc:"auth.py importaba db desde app.py mientras app.py importaba auth_bp desde auth.py, generando ImportError al arrancar Flask.",
        sol:"Se creó database.py independiente. Ambos módulos importan db desde allí, eliminando la dependencia circular." },
      { icon:"🔐", title:"jwt vs PyJWT en conflicto",
        desc:"El paquete jwt==1.4.0 coexistía con PyJWT. flask-jwt-extended no podía importar DecodeError y lanzaba ImportError al arrancar.",
        sol:"Se desinstalaron ambos y se reinstalaron flask-jwt-extended==4.6.0 + PyJWT==2.8.0 compatibles entre sí." },
    ]
  },
  {
    dia:"Día 2 · Martes", color:GO,
    items:[
      { icon:"🌐", title:"MONGO_URI con None local",
        desc:"load_dotenv() no encontraba el .env porque se ejecutaba Flask desde un directorio diferente. os.getenv('MONGO_URI') devolvía None.",
        sol:"Se usó load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env')) para forzar la ruta absoluta del archivo." },
      { icon:"📦", title:"Segunda conexión MongoDB en rutas",
        desc:"productos.py y auth.py creaban su propio MongoClient duplicando conexiones y causando timeouts intermitentes bajo carga.",
        sol:"Se centralizó en database.py. Todas las rutas importan db desde allí con una única instancia de conexión." },
    ]
  },
  {
    dia:"Día 3 · Miércoles", color:PU,
    items:[
      { icon:"🚀", title:"Gunicorn no encontrado en Render",
        desc:"El primer deploy falló con 'gunicorn: command not found' (exit 127) porque gunicorn no estaba en requirements.txt.",
        sol:"pip install gunicorn → pip freeze > requirements.txt → git push. Render detectó el nuevo commit y redeplegó exitosamente." },
      { icon:"📋", title:"requirements.txt con typo en GitHub",
        desc:"Se subió un archivo llamado 'requeriments.txt' (sin la 'i') en paralelo al correcto, causando confusión en el CI/CD.",
        sol:"git rm requeriments.txt + git commit para eliminar el archivo duplicado. Solo quedó requirements.txt correcto." },
    ]
  },
  {
    dia:"Día 4 · Jueves", color:GR,
    items:[
      { icon:"🔑", title:"JWT_SECRET_KEY no leído en Render",
        desc:"El backend desplegado devolvía RuntimeError 'JWT_SECRET_KEY must be set' porque Render no tenía las variables de entorno configuradas.",
        sol:"Se agregaron MONGO_URI y JWT_SECRET_KEY en el panel Environment de Render. Redeploy automático solucionó el error." },
      { icon:"🔗", title:"MONGO_URI incompleta en Render",
        desc:"La URI copiada en el panel de Render omitía '?retryWrites=true&w=majority', causando ServerSelectionTimeoutError al conectar.",
        sol:"Se editó la variable directamente en Render con la URI completa. La conexión a Atlas quedó estable." },
    ]
  },
  {
    dia:"Día 5 · Viernes", color:RD,
    items:[
      { icon:"🌐", title:"Frontend con token vencido",
        desc:"Al hacer el primer pedido real, el token guardado en localStorage era del sprint anterior y fue rechazado por el backend con 401.",
        sol:"Se hizo logout + login nuevo para obtener un token válido del backend en producción. El pedido se procesó correctamente." },
      { icon:"🌱", title:"Solo un producto en MongoDB",
        desc:"Al conectar el frontend a la API, la tienda mostraba solo la 'Pulsera Dorada' de prueba porque MongoDB solo tenía ese registro.",
        sol:"Se creó seed.py con los 15 productos del catálogo. python seed.py → db.productos.delete_many({}) + insert_many() → 15 productos en Atlas." },
    ]
  },
];

obs.forEach((blk,bi) => {
  const cx = 0.15 + bi * 1.97;
  s.addShape(pres.shapes.RECTANGLE, { x:cx, y:0.86, w:1.84, h:0.4, fill:{ color:blk.color, transparency:15 }, line:{ type:"none" } });
  s.addText(blk.dia, { x:cx, y:0.86, w:1.84, h:0.4, fontSize:8, bold:true, color:N, align:"center", valign:"middle", fontFace:"Calibri" });
  blk.items.forEach((it,ii) => {
    const cy = 1.34 + ii * 2.05;
    s.addShape(pres.shapes.RECTANGLE, { x:cx,      y:cy,      w:1.84, h:1.92, fill:{ color:"F8F9FA" }, line:{ color:"E2E8F0", pt:1 }, shadow:mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x:cx,      y:cy,      w:1.84, h:0.3,  fill:{ color:blk.color, transparency:20 }, line:{ type:"none" } });
    s.addText(`${it.icon} ${it.title}`, { x:cx+0.06, y:cy+0.02, w:1.72, h:0.28, fontSize:7, bold:true, color:N, fontFace:"Calibri", valign:"middle" });
    s.addText(it.desc,                  { x:cx+0.06, y:cy+0.36, w:1.72, h:0.62, fontSize:6.5, color:"374151", fontFace:"Calibri" });
    s.addShape(pres.shapes.RECTANGLE,   { x:cx+0.06, y:cy+1.02, w:1.72, h:0.16, fill:{ color:"DCFCE7" }, line:{ type:"none" } });
    s.addText("✓ Resolución:",          { x:cx+0.06, y:cy+1.02, w:1.72, h:0.16, fontSize:6, bold:true, color:"166534", fontFace:"Calibri" });
    s.addText(it.sol,                   { x:cx+0.06, y:cy+1.2,  w:1.72, h:0.62, fontSize:6.5, color:"166534", fontFace:"Calibri" });
  });
});

// ══════════════════════════════════════════════════════════════════
// SLIDE 6 — BURNDOWN CHART
// ══════════════════════════════════════════════════════════════════
s = pres.addSlide();
s.background = { color:N };
s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.78, fill:{ color:N2 }, line:{ type:"none" } });
s.addText("📉  Burndown Chart · Sprint 2", { x:0.3, y:0.08, w:9, h:0.44, fontSize:20, bold:true, color:WH, fontFace:"Calibri" });
s.addText("HUs restantes por jornada · Línea roja = avance real · Línea gris = tendencia ideal lineal", { x:0.3, y:0.5, w:9, h:0.24, fontSize:9, color:MU, fontFace:"Calibri" });

// Real: impedimentos D1 y D2 retrasaron el avance; D3-D5 recuperaron el ritmo
s.addChart(pres.charts.LINE,
  [
    { name:"HUs restantes (real)", labels:["Inicio","Lun","Mar","Mié","Jue","Vie"], values:[15,13,10,7,3,0] },
    { name:"Tendencia ideal",      labels:["Inicio","Lun","Mar","Mié","Jue","Vie"], values:[15,12,9,6,3,0] },
  ],
  {
    x:0.3, y:0.9, w:6.8, h:4.4,
    chartColors:[RD, MU],
    lineSize:3, lineSmooth:false,
    showLegend:true, legendPos:"b", legendFontSize:9, legendColor:MU,
    chartArea:{ fill:{ color:N2 } },
    catAxisLabelColor:MU, valAxisLabelColor:MU,
    valGridLine:{ color:N3, size:0.5 }, catGridLine:{ style:"none" },
    valAxisMinVal:0, valAxisMaxVal:16,
    showValue:true, dataLabelFontSize:8, dataLabelColor:WH,
  }
);

s.addShape(pres.shapes.RECTANGLE, { x:7.3, y:0.9, w:2.5, h:4.4, fill:{ color:N2 }, line:{ color:N3, pt:1 } });
s.addText("Análisis\nBurndown", { x:7.4, y:1.0, w:2.3, h:0.5, fontSize:10, bold:true, color:WH, fontFace:"Calibri" });

const bdItems = [
  { t:"Línea roja → HUs reales restantes", c:RD },
  { t:"Línea gris → bajada ideal uniforme", c:MU },
  { t:"D1: -2 HUs (impedimentos import/jwt)", c:RD },
  { t:"D2: -3 HUs (MONGO_URI + rutas)", c:GO },
  { t:"D3-D4: aceleración tras resolver Render", c:GR },
  { t:"Viernes: 0 HUs → sprint cerrado al 100%", c:GR },
];
bdItems.forEach((b,i) => {
  s.addShape(pres.shapes.RECTANGLE, { x:7.38, y:1.6+i*0.5, w:0.18, h:0.26, fill:{ color:b.c }, line:{ type:"none" } });
  s.addText(b.t, { x:7.62, y:1.6+i*0.5, w:2.1, h:0.28, fontSize:7.5, color:WH, fontFace:"Calibri", valign:"middle" });
});

s.addShape(pres.shapes.RECTANGLE, { x:7.4, y:4.58, w:2.2, h:0.6, fill:{ color:"1F3830" }, line:{ type:"none" } });
s.addText("15/15 HUs\ncompletadas al Viernes", { x:7.5, y:4.59, w:2.1, h:0.56, fontSize:8.5, bold:true, color:GR, fontFace:"Calibri" });

// ══════════════════════════════════════════════════════════════════
// SLIDE 7 — BURNUP CHART
// ══════════════════════════════════════════════════════════════════
s = pres.addSlide();
s.background = { color:N };
s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.78, fill:{ color:N2 }, line:{ type:"none" } });
s.addText("📈  BurnUp Chart · Sprint 2", { x:0.3, y:0.08, w:9, h:0.44, fontSize:20, bold:true, color:WH, fontFace:"Calibri" });
s.addText("HUs completadas acumuladas · Línea verde = avance real · Línea gris = meta total (15 HUs)", { x:0.3, y:0.5, w:9, h:0.24, fontSize:9, color:MU, fontFace:"Calibri" });

s.addChart(pres.charts.LINE,
  [
    { name:"HUs completadas (acum.)", labels:["Inicio","Lun","Mar","Mié","Jue","Vie"], values:[0,2,5,8,12,15] },
    { name:"Meta total (15 HUs)",     labels:["Inicio","Lun","Mar","Mié","Jue","Vie"], values:[15,15,15,15,15,15] },
  ],
  {
    x:0.3, y:0.9, w:6.8, h:4.4,
    chartColors:[GR, MU],
    lineSize:3, lineSmooth:false,
    showLegend:true, legendPos:"b", legendFontSize:9, legendColor:MU,
    chartArea:{ fill:{ color:N2 } },
    catAxisLabelColor:MU, valAxisLabelColor:MU,
    valGridLine:{ color:N3, size:0.5 }, catGridLine:{ style:"none" },
    valAxisMinVal:0, valAxisMaxVal:17,
    showValue:true, dataLabelFontSize:8, dataLabelColor:WH,
  }
);

s.addShape(pres.shapes.RECTANGLE, { x:7.3, y:0.9, w:2.5, h:4.4, fill:{ color:N2 }, line:{ color:N3, pt:1 } });
s.addText("Análisis\nBurnUp", { x:7.4, y:1.0, w:2.3, h:0.5, fontSize:10, bold:true, color:WH, fontFace:"Calibri" });

const buItems = [
  { t:"Línea verde → HUs acumuladas completadas", c:GR },
  { t:"Línea gris → meta fija de 15 HUs", c:MU },
  { t:"Lunes: 2 HUs (repo + Flask setup)", c:CY },
  { t:"Martes: +3 HUs (auth + productos)", c:GO },
  { t:"Miércoles: +3 HUs (pedidos + estado)", c:PU },
  { t:"Jueves: +4 HUs (inventario + deploy)", c:GR },
  { t:"Viernes: +3 HUs → meta alcanzada ✅", c:GR },
];
buItems.forEach((b,i) => {
  s.addShape(pres.shapes.RECTANGLE, { x:7.38, y:1.6+i*0.44, w:0.18, h:0.24, fill:{ color:b.c }, line:{ type:"none" } });
  s.addText(b.t, { x:7.62, y:1.6+i*0.44, w:2.1, h:0.28, fontSize:7, color:WH, fontFace:"Calibri", valign:"middle" });
});

s.addShape(pres.shapes.RECTANGLE, { x:7.4, y:4.65, w:2.2, h:0.52, fill:{ color:"1F3830" }, line:{ type:"none" } });
s.addText("Sprint cerrado\nal 100% ✅", { x:7.5, y:4.66, w:2.1, h:0.5, fontSize:9, bold:true, color:GR, fontFace:"Calibri" });

// ══════════════════════════════════════════════════════════════════
// SLIDE 8 — ESTIMACIÓN vs ESFUERZO REAL
// ══════════════════════════════════════════════════════════════════
s = pres.addSlide();
s.background = { color:"FFFFFF" };
s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.78, fill:{ color:N }, line:{ type:"none" } });
s.addText("⏱️  Primera Estimación vs. Esfuerzo Real — Sprint 2", { x:0.3, y:0.1, w:9, h:0.44, fontSize:18, bold:true, color:WH, fontFace:"Calibri" });
s.addText("Puntos de historia (Story Points) por historia de usuario · Escala Fibonacci simplificada", { x:0.3, y:0.52, w:9, h:0.24, fontSize:9, color:MU, fontFace:"Calibri" });

// Estimación en SP (inicial) vs real (horas invertidas reales expresadas en SP equivalentes)
s.addChart(pres.charts.BAR,
  [
    { name:"Estimado (SP)", values:[2,2,2,3,3,3,3,2,2,3,2,2,3,3,2] },
    { name:"Real (SP)",     values:[3,4,2,3,3,3,4,2,2,3,3,2,4,3,3] },
  ],
  {
    x:0.2, y:0.9, w:9.6, h:3.6,
    chartColors:[CY, RD],
    barGrouping:"clustered",
    showLegend:true, legendPos:"t", legendFontSize:9,
    chartArea:{ fill:{ color:"F8F9FA" } },
    catAxisLabelColor:"374151", valAxisLabelColor:"374151",
    valGridLine:{ color:"E2E8F0", size:0.5 },
    valAxisMinVal:0, valAxisMaxVal:5,
    catAxisLabelFrequency:1,
    showValue:true, dataLabelFontSize:7,
    dataLabelColor:N,
    catAxisTitle:"HU-01 → HU-15",
    valAxisTitle:"Story Points",
  }
);

// Tabla resumen
const estRows = [
  ["HU-01","Repo Backend","2","2","0%"],
  ["HU-02","Flask + JWT setup","2","3","+50%"],
  ["HU-03","database.py central","2","2","0%"],
  ["HU-04","Registro real","3","3","0%"],
  ["HU-05","Login JWT","3","3","0%"],
  ["HU-06","CRUD Productos","3","3","0%"],
  ["HU-07","Pedidos + stock","3","4","+33%"],
  ["HU-08","GET mis-pedidos","2","2","0%"],
  ["HU-09","Estado pedidos","2","2","0%"],
  ["HU-10","Entrada inventario","3","3","0%"],
  ["HU-11","Salida + historial","2","3","+50%"],
  ["HU-12","Alertas stock","2","2","0%"],
  ["HU-13","Frontend → API","3","4","+33%"],
  ["HU-14","Dashboard real","3","3","0%"],
  ["HU-15","Deploy Render","2","3","+50%"],
];

// Mini tabla de resumen al pie
s.addShape(pres.shapes.RECTANGLE, { x:0.2, y:4.62, w:2.2, h:0.75, fill:{ color:N2 }, line:{ type:"none" } });
s.addText("Total estimado", { x:0.3, y:4.66, w:2.0, h:0.25, fontSize:8, color:MU, fontFace:"Calibri" });
s.addText("37 SP", { x:0.3, y:4.88, w:2.0, h:0.38, fontSize:20, bold:true, color:CY, fontFace:"Calibri" });

s.addShape(pres.shapes.RECTANGLE, { x:2.6, y:4.62, w:2.2, h:0.75, fill:{ color:N2 }, line:{ type:"none" } });
s.addText("Total real", { x:2.7, y:4.66, w:2.0, h:0.25, fontSize:8, color:MU, fontFace:"Calibri" });
s.addText("44 SP", { x:2.7, y:4.88, w:2.0, h:0.38, fontSize:20, bold:true, color:RD, fontFace:"Calibri" });

s.addShape(pres.shapes.RECTANGLE, { x:5.0, y:4.62, w:2.2, h:0.75, fill:{ color:N2 }, line:{ type:"none" } });
s.addText("Desviación total", { x:5.1, y:4.66, w:2.0, h:0.25, fontSize:8, color:MU, fontFace:"Calibri" });
s.addText("+19%", { x:5.1, y:4.88, w:2.0, h:0.38, fontSize:20, bold:true, color:GO, fontFace:"Calibri" });

s.addShape(pres.shapes.RECTANGLE, { x:7.4, y:4.62, w:2.4, h:0.75, fill:{ color:"1F3830" }, line:{ type:"none" } });
s.addText("HUs en desviación", { x:7.5, y:4.66, w:2.2, h:0.25, fontSize:8, color:MU, fontFace:"Calibri" });
s.addText("5 de 15 HUs", { x:7.5, y:4.88, w:2.2, h:0.38, fontSize:14, bold:true, color:GR, fontFace:"Calibri" });

// ══════════════════════════════════════════════════════════════════
// SLIDE 9 — PRUEBAS DE ACEPTACIÓN
// ══════════════════════════════════════════════════════════════════
s = pres.addSlide();
s.background = { color:N };
s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.78, fill:{ color:N2 }, line:{ type:"none" } });
s.addText("✅  Pruebas de Aceptación — Sprint 2", { x:0.3, y:0.08, w:9, h:0.44, fontSize:20, bold:true, color:WH, fontFace:"Calibri" });
s.addText("Verificadas con Thunder Client (local) y navegador en producción · Railway + Render", { x:0.3, y:0.5, w:9, h:0.24, fontSize:9, color:MU, fontFace:"Calibri" });

// Gráfico de pastel — estado de pruebas
s.addChart(pres.charts.DOUGHNUT,
  [{ name:"Estado", labels:["Aprobadas","Fallidas inicialmente (luego corregidas)","Pendientes"], values:[12,3,0] }],
  {
    x:0.2, y:0.9, w:3.8, h:3.5,
    chartColors:[GR, GO, RD],
    showLegend:true, legendPos:"b", legendFontSize:8, legendColor:WH,
    chartArea:{ fill:{ color:N2 } },
    showLabel:true, showPercent:true, dataLabelFontSize:9, dataLabelColor:WH,
    holeSize:45,
  }
);

// Panel de pruebas detallado
const pruebas = [
  { hu:"HU-04", test:"POST /api/auth/registro", resultado:"✅ 201 Created · usuario en MongoDB Atlas",   estado:GR },
  { hu:"HU-05", test:"POST /api/auth/login",    resultado:"✅ 200 OK · token JWT con claims correctos",   estado:GR },
  { hu:"HU-06", test:"POST /api/productos/ (Bearer)", resultado:"✅ 201 · producto creado en DB",       estado:GR },
  { hu:"HU-06", test:"GET  /api/productos/",    resultado:"✅ 200 · lista con 15 productos desde MongoDB",estado:GR },
  { hu:"HU-07", test:"POST /api/pedidos/ (carrito)", resultado:"✅ 201 · factura generada + stock descontado", estado:GR },
  { hu:"HU-08", test:"GET  /api/pedidos/mis-pedidos",resultado:"✅ 200 · solo pedidos del token activo",  estado:GR },
  { hu:"HU-09", test:"PUT  /api/pedidos/:id/estado", resultado:"✅ 200 · estado actualizado en MongoDB", estado:GR },
  { hu:"HU-10", test:"POST /api/inventario/entrada", resultado:"✅ 201 · stock incrementado + movimiento", estado:GR },
  { hu:"HU-11", test:"POST /api/inventario/salida",  resultado:"✅ 201 · stock reducido con validación",  estado:GR },
  { hu:"HU-12", test:"GET  /api/inventario/alertas", resultado:"✅ 200 · productos con stock ≤ 5",        estado:GR },
  { hu:"HU-13", test:"Frontend tienda → API",   resultado:"⚠️ Fallido inicial (token vencido) → corregido con re-login", estado:GO },
  { hu:"HU-15", test:"Deploy en Render.com",    resultado:"⚠️ Fallido x2 (gunicorn, PyJWT) → resuelto en 3er deploy", estado:GO },
];

s.addShape(pres.shapes.RECTANGLE, { x:4.2, y:0.88, w:5.6, h:0.38, fill:{ color:N3 }, line:{ type:"none" } });
["HU","Endpoint / Test","Resultado"].forEach((h,i) => {
  s.addText(h, { x:4.2+[0,0.5,1.5][i], y:0.88, w:[0.5,1.0,4.1][i], h:0.38, fontSize:7.5, bold:true, color:GO, fontFace:"Calibri", valign:"middle" });
});

pruebas.forEach((p,i) => {
  const py = 1.3 + i * 0.28;
  const bg = i%2===0 ? N2 : N3;
  s.addShape(pres.shapes.RECTANGLE, { x:4.2, y:py, w:5.6, h:0.26, fill:{ color:bg }, line:{ type:"none" } });
  s.addText(p.hu,         { x:4.22, y:py+0.02, w:0.46, h:0.22, fontSize:6.5, bold:true, color:p.estado, fontFace:"Calibri" });
  s.addText(p.test,       { x:4.7,  y:py+0.02, w:1.1,  h:0.22, fontSize:6,   color:CY,  fontFace:"Calibri" });
  s.addText(p.resultado,  { x:5.82, y:py+0.02, w:3.94, h:0.22, fontSize:6,   color:WH,  fontFace:"Calibri" });
});

// Estadísticas finales
s.addShape(pres.shapes.RECTANGLE, { x:0.2, y:4.52, w:3.8, h:0.85, fill:{ color:N2 }, line:{ color:N3, pt:1 } });
const stats = [
  { v:"12", l:"Pruebas aprobadas", c:GR },
  { v:"3",  l:"Corregidas en sprint", c:GO },
  { v:"0",  l:"Pendientes", c:MU },
];
stats.forEach((st,i) => {
  s.addText(st.v, { x:0.25+i*1.25, y:4.55, w:1.1, h:0.44, fontSize:28, bold:true, color:st.c, fontFace:"Calibri", align:"center" });
  s.addText(st.l, { x:0.25+i*1.25, y:4.96, w:1.1, h:0.3,  fontSize:7,  color:MU,  fontFace:"Calibri", align:"center" });
});

// ══════════════════════════════════════════════════════════════════
// SLIDE 10 — SEGUIMIENTO: ¿QUÉ HICIMOS EN EL SPRINT?
// ══════════════════════════════════════════════════════════════════
s = pres.addSlide();
s.background = { color:"FFFFFF" };
s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.78, fill:{ color:N }, line:{ type:"none" } });
s.addText("🗺️  Seguimiento del Sprint 2 — ¿Qué construimos?", { x:0.3, y:0.1, w:9, h:0.44, fontSize:18, bold:true, color:WH, fontFace:"Calibri" });
s.addText("De la base de datos quemada en JS a un sistema real con Flask · MongoDB · JWT · Render", { x:0.3, y:0.52, w:9, h:0.24, fontSize:9, color:MU, fontFace:"Calibri" });

const modulos = [
  {
    titulo:"🔧 Backend Flask",
    color:CY, x:0.2, y:0.88,
    items:[
      "app.py — Flask + CORS + JWT + Blueprints",
      "database.py — MongoClient único (Atlas)",
      "Procfile — gunicorn app:app",
      "requirements.txt — 22 dependencias",
      ".env — MONGO_URI + JWT_SECRET_KEY",
    ]
  },
  {
    titulo:"🔐 Auth (routes/auth.py)",
    color:GO, x:3.4, y:0.88,
    items:[
      "POST /api/auth/registro — bcrypt hash",
      "POST /api/auth/login — JWT 15min",
      "GET  /api/auth/perfil — usuario activo",
      "PUT  /api/auth/perfil — actualizar datos",
      "GET  /api/auth/clientes — solo admin",
    ]
  },
  {
    titulo:"💎 Productos (routes/productos.py)",
    color:PU, x:6.6, y:0.88,
    items:[
      "GET  /api/productos/ — público",
      "GET  /api/productos/:id — público",
      "POST /api/productos/ — admin JWT",
      "PUT  /api/productos/:id — admin JWT",
      "DELETE /api/productos/:id — admin JWT",
    ]
  },
  {
    titulo:"📦 Pedidos (routes/pedidos.py)",
    color:GR, x:0.2, y:3.1,
    items:[
      "GET  /api/pedidos/ — admin JWT",
      "GET  /api/pedidos/mis-pedidos — cliente",
      "POST /api/pedidos/ — descuenta stock",
      "PUT  /api/pedidos/:id/estado — admin",
      "GET  /api/pedidos/clientes — admin",
    ]
  },
  {
    titulo:"📊 Inventario (routes/inventario.py)",
    color:RD, x:3.4, y:3.1,
    items:[
      "GET  /api/inventario/ — historial movs",
      "GET  /api/inventario/alertas — stock ≤5",
      "POST /api/inventario/entrada — sube stock",
      "POST /api/inventario/salida — baja stock",
      "GET  /api/inventario/producto/:id",
    ]
  },
  {
    titulo:"🌐 Frontend Conectado",
    color:GO, x:6.6, y:3.1,
    items:[
      "apiFetch() — fetch + Bearer token",
      "Login/registro → API real (no DB local)",
      "Tienda → GET /api/productos/ (MongoDB)",
      "Checkout → POST /api/pedidos/ real",
      "Admin dashboard → datos en tiempo real",
    ]
  },
];

modulos.forEach(m => {
  s.addShape(pres.shapes.RECTANGLE, { x:m.x, y:m.y, w:3.0, h:2.1, fill:{ color:"F8F9FA" }, line:{ color:m.color, pt:1.5 }, shadow:mkShadow() });
  s.addShape(pres.shapes.RECTANGLE, { x:m.x, y:m.y, w:3.0, h:0.36, fill:{ color:m.color, transparency:15 }, line:{ type:"none" } });
  s.addText(m.titulo, { x:m.x+0.08, y:m.y+0.02, w:2.85, h:0.34, fontSize:8.5, bold:true, color:N, fontFace:"Calibri", valign:"middle" });
  m.items.forEach((it,ii) => {
    s.addText(`· ${it}`, { x:m.x+0.1, y:m.y+0.44+ii*0.32, w:2.82, h:0.3, fontSize:7.5, color:"374151", fontFace:"Calibri" });
  });
});

// ══════════════════════════════════════════════════════════════════
// SLIDE 11 — DEMO: ENDPOINTS Y FRONTEND
// ══════════════════════════════════════════════════════════════════
s = pres.addSlide();
s.background = { color:N };
s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.78, fill:{ color:N2 }, line:{ type:"none" } });
s.addText("🖥️  Demo · Endpoints REST y Frontend Conectado", { x:0.3, y:0.08, w:9, h:0.44, fontSize:20, bold:true, color:WH, fontFace:"Calibri" });
s.addText("Backend Python/Flask · MongoDB Atlas · JWT · Render.com · Frontend Railway", { x:0.3, y:0.5, w:9, h:0.24, fontSize:9, color:MU, fontFace:"Calibri" });

const demos = [
  { emoji:"🔐", title:"Autenticación JWT",
    desc:"Registro persiste en MongoDB con bcrypt. Login devuelve JWT con claims (rol, nombre, email). Token válido 15 minutos. Rutas protegidas con @jwt_required().",
    estado:"✅ Real en Atlas", color:CY },
  { emoji:"💎", title:"CRUD Productos",
    desc:"GET público sin token. POST/PUT/DELETE requieren JWT admin. Stock actualizable. 15 productos sembrados con seed.py en MongoDB Atlas.",
    estado:"✅ Real en Atlas", color:GO },
  { emoji:"📦", title:"Pedidos con Factura",
    desc:"POST /api/pedidos/ descuenta stock en tiempo real. Genera número de factura único (FAC-YYYY-NNNN). GET mis-pedidos filtra por JWT del cliente.",
    estado:"✅ Real en Atlas", color:PU },
  { emoji:"📊", title:"Inventario y Alertas",
    desc:"Entradas incrementan stock y registran movimiento. Alertas detectan productos con stock ≤5 unidades. Admin ve historial completo de movimientos.",
    estado:"✅ Real en Atlas", color:GR },
  { emoji:"🛒", title:"Tienda Conectada",
    desc:"Frontend carga productos desde GET /api/productos/. Carrito construye items[] y los envía al POST /api/pedidos/. Factura se muestra con datos del backend.",
    estado:"✅ Railway→Render", color:GO },
  { emoji:"🛠️", title:"Panel Admin Real",
    desc:"Dashboard con conteos reales de MongoDB. Despachar/cancelar pedidos actualiza estado en Atlas. Editor de productos persiste cambios en la DB.",
    estado:"✅ Datos reales", color:RD },
  { emoji:"🌐", title:"Deploy en Render",
    desc:"Backend en glamour-backend-6bug.onrender.com. Variables MONGO_URI y JWT_SECRET_KEY en panel Render. Plan gratuito (spin-down 50s de inactividad).",
    estado:"✅ Producción", color:CY },
  { emoji:"🌱", title:"Seed de Datos",
    desc:"seed.py pobló MongoDB Atlas con los 15 productos reales del catálogo. db.productos.delete_many({}) + insert_many() para reiniciar datos de prueba.",
    estado:"✅ 15 productos", color:GR },
];

demos.forEach((d,i) => {
  const col = i%2===0 ? 0 : 1;
  const row = Math.floor(i/2);
  const cx = 0.2 + col * 4.9;
  const cy = 0.88 + row * 1.16;
  s.addShape(pres.shapes.RECTANGLE, { x:cx, y:cy, w:4.7, h:1.05, fill:{ color:N2 }, line:{ color:d.color, pt:1 } });
  s.addShape(pres.shapes.RECTANGLE, { x:cx, y:cy, w:0.06, h:1.05, fill:{ color:d.color }, line:{ type:"none" } });
  s.addText(d.emoji,  { x:cx+0.15, y:cy+0.18, w:0.65, h:0.65, fontSize:22, align:"center" });
  s.addText(d.title,  { x:cx+0.88, y:cy+0.08, w:2.7,  h:0.3,  fontSize:10, bold:true, color:WH, fontFace:"Calibri" });
  s.addText(d.desc,   { x:cx+0.88, y:cy+0.38, w:2.7,  h:0.5,  fontSize:7.5, color:MU,  fontFace:"Calibri" });
  s.addText(d.estado, { x:cx+3.7,  y:cy+0.06, w:0.93, h:0.3,  fontSize:6.5, bold:true, color:GR, align:"right", fontFace:"Calibri" });
});

// ══════════════════════════════════════════════════════════════════
// SLIDE 12 — DEPLOY: ARQUITECTURA EN PRODUCCIÓN
// ══════════════════════════════════════════════════════════════════
s = pres.addSlide();
s.background = { color:"FFFFFF" };
s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.78, fill:{ color:N }, line:{ type:"none" } });
s.addText("🚀  Arquitectura en Producción · Sprint 2", { x:0.3, y:0.1, w:9, h:0.44, fontSize:20, bold:true, color:WH, fontFace:"Calibri" });
s.addText("Frontend Railway → Backend Render → MongoDB Atlas · HTTPS en toda la cadena", { x:0.3, y:0.52, w:9, h:0.24, fontSize:9, color:MU, fontFace:"Calibri" });

// Diagrama de arquitectura con bloques
const arq = [
  { label:"Usuario", sub:"Navegador Web", color:WH, bg:N2, x:0.2 },
  { label:"Railway", sub:"Frontend estático\nindex.html", color:GO, bg:"F8F9FA", x:2.5 },
  { label:"Render.com", sub:"Backend Flask\ngunicorn", color:CY, bg:"F8F9FA", x:4.8 },
  { label:"MongoDB Atlas", sub:"glamour_db\nCloud Database", color:GR, bg:"F8F9FA", x:7.1 },
];
arq.forEach((a,i) => {
  s.addShape(pres.shapes.RECTANGLE, { x:a.x, y:1.0, w:2.0, h:1.6, fill:{ color:a.bg }, line:{ color:a.color, pt:2 }, shadow:mkShadow() });
  s.addText(a.label, { x:a.x+0.05, y:1.1,  w:1.9, h:0.5, fontSize:11, bold:true, color:a.color==="FFFFFF"?WH:N, align:"center", fontFace:"Calibri" });
  s.addText(a.sub,   { x:a.x+0.05, y:1.65, w:1.9, h:0.7, fontSize:8,  color:a.color==="FFFFFF"?MU:"374151", align:"center", fontFace:"Calibri" });
  if(i<3) s.addText("→", { x:a.x+2.05, y:1.55, w:0.4, h:0.5, fontSize:18, color:GO, align:"center", fontFace:"Calibri", bold:true });
});

// URLs
s.addShape(pres.shapes.RECTANGLE, { x:0.2, y:2.8, w:9.6, h:0.6, fill:{ color:N2 }, line:{ type:"none" } });
s.addText("Frontend:", { x:0.4, y:2.88, w:1.2, h:0.35, fontSize:8, color:MU, fontFace:"Calibri" });
s.addText("proyecto-production-079f.up.railway.app", { x:1.6, y:2.88, w:3.5, h:0.35, fontSize:8, color:GO, fontFace:"Calibri" });
s.addText("Backend:", { x:5.3, y:2.88, w:1.1, h:0.35, fontSize:8, color:MU, fontFace:"Calibri" });
s.addText("glamour-backend-6bug.onrender.com", { x:6.4, y:2.88, w:3.2, h:0.35, fontSize:8, color:CY, fontFace:"Calibri" });

// Repos
const repoInfo = [
  { label:"Repo Frontend:", val:"github.com/jess-1304/proyecto", color:GO },
  { label:"Repo Backend:",  val:"github.com/jess-1304/glamour-backend", color:CY },
  { label:"Stack Backend:",  val:"Python 3.14 · Flask 3.1 · PyMongo 4.17 · Gunicorn 26 · bcrypt 5.0 · flask-jwt-extended 4.6", color:WH },
  { label:"Stack Frontend:", val:"HTML5 · CSS3 · JS ES6 · fetch API · localStorage (JWT token)", color:WH },
];
repoInfo.forEach((r,i) => {
  s.addShape(pres.shapes.RECTANGLE, { x:0.2, y:3.55+i*0.46, w:9.6, h:0.4, fill:{ color:i%2===0?"F8F9FA":"FFFFFF" }, line:{ color:"E2E8F0", pt:0.5 } });
  s.addText(r.label, { x:0.35, y:3.57+i*0.46, w:1.8, h:0.34, fontSize:8, bold:true, color:"374151", fontFace:"Calibri" });
  s.addText(r.val,   { x:2.2,  y:3.57+i*0.46, w:7.5, h:0.34, fontSize:8, color:"374151", fontFace:"Calibri" });
});

// ══════════════════════════════════════════════════════════════════
// SLIDE 13 — RETROSPECTIVA + SPRINT 3
// ══════════════════════════════════════════════════════════════════
s = pres.addSlide();
s.background = { color:"FFFFFF" };
s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.78, fill:{ color:N }, line:{ type:"none" } });
s.addText("🔄  Retrospectiva Sprint 2 · Planificación Sprint 3", { x:0.3, y:0.1, w:9, h:0.44, fontSize:18, bold:true, color:WH, fontFace:"Calibri" });
s.addText("¿Qué salió bien? · ¿Qué mejorar? · ¿Qué construiremos en Sprint 3?", { x:0.3, y:0.52, w:9, h:0.24, fontSize:9, color:MU, fontFace:"Calibri" });

const retro = [
  {
    cat:"✅ Salió bien", color:GR,
    items:[
      "Backend Flask funcional en 5 jornadas",
      "MongoDB Atlas conectado sin pérdida de datos",
      "JWT con roles admin/cliente funcionando al 100%",
      "CRUD completo de productos con protección de roles",
      "Inventario con entradas, salidas y alertas operativo",
      "Frontend completamente desacoplado de datos locales",
    ]
  },
  {
    cat:"⚠️ Por mejorar", color:GO,
    items:[
      "Verificar compatibilidad de versiones antes de instalar",
      "Configurar variables de entorno en Render antes del deploy",
      "Incluir gunicorn en requirements desde el primer commit",
      "Probar el flujo completo (frontend↔backend) antes del viernes",
      "Documentar los endpoints con Swagger desde el inicio",
      "Hacer seed de datos al inicio, no al final del sprint",
    ]
  },
  {
    cat:"🚀 Sprint 3 — Planeado", color:CY,
    items:[
      "Dashboard con gráficas dinámicas (Chart.js o D3)",
      "Tablero Kanban con actualización en tiempo real",
      "Exportar reportes en PDF y Excel desde el backend",
      "Documentación completa de la API en Swagger/OpenAPI 3.0",
      "BurnUp/BurnDown y gráficas Scrum interactivas",
      "Optimización de rendimiento y tests de carga en Render",
    ]
  },
];

retro.forEach((r,i) => {
  const cx = 0.2 + i * 3.25;
  s.addShape(pres.shapes.RECTANGLE, { x:cx, y:0.88, w:3.1, h:4.55, fill:{ color:"F8F9FA" }, line:{ color:"E2E8F0", pt:1 }, shadow:mkShadow() });
  s.addShape(pres.shapes.RECTANGLE, { x:cx, y:0.88, w:3.1, h:0.44, fill:{ color:r.color, transparency:15 }, line:{ type:"none" } });
  s.addText(r.cat, { x:cx+0.1, y:0.9, w:2.9, h:0.4, fontSize:10, bold:true, color:N, fontFace:"Calibri", valign:"middle" });
  r.items.forEach((item,ii) => {
    s.addShape(pres.shapes.RECTANGLE, { x:cx+0.12, y:1.44+ii*0.55, w:0.2, h:0.2, fill:{ color:r.color, transparency:20 }, line:{ type:"none" } });
    s.addText("·",   { x:cx+0.12, y:1.44+ii*0.55, w:0.2,  h:0.2,  fontSize:10, bold:true, color:r.color, align:"center", fontFace:"Calibri" });
    s.addText(item,  { x:cx+0.38, y:1.44+ii*0.55, w:2.65, h:0.46, fontSize:8.5, color:"374151", fontFace:"Calibri" });
  });
});

// ══════════════════════════════════════════════════════════════════
// SLIDE 14 — CIERRE
// ══════════════════════════════════════════════════════════════════
s = pres.addSlide();
s.background = { color:N };
s.addShape(pres.shapes.OVAL, { x:6.5, y:-1, w:5, h:5, fill:{ color:CY, transparency:94 }, line:{ type:"none" } });
s.addShape(pres.shapes.RECTANGLE, { x:0, y:4.8, w:10, h:0.825, fill:{ color:N2 }, line:{ type:"none" } });
s.addText("Sprint 2", { x:0.5, y:0.8, w:8, h:0.9, fontSize:58, bold:true, color:GO, fontFace:"Calibri", charSpacing:4 });
s.addText("Backend real en producción · MongoDB · JWT · Render", { x:0.5, y:1.7, w:8, h:0.55, fontSize:18, color:WH, fontFace:"Calibri" });
s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:2.32, w:5.5, h:0.04, fill:{ color:GO }, line:{ type:"none" } });

const finals = [
  { v:"15/15", l:"HUs completadas", c:GR },
  { v:"10",    l:"impedimentos resueltos", c:GO },
  { v:"12",    l:"pruebas aprobadas", c:CY },
  { v:"100%",  l:"sistema en producción", c:PU },
];
finals.forEach((f,i) => {
  s.addText(f.v, { x:0.5+i*2.3, y:2.55, w:2.1, h:0.7, fontSize:28, bold:true, color:f.c, fontFace:"Calibri" });
  s.addText(f.l, { x:0.5+i*2.3, y:3.22, w:2.1, h:0.3, fontSize:8.5, color:MU, fontFace:"Calibri" });
});

s.addText("¡Gracias! · Preguntas y respuestas", { x:0.5, y:3.75, w:8, h:0.5, fontSize:14, color:WH, fontFace:"Calibri" });
s.addText("Jesús González · Marlón Gélvez · UTS Bucaramanga 2026 · Grupo 3", { x:0.3, y:4.86, w:9.4, h:0.35, fontSize:8.5, color:MU, align:"center", fontFace:"Calibri" });
s.addText("github.com/jess-1304/glamour-backend  ·  glamour-backend-6bug.onrender.com", { x:0.3, y:5.18, w:9.4, h:0.28, fontSize:7.5, color:GO, align:"center", fontFace:"Calibri" });

// ── WRITE ────────────────────────────────────────────────────────
pres.writeFile({fileName:"Presentacion_Sprint2.pptx"})
  .then(() => console.log("✅ Presentación generada: Presentacion_Sprint2.pptx"))
  .catch(e => { console.error(e); process.exit(1); });
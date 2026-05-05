// =============================================
// FRESHMART — Script Principal
// Versión profesional sin emojis ni textos académicos
// Usuarios demo: admin/1234, vendedor1/1234, cliente1/1234
// =============================================

// ---- MONEDAS ----
const MONEDAS = {
  USD: { simbolo: "$",   tasa: 1,     decimales: 2 },
  CLP: { simbolo: "$",   tasa: 950,   decimales: 0 },
  EUR: { simbolo: "€",   tasa: 0.92,  decimales: 2 },
  GBP: { simbolo: "£",   tasa: 0.79,  decimales: 2 },
  JPY: { simbolo: "¥",   tasa: 149.5, decimales: 0 },
  BRL: { simbolo: "R$",  tasa: 4.97,  decimales: 2 },
  MXN: { simbolo: "$",   tasa: 17.15, decimales: 2 },
};
let monedaActual = "CLP";

function cambiarMoneda(codigo) {
  monedaActual = codigo;
  localStorage.setItem("fm_moneda", codigo);
  const activa = document.querySelector(".vista:not(.hidden)");
  if (activa?.id === "vistaTienda")       mostrarProductos();
  if (activa?.id === "vistaMisProductos") mostrarMisProductos();
  if (activa?.id === "vistaAdmin")        mostrarAdmin();
  if (activa?.id === "vistaHistorial")    mostrarHistorial();
  if (document.getElementById("modalCarrito").classList.contains("abierto")) renderCarrito();
}

function formatPrecio(precioUSD) {
  const m = MONEDAS[monedaActual];
  const convertido = precioUSD * m.tasa;
  const formateado = convertido.toLocaleString("es-CL", {
    minimumFractionDigits: m.decimales,
    maximumFractionDigits: m.decimales
  });
  return `${m.simbolo}${formateado} ${monedaActual}`;
}

// ---- USUARIOS DEMO ----
const USUARIOS_DEMO = [
  { usuario: "admin",    password: "1234", rol: "admin",   nombre: "Administrador" },
  { usuario: "vendedor1",password: "1234", rol: "vendedor",nombre: "María García" },
  { usuario: "cliente1", password: "1234", rol: "cliente", nombre: "Juan Pérez" }
];

// ---- PRODUCTOS DEMO ----
const PRODUCTOS_DEMO = [
  { id: 1, nombre: "Manzanas Rojas",   precio: 2.99, stock: 50, categoria: "frutas",    descripcion: "Manzanas frescas importadas, perfectas para snack o repostería.", imagen: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80", vendedor: "vendedor1", estado: "aprobado", ventas: 34, calificaciones: [{ usuario: "cliente1", valor: 5, comentario: "Excelente calidad, muy frescas." }] },
  { id: 2, nombre: "Pechuga de Pollo", precio: 6.50, stock: 30, categoria: "carnes",    descripcion: "Pechuga de pollo fresca sin hueso, ideal para parrilla o al horno.", imagen: "https://images.unsplash.com/photo-1604503468506-a8da13d11d36?w=400&q=80", vendedor: "vendedor1", estado: "aprobado", ventas: 21, calificaciones: [] },
  { id: 3, nombre: "Leche Entera 1L",  precio: 1.20, stock: 80, categoria: "lacteos",   descripcion: "Leche entera pasteurizada, rica en calcio y vitaminas.", imagen: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80", vendedor: "vendedor1", estado: "aprobado", ventas: 58, calificaciones: [{ usuario: "cliente1", valor: 4, comentario: "Buena calidad." }] },
  { id: 4, nombre: "Pan Artesanal",    precio: 3.50, stock: 20, categoria: "panaderia", descripcion: "Pan artesanal recién horneado, con corteza crujiente y miga suave.", imagen: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80", vendedor: "vendedor1", estado: "aprobado", ventas: 15, calificaciones: [] },
  { id: 5, nombre: "Tomates Cherry",   precio: 2.10, stock: 45, categoria: "verduras",  descripcion: "Tomates cherry dulces, perfectos para ensaladas.", imagen: "https://images.unsplash.com/photo-1546094096-0df4bcaad338?w=400&q=80", vendedor: "vendedor1", estado: "aprobado", ventas: 42, calificaciones: [] },
  { id: 6, nombre: "Jugo de Naranja",  precio: 2.80, stock: 35, categoria: "bebidas",   descripcion: "Jugo natural de naranja, sin conservantes añadidos.", imagen: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80", vendedor: "vendedor1", estado: "aprobado", ventas: 27, calificaciones: [] }
];

// ---- ESTADO GLOBAL ----
let usuarioActual     = null;
let carrito           = [];
let estrellaSeleccionada = 0;
let darkMode          = false;

// ============================================================
// LANDING PAGE
// ============================================================
function irAlLogin() {
  document.getElementById("landingPage").classList.add("hidden");
  document.getElementById("authOverlay").classList.remove("hidden");
}

// ============================================================
// DARK MODE
// ============================================================
function toggleDarkMode() {
  darkMode = !darkMode;
  document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  document.getElementById("darkModeBtn").textContent = darkMode ? "☀️" : "🌙";
  localStorage.setItem("fm_darkmode", darkMode ? "1" : "0");
}

// ============================================================
// INICIALIZACIÓN
// ============================================================
function init() {
  if (!localStorage.getItem("fm_usuarios")) {
    localStorage.setItem("fm_usuarios", JSON.stringify(USUARIOS_DEMO));
  }
  if (!localStorage.getItem("fm_productos")) {
    localStorage.setItem("fm_productos", JSON.stringify(PRODUCTOS_DEMO));
  }

  const dm = localStorage.getItem("fm_darkmode");
  if (dm === "1") {
    darkMode = true;
    document.documentElement.setAttribute("data-theme", "dark");
    const btn = document.getElementById("darkModeBtn");
    if (btn) btn.textContent = "☀️";
  }

  const monedaGuardada = localStorage.getItem("fm_moneda");
  if (monedaGuardada) {
    monedaActual = monedaGuardada;
    const sel = document.getElementById("selectorMoneda");
    if (sel) sel.value = monedaActual;
  }

  const sesion = localStorage.getItem("fm_sesion");
  if (sesion) {
    usuarioActual = JSON.parse(sesion);
    document.getElementById("landingPage").classList.add("hidden");
    iniciarApp();
  }
}

// ============================================================
// AUTH
// ============================================================
function switchTab(tab) {
  document.querySelectorAll(".auth-tab").forEach((t, i) => {
    t.classList.toggle("active", (i === 0 && tab === "login") || (i === 1 && tab === "registro"));
  });
  document.getElementById("tabLogin").classList.toggle("active",    tab === "login");
  document.getElementById("tabRegistro").classList.toggle("active", tab === "registro");
}

function hacerLogin() {
  const user     = document.getElementById("loginUser").value.trim();
  const pass     = document.getElementById("loginPass").value;
  const usuarios = getUsuarios();
  const encontrado = usuarios.find(u => u.usuario === user && u.password === pass);
  if (!encontrado) {
    document.getElementById("loginError").textContent = "Usuario o contraseña incorrectos.";
    return;
  }
  usuarioActual = encontrado;
  localStorage.setItem("fm_sesion", JSON.stringify(encontrado));
  document.getElementById("authOverlay").classList.add("hidden");
  iniciarApp();
}

function registrarUsuario() {
  const user   = document.getElementById("regUser").value.trim();
  const pass   = document.getElementById("regPass").value;
  const rol    = document.getElementById("regRol").value;
  const errEl  = document.getElementById("regError");

  if (!user || !pass)     { errEl.textContent = "Completa todos los campos."; return; }
  if (user.length < 3)    { errEl.textContent = "El usuario debe tener al menos 3 caracteres."; return; }

  const usuarios = getUsuarios();
  if (usuarios.find(u => u.usuario === user)) {
    errEl.textContent = "Ese nombre de usuario ya existe."; return;
  }

  const nuevo = { usuario: user, password: pass, rol, nombre: user };
  usuarios.push(nuevo);
  localStorage.setItem("fm_usuarios", JSON.stringify(usuarios));
  usuarioActual = nuevo;
  localStorage.setItem("fm_sesion", JSON.stringify(nuevo));
  document.getElementById("authOverlay").classList.add("hidden");
  iniciarApp();
}

function cerrarSesion() {
  usuarioActual = null;
  carrito = [];
  localStorage.removeItem("fm_sesion");
  location.reload();
}

function iniciarApp() {
  const carritoKey = `fm_carrito_${usuarioActual.usuario}`;
  carrito = JSON.parse(localStorage.getItem(carritoKey) || "[]");

  document.getElementById("mainHeader").classList.remove("hidden");

  const rolEmoji = { admin: "👑", vendedor: "🏪", cliente: "🛒" };
  document.getElementById("userBadge").textContent =
    `${rolEmoji[usuarioActual.rol]} ${usuarioActual.nombre} (${usuarioActual.rol})`;

  if (usuarioActual.rol === "cliente") {
    document.querySelectorAll(".cliente-only").forEach(el => el.classList.remove("hidden"));
  }
  if (usuarioActual.rol === "vendedor") {
    document.querySelectorAll(".vendedor-only").forEach(el => el.classList.remove("hidden"));
  }
  if (usuarioActual.rol === "admin") {
    document.querySelectorAll(".admin-only").forEach(el => el.classList.remove("hidden"));
    document.querySelectorAll(".vendedor-only").forEach(el => el.classList.remove("hidden"));
  }

  actualizarContador();
  mostrarVista("tienda");
}

// ============================================================
// NAVEGACIÓN
// ============================================================
function mostrarVista(vista) {
  document.querySelectorAll(".vista").forEach(v => v.classList.add("hidden"));
  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));

  const mapaVistas = {
    tienda:       { id: "vistaTienda",        fn: mostrarProductos,   navIdx: 0 },
    historial:    { id: "vistaHistorial",      fn: mostrarHistorial,   navIdx: 1 },
    misProductos: { id: "vistaMisProductos",   fn: mostrarMisProductos,navIdx: null },
    admin:        { id: "vistaAdmin",          fn: mostrarAdmin,       navIdx: null },
  };

  const v = mapaVistas[vista];
  if (!v) return;
  document.getElementById(v.id).classList.remove("hidden");

  const navLinks = document.querySelectorAll(".nav-link:not(.hidden)");
  navLinks.forEach(link => {
    if (link.textContent.trim().includes(
      vista === "tienda" ? "Tienda" :
      vista === "historial" ? "Pedidos" :
      vista === "misProductos" ? "Productos" :
      "Admin"
    )) link.classList.add("active");
  });

  v.fn();
}

// ============================================================
// BUSCADOR CON SUGERENCIAS
// ============================================================
function filtrarProductos() {
  mostrarProductos();
  mostrarSugerencias();
}

function mostrarSugerencias() {
  const input = document.getElementById("buscador");
  const cont  = document.getElementById("sugerencias");
  const busq  = input.value.trim().toLowerCase();

  if (busq.length < 2) { cont.classList.add("hidden"); return; }

  const productos = getProductos().filter(p => p.estado === "aprobado");
  const sugs = productos
    .filter(p => p.nombre.toLowerCase().includes(busq) || (p.descripcion || "").toLowerCase().includes(busq))
    .slice(0, 5);

  if (sugs.length === 0) { cont.classList.add("hidden"); return; }

  cont.innerHTML = sugs.map(p => `
    <div class="sugerencia-item" onclick="seleccionarSugerencia('${p.nombre.replace(/'/g, "\\'")}')">
      <img class="sugerencia-img" src="${p.imagen || ''}" alt="${p.nombre}" onerror="this.src='https://via.placeholder.com/36?text=?'">
      <div class="sugerencia-info">
        <div class="sugerencia-nombre">${resaltarTexto(p.nombre, busq)}</div>
        <div class="sugerencia-precio">${formatPrecio(p.precio)}</div>
      </div>
    </div>
  `).join("");

  cont.classList.remove("hidden");
}

function resaltarTexto(texto, busq) {
  const regex = new RegExp(`(${busq})`, "gi");
  return texto.replace(regex, '<strong style="color:var(--verde)">$1</strong>');
}

function seleccionarSugerencia(nombre) {
  document.getElementById("buscador").value = nombre;
  document.getElementById("sugerencias").classList.add("hidden");
  mostrarProductos();
}

document.addEventListener("click", e => {
  const wrapper = document.querySelector(".buscador-wrapper");
  if (wrapper && !wrapper.contains(e.target)) {
    const cont = document.getElementById("sugerencias");
    if (cont) cont.classList.add("hidden");
  }
});

// ============================================================
// TIENDA — Mostrar productos con ordenamiento
// ============================================================
function mostrarProductos() {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";
  const busq  = document.getElementById("buscador").value.toLowerCase();
  const cat   = document.getElementById("filtroCat").value;
  const orden = document.getElementById("filtroOrden").value;

  let productos = getProductos().filter(p => p.estado === "aprobado");

  let filtrados = productos.filter(p => {
    const coincideBusq = p.nombre.toLowerCase().includes(busq) || (p.descripcion || "").toLowerCase().includes(busq);
    const coincideCat  = !cat || p.categoria === cat;
    return coincideBusq && coincideCat;
  });

  if (orden === "precio_asc")   filtrados.sort((a, b) => a.precio - b.precio);
  if (orden === "precio_desc")  filtrados.sort((a, b) => b.precio - a.precio);
  if (orden === "nombre_asc")   filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  if (orden === "nombre_desc")  filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
  if (orden === "rating")       filtrados.sort((a, b) => calcularRating(b) - calcularRating(a));

  if (filtrados.length === 0) {
    contenedor.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><p>No se encontraron productos.</p></div>`;
    return;
  }

  filtrados.forEach(prod => {
    const rating = calcularRating(prod);
    const card = document.createElement("div");
    card.classList.add("producto-card");
    card.innerHTML = `
      <img class="producto-img" src="${prod.imagen || 'https://via.placeholder.com/400x200?text=Sin+imagen'}" alt="${prod.nombre}"
           onerror="this.src='https://via.placeholder.com/400x200?text=Sin+imagen'">
      <div class="producto-body">
        <span class="producto-cat">${categoriaNombre(prod.categoria)}</span>
        <div class="producto-nombre">${prod.nombre}</div>
        <div class="producto-desc">${prod.descripcion || ""}</div>
        <div class="producto-precio">${formatPrecio(prod.precio)}</div>
        <div class="producto-vendedor">Vendedor: ${prod.vendedor}</div>
        <div class="producto-rating">${renderEstrellas(rating)} (${prod.calificaciones.length})</div>
        <div class="producto-stock">Stock: ${prod.stock} unidades</div>
      </div>
      <div class="producto-acciones">
        <button class="btn-primary btn-sm" onclick="agregarAlCarrito(${prod.id})">Agregar</button>
        <button class="btn-sm" style="background:var(--gris-claro);color:var(--texto)" onclick="verDetalle(${prod.id})">Ver</button>
        ${puedeCalificar(prod) ? `<button class="btn-sm" style="background:#fff3cd;color:#7a5300" onclick="abrirCalificar(${prod.id})">Calificar</button>` : ""}
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function categoriaNombre(cat) {
  const nombres = {
    frutas: "Frutas",
    verduras: "Verduras",
    lacteos: "Lácteos",
    carnes: "Carnes",
    panaderia: "Panadería",
    bebidas: "Bebidas",
    otros: "Otros"
  };
  return nombres[cat] || cat;
}

function puedeCalificar(prod) {
  if (!usuarioActual) return false;
  if (usuarioActual.rol === "admin") return false;
  return !prod.calificaciones.find(c => c.usuario === usuarioActual.usuario);
}

// ============================================================
// CARRITO
// ============================================================
function agregarAlCarrito(id) {
  if (!usuarioActual) { mostrarToast("Inicia sesión primero."); return; }
  const productos = getProductos();
  const prod = productos.find(p => p.id === id);
  if (!prod || prod.stock <= 0) { mostrarToast("Sin stock disponible"); return; }

  const existente = carrito.find(item => item.id === id);
  if (existente) {
    if (existente.cantidad >= prod.stock) { mostrarToast("Stock máximo alcanzado"); return; }
    existente.cantidad++;
  } else {
    carrito.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1, imagen: prod.imagen });
  }

  guardarCarrito();
  actualizarContador();
  mostrarToast(`${prod.nombre} agregado al carrito`);
}

function guardarCarrito() {
  localStorage.setItem(`fm_carrito_${usuarioActual.usuario}`, JSON.stringify(carrito));
}

function actualizarContador() {
  const total = carrito.reduce((s, i) => s + i.cantidad, 0);
  document.getElementById("contadorCarrito").textContent = total;
}

function abrirCarrito() {
  renderCarrito();
  abrirModal("modalCarrito");
}

function renderCarrito() {
  const cont    = document.getElementById("itemsCarrito");
  const totalEl = document.getElementById("totalCarrito");

  if (carrito.length === 0) {
    cont.innerHTML = `<div class="empty-state"><div class="empty-icon">🛒</div><p>Tu carrito está vacío</p></div>`;
    totalEl.textContent = "0.00";
    return;
  }

  cont.innerHTML = "";
  let total = 0;

  carrito.forEach((item, idx) => {
    const sub = item.precio * item.cantidad;
    total += sub;
    const div = document.createElement("div");
    div.classList.add("item-carrito");
    div.innerHTML = `
      <div class="item-carrito-info">
        <div class="item-carrito-nombre">${item.nombre}</div>
        <div class="item-carrito-precio">${formatPrecio(item.precio)} c/u · Subtotal: ${formatPrecio(sub)}</div>
      </div>
      <div class="item-carrito-controles">
        <button class="qty-btn" onclick="cambiarCantidad(${idx}, -1)">−</button>
        <span class="item-qty">${item.cantidad}</span>
        <button class="qty-btn" onclick="cambiarCantidad(${idx}, 1)">+</button>
        <button class="btn-eliminar-item" onclick="eliminarItemCarrito(${idx})">🗑</button>
      </div>
    `;
    cont.appendChild(div);
  });

  totalEl.textContent = formatPrecio(total);
}

function cambiarCantidad(idx, delta) {
  const productos = getProductos();
  const prod = productos.find(p => p.id === carrito[idx].id);
  carrito[idx].cantidad += delta;
  if (carrito[idx].cantidad <= 0) {
    carrito.splice(idx, 1);
  } else if (prod && carrito[idx].cantidad > prod.stock) {
    carrito[idx].cantidad = prod.stock;
    mostrarToast("Stock máximo alcanzado");
  }
  guardarCarrito();
  actualizarContador();
  renderCarrito();
}

function eliminarItemCarrito(idx) {
  carrito.splice(idx, 1);
  guardarCarrito();
  actualizarContador();
  renderCarrito();
}

function vaciarCarrito() {
  if (!confirm("¿Vaciar todo el carrito?")) return;
  carrito = [];
  guardarCarrito();
  actualizarContador();
  renderCarrito();
}

// ============================================================
// COMPRA
// ============================================================
function finalizarCompra() {
  if (carrito.length === 0) { mostrarToast("El carrito está vacío"); return; }

  const productos = getProductos();
  let totalCompra = 0;
  const resumenHTML = [];

  carrito.forEach(item => {
    const idx = productos.findIndex(p => p.id === item.id);
    if (idx !== -1) {
      productos[idx].stock  = Math.max(0, productos[idx].stock - item.cantidad);
      productos[idx].ventas = (productos[idx].ventas || 0) + item.cantidad;
    }
    const sub = item.precio * item.cantidad;
    totalCompra += sub;
    resumenHTML.push(`
      <div class="resumen-item">
        <span>${item.nombre} x${item.cantidad}</span>
        <span>${formatPrecio(sub)}</span>
      </div>
    `);
  });

  resumenHTML.push(`<div class="resumen-item"><span>TOTAL</span><span>${formatPrecio(totalCompra)}</span></div>`);
  localStorage.setItem("fm_productos", JSON.stringify(productos));

  const historial = JSON.parse(localStorage.getItem("fm_historial") || "[]");
  const pedido = {
    id:      "FM-" + Date.now(),
    usuario: usuarioActual.usuario,
    items:   [...carrito],
    total:   totalCompra,
    fecha:   new Date().toLocaleString("es-CL")
  };
  historial.push(pedido);
  localStorage.setItem("fm_historial", JSON.stringify(historial));

  carrito = [];
  guardarCarrito();
  actualizarContador();
  cerrarModal("modalCarrito");

  document.getElementById("resumenPago").innerHTML = resumenHTML.join("");
  document.getElementById("pedidoId").textContent  = pedido.id;
  document.getElementById("paginaPago").classList.remove("hidden");
}

function volverTienda() {
  document.getElementById("paginaPago").classList.add("hidden");
  mostrarVista("tienda");
}

// ============================================================
// HISTORIAL DE COMPRAS
// ============================================================
function mostrarHistorial() {
  const cont = document.getElementById("historialContenido");
  const historial = JSON.parse(localStorage.getItem("fm_historial") || "[]");
  const misPedidos = historial.filter(p => p.usuario === usuarioActual.usuario).reverse();

  if (misPedidos.length === 0) {
    cont.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <p>Aún no has realizado ninguna compra.</p>
      </div>`;
    return;
  }

  cont.innerHTML = misPedidos.map(pedido => {
    const itemsTexto = pedido.items.map(i => `${i.nombre} x${i.cantidad}`).join(", ");
    return `
      <div class="historial-card">
        <div class="historial-header">
          <div>
            <div class="historial-id">Pedido ${pedido.id}</div>
            <div class="historial-fecha">${pedido.fecha}</div>
          </div>
          <div class="historial-total">${formatPrecio(pedido.total)}</div>
        </div>
        <div class="historial-items">${itemsTexto}</div>
      </div>
    `;
  }).join("");
}

// ============================================================
// VENDEDOR — Mis Productos + Gráfico
// ============================================================
function mostrarMisProductos() {
  const contenedor = document.getElementById("misProductosGrid");
  contenedor.innerHTML = "";
  const mios = getProductos().filter(p => p.vendedor === usuarioActual.usuario);

  mostrarGraficoVentas(mios);

  if (mios.length === 0) {
    contenedor.innerHTML = `<div class="empty-state"><div class="empty-icon">📦</div><p>Aún no tienes productos. ¡Agrega el primero!</p></div>`;
    return;
  }

  mios.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("producto-card");
    card.innerHTML = `
      <img class="producto-img" src="${prod.imagen || 'https://via.placeholder.com/400x200?text=Sin+imagen'}" alt="${prod.nombre}"
           onerror="this.src='https://via.placeholder.com/400x200?text=Sin+imagen'">
      <div class="producto-body">
        <span class="producto-cat">${categoriaNombre(prod.categoria)}</span>
        <div class="producto-nombre">${prod.nombre}</div>
        <div class="producto-precio">${formatPrecio(prod.precio)}</div>
        <div class="producto-stock">Stock: ${prod.stock} · Ventas: ${prod.ventas || 0}</div>
        <span class="tag tag-${prod.estado}">${estadoLabel(prod.estado)}</span>
      </div>
      <div class="producto-acciones">
        <button class="btn-sm btn-editar" onclick="abrirModalEditarProducto(${prod.id})">Editar</button>
        <button class="btn-sm btn-eliminar" onclick="eliminarProductoVendedor(${prod.id})">Eliminar</button>
        ${prod.estado === "aprobado" ? `<button class="btn-sm btn-aprobar" onclick="agregarAlCarrito(${prod.id})">Comprar</button>` : ""}
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function mostrarGraficoVentas(productos) {
  const box = document.getElementById("graficoVentasBox");
  const cont = document.getElementById("graficoVentas");

  const conVentas = productos.filter(p => (p.ventas || 0) > 0);
  if (conVentas.length === 0) { box.classList.add("hidden"); return; }

  box.classList.remove("hidden");
  const maxVentas = Math.max(...conVentas.map(p => p.ventas));

  cont.innerHTML = conVentas.map(p => {
    const altura = Math.max(8, Math.round((p.ventas / maxVentas) * 150));
    return `
      <div class="barra-item">
        <div class="barra-valor">${p.ventas}</div>
        <div class="barra-rellena" style="height:${altura}px" title="${p.nombre}: ${p.ventas} ventas"></div>
        <div class="barra-nombre">${p.nombre}</div>
      </div>
    `;
  }).join("");
}

function abrirModalAgregarProducto() {
  document.getElementById("modalProductoTitulo").textContent = "Agregar Producto";
  document.getElementById("prodId").value = "";
  document.getElementById("prodNombre").value = "";
  document.getElementById("prodPrecio").value = "";
  document.getElementById("prodStock").value = "";
  document.getElementById("prodCategoria").value = "frutas";
  document.getElementById("prodImagen").value = "";
  document.getElementById("prodDescripcion").value = "";
  document.getElementById("prodError").textContent = "";
  abrirModal("modalProducto");
}

function abrirModalEditarProducto(id) {
  const prod = getProductos().find(p => p.id === id);
  if (!prod) return;
  document.getElementById("modalProductoTitulo").textContent = "Editar Producto";
  document.getElementById("prodId").value           = prod.id;
  document.getElementById("prodNombre").value       = prod.nombre;
  document.getElementById("prodPrecio").value       = prod.precio;
  document.getElementById("prodStock").value        = prod.stock;
  document.getElementById("prodCategoria").value    = prod.categoria;
  document.getElementById("prodImagen").value       = prod.imagen || "";
  document.getElementById("prodDescripcion").value  = prod.descripcion || "";
  document.getElementById("prodError").textContent  = "";
  abrirModal("modalProducto");
}

function guardarProducto() {
  const id     = document.getElementById("prodId").value;
  const nombre = document.getElementById("prodNombre").value.trim();
  const precio = parseFloat(document.getElementById("prodPrecio").value);
  const stock  = parseInt(document.getElementById("prodStock").value);
  const cat    = document.getElementById("prodCategoria").value;
  const imagen = document.getElementById("prodImagen").value.trim();
  const desc   = document.getElementById("prodDescripcion").value.trim();
  const errEl  = document.getElementById("prodError");

  if (!nombre || isNaN(precio) || isNaN(stock)) {
    errEl.textContent = "Completa nombre, precio y stock."; return;
  }
  if (precio <= 0 || stock <= 0) {
    errEl.textContent = "Precio y stock deben ser mayores a 0."; return;
  }

  const productos = getProductos();

  if (id) {
    const idx = productos.findIndex(p => p.id === parseInt(id));
    if (idx !== -1) {
      productos[idx] = { ...productos[idx], nombre, precio, stock, categoria: cat, imagen, descripcion: desc, estado: "pendiente" };
    }
  } else {
    const nuevoId = Date.now();
    productos.push({ id: nuevoId, nombre, precio, stock, categoria: cat, imagen, descripcion: desc, vendedor: usuarioActual.usuario, estado: "pendiente", ventas: 0, calificaciones: [] });
  }

  localStorage.setItem("fm_productos", JSON.stringify(productos));
  cerrarModal("modalProducto");
  mostrarToast("Producto guardado. Pendiente de aprobación.");
  mostrarMisProductos();
}

function eliminarProductoVendedor(id) {
  if (!confirm("¿Eliminar este producto?")) return;
  const productos = getProductos().filter(p => p.id !== id);
  localStorage.setItem("fm_productos", JSON.stringify(productos));
  mostrarToast("Producto eliminado");
  mostrarMisProductos();
}

// ============================================================
// CALIFICACIONES
// ============================================================
function abrirCalificar(id) {
  const prod = getProductos().find(p => p.id === id);
  estrellaSeleccionada = 0;
  document.getElementById("calificarNombre").textContent = prod.nombre;
  document.getElementById("calificarProdId").value = id;
  document.getElementById("calificarComentario").value = "";
  document.getElementById("calError").textContent = "";
  renderEstrellasSelector(0);
  abrirModal("modalCalificar");
}

function seleccionarEstrella(val) {
  estrellaSeleccionada = val;
  renderEstrellasSelector(val);
}

function renderEstrellasSelector(val) {
  document.querySelectorAll("#estrellasSelector .estrella").forEach((el, i) => {
    el.classList.toggle("activa", i < val);
  });
}

function enviarCalificacion() {
  if (estrellaSeleccionada === 0) {
    document.getElementById("calError").textContent = "Selecciona al menos 1 estrella."; return;
  }
  const id         = parseInt(document.getElementById("calificarProdId").value);
  const comentario = document.getElementById("calificarComentario").value.trim();
  const productos  = getProductos();
  const idx        = productos.findIndex(p => p.id === id);
  if (idx === -1) return;

  productos[idx].calificaciones.push({ usuario: usuarioActual.usuario, valor: estrellaSeleccionada, comentario });
  localStorage.setItem("fm_productos", JSON.stringify(productos));
  cerrarModal("modalCalificar");
  mostrarToast("¡Gracias por tu calificación!");
  mostrarProductos();
}

// ============================================================
// DETALLE PRODUCTO
// ============================================================
function verDetalle(id) {
  const prod = getProductos().find(p => p.id === id);
  if (!prod) return;
  const rating = calcularRating(prod);

  document.getElementById("detalleTitulo").textContent = prod.nombre;

  const resenasHTML = prod.calificaciones.length === 0
    ? `<p style="color:var(--gris);font-size:0.9rem">Aún no hay calificaciones.</p>`
    : prod.calificaciones.map(c => `
        <div class="resena-item">
          <div class="resena-header">
            <span class="resena-usuario">${c.usuario}</span>
            <span class="estrellas-display">${renderEstrellas(c.valor)}</span>
          </div>
          ${c.comentario ? `<div class="resena-comentario">"${c.comentario}"</div>` : ""}
        </div>
      `).join("");

  document.getElementById("detalleContenido").innerHTML = `
    <img src="${prod.imagen || 'https://via.placeholder.com/600x250?text=Sin+imagen'}" alt="${prod.nombre}"
         style="width:100%;height:220px;object-fit:cover;border-radius:12px;margin-bottom:1.2rem"
         onerror="this.src='https://via.placeholder.com/600x250?text=Sin+imagen'">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1rem">
      <div>
        <p style="color:var(--texto-suave);font-size:0.85rem;margin-bottom:0.3rem">${categoriaNombre(prod.categoria)}</p>
        <p style="font-size:1rem;color:var(--texto-suave);line-height:1.5">${prod.descripcion || "Sin descripción."}</p>
      </div>
      <div style="text-align:right">
        <div style="font-size:2rem;font-weight:800;color:var(--naranja)">${formatPrecio(prod.precio)}</div>
        <div class="estrellas-display" style="margin:0.3rem 0">${renderEstrellas(rating)} (${prod.calificaciones.length} reseñas)</div>
        <div style="font-size:0.85rem;color:var(--gris)">Stock: ${prod.stock} · Vendido por: ${prod.vendedor}</div>
      </div>
    </div>
    <button class="btn-primary" style="width:100%;margin-bottom:1.5rem" onclick="agregarAlCarrito(${prod.id});cerrarModal('modalDetalle')">Agregar al Carrito</button>
    <h3 style="font-family:'Syne',sans-serif;margin-bottom:0.8rem">Reseñas de clientes</h3>
    ${resenasHTML}
  `;

  abrirModal("modalDetalle");
}

// ============================================================
// ADMIN
// ============================================================
function mostrarAdmin() {
  const productos = getProductos();
  const usuarios  = getUsuarios();

  const statsGrid  = document.getElementById("statsGrid");
  const totalVentas = productos.reduce((s, p) => s + (p.ventas || 0), 0);
  const pendientes  = productos.filter(p => p.estado === "pendiente").length;
  const aprobados   = productos.filter(p => p.estado === "aprobado").length;

  statsGrid.innerHTML = `
    <div class="stat-card"><div class="stat-numero">${usuarios.length}</div><div class="stat-label">Usuarios</div></div>
    <div class="stat-card"><div class="stat-numero">${productos.length}</div><div class="stat-label">Productos</div></div>
    <div class="stat-card"><div class="stat-numero" style="color:var(--naranja)">${pendientes}</div><div class="stat-label">Pendientes</div></div>
    <div class="stat-card"><div class="stat-numero">${aprobados}</div><div class="stat-label">Aprobados</div></div>
    <div class="stat-card"><div class="stat-numero">${totalVentas}</div><div class="stat-label">Unidades Vendidas</div></div>
  `;

  const tablaU = document.getElementById("tablaUsuarios");
  tablaU.innerHTML = `
    <table class="tabla-admin">
      <thead>
        <th>Usuario</th><th>Nombre</th><th>Rol</th><th>Acción</th>
      </thead>
      <tbody>
        ${usuarios.map(u => `
          <tr>
            <td><strong>${u.usuario}</strong></td>
            <td>${u.nombre}</td>
            <td><span class="tag" style="background:${rolColor(u.rol).bg};color:${rolColor(u.rol).txt}">${u.rol}</span></td>
            <td>
              ${u.usuario !== "admin"
                ? `<button class="btn-sm btn-eliminar" onclick="eliminarUsuarioAdmin('${u.usuario}')">Eliminar</button>`
                : "<span style='color:var(--gris);font-size:0.8rem'>Protegido</span>"}
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  const tablaP = document.getElementById("tablaProductosAdmin");
  tablaP.innerHTML = `
    <table class="tabla-admin">
      <thead>
        <th>Producto</th><th>Vendedor</th><th>Precio</th><th>Stock</th><th>Ventas</th><th>Rating</th><th>Estado</th><th>Acciones</th>
      </thead>
      <tbody>
        ${productos.map(p => `
          <tr>
            <td><strong>${p.nombre}</strong></td>
            <td>${p.vendedor}</td>
            <td>${formatPrecio(p.precio)}</td>
            <td>${p.stock}</td>
            <td>${p.ventas || 0}</td>
            <td>${renderEstrellas(calcularRating(p))} (${p.calificaciones.length})</td>
            <td><span class="tag tag-${p.estado}">${estadoLabel(p.estado)}</span></td>
            <td>
              <div class="acciones-td">
                ${p.estado !== "aprobado"  ? `<button class="btn-sm btn-aprobar" onclick="cambiarEstadoProducto(${p.id},'aprobado')">Aprobar</button>` : ""}
                ${p.estado !== "rechazado" ? `<button class="btn-sm btn-eliminar" onclick="cambiarEstadoProducto(${p.id},'rechazado')">Rechazar</button>` : ""}
                <button class="btn-sm btn-eliminar" onclick="eliminarProductoAdmin(${p.id})">Eliminar</button>
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function cambiarEstadoProducto(id, estado) {
  const productos = getProductos();
  const idx = productos.findIndex(p => p.id === id);
  if (idx !== -1) { productos[idx].estado = estado; }
  localStorage.setItem("fm_productos", JSON.stringify(productos));
  mostrarToast(`Producto ${estado === "aprobado" ? "aprobado" : "rechazado"}`);
  mostrarAdmin();
}

function eliminarProductoAdmin(id) {
  if (!confirm("¿Eliminar este producto permanentemente?")) return;
  const productos = getProductos().filter(p => p.id !== id);
  localStorage.setItem("fm_productos", JSON.stringify(productos));
  mostrarToast("Producto eliminado");
  mostrarAdmin();
}

function eliminarUsuarioAdmin(usuario) {
  if (!confirm(`¿Eliminar al usuario "${usuario}"?`)) return;
  const usuarios = getUsuarios().filter(u => u.usuario !== usuario);
  localStorage.setItem("fm_usuarios", JSON.stringify(usuarios));
  mostrarToast("Usuario eliminado");
  mostrarAdmin();
}

// ============================================================
// HELPERS
// ============================================================
function getProductos() { return JSON.parse(localStorage.getItem("fm_productos") || "[]"); }
function getUsuarios()  { return JSON.parse(localStorage.getItem("fm_usuarios")  || "[]"); }

function abrirModal(id)  { document.getElementById(id).classList.add("abierto"); }
function cerrarModal(id) { document.getElementById(id).classList.remove("abierto"); }

document.addEventListener("click", e => {
  document.querySelectorAll(".modal.abierto").forEach(m => {
    if (e.target === m) m.classList.remove("abierto");
  });
});

function mostrarToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("visible");
  setTimeout(() => t.classList.remove("visible"), 2800);
}

function calcularRating(prod) {
  if (!prod.calificaciones || prod.calificaciones.length === 0) return 0;
  return prod.calificaciones.reduce((s, c) => s + c.valor, 0) / prod.calificaciones.length;
}

function renderEstrellas(rating) {
  const llenas = Math.round(rating);
  return "★".repeat(llenas) + "☆".repeat(5 - llenas);
}

function estadoLabel(estado) {
  return { aprobado: "Aprobado", pendiente: "Pendiente", rechazado: "Rechazado" }[estado] || estado;
}

function rolColor(rol) {
  return {
    admin:    { bg: "#ffd0d3", txt: "#8b0000" },
    vendedor: { bg: "#fff3cd", txt: "#7a5300" },
    cliente:  { bg: "#d8f3dc", txt: "#1b4332" }
  }[rol] || { bg: "#eee", txt: "#333" };
}

// ---- ARRANQUE ----
document.addEventListener("DOMContentLoaded", init);
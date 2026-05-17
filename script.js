// =============================================

// ---- MONEDAS ----
const MONEDAS = {
  USD: { simbolo: "$",  tasa: 1,     decimales: 2 },
  CLP: { simbolo: "$",  tasa: 950,   decimales: 0 },
  EUR: { simbolo: "€",  tasa: 0.92,  decimales: 2 },
  GBP: { simbolo: "£",  tasa: 0.79,  decimales: 2 },
  JPY: { simbolo: "¥",  tasa: 149.5, decimales: 0 },
  BRL: { simbolo: "R$", tasa: 4.97,  decimales: 2 },
  MXN: { simbolo: "$",  tasa: 17.15, decimales: 2 },
};
let monedaActual = "CLP";

function cambiarMoneda(codigo) {
  monedaActual = codigo;
  localStorage.setItem("burzums_moneda", codigo);
  const activa = document.querySelector(".vista:not(.hidden)");
  if (activa?.id === "vistaTienda")       aplicarFiltrosYRender();
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

// ============================================================
// HASH Y SEGURIDAD
// ============================================================
async function hashPassword(password) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(password));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
}

function san(texto) {
  const d = document.createElement("div");
  d.textContent = String(texto ?? "");
  return d.innerHTML;
}

const IMG_FB = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect width='400' height='500' fill='%23f5f0e8'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-family='Cormorant Garamond' font-size='16' fill='%23C9A84C'%3EBURZUMS%3C/text%3E%3C/svg%3E";

function imgSrc(url) { return (url && url.trim()) ? url.trim() : IMG_FB; }

function esURLValida(url) {
  if (!url || !url.trim()) return true;
  try { const u = new URL(url.trim()); return u.protocol === "http:" || u.protocol === "https:"; }
  catch { return false; }
}

const HASH_1234 = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4";

const USUARIOS_DEMO = [
  { usuario: "admin",     passwordHash: HASH_1234, rol: "admin",    nombre: "Administrador" },
  { usuario: "vendedor1", passwordHash: HASH_1234, rol: "vendedor", nombre: "Studio Moda" },
  { usuario: "cliente1",  passwordHash: HASH_1234, rol: "cliente",  nombre: "Valentina Rossi" }
];

// ============================================================
// PRODUCTOS DEMO CON IMÁGENES LIFESTYLE
// ============================================================
const PRODUCTOS_DEMO = [
  { id:1,  nombre:"Camisa Oversize Lino",   precio:59.99, stock:15, categoria:"camisas", descripcion:"Camisa de lino 100% natural, fresca y elegante.", imagen:"https://images.unsplash.com/photo-1598032895397-b9472444bf21?w=400&q=80", imagenHover:"https://images.unsplash.com/photo-1598032895397-b9472444bf21?w=400&q=80&fit=crop&crop=faces", vendedor:"vendedor1", estado:"aprobado", ventas:34, oferta:true, descuento:20, calificaciones:[{usuario:"cliente1",valor:5,comentario:"Excelente calidad"}] },
  { id:2,  nombre:"Vestido Floral Midi",    precio:89.99, stock:12, categoria:"vestidos", descripcion:"Vestido midi con estampado floral.", imagen:"https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400&q=80", imagenHover:"https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400&q=80&fit=crop&crop=faces", vendedor:"vendedor1", estado:"aprobado", ventas:28, oferta:false, calificaciones:[{usuario:"cliente1",valor:4,comentario:"Hermoso diseño"}] },
  { id:3,  nombre:"Pantalón Cargo Beige",   precio:79.99, stock:20, categoria:"pantalones", descripcion:"Pantalón cargo tiro alto, estilo utilitario.", imagen:"https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=400&q=80", imagenHover:"https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=400&q=80&fit=crop&crop=faces", vendedor:"vendedor1", estado:"aprobado", ventas:42, oferta:true, descuento:15, calificaciones:[] },
  { id:4,  nombre:"Chaqueta Denim Clásica", precio:129.99, stock:8, categoria:"chaquetas", descripcion:"Chaqueta de mezclilla lavada.", imagen:"https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=80", imagenHover:"https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=80&fit=crop&crop=faces", vendedor:"vendedor1", estado:"aprobado", ventas:19, oferta:false, calificaciones:[] },
  { id:5,  nombre:"Top Algodón Rib",        precio:39.99, stock:25, categoria:"tops", descripcion:"Top ajustado de algodón rib.", imagen:"https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80", imagenHover:"https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80&fit=crop&crop=faces", vendedor:"vendedor1", estado:"aprobado", ventas:56, oferta:true, descuento:10, calificaciones:[] },
  { id:6,  nombre:"Sudadera Hoodie Cruda",  precio:69.99, stock:10, categoria:"sudaderas", descripcion:"Sudadera oversize con capucha.", imagen:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80", imagenHover:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80&fit=crop&crop=faces", vendedor:"vendedor1", estado:"aprobado", ventas:31, oferta:false, calificaciones:[] }
];

// ---- ESTADO GLOBAL ----
let usuarioActual = null;
let carrito = [];
let estrellaSeleccionada = 0;
let darkMode = false;
let productosMostrados = 6; // Para "Cargar más"
let productosFiltradosCache = [];

// ---- IMÁGENES PARA HERO (cambian automáticamente) ----
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1920&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80"
];
let heroIndex = 0;

// ============================================================
// INICIALIZACIÓN
// ============================================================
function init() {
  if (!localStorage.getItem("burzums_usuarios")) {
    localStorage.setItem("burzums_usuarios", JSON.stringify(USUARIOS_DEMO));
  } else {
    const usuarios = getUsuarios();
    usuarios.forEach(u => {
      if (u.password !== undefined && !u.passwordHash) {
        u.passwordHash = HASH_1234;
        delete u.password;
      }
    });
    localStorage.setItem("burzums_usuarios", JSON.stringify(usuarios));
  }

  if (!localStorage.getItem("burzums_productos")) {
    localStorage.setItem("burzums_productos", JSON.stringify(PRODUCTOS_DEMO));
  }

  const dm = localStorage.getItem("burzums_darkmode");
  if (dm === "1") {
    darkMode = true;
    document.documentElement.setAttribute("data-theme", "dark");
    const btn = document.getElementById("darkModeBtn");
    if (btn) btn.textContent = "☀️";
  }

  const monedaGuardada = localStorage.getItem("burzums_moneda");
  if (monedaGuardada) {
    monedaActual = monedaGuardada;
    const sel = document.getElementById("selectorMoneda");
    if (sel) sel.value = monedaActual;
  }

  const sesion = localStorage.getItem("burzums_sesion");
  if (sesion) {
    usuarioActual = JSON.parse(sesion);
    document.getElementById("landingPage").classList.add("hidden");
    iniciarApp();
  }

  // Iniciar temporizador de oferta (24 horas)
  iniciarTemporizador();

  // Iniciar carrusel de imágenes del hero
  setInterval(cambiarHeroImage, 5000);
}

function iniciarTemporizador() {
  // Fijar fecha objetivo (24 horas desde ahora)
  let targetDate = localStorage.getItem("burzums_offer_target");
  if (!targetDate) {
    targetDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem("burzums_offer_target", targetDate);
  }
  
  function updateTimer() {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const diff = target - now;
    
    if (diff <= 0) {
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
      return;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
  }
  
  updateTimer();
  setInterval(updateTimer, 1000);
}

function cambiarHeroImage() {
  const heroImageDiv = document.getElementById("heroImage");
  if (heroImageDiv) {
    heroIndex = (heroIndex + 1) % HERO_IMAGES.length;
    heroImageDiv.style.backgroundImage = `url(${HERO_IMAGES[heroIndex]})`;
    heroImageDiv.style.transition = "background-image 1s ease-in-out";
  }
}

function scrollToProducts() {
  const categoriesSection = document.querySelector(".categories-section");
  if (categoriesSection) {
    categoriesSection.scrollIntoView({ behavior: "smooth" });
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================================================
// EFECTO SCROLL EN HEADER
// ============================================================
window.addEventListener("scroll", () => {
  const header = document.getElementById("mainHeader");
  if (header && window.scrollY > 50) {
    header.classList.add("header-scrolled");
  } else if (header) {
    header.classList.remove("header-scrolled");
  }
});

// ============================================================
// AUTH
// ============================================================
function irAlLogin() {
  document.getElementById("landingPage").classList.add("hidden");
  document.getElementById("authOverlay").classList.remove("hidden");
}

function switchTab(tab) {
  document.querySelectorAll(".auth-tab").forEach((t, i) => {
    t.classList.toggle("active", (i===0 && tab==="login") || (i===1 && tab==="registro"));
  });
  document.getElementById("tabLogin").classList.toggle("active", tab==="login");
  document.getElementById("tabRegistro").classList.toggle("active", tab==="registro");
}

async function hacerLogin() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value;
  const errEl = document.getElementById("loginError");
  if (!user || !pass) { errEl.textContent = "Completa todos los campos."; return; }

  const hash = await hashPassword(pass);
  const usuarios = getUsuarios();
  const encontrado = usuarios.find(u => u.usuario === user && u.passwordHash === hash);

  if (!encontrado) { errEl.textContent = "Usuario o contraseña incorrectos."; return; }
  usuarioActual = encontrado;
  localStorage.setItem("burzums_sesion", JSON.stringify(encontrado));
  document.getElementById("authOverlay").classList.add("hidden");
  iniciarApp();
}

async function registrarUsuario() {
  const user = document.getElementById("regUser").value.trim();
  const pass = document.getElementById("regPass").value;
  const rol = document.getElementById("regRol").value;
  const errEl = document.getElementById("regError");
  if (!user || !pass) { errEl.textContent = "Completa todos los campos."; return; }
  if (user.length < 3) { errEl.textContent = "El usuario debe tener al menos 3 caracteres."; return; }
  if (pass.length < 4) { errEl.textContent = "La contraseña debe tener al menos 4 caracteres."; return; }

  const usuarios = getUsuarios();
  if (usuarios.find(u => u.usuario === user)) { errEl.textContent = "Ese nombre de usuario ya existe."; return; }

  const passwordHash = await hashPassword(pass);
  const nuevo = { usuario: user, passwordHash, rol, nombre: user };
  usuarios.push(nuevo);
  localStorage.setItem("burzums_usuarios", JSON.stringify(usuarios));
  usuarioActual = nuevo;
  localStorage.setItem("burzums_sesion", JSON.stringify(nuevo));
  document.getElementById("authOverlay").classList.add("hidden");
  iniciarApp();
}

function cerrarSesion() {
  usuarioActual = null; carrito = [];
  localStorage.removeItem("burzums_sesion");
  location.reload();
}

function iniciarApp() {
  const carritoKey = `burzums_carrito_${usuarioActual.usuario}`;
  carrito = JSON.parse(localStorage.getItem(carritoKey) || "[]");
  document.getElementById("mainHeader").classList.remove("hidden");
  const rolEmoji = { admin:"👑", vendedor:"🏷️", cliente:"🛍️" };
  document.getElementById("userBadge").textContent = `${rolEmoji[usuarioActual.rol]} ${usuarioActual.nombre} (${usuarioActual.rol})`;
  if (usuarioActual.rol === "cliente") document.querySelectorAll(".cliente-only").forEach(el=>el.classList.remove("hidden"));
  if (usuarioActual.rol === "vendedor") document.querySelectorAll(".vendedor-only").forEach(el=>el.classList.remove("hidden"));
  if (usuarioActual.rol === "admin") {
    document.querySelectorAll(".admin-only").forEach(el=>el.classList.remove("hidden"));
    document.querySelectorAll(".vendedor-only").forEach(el=>el.classList.remove("hidden"));
    document.querySelectorAll(".cliente-only").forEach(el=>el.classList.remove("hidden"));
  }
  actualizarContador();
  mostrarVista("tienda");
}

function mostrarVista(vista) {
  document.querySelectorAll(".vista").forEach(v=>v.classList.add("hidden"));
  document.querySelectorAll(".nav-link").forEach(l=>l.classList.remove("active"));
  const mapaVistas = {
    tienda: { id:"vistaTienda", fn:() => aplicarFiltrosYRender() },
    historial: { id:"vistaHistorial", fn:mostrarHistorial },
    misProductos: { id:"vistaMisProductos", fn:mostrarMisProductos },
    admin: { id:"vistaAdmin", fn:mostrarAdmin },
  };
  const v = mapaVistas[vista]; if (!v) return;
  document.getElementById(v.id).classList.remove("hidden");
  document.querySelectorAll(".nav-link:not(.hidden)").forEach(link => {
    const labels = { tienda:"Tienda", historial:"Pedidos", misProductos:"Prendas", admin:"Admin" };
    if (link.textContent.trim().includes(labels[vista])) link.classList.add("active");
  });
  v.fn();
}

// ============================================================
// CATEGORÍAS VISUALES Y FILTROS
// ============================================================
function initCategories() {
  document.querySelectorAll(".category-item").forEach(cat => {
    cat.addEventListener("click", () => {
      const categoria = cat.getAttribute("data-cat");
      // Limpiar filtros de checkbox
      document.querySelectorAll(".filtro-cat").forEach(cb => cb.checked = false);
      // Marcar la categoría seleccionada
      const targetCheckbox = document.querySelector(`.filtro-cat[value="${categoria}"]`);
      if (targetCheckbox) targetCheckbox.checked = true;
      aplicarFiltrosYRender();
    });
  });
}

function toggleFiltro(element) {
  const grupo = element.closest(".filtro-grupo");
  grupo.classList.toggle("collapsed");
}

function resetFilters() {
  document.querySelectorAll(".filtro-cat").forEach(cb => cb.checked = false);
  document.getElementById("precioMin").value = 0;
  document.getElementById("precioMax").value = 200;
  document.getElementById("minVal").textContent = 0;
  document.getElementById("maxVal").textContent = 200;
  document.getElementById("filtroOrdenSidebar").value = "";
  document.getElementById("buscador").value = "";
  productosMostrados = 6;
  aplicarFiltrosYRender();
}

function aplicarFiltrosYRender() {
  const busq = document.getElementById("buscador").value.toLowerCase();
  const categoriasSeleccionadas = Array.from(document.querySelectorAll(".filtro-cat:checked")).map(cb => cb.value);
  const precioMin = parseFloat(document.getElementById("precioMin").value);
  const precioMax = parseFloat(document.getElementById("precioMax").value);
  const orden = document.getElementById("filtroOrdenSidebar").value;
  const soloOfertas = document.getElementById("soloOfertas")?.checked || false;

  let filtrados = getProductos().filter(p => p.estado === "aprobado");
  
  // Búsqueda
  if (busq) {
    filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(busq) || (p.descripcion||"").toLowerCase().includes(busq));
  }
  
  // Categorías
  if (categoriasSeleccionadas.length > 0) {
    filtrados = filtrados.filter(p => categoriasSeleccionadas.includes(p.categoria));
  }
  
  // Precio
  filtrados = filtrados.filter(p => p.precio >= precioMin && p.precio <= precioMax);
  
  // Ofertas
  if (soloOfertas) {
    filtrados = filtrados.filter(p => p.oferta === true);
  }
  
  // Orden
  if (orden === "precio_asc") filtrados.sort((a,b) => a.precio - b.precio);
  if (orden === "precio_desc") filtrados.sort((a,b) => b.precio - a.precio);
  if (orden === "nombre_asc") filtrados.sort((a,b) => a.nombre.localeCompare(b.nombre));
  if (orden === "rating") filtrados.sort((a,b) => calcularRating(b) - calcularRating(a));
  
  productosFiltradosCache = filtrados;
  document.getElementById("productosCount").textContent = `Mostrando ${Math.min(productosMostrados, filtrados.length)} de ${filtrados.length} productos`;
  renderProductosGrid(filtrados.slice(0, productosMostrados));
  
  // Ocultar/mostrar botón "Cargar más"
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.style.display = productosMostrados >= filtrados.length ? "none" : "block";
  }
}

function cargarMasProductos() {
  productosMostrados += 6;
  aplicarFiltrosYRender();
}

function filtrarOfertas() {
  document.querySelectorAll(".filtro-cat").forEach(cb => cb.checked = false);
  productosMostrados = 6;
  aplicarFiltrosYRender();
  const offerSection = document.getElementById("offerSection");
  if (offerSection) offerSection.scrollIntoView({ behavior: "smooth" });
}

function renderProductosGrid(productos) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";
  
  if (productos.length === 0) {
    contenedor.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><p>No se encontraron prendas.</p></div>';
    return;
  }
  
  productos.forEach((prod, index) => {
    const rating = calcularRating(prod);
    const esPropio = usuarioActual && prod.vendedor === usuarioActual.usuario;
    const card = crearCardProductoMejorada(prod, rating, esPropio, index === 0);
    contenedor.appendChild(card);
  });
}

function crearCardProductoMejorada(prod, rating, esPropio, esDestacado) {
  const card = document.createElement("div");
  card.className = "producto-card";
  if (esDestacado) card.classList.add("producto-destacado");
  
  // Contenedor de imagen con hover
  const imgContainer = document.createElement("div");
  imgContainer.className = "producto-img-container";
  
  const img = document.createElement("img");
  img.className = "producto-img";
  img.src = imgSrc(prod.imagen);
  img.alt = san(prod.nombre);
  img.onerror = function(){ this.src = IMG_FB; };
  
  const imgHover = document.createElement("img");
  imgHover.className = "producto-img-hover";
  imgHover.src = prod.imagenHover || prod.imagen;
  imgHover.alt = san(prod.nombre);
  imgHover.onerror = function(){ this.src = IMG_FB; };
  
  imgContainer.append(img, imgHover);
  
  // Badge de oferta
  let badge = null;
  if (prod.oferta) {
    badge = document.createElement("div");
    badge.className = "producto-badge sale";
    badge.textContent = prod.descuento ? `-${prod.descuento}%` : "SALE";
    imgContainer.appendChild(badge);
  } else if (prod.id === 1 || prod.id === 2) {
    badge = document.createElement("div");
    badge.className = "producto-badge";
    badge.textContent = "NUEVO";
    imgContainer.appendChild(badge);
  }
  
  // Cuerpo
  const body = document.createElement("div");
  body.className = "producto-body";
  
  const catEl = document.createElement("div");
  catEl.className = "producto-cat";
  catEl.textContent = categoriaNombre(prod.categoria);
  
  const nomEl = document.createElement("div");
  nomEl.className = "producto-nombre";
  nomEl.textContent = prod.nombre;
  
  const precioContainer = document.createElement("div");
  if (prod.oferta && prod.descuento) {
    const precioOriginal = prod.precio;
    const precioConDescuento = precioOriginal * (1 - prod.descuento / 100);
    const precioSpan = document.createElement("span");
    precioSpan.className = "producto-precio";
    precioSpan.innerHTML = `${formatPrecio(precioConDescuento)} <span class="producto-precio-old">${formatPrecio(precioOriginal)}</span>`;
    precioContainer.appendChild(precioSpan);
  } else {
    const precioSpan = document.createElement("div");
    precioSpan.className = "producto-precio";
    precioSpan.textContent = formatPrecio(prod.precio);
    precioContainer.appendChild(precioSpan);
  }
  
  const ratingEl = document.createElement("div");
  ratingEl.className = "producto-rating";
  ratingEl.innerHTML = `${renderEstrellas(rating)} (${prod.calificaciones.length})`;
  
  body.append(catEl, nomEl, precioContainer, ratingEl);
  
  // Acciones
  const acciones = document.createElement("div");
  acciones.className = "producto-acciones";
  
  if (!esPropio && usuarioActual?.rol !== "admin") {
    const btnAgregar = document.createElement("button");
    btnAgregar.className = "btn-primary btn-sm";
    btnAgregar.textContent = "Agregar";
    btnAgregar.onclick = (e) => {
      e.stopPropagation();
      agregarAlCarrito(prod.id);
    };
    acciones.appendChild(btnAgregar);
  }
  
  const btnVer = document.createElement("button");
  btnVer.className = "btn-sm";
  btnVer.textContent = "Ver detalles";
  btnVer.onclick = (e) => {
    e.stopPropagation();
    verDetalle(prod.id);
  };
  acciones.appendChild(btnVer);
  
  card.append(imgContainer, body, acciones);
  card.onclick = () => verDetalle(prod.id);
  
  return card;
}

function categoriaNombre(cat) {
  const cats = {
    camisas:"CAMISAS", vestidos:"VESTIDOS", pantalones:"PANTALONES",
    chaquetas:"CHAQUETAS", tops:"TOPS", sudaderas:"SUDADERAS", accesorios:"ACCESORIOS"
  };
  return cats[cat] || cat;
}

// ============================================================
// CARRITO Y COMPRAS 
// ============================================================
function agregarAlCarrito(id) {
  if (!usuarioActual) { mostrarToast("Inicia sesión primero."); return; }
  const productos = getProductos();
  const prod = productos.find(p => p.id === id);
  if (!prod || prod.stock <= 0) { mostrarToast("Sin stock disponible"); return; }
  if (prod.vendedor === usuarioActual.usuario) { mostrarToast("No puedes agregar tus propias prendas."); return; }
  const existente = carrito.find(item => item.id === id);
  if (existente) {
    if (existente.cantidad >= prod.stock) { mostrarToast("Stock máximo alcanzado"); return; }
    existente.cantidad++;
  } else {
    carrito.push({ id:prod.id, nombre:prod.nombre, precio:prod.precio, cantidad:1, imagen:prod.imagen });
  }
  guardarCarrito(); actualizarContador();
  mostrarToast(`${prod.nombre} agregado a tu bolsa`);
}

function guardarCarrito() {
  localStorage.setItem(`burzums_carrito_${usuarioActual.usuario}`, JSON.stringify(carrito));
}

function actualizarContador() {
  document.getElementById("contadorCarrito").textContent = carrito.reduce((s,i)=>s+i.cantidad,0);
}

function abrirCarrito() { renderCarrito(); abrirModal("modalCarrito"); }

function renderCarrito() {
  const cont = document.getElementById("itemsCarrito");
  const totEl = document.getElementById("totalCarrito");
  cont.innerHTML = "";
  if (carrito.length === 0) {
    cont.innerHTML = '<div class="empty-state"><div class="empty-icon">🛍️</div><p>Tu bolsa está vacía</p></div>';
    totEl.textContent = "0.00";
    return;
  }
  let total = 0;
  carrito.forEach((item, idx) => {
    const sub = item.precio * item.cantidad;
    total += sub;
    const div = document.createElement("div");
    div.className = "item-carrito";
    div.innerHTML = `
      <div class="item-carrito-info">
        <div class="item-carrito-nombre">${san(item.nombre)}</div>
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
  totEl.textContent = formatPrecio(total);
}

function cambiarCantidad(idx, delta) {
  const prod = getProductos().find(p=>p.id===carrito[idx].id);
  carrito[idx].cantidad += delta;
  if (carrito[idx].cantidad <= 0) carrito.splice(idx,1);
  else if (prod && carrito[idx].cantidad > prod.stock) { carrito[idx].cantidad = prod.stock; mostrarToast("Stock máximo alcanzado"); }
  guardarCarrito(); actualizarContador(); renderCarrito();
}

function eliminarItemCarrito(idx) {
  carrito.splice(idx,1); guardarCarrito(); actualizarContador(); renderCarrito();
}

async function vaciarCarrito() {
  const ok = await confirmar("¿Vaciar toda tu bolsa?");
  if (!ok) return;
  carrito = []; guardarCarrito(); actualizarContador(); renderCarrito();
}

function finalizarCompra() {
  if (carrito.length === 0) { mostrarToast("Tu bolsa está vacía"); return; }
  const productos = getProductos();
  let totalCompra = 0;
  const resumenItems = [];

  carrito.forEach(item => {
    const idx = productos.findIndex(p=>p.id===item.id);
    if (idx !== -1) {
      productos[idx].stock = Math.max(0, productos[idx].stock - item.cantidad);
      productos[idx].ventas = (productos[idx].ventas||0) + item.cantidad;
    }
    const sub = item.precio * item.cantidad;
    totalCompra += sub;
    resumenItems.push({ nombre:item.nombre, cantidad:item.cantidad, sub });
  });

  localStorage.setItem("burzums_productos", JSON.stringify(productos));
  const historial = JSON.parse(localStorage.getItem("burzums_historial")||"[]");
  const pedido = { id:"BZ-"+Date.now(), usuario:usuarioActual.usuario, items:[...carrito], total:totalCompra, fecha:new Date().toLocaleString("es-CL") };
  historial.push(pedido);
  localStorage.setItem("burzums_historial", JSON.stringify(historial));

  carrito = []; guardarCarrito(); actualizarContador(); cerrarModal("modalCarrito");

  const resumenEl = document.getElementById("resumenPago");
  resumenEl.innerHTML = "";
  resumenItems.forEach(i => {
    const d = document.createElement("div");
    d.className = "resumen-item";
    d.innerHTML = `<span>${i.nombre} x${i.cantidad}</span><span>${formatPrecio(i.sub)}</span>`;
    resumenEl.appendChild(d);
  });
  const totD = document.createElement("div");
  totD.className = "resumen-item";
  totD.innerHTML = `<span>TOTAL</span><span>${formatPrecio(totalCompra)}</span>`;
  resumenEl.appendChild(totD);
  document.getElementById("pedidoId").textContent = pedido.id;
  document.getElementById("paginaPago").classList.remove("hidden");
}

function volverTienda() {
  document.getElementById("paginaPago").classList.add("hidden");
  mostrarVista("tienda");
}

// ============================================================
// HISTORIAL, VENDEDOR, ADMIN 
// ============================================================
function mostrarHistorial() {
  const cont = document.getElementById("historialContenido");
  cont.innerHTML = "";
  const misPedidos = (JSON.parse(localStorage.getItem("burzums_historial")||"[]")).filter(p=>p.usuario===usuarioActual.usuario).reverse();
  if (misPedidos.length === 0) {
    cont.innerHTML = '<div class="empty-state"><div class="empty-icon">📦</div><p>Aún no has realizado ninguna compra.</p></div>';
    return;
  }
  misPedidos.forEach(pedido => {
    const card = document.createElement("div");
    card.className = "historial-card";
    card.innerHTML = `
      <div class="historial-header">
        <div><div class="historial-id">Pedido ${pedido.id}</div><div class="historial-fecha">${pedido.fecha}</div></div>
        <div class="historial-total">${formatPrecio(pedido.total)}</div>
      </div>
      <div class="historial-items">${pedido.items.map(i=>`${i.nombre} x${i.cantidad}`).join(", ")}</div>
    `;
    cont.appendChild(card);
  });
}

function mostrarMisProductos() {
  const contenedor = document.getElementById("misProductosGrid");
  contenedor.innerHTML = "";
  const mios = getProductos().filter(p=>p.vendedor===usuarioActual.usuario);
  if (mios.length === 0) {
    contenedor.innerHTML = '<div class="empty-state"><div class="empty-icon">🏷️</div><p>Aún no tienes prendas publicadas.</p></div>';
    return;
  }
  mios.forEach(prod => {
    const card = crearCardProductoVendedor(prod);
    contenedor.appendChild(card);
  });
}

function crearCardProductoVendedor(prod) {
  const card = document.createElement("div");
  card.className = "producto-card";
  const img = document.createElement("img");
  img.className = "producto-img";
  img.src = imgSrc(prod.imagen);
  img.onerror = function(){ this.src = IMG_FB; };
  const body = document.createElement("div");
  body.className = "producto-body";
  body.innerHTML = `
    <div class="producto-cat">${categoriaNombre(prod.categoria)}</div>
    <div class="producto-nombre">${san(prod.nombre)}</div>
    <div class="producto-precio">${formatPrecio(prod.precio)}</div>
    <div class="producto-stock">Stock: ${prod.stock}</div>
    <span class="tag tag-${prod.estado}">${estadoLabel(prod.estado)}</span>
  `;
  const acciones = document.createElement("div");
  acciones.className = "producto-acciones";
  const btnEdit = document.createElement("button");
  btnEdit.className = "btn-sm btn-editar";
  btnEdit.textContent = "Editar";
  btnEdit.onclick = () => abrirModalEditarProducto(prod.id);
  const btnElim = document.createElement("button");
  btnElim.className = "btn-sm btn-eliminar";
  btnElim.textContent = "Eliminar";
  btnElim.onclick = () => eliminarProductoVendedor(prod.id);
  acciones.append(btnEdit, btnElim);
  card.append(img, body, acciones);
  return card;
}

function abrirModalEditarProducto(id) {
  const prod = getProductos().find(p=>p.id===id);
  if (!prod) return;
  document.getElementById("modalProductoTitulo").textContent = "Editar Prenda";
  document.getElementById("prodId").value = prod.id;
  document.getElementById("prodNombre").value = prod.nombre;
  document.getElementById("prodPrecio").value = prod.precio;
  document.getElementById("prodStock").value = prod.stock;
  document.getElementById("prodCategoria").value = prod.categoria;
  document.getElementById("prodImagen").value = prod.imagen || "";
  document.getElementById("prodImagenHover").value = prod.imagenHover || "";
  document.getElementById("prodDescripcion").value = prod.descripcion || "";
  abrirModal("modalProducto");
}

function guardarProducto() {
  const id = document.getElementById("prodId").value;
  const nombre = document.getElementById("prodNombre").value.trim();
  const precio = parseFloat(document.getElementById("prodPrecio").value);
  const stock = parseInt(document.getElementById("prodStock").value);
  const cat = document.getElementById("prodCategoria").value;
  const imagen = document.getElementById("prodImagen").value.trim();
  const imagenHover = document.getElementById("prodImagenHover").value.trim();
  const desc = document.getElementById("prodDescripcion").value.trim();
  const errEl = document.getElementById("prodError");

  if (!nombre || isNaN(precio) || isNaN(stock)) { errEl.textContent = "Completa nombre, precio y stock."; return; }
  if (precio <= 0 || stock <= 0) { errEl.textContent = "Precio y stock deben ser mayores a 0."; return; }

  const productos = getProductos();
  if (id) {
    const idx = productos.findIndex(p => p.id === parseInt(id));
    if (idx !== -1) productos[idx] = { ...productos[idx], nombre, precio, stock, categoria: cat, imagen, imagenHover, descripcion: desc, estado: "pendiente" };
  } else {
    productos.push({ id: Date.now(), nombre, precio, stock, categoria: cat, imagen, imagenHover, descripcion: desc, vendedor: usuarioActual.usuario, estado: "pendiente", ventas: 0, calificaciones: [], oferta: false });
  }
  localStorage.setItem("burzums_productos", JSON.stringify(productos));
  cerrarModal("modalProducto");
  mostrarToast("Prenda guardada. Pendiente de aprobación.");
  mostrarMisProductos();
}

async function eliminarProductoVendedor(id) {
  const ok = await confirmar("¿Eliminar esta prenda?");
  if (!ok) return;
  localStorage.setItem("burzums_productos", JSON.stringify(getProductos().filter(p => p.id !== id)));
  mostrarToast("Prenda eliminada");
  mostrarMisProductos();
}

function mostrarAdmin() {
  const productos = getProductos();
  const usuarios = getUsuarios();
  const totalV = productos.reduce((s,p) => s + (p.ventas||0), 0);
  const pend = productos.filter(p => p.estado === "pendiente").length;
  const apro = productos.filter(p => p.estado === "aprobado").length;

  document.getElementById("statsGrid").innerHTML = `
    <div class="stat-card"><div class="stat-numero">${usuarios.length}</div><div class="stat-label">Usuarios</div></div>
    <div class="stat-card"><div class="stat-numero">${productos.length}</div><div class="stat-label">Prendas</div></div>
    <div class="stat-card"><div class="stat-numero" style="color:var(--oro)">${pend}</div><div class="stat-label">Pendientes</div></div>
    <div class="stat-card"><div class="stat-numero">${apro}</div><div class="stat-label">Aprobadas</div></div>
    <div class="stat-card"><div class="stat-numero">${totalV}</div><div class="stat-label">Unidades Vendidas</div></div>
  `;
  
  const tablaU = document.getElementById("tablaUsuarios");
  tablaU.innerHTML = '<table class="tabla-admin"><thead><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Acción</th></tr></thead><tbody id="tbodyUsuarios"></tbody></table>';
  const tbodyU = document.getElementById("tbodyUsuarios");
  usuarios.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><strong>${san(u.usuario)}</strong></td><td>${san(u.nombre)}</td><td>${u.rol}</td><td>${u.usuario !== "admin" ? '<button class="btn-sm btn-eliminar" onclick="eliminarUsuarioAdmin(\''+u.usuario+'\')">Eliminar</button>' : '<span class="protegido">Protegido</span>'}</td>`;
    tbodyU.appendChild(tr);
  });
  
  const tablaP = document.getElementById("tablaProductosAdmin");
  tablaP.innerHTML = '<table class="tabla-admin"><thead><tr><th>Prenda</th><th>Marca</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="tbodyProductos"></tbody></table>';
  const tbodyP = document.getElementById("tbodyProductos");
  productos.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${san(p.nombre)}</strong></td>
      <td>${san(p.vendedor)}</td>
      <td>${formatPrecio(p.precio)}</td>
      <td>${p.stock}</td>
      <td><span class="tag tag-${p.estado}">${estadoLabel(p.estado)}</span></td>
      <td class="acciones-td">
        ${p.estado !== "aprobado" ? '<button class="btn-sm btn-aprobar" onclick="cambiarEstadoProducto('+p.id+',\'aprobado\')">Aprobar</button>' : ''}
        ${p.estado !== "rechazado" ? '<button class="btn-sm btn-eliminar" onclick="cambiarEstadoProducto('+p.id+',\'rechazado\')">Rechazar</button>' : ''}
        <button class="btn-sm btn-eliminar" onclick="eliminarProductoAdmin('+p.id+')">Eliminar</button>
      </td>
    `;
    tbodyP.appendChild(tr);
  });
}

function cambiarEstadoProducto(id, estado) {
  const productos = getProductos();
  const idx = productos.findIndex(p => p.id === id);
  if (idx !== -1) productos[idx].estado = estado;
  localStorage.setItem("burzums_productos", JSON.stringify(productos));
  mostrarToast(`Prenda ${estado === "aprobado" ? "aprobada" : "rechazada"}`);
  mostrarAdmin();
}

async function eliminarProductoAdmin(id) {
  const ok = await confirmar("¿Eliminar esta prenda permanentemente?");
  if (!ok) return;
  localStorage.setItem("burzums_productos", JSON.stringify(getProductos().filter(p => p.id !== id)));
  mostrarToast("Prenda eliminada");
  mostrarAdmin();
}

async function eliminarUsuarioAdmin(usuario) {
  const ok = await confirmar(`¿Eliminar al usuario "${usuario}"?`);
  if (!ok) return;
  localStorage.setItem("burzums_usuarios", JSON.stringify(getUsuarios().filter(u => u.usuario !== usuario)));
  mostrarToast("Usuario eliminado");
  mostrarAdmin();
}

// ============================================================
// CALIFICACIONES Y DETALLE
// ============================================================
function abrirCalificar(id) {
  const prod = getProductos().find(p => p.id === id);
  estrellaSeleccionada = 0;
  document.getElementById("calificarNombre").textContent = prod.nombre;
  document.getElementById("calificarProdId").value = id;
  document.getElementById("calificarComentario").value = "";
  renderEstrellasSelector(0);
  abrirModal("modalCalificar");
}

function seleccionarEstrella(val) { estrellaSeleccionada = val; renderEstrellasSelector(val); }

function renderEstrellasSelector(val) {
  document.querySelectorAll("#estrellasSelector .estrella").forEach((el, i) => el.classList.toggle("activa", i < val));
}

function enviarCalificacion() {
  if (estrellaSeleccionada === 0) { document.getElementById("calError").textContent = "Selecciona al menos 1 estrella."; return; }
  const id = parseInt(document.getElementById("calificarProdId").value);
  const comentario = document.getElementById("calificarComentario").value.trim();
  const productos = getProductos();
  const idx = productos.findIndex(p => p.id === id);
  if (idx === -1) return;
  productos[idx].calificaciones.push({ usuario: usuarioActual.usuario, valor: estrellaSeleccionada, comentario });
  localStorage.setItem("burzums_productos", JSON.stringify(productos));
  cerrarModal("modalCalificar");
  mostrarToast("¡Gracias por tu calificación!");
  aplicarFiltrosYRender();
}

function verDetalle(id) {
  const prod = getProductos().find(p => p.id === id);
  if (!prod) return;
  const rating = calcularRating(prod);
  document.getElementById("detalleTitulo").textContent = prod.nombre;
  const c = document.getElementById("detalleContenido");
  c.innerHTML = `
    <img src="${imgSrc(prod.imagen)}" alt="${san(prod.nombre)}" style="width:100%;height:280px;object-fit:cover;margin-bottom:1rem;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:1rem;flex-wrap:wrap;">
      <div><p style="color:var(--texto-suave);font-size:0.85rem;">${categoriaNombre(prod.categoria)}</p><p>${prod.descripcion || "Sin descripción."}</p></div>
      <div style="text-align:right;"><div style="font-size:2rem;font-weight:800;color:var(--oro)">${formatPrecio(prod.precio)}</div><div class="estrellas-display">${renderEstrellas(rating)} (${prod.calificaciones.length} reseñas)</div><div style="font-size:0.85rem;">Stock: ${prod.stock} · Marca: ${prod.vendedor}</div></div>
    </div>
    <button class="btn-primary" style="width:100%;margin-bottom:1.5rem;" onclick="agregarAlCarrito(${prod.id}); cerrarModal('modalDetalle');">Agregar a la bolsa</button>
    <h3 style="font-family:var(--font-display);margin-bottom:0.8rem;">Opiniones de clientes</h3>
    <div id="reseasContainer"></div>
  `;
  const reseasContainer = document.getElementById("reseasContainer");
  if (prod.calificaciones.length === 0) {
    reseasContainer.innerHTML = '<p style="color:var(--gris);font-size:0.9rem;">Aún no hay calificaciones. ¡Sé el primero!</p>';
  } else {
    reseasContainer.innerHTML = prod.calificaciones.map(cal => `
      <div class="resena-item">
        <div class="resena-header"><span class="resena-usuario">${san(cal.usuario)}</span><span class="estrellas-display">${renderEstrellas(cal.valor)}</span></div>
        <div class="resena-comentario">"${san(cal.comentario)}"</div>
      </div>
    `).join("");
  }
  abrirModal("modalDetalle");
}

// ============================================================
// HELPERS
// ============================================================
function getProductos() { return JSON.parse(localStorage.getItem("burzums_productos") || "[]"); }
function getUsuarios() { return JSON.parse(localStorage.getItem("burzums_usuarios") || "[]"); }
function abrirModal(id) { document.getElementById(id).classList.add("abierto"); }
function cerrarModal(id) { document.getElementById(id).classList.remove("abierto"); }

document.addEventListener("click", e => {
  document.querySelectorAll(".modal.abierto").forEach(m => { if (e.target === m) m.classList.remove("abierto"); });
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
  const l = Math.round(rating);
  return "★".repeat(l) + "☆".repeat(5 - l);
}

function estadoLabel(e) { return { aprobado: "Aprobada", pendiente: "Pendiente", rechazado: "Rechazada" }[e] || e; }

function confirmar(mensaje) {
  return new Promise(resolve => {
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9000;display:flex;align-items:center;justify-content:center;padding:1rem";
    const box = document.createElement("div");
    box.style.cssText = "background:var(--blanco);border-radius:0px;padding:2rem;max-width:360px;width:100%;text-align:center;border:1px solid var(--borde)";
    const p = document.createElement("p");
    p.style.cssText = "font-size:1rem;color:var(--texto);margin-bottom:1.5rem;";
    p.textContent = mensaje;
    const row = document.createElement("div");
    row.style.cssText = "display:flex;gap:.8rem;justify-content:center";
    const btnNo = document.createElement("button");
    btnNo.className = "btn-danger";
    btnNo.textContent = "Cancelar";
    const btnSi = document.createElement("button");
    btnSi.className = "btn-primary";
    btnSi.textContent = "Confirmar";
    const limpiar = (res) => { document.body.removeChild(overlay); resolve(res); };
    btnNo.onclick = () => limpiar(false);
    btnSi.onclick = () => limpiar(true);
    row.append(btnNo, btnSi);
    box.append(p, row);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  });
}

function toggleDarkMode() {
  darkMode = !darkMode;
  document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  document.getElementById("darkModeBtn").textContent = darkMode ? "☀️" : "🌙";
  localStorage.setItem("burzums_darkmode", darkMode ? "1" : "0");
}

function filtrarProductosSidebar() {
  productosMostrados = 6;
  aplicarFiltrosYRender();
}

// Inicializar todo al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  init();
  initCategories();
  
  // Event listeners para filtros
  document.getElementById("precioMin")?.addEventListener("input", (e) => {
    document.getElementById("minVal").textContent = e.target.value;
    productosMostrados = 6;
    aplicarFiltrosYRender();
  });
  document.getElementById("precioMax")?.addEventListener("input", (e) => {
    document.getElementById("maxVal").textContent = e.target.value;
    productosMostrados = 6;
    aplicarFiltrosYRender();
  });
  document.querySelectorAll(".filtro-cat").forEach(cb => {
    cb.addEventListener("change", () => {
      productosMostrados = 6;
      aplicarFiltrosYRender();
    });
  });
  
  // Hero image inicial
  const heroImageDiv = document.getElementById("heroImage");
  if (heroImageDiv) heroImageDiv.style.backgroundImage = `url(${HERO_IMAGES[0]})`;
});
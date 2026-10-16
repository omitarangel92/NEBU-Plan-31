import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA8oIEjox4y8vm7vsnwd0JQaixiw_6Chvs",
  authDomain: "fitplan30-76a27.firebaseapp.com",
  projectId: "fitplan30-76a27",
  storageBucket: "fitplan30-76a27.firebasestorage.app",
  messagingSenderId: "1005774749920",
  appId: "1:1005774749920:web:cf088e83804d14fd51d085"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const sharedMarketRef = doc(db, "sharedData", "marketCompleteData");

// Lista completa de productos
const defaultMarketState = {
  generalBudget: 400000,
  theme: "light",
  generalItems: [
    {"status": "NO", "concept": "Bolsas de basura", "area": "Aseo Casita", "price": 1900, "qty": 1},
    {"status": "NO", "concept": "Limpia pisos", "area": "Aseo Casita", "price": 2650, "qty": 1},
    {"status": "NO", "concept": "Vinagre de Limpieza", "area": "Aseo Casita", "price": 3700, "qty": 1},
    {"status": "NO", "concept": "Lavaloza", "area": "Aseo Cocina", "price": 2590, "qty": 1},
    {"status": "NO", "concept": "Crema dental", "area": "Aseo Personal", "price": 5200, "qty": 1},
    {"status": "NO", "concept": "Aroma en palillos", "area": "Aseo Casita", "price": 5350, "qty": 2},
    {"status": "NO", "concept": "Limpido liquido", "area": "Aseo Casita", "price": 2900, "qty": 1},
    {"status": "NO", "concept": "Limpido Gel", "area": "Aseo Casita", "price": 5490, "qty": 1},
    {"status": "NO", "concept": "Polvo abrasivo", "area": "Aseo Casita", "price": 2550, "qty": 1},
    {"status": "NO", "concept": "Detergente en Polvo pequeño", "area": "Aseo Casita", "price": 1690, "qty": 1},
    {"status": "NO", "concept": "Guantes para lavar", "area": "Aseo Cocina", "price": 2500, "qty": 1},
    {"status": "NO", "concept": "Esponjas", "area": "Aseo Cocina", "price": 1800, "qty": 1},
    {"status": "NO", "concept": "Enjuague Bucal", "area": "Aseo Personal", "price": 6550, "qty": 1},
    {"status": "NO", "concept": "Cepillo de dientes X2", "area": "Aseo Personal", "price": 2990, "qty": 1},
    {"status": "NO", "concept": "Jabón Corporal (paquete)", "area": "Aseo Personal", "price": 5350, "qty": 1},
    {"status": "NO", "concept": "Protectores", "area": "Aseo Personal", "price": 4750, "qty": 1},
    {"status": "NO", "concept": "Desodorante", "area": "Aseo Personal", "price": 1400, "qty": 4},
    {"status": "NO", "concept": "Gel", "area": "Aseo Personal", "price": 4000, "qty": 1},
    {"status": "NO", "concept": "Papel higiénico X4", "area": "Baño", "price": 7100, "qty": 1},
    {"status": "NO", "concept": "Bolsas de papelera", "area": "Baño", "price": 2200, "qty": 1},
    {"status": "NO", "concept": "Desengrasante", "area": "General", "price": 2450, "qty": 1},
    {"status": "NO", "concept": "Pastilla baño", "area": "Baño", "price": 3490, "qty": 1},
    {"status": "NO", "concept": "Eliminador olores baño", "area": "Baño", "price": 6490, "qty": 2},
    {"status": "NO", "concept": "Jabón de manos", "area": "Aseo Personal", "price": 3650, "qty": 1},
    {"status": "NO", "concept": "Limpia juntas", "area": "Baño", "price": 3000, "qty": 1},
    {"status": "NO", "concept": "Detergente en Polvo Grande", "area": "Lavandería", "price": 4990, "qty": 1},
    {"status": "NO", "concept": "Detergente Liquido", "area": "Lavandería", "price": 4990, "qty": 1},
    {"status": "NO", "concept": "Ropa Color Bonaropa", "area": "Lavandería", "price": 2900, "qty": 1},
    {"status": "NO", "concept": "Jabón de coco", "area": "Lavandería", "price": 2100, "qty": 1},
    {"status": "NO", "concept": "Suavizante", "area": "Lavandería", "price": 3900, "qty": 1},
    {"status": "NO", "concept": "Servilletas", "area": "General", "price": 2350, "qty": 1},
    {"status": "NO", "concept": "Atún", "area": "Proteina", "price": 4950, "qty": 3},
    {"status": "NO", "concept": "Sardina", "area": "Proteina", "price": 6990, "qty": 1},
    {"status": "NO", "concept": "Servilletas de cocina", "area": "General", "price": 1750, "qty": 1},
    {"status": "NO", "concept": "Queso campesino", "area": "General", "price": 5000, "qty": 1},
    {"status": "NO", "concept": "Mortadela Jamonada", "area": "General", "price": 5990, "qty": 1},
    {"status": "NO", "concept": "Tarro champiñones", "area": "Proteina", "price": 5250, "qty": 1},
    {"status": "NO", "concept": "Nuggets", "area": "General", "price": 7950, "qty": 1},
    {"status": "NO", "concept": "Jamón", "area": "General", "price": 9490, "qty": 1},
    {"status": "NO", "concept": "Menudencias", "area": "General", "price": 3850, "qty": 1},
    {"status": "NO", "concept": "Huevos cubeta", "area": "General", "price": 13000, "qty": 1},
    {"status": "NO", "concept": "Carne Molida Res", "area": "Proteina", "price": 15500, "qty": 1},
    {"status": "NO", "concept": "Carne Molida Cerdo", "area": "Proteina", "price": 11211, "qty": 1},
    {"status": "NO", "concept": "Carne falda", "area": "General", "price": 10000, "qty": 1},
    {"status": "NO", "concept": "Patas y Pezcuezos", "area": "General", "price": 5490, "qty": 1},
    {"status": "NO", "concept": "Carne Res", "area": "General", "price": 14825, "qty": 1},
    {"status": "NO", "concept": "Trozos de pechuga", "area": "General", "price": 10000, "qty": 1},
    {"status": "NO", "concept": "Carne murillo", "area": "General", "price": 20000, "qty": 1},
    {"status": "NO", "concept": "Milanesa de Cerdo", "area": "General", "price": 12440, "qty": 2},
    {"status": "NO", "concept": "ALITAS BBQ", "area": "General", "price": 15690, "qty": 1},
    {"status": "NO", "concept": "Chorizos", "area": "General", "price": 4500, "qty": 2},
    {"status": "NO", "concept": "Chicharron / Tocino", "area": "General", "price": 7600, "qty": 1},
    {"status": "NO", "concept": "Tilapia", "area": "General", "price": 7490, "qty": 1},
    {"status": "NO", "concept": "Colombinas", "area": "Proteina", "price": 9990, "qty": 1},
    {"status": "NO", "concept": "Salchicha", "area": "General", "price": 7150, "qty": 1},
    {"status": "NO", "concept": "Morcilla", "area": "General", "price": 9000, "qty": 1},
    {"status": "NO", "concept": "Camarones", "area": "General", "price": 20000, "qty": 1},
    {"status": "NO", "concept": "Aluminio", "area": "General", "price": 4800, "qty": 1},
    {"status": "NO", "concept": "Parmesano", "area": "General", "price": 7550, "qty": 1},
    {"status": "NO", "concept": "Panela", "area": "General", "price": 8000, "qty": 1},
    {"status": "NO", "concept": "Leche entera", "area": "General", "price": 3200, "qty": 2},
    {"status": "NO", "concept": "Lenteja", "area": "General", "price": 2100, "qty": 1},
    {"status": "NO", "concept": "Yogurt Griego mediano", "area": "General", "price": 7600, "qty": 1},
    {"status": "NO", "concept": "Frijoles Cargamanto", "area": "General", "price": 5990, "qty": 1},
    {"status": "NO", "concept": "Arvejas", "area": "General", "price": 1850, "qty": 1},
    {"status": "NO", "concept": "Spaguetti", "area": "General", "price": 1100, "qty": 1},
    {"status": "NO", "concept": "Chococrispi", "area": "General", "price": 6490, "qty": 1},
    {"status": "NO", "concept": "Macarrones con queso", "area": "General", "price": 3990, "qty": 1},
    {"status": "NO", "concept": "Conchas", "area": "General", "price": 1200, "qty": 1},
    {"status": "NO", "concept": "Queso en lonchas", "area": "General", "price": 10500, "qty": 1},
    {"status": "NO", "concept": "Gaseosa negra", "area": "General", "price": 3250, "qty": 1},
    {"status": "NO", "concept": "Queso crema", "area": "General", "price": 4000, "qty": 1},
    {"status": "NO", "concept": "Fideos para arroz", "area": "General", "price": 1150, "qty": 1},
    {"status": "NO", "concept": "Colada", "area": "General", "price": 2100, "qty": 2},
    {"status": "NO", "concept": "Leche Klim pequeña", "area": "General", "price": 1500, "qty": 1},
    {"status": "NO", "concept": "Aceite normal", "area": "General", "price": 6490, "qty": 1},
    {"status": "NO", "concept": "Bananos", "area": "General", "price": 550, "qty": 4},
    {"status": "NO", "concept": "Panela Pulverizada", "area": "General", "price": 3990, "qty": 1},
    {"status": "NO", "concept": "Azucar", "area": "General", "price": 3200, "qty": 1},
    {"status": "NO", "concept": "Sal", "area": "General", "price": 2700, "qty": 1},
    {"status": "NO", "concept": "Fresas", "area": "General", "price": 3500, "qty": 1},
    {"status": "NO", "concept": "Mantequilla barra", "area": "General", "price": 1400, "qty": 1},
    {"status": "NO", "concept": "Mantequilla suave", "area": "General", "price": 3990, "qty": 1},
    {"status": "NO", "concept": "Maicitios", "area": "General", "price": 5990, "qty": 1},
    {"status": "NO", "concept": "Galletas saltinas", "area": "General", "price": 5600, "qty": 1},
    {"status": "NO", "concept": "Café", "area": "General", "price": 8750, "qty": 1},
    {"status": "NO", "concept": "Galletas ducales", "area": "General", "price": 6990, "qty": 1},
    {"status": "NO", "concept": "Pan Tajado", "area": "General", "price": 2990, "qty": 1},
    {"status": "NO", "concept": "Tostadas Integrales", "area": "General", "price": 0, "qty": 1},
    {"status": "NO", "concept": "Paqueton familiar", "area": "General", "price": 6350, "qty": 1},
    {"status": "NO", "concept": "Mini Croissan", "area": "General", "price": 4800, "qty": 1},
    {"status": "NO", "concept": "Harina", "area": "General", "price": 1700, "qty": 1},
    {"status": "NO", "concept": "Color", "area": "General", "price": 950, "qty": 1},
    {"status": "NO", "concept": "Azafran Rey", "area": "General", "price": 1150, "qty": 1},
    {"status": "NO", "concept": "Oregano", "area": "General", "price": 1990, "qty": 1},
    {"status": "NO", "concept": "Paprica", "area": "General", "price": 1600, "qty": 1},
    {"status": "NO", "concept": "Pimienta", "area": "General", "price": 1750, "qty": 1},
    {"status": "NO", "concept": "Sazonarey", "area": "General", "price": 1000, "qty": 1},
    {"status": "NO", "concept": "Sal de ajo", "area": "General", "price": 1990, "qty": 1},
    {"status": "NO", "concept": "Salsa de tomate", "area": "Salsas", "price": 4490, "qty": 1},
    {"status": "NO", "concept": "Salsa mayonesa", "area": "General", "price": 3990, "qty": 1},
    {"status": "NO", "concept": "Arroz paquete rojo", "area": "Granos", "price": 1650, "qty": 2},
    {"status": "NO", "concept": "Canela", "area": "General", "price": 2300, "qty": 1},
    {"status": "NO", "concept": "Salsa mostaza", "area": "General", "price": 2450, "qty": 1},
    {"status": "NO", "concept": "Pasta Penne", "area": "General", "price": 3990, "qty": 1},
    {"status": "NO", "concept": "Laminas Lasagna", "area": "General", "price": 5320, "qty": 1},
    {"status": "NO", "concept": "Vinagreta", "area": "General", "price": 3400, "qty": 1},
    {"status": "NO", "concept": "Ají", "area": "General", "price": 1000, "qty": 1},
    {"status": "NO", "concept": "Kumis", "area": "General", "price": 6850, "qty": 1},
    {"status": "NO", "concept": "Yogurt paqueticos", "area": "General", "price": 5000, "qty": 1},
    {"status": "NO", "concept": "Yogurt grande", "area": "General", "price": 3990, "qty": 1},
    {"status": "NO", "concept": "Zucaritas", "area": "General", "price": 5850, "qty": 1},
    {"status": "NO", "concept": "Papa fosforo", "area": "General", "price": 3600, "qty": 1},
    {"status": "NO", "concept": "Aros frutales", "area": "General", "price": 4350, "qty": 1},
    {"status": "NO", "concept": "Mani Dulce", "area": "General", "price": 4650, "qty": 1},
    {"status": "NO", "concept": "Frutiño", "area": "General", "price": 1000, "qty": 3},
    {"status": "NO", "concept": "Maispira", "area": "General", "price": 1950, "qty": 1},
    {"status": "NO", "concept": "Cucas", "area": "General", "price": 5800, "qty": 1},
    {"status": "NO", "concept": "Gelatina blanca", "area": "General", "price": 3990, "qty": 1},
    {"status": "NO", "concept": "Dulce de leche", "area": "General", "price": 3990, "qty": 1},
    {"status": "NO", "concept": "Leche condensada", "area": "General", "price": 4200, "qty": 1},
    {"status": "NO", "concept": "Sal salero", "area": "General", "price": 1290, "qty": 1},
    {"status": "NO", "concept": "Bocadillo", "area": "General", "price": 2150, "qty": 1},
    {"status": "NO", "concept": "Alpinitos", "area": "General", "price": 3300, "qty": 1},
    {"status": "NO", "concept": "Gelatina bogui", "area": "General", "price": 4200, "qty": 1},
    {"status": "NO", "concept": "Galleticas festivales", "area": "General", "price": 6990, "qty": 1},
    {"status": "NO", "concept": "Miel", "area": "General", "price": 8900, "qty": 1},
    {"status": "NO", "concept": "Galletas Muu", "area": "General", "price": 4900, "qty": 1},
    {"status": "NO", "concept": "Arepas", "area": "General", "price": 2500, "qty": 2},
    {"status": "NO", "concept": "Tostada clasica", "area": "General", "price": 1950, "qty": 1},
    {"status": "NO", "concept": "Chocolate", "area": "General", "price": 7550, "qty": 1},
    {"status": "NO", "concept": "Verduras congeladas", "area": "General", "price": 5700, "qty": 1},
    {"status": "NO", "concept": "Verduras paquete placita", "area": "General", "price": 2000, "qty": 1},
    {"status": "NO", "concept": "Ricostilla", "area": "General", "price": 1990, "qty": 1},
    {"status": "NO", "concept": "Salsa de maiz", "area": "General", "price": 3700, "qty": 1},
    {"status": "NO", "concept": "Vinagre Blanco", "area": "General", "price": 2850, "qty": 1},
    {"status": "NO", "concept": "Salsa Soya", "area": "General", "price": 1850, "qty": 1},
    {"status": "NO", "concept": "Gelatina", "area": "General", "price": 3490, "qty": 1},
    {"status": "NO", "concept": "Arroz sabor a coco", "area": "General", "price": 6300, "qty": 1},
    {"status": "NO", "concept": "Coco", "area": "General", "price": 3200, "qty": 1},
    {"status": "NO", "concept": "Tortillas integrales", "area": "General", "price": 4050, "qty": 1},
    {"status": "NO", "concept": "Sopera champiñon / pollo", "area": "General", "price": 1600, "qty": 2},
    {"status": "NO", "concept": "Crema de leche", "area": "General", "price": 2400, "qty": 2},
    {"status": "NO", "concept": "Antojitos", "area": "General", "price": 3400, "qty": 1},
    {"status": "NO", "concept": "Salsa Boloñesa", "area": "Salsas", "price": 2600, "qty": 1},
    {"status": "NO", "concept": "Salsa Bechamel", "area": "Salsas", "price": 2850, "qty": 1}
  ]
};

window.marketState = JSON.parse(JSON.stringify(defaultMarketState));

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initBackToTop();
});

signInAnonymously(auth);

onSnapshot(sharedMarketRef, (docSnap) => {
  if (docSnap.exists()) {
    const cloudData = docSnap.data().data;
    if (cloudData && Array.isArray(cloudData.generalItems) && cloudData.generalItems.length >= 100) {
      window.marketState = cloudData;
    } else {
      window.marketState = defaultMarketState;
      saveData();
    }
    if (window.marketState.theme) {
      document.documentElement.setAttribute("data-bs-theme", window.marketState.theme);
      localStorage.setItem("fitplan_theme", window.marketState.theme);
      updateThemeIcon(window.marketState.theme, document.getElementById("themeIcon"));
    }
  } else {
    setDoc(sharedMarketRef, { data: defaultMarketState });
  }
  renderGeneralTable();
});

/* --- TEMA CLARO / OSCURO --- */
function initThemeToggle() {
  const toggleBtn = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const htmlElement = document.documentElement;
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem("fitplan_theme") || "light";
  htmlElement.setAttribute("data-bs-theme", savedTheme);
  updateThemeIcon(savedTheme, themeIcon);

  toggleBtn.addEventListener("click", () => {
    const current = htmlElement.getAttribute("data-bs-theme");
    const next = current === "dark" ? "light" : "dark";
    htmlElement.setAttribute("data-bs-theme", next);
    localStorage.setItem("fitplan_theme", next); 
    updateThemeIcon(next, themeIcon);

    window.marketState.theme = next;
    saveData();
  });
}

function updateThemeIcon(theme, iconElement) {
  if (!iconElement) return;
  iconElement.className = theme === "dark" ? "bi bi-sun-fill text-warning" : "bi bi-moon-stars-fill";
}

function initBackToTop() {
  const button = document.getElementById("backToTop");
  if (!button) return;

  const updateVisibility = () => {
    button.hidden = window.scrollY < 400;
  };

  window.addEventListener("scroll", updateVisibility, { passive: true });
  button.addEventListener("click", () => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    window.scrollTo({ top: 0, behavior });
  });

  updateVisibility();
}

/* --- RENDERIZADO Y FILTROS --- */
window.filterGeneralTable = function() {
  renderGeneralTable();
};

function renderGeneralTable() {
  const tbody = document.getElementById("tableGeneralBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const searchText = (document.getElementById("searchConcept")?.value || "").toLowerCase();
  const statusFilter = document.getElementById("filterStatus")?.value || "";
  const areaFilter = document.getElementById("filterArea")?.value || "";

  let fullSpent = 0;
  window.marketState.generalItems.forEach(i => fullSpent += (i.price * i.qty));

  let visibleCount = 0;
  window.marketState.generalItems.forEach((item, index) => {
    if (searchText && !item.concept.toLowerCase().includes(searchText)) return;
    if (statusFilter && item.status !== statusFilter) return;
    if (areaFilter && item.area !== areaFilter) return;

    visibleCount++;
    const total = item.price * item.qty;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="ps-3">
        <select class="form-select form-select-sm fw-semibold" onchange="updateGenStatus(${index}, this.value)">
          <option value="NO" ${item.status === "NO" ? "selected" : ""}>NO</option>
          <option value="SI" ${item.status === "SI" ? "selected" : ""}>SI</option>
          <option value="YA" ${item.status === "YA" ? "selected" : ""}>YA</option>
        </select>
      </td>
      <td class="fw-semibold">${item.concept}</td>
      <td><span class="badge bg-secondary-subtle text-secondary border">${item.area}</span></td>
      <td class="text-end">$${item.price.toLocaleString("es-CO")}</td>
      <td class="text-center">${item.qty}</td>
      <td class="text-end fw-bold">$${total.toLocaleString("es-CO")}</td>
      <td class="text-center pe-3">
        <button class="btn btn-sm btn-link text-primary p-0 me-2" onclick="openEditGeneralModal(${index})"><i class="bi bi-pencil-fill fs-6"></i></button>
        <button class="btn btn-sm btn-link text-danger p-0" onclick="deleteGeneralItem(${index})"><i class="bi bi-trash-fill fs-6"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const budget = window.marketState.generalBudget || 500000;
  const remaining = budget - fullSpent;

  const countTitle = document.getElementById("itemCountTitle");
  if (countTitle) countTitle.textContent = `Lista Completa (${visibleCount} Ítems)`;

  document.getElementById("genBudget").textContent = `$${budget.toLocaleString("es-CO")}`;
  document.getElementById("genTotal").textContent = `$${fullSpent.toLocaleString("es-CO")}`;
  document.getElementById("genRemaining").textContent = `$${remaining.toLocaleString("es-CO")}`;
}

window.updateGenStatus = function(index, val) {
  window.marketState.generalItems[index].status = val;
  saveData();
};

window.openAddGeneralModal = function() {
  document.getElementById("genModalTitle").textContent = "Agregar Producto General";
  document.getElementById("genProdIndex").value = "";
  document.getElementById("genConcept").value = "";
  document.getElementById("genArea").value = "Aseo Casita";
  document.getElementById("genPrice").value = "";
  document.getElementById("genQty").value = "1";
  document.getElementById("genStatus").value = "NO";
  new bootstrap.Modal(document.getElementById("genProductModal")).show();
};

window.openEditGeneralModal = function(index) {
  const item = window.marketState.generalItems[index];
  document.getElementById("genModalTitle").textContent = "Editar Producto General";
  document.getElementById("genProdIndex").value = index;
  document.getElementById("genConcept").value = item.concept;
  document.getElementById("genArea").value = item.area;
  document.getElementById("genPrice").value = item.price;
  document.getElementById("genQty").value = item.qty;
  document.getElementById("genStatus").value = item.status;
  new bootstrap.Modal(document.getElementById("genProductModal")).show();
};

window.saveGeneralProduct = function() {
  const idx = document.getElementById("genProdIndex").value;
  const concept = document.getElementById("genConcept").value;
  const area = document.getElementById("genArea").value;
  const price = Number(document.getElementById("genPrice").value) || 0;
  const qty = Number(document.getElementById("genQty").value) || 1;
  const status = document.getElementById("genStatus").value;

  if(!concept) {
    Swal.fire({icon: 'warning', title: 'Atención', text: 'El concepto del producto es obligatorio.'});
    return;
  }

  const newItem = { status, concept, area, price, qty };
  if (idx === "") window.marketState.generalItems.push(newItem);
  else window.marketState.generalItems[Number(idx)] = newItem;

  saveData();
  bootstrap.Modal.getInstance(document.getElementById("genProductModal")).hide();
};

window.deleteGeneralItem = function(index) {
  Swal.fire({
    title: '¿Eliminar producto?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      window.marketState.generalItems.splice(index, 1);
      saveData();
    }
  });
};

window.changeGeneralBudget = function() {
  Swal.fire({
    title: "Presupuesto General",
    input: "number",
    inputValue: window.marketState.generalBudget,
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar"
  }).then((res) => {
    if (res.isConfirmed && res.value) {
      window.marketState.generalBudget = Number(res.value);
      saveData();
    }
  });
};

window.restoreFullList = function() {
  Swal.fire({
    title: '¿Restablecer lista completa?',
    text: "Se recargarán los 145+ productos originales en la base de datos.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, restablecer',
    cancelButtonText: 'Cancelar'
  }).then((res) => {
    if (res.isConfirmed) {
      window.marketState = JSON.parse(JSON.stringify(defaultMarketState));
      saveData();
      Swal.fire('Restablecido', 'Lista completa recuperada con éxito', 'success');
    }
  });
};

function saveData() {
  setDoc(sharedMarketRef, { data: window.marketState }, { merge: true });
}
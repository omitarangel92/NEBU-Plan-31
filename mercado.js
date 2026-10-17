import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, runTransaction, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signOut, reload } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { calculateMarketTotals, escapeHtml, migrateMarketCatalogs, parseNonNegativeNumber, uniqueValues } from "./shared-logic.mjs";
import { installBackupTools } from "./backup-tools.mjs";
import { installActivityHistory } from "./activity-history.mjs";

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
installBackupTools(app, auth);
installActivityHistory(app, auth);
const authorizedUserIds = new Set([
  "khWRDuGHOxbih1kTdgLxgiv6Rd52",
  "eBt7BBTdc4MLRzQx3arbgVxjM2F3"
]);

const sharedMarketRef = doc(db, "sharedData", "marketCompleteData");
const activityHistoryRef = doc(db, "sharedData", "activityHistory");
const DEFAULT_MARKET_BUDGET = 400000;
const MARKET_SETUP_VERSION = 2;
const NUTRITION_FRUITS = [
  { concept: "Papaya", aliases: ["papaya", "papayas"] },
  { concept: "Banano", aliases: ["banano", "bananos", "banana", "bananas"] },
  { concept: "Mandarina", aliases: ["mandarina", "mandarinas"] },
  { concept: "Naranja", aliases: ["naranja", "naranjas"] },
  { concept: "Manzana", aliases: ["manzana", "manzanas"] },
  { concept: "Uvas", aliases: ["uva", "uvas"] },
  { concept: "Uchuvas", aliases: ["uchuva", "uchuvas"] },
  { concept: "Durazno", aliases: ["durazno", "duraznos"] },
  { concept: "Sandía", aliases: ["sandia", "sandias"] },
  { concept: "Mango", aliases: ["mango", "mangos"] },
  { concept: "Pera", aliases: ["pera", "peras"] },
  { concept: "Fresas", aliases: ["fresa", "fresas", "frutilla", "frutillas"] },
  { concept: "Kiwi", aliases: ["kiwi", "kiwis"] },
  { concept: "Coco", aliases: ["coco", "cocos"] },
  { concept: "Ciruelas", aliases: ["ciruela", "ciruelas"] },
  { concept: "Piña", aliases: ["pina", "pinas"] },
  { concept: "Limón", aliases: ["limon", "limones"] },
  { concept: "Aguacate", aliases: ["aguacate", "aguacates", "palta", "paltas"] },
  { concept: "Tomate", aliases: ["tomate", "tomates"] },
  { concept: "Plátano maduro", aliases: ["platano maduro", "platanos maduros"] },
  { concept: "Plátano verde", aliases: ["platano verde", "platanos verdes"] },
  { concept: "Uvas pasas", aliases: ["uva pasa", "uvas pasas", "pasas"] }
];
const MEAT_TERMS = [
  "carne", "pollo", "pechuga", "cerdo", "res", "pescado", "tilapia", "atun",
  "sardina", "camaron", "chorizo", "morcilla", "salchicha", "menudencia",
  "nugget", "colombina", "jamon", "mortadela", "tocino", "pezcuezo",
  "espinazo", "costilla", "alita", "chicharron", "pata"
];

// Lista completa de productos
const defaultMarketState = {
  generalBudget: DEFAULT_MARKET_BUDGET,
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

function createDefaultMarketState() {
  const state = JSON.parse(JSON.stringify(defaultMarketState));
  state.generalBudget = DEFAULT_MARKET_BUDGET;
  state.generalItems = state.generalItems.map((item, index) => ({
    ...item,
    id: `default-${index}`,
    status: "NO"
  }));
  return applyInitialMarketSetup(state);
}

function normalizeConcept(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function findNutritionFruit(concept) {
  const normalized = normalizeConcept(concept);
  return NUTRITION_FRUITS.find(fruit => fruit.aliases.includes(normalized));
}

function defaultPlaceForItem(concept) {
  if (findNutritionFruit(concept)) return "Zapatoca";
  const normalized = normalizeConcept(concept);
  if (normalized.includes("sopera")) return "D1";
  const words = normalized.split(/[^a-z0-9]+/);
  if (words.some(word =>
    MEAT_TERMS.some(term => word === term || word === `${term}s` || word === `${term}es`)
  )) return "ARA";
  return "D1";
}

function applyInitialMarketSetup(state) {
  const generalItems = state.generalItems.map(item => {
    const fruit = findNutritionFruit(item.concept);
    return {
      ...item,
      area: fruit ? "Frutas" : item.area,
      place: defaultPlaceForItem(item.concept)
    };
  });

  NUTRITION_FRUITS.forEach((fruit, index) => {
    if (generalItems.some(item => findNutritionFruit(item.concept)?.concept === fruit.concept)) return;
    generalItems.push({
      id: `nutrition-fruit-${index}`,
      status: "NO",
      concept: fruit.concept,
      area: "Frutas",
      price: 0,
      qty: 1,
      place: "Zapatoca"
    });
  });

  return {
    ...state,
    generalItems,
    areas: uniqueValues([...(state.areas || []), ...generalItems.map(item => item.area)]),
    places: uniqueValues([...(state.places || []), ...generalItems.map(item => item.place)])
  };
}

window.marketState = createDefaultMarketState();
let marketReady = false;
let editingProductOriginal = null;
let activeAuthUid = null;
let stopMarketListener = null;

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initBackToTop();
  initProductCategorySelects();
});

const ADD_NEW_OPTION = "__add_new__";

function initProductCategorySelects() {
  document.getElementById("genArea").addEventListener("change", event => {
    const isAdding = event.target.value === ADD_NEW_OPTION;
    const container = document.getElementById("newAreaContainer");
    const input = document.getElementById("genNewArea");
    container.hidden = !isAdding;
    input.required = isAdding;
    if (isAdding) input.focus();
  });

  document.getElementById("genPlace").addEventListener("change", event => {
    const isAdding = event.target.value === ADD_NEW_OPTION;
    const container = document.getElementById("newPlaceContainer");
    const input = document.getElementById("genNewPlace");
    container.hidden = !isAdding;
    input.required = isAdding;
    if (isAdding) input.focus();
  });
}

function populateProductSelect(select, values, placeholder, selectedValue, addLabel) {
  select.replaceChildren(new Option(placeholder, ""));
  values.forEach(value => select.add(new Option(value, value)));
  select.add(new Option(addLabel, ADD_NEW_OPTION));
  select.value = selectedValue;
}

function getProductSelectValue(selectId, newValueId, label) {
  const select = document.getElementById(selectId);
  if (select.value !== ADD_NEW_OPTION) return select.value;

  const newValue = document.getElementById(newValueId).value.trim();
  if (!newValue) {
    Swal.fire({ icon: "warning", title: "Falta el nombre", text: `Escribe el nombre de ${label}.` });
    return null;
  }
  return newValue;
}

setSyncStatus("Conectando con la lista compartida...");
onAuthStateChanged(auth, user => {
  handleMarketAuthState(user).catch(error => {
    console.error("Error validando el acceso:", error);
    showMarketAuthGate("login", "No se pudo validar el acceso. Intenta iniciar sesión de nuevo.");
  });
});

async function handleMarketAuthState(user) {
  if (activeAuthUid && activeAuthUid !== user?.uid) {
    stopMarketListener?.();
    activeAuthUid = null;
    marketReady = false;
  }
  if (user?.isAnonymous) {
    await signOut(auth);
    return;
  }
  if (!user) {
    activeAuthUid = null;
    marketReady = false;
    stopMarketListener?.();
    showMarketAuthGate("login");
    return;
  }
  if (!authorizedUserIds.has(user.uid)) {
    await signOut(auth);
    showMarketAuthGate("login", "Esta cuenta no está autorizada para usar la aplicación.");
    return;
  }
  if (!user.emailVerified) {
    showMarketAuthGate("verify", `Verifica el correo ${user.email} para habilitar el acceso.`);
    return;
  }
  if (activeAuthUid === user.uid) {
    document.getElementById("authGate").hidden = true;
    document.getElementById("marketAppSection").hidden = false;
    return;
  }
  document.getElementById("authGate").hidden = true;
  document.getElementById("marketAppSection").hidden = false;
  activeAuthUid = user.uid;
  await initializeSharedMarket();
}

function showMarketAuthGate(mode, message = "") {
  document.getElementById("authGate").hidden = false;
  document.getElementById("marketAppSection").hidden = true;
  document.getElementById("loginPanel").hidden = mode !== "login";
  document.getElementById("verifyPanel").hidden = mode !== "verify";
  const authMessage = document.getElementById("authMessage");
  authMessage.textContent = message;
  authMessage.classList.remove("text-success");
  authMessage.classList.add("text-danger");
}

window.loginWithEmail = async function(event) {
  event.preventDefault();
  const email = document.getElementById("authEmail").value.trim().toLowerCase();
  const password = document.getElementById("authPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error iniciando sesión:", error);
    showMarketAuthGate("login", "No se pudo iniciar sesión. Verifica el correo y la contraseña.");
  }
};

window.sendPasswordReset = async function() {
  const email = document.getElementById("authEmail").value.trim().toLowerCase();
  if (!email) {
    document.getElementById("authMessage").textContent = "Escribe tu correo para enviarte el enlace de recuperación.";
    document.getElementById("authEmail").focus();
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    setAuthMessage("Si el correo corresponde a una cuenta, recibirás instrucciones para cambiar la contraseña.", false);
  } catch (error) {
    console.error("Error enviando recuperación de contraseña:", error);
    setAuthMessage("No se pudo enviar el correo de recuperación. Verifica la dirección e inténtalo de nuevo.");
  }
};

function setAuthMessage(message, isError = true) {
  const authMessage = document.getElementById("authMessage");
  authMessage.textContent = message;
  authMessage.classList.toggle("text-danger", isError);
  authMessage.classList.toggle("text-success", !isError);
}

window.sendVerificationEmail = async function() {
  const user = auth.currentUser;
  if (!user) {
    showMarketAuthGate("login", "Inicia sesión con una cuenta autorizada primero.");
    return;
  }
  try {
    await sendEmailVerification(user);
    showMarketAuthGate("verify", `Enviamos un enlace de verificación a ${user.email}.`);
  } catch (error) {
    console.error("Error enviando la verificación:", error);
    showMarketAuthGate("verify", "No se pudo enviar el correo de verificación. Intenta de nuevo.");
  }
};

window.confirmEmailVerified = async function() {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await reload(user);
    await user.getIdToken(true);
    await handleMarketAuthState(user);
    if (!user.emailVerified) {
      showMarketAuthGate("verify", "Firebase aún no confirma el correo. Abre el enlace del mensaje e inténtalo otra vez.");
    }
  } catch (error) {
    console.error("Error confirmando la verificación:", error);
    showMarketAuthGate("verify", "No se pudo confirmar la verificación. Intenta de nuevo.");
  }
};

window.logoutApp = function() {
  signOut(auth).catch(error => {
    console.error("Error cerrando sesión:", error);
    Swal.fire({ icon: "error", title: "Error", text: "No se pudo cerrar la sesión." });
  });
};

async function initializeSharedMarket() {
  marketReady = false;
  stopMarketListener?.();
  await runTransaction(db, async transaction => {
    const snapshot = await transaction.get(sharedMarketRef);
    if (!snapshot.exists()) {
      transaction.set(sharedMarketRef, {
        data: createDefaultMarketState(),
        marketSetupVersion: MARKET_SETUP_VERSION
      });
      return;
    }

    const storedData = snapshot.data().data;
    if (!storedData || !Array.isArray(storedData.generalItems)) {
      throw new Error("Los datos guardados de la lista no tienen un formato válido. No se modificaron.");
    }

    const normalized = normalizeMarketState(storedData);
    const setupVersion = Number(snapshot.data().marketSetupVersion) || 0;
    let state = normalized.state;
    if (setupVersion < 1) {
      state = applyInitialMarketSetup(state);
    }
    if (setupVersion < MARKET_SETUP_VERSION || normalized.needsMigration) {
      transaction.set(sharedMarketRef, {
        data: migrateMarketCatalogs(state),
        marketSetupVersion: MARKET_SETUP_VERSION
      }, { merge: true });
    }
  });

  stopMarketListener = onSnapshot(sharedMarketRef, { includeMetadataChanges: true }, snapshot => {
    if (snapshot.metadata.fromCache) {
      setSyncStatus("Esperando confirmación del servidor...");
      return;
    }
    if (!snapshot.exists()) {
      reportSyncError(new Error("No se encontró la lista compartida en el servidor."));
      return;
    }

    const storedData = snapshot.data().data;
    if (!storedData || !Array.isArray(storedData.generalItems)) {
      reportSyncError(new Error("Los datos guardados de la lista no tienen un formato válido. No se modificaron."));
      return;
    }

    window.marketState = normalizeMarketState(storedData).state;
    marketReady = true;
    setSyncStatus(snapshot.metadata.hasPendingWrites ? "Guardando..." : "Sincronizado");
    applyMarketTheme();
    renderGeneralTable();
  }, reportSyncError);
}

function normalizeMarketState(data) {
  const parsedBudget = Number(data.generalBudget);
  const hasValidBudget = data.generalBudget !== null
    && data.generalBudget !== ""
    && Number.isFinite(parsedBudget);
  const productIds = new Set();
  let needsMigration = !hasValidBudget
    || !["light", "dark"].includes(data.theme)
    || !Array.isArray(data.areas)
    || !Array.isArray(data.places)
    || (Array.isArray(data.areas) && uniqueValues(data.areas).length !== data.areas.length)
    || (Array.isArray(data.places) && uniqueValues(data.places).length !== data.places.length);
  data.generalItems.forEach(item => {
    if (!item || typeof item !== "object") {
      needsMigration = true;
      return;
    }
    const validId = typeof item.id === "string"
      && item.id.trim() !== ""
      && item.id.trim() === item.id
      && !productIds.has(item.id);
    if (validId) productIds.add(item.id);
    if (!validId
      || !["NO", "SI", "YA"].includes(item.status)
      || typeof item.concept !== "string"
      || typeof item.area !== "string"
      || typeof item.place !== "string"
      || !Number.isFinite(Number(item.price))
      || !Number.isFinite(Number(item.qty))
      || Number(item.qty) < 1) {
      needsMigration = true;
    }
    if (typeof item.area === "string"
      && (!Array.isArray(data.areas) || !data.areas.includes(item.area))) needsMigration = true;
    if (typeof item.place === "string"
      && (!Array.isArray(data.places) || !data.places.includes(item.place))) needsMigration = true;
  });
  const usedIds = new Set();
  const state = migrateMarketCatalogs({
    ...data,
    generalBudget: hasValidBudget ? parsedBudget : DEFAULT_MARKET_BUDGET,
    theme: ["light", "dark"].includes(data.theme) ? data.theme : "light",
    generalItems: data.generalItems.map((item, index) => {
      const product = item && typeof item === "object" ? item : {};
      const price = Number(product.price);
      const qty = Number(product.qty);
      let id = typeof product.id === "string" ? product.id.trim() : "";
      if (!id || usedIds.has(id)) {
        id = `legacy-${index}`;
        while (usedIds.has(id)) id += "-migrated";
      }
      usedIds.add(id);
      return {
        ...product,
        id,
        status: ["NO", "SI", "YA"].includes(product.status) ? product.status : "NO",
        concept: typeof product.concept === "string" ? product.concept : "",
        area: typeof product.area === "string" ? product.area : "",
        place: typeof product.place === "string" ? product.place : "",
        price: Number.isFinite(price) ? price : 0,
        qty: Number.isFinite(qty) && qty >= 1 ? qty : 1
      };
    })
  });
  return { state, needsMigration };
}

function applyMarketTheme() {
  const theme = window.marketState.theme;
  document.documentElement.setAttribute("data-bs-theme", theme);
  localStorage.setItem("fitplan_theme", theme);
  updateThemeIcon(theme, document.getElementById("themeIcon"));
}

function setSyncStatus(message, isError = false) {
  const status = document.getElementById("marketSyncStatus");
  if (!status) return;
  status.textContent = message;
  status.classList.toggle("text-danger", isError);
  status.classList.toggle("text-success", !isError && message === "Sincronizado");
}

function reportSyncError(error) {
  console.error("Error sincronizando la lista de mercado:", error);
  setSyncStatus("Error de sincronización. Tus cambios no se guardaron.", true);
  if (window.Swal) {
    Swal.fire({
      icon: "error",
      title: "No se pudo sincronizar",
      text: "Revisa tu conexión e inténtalo de nuevo. La lista guardada no se reemplazó."
    });
  }
}

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
    saveData(state => ({ ...state, theme: next }), "Cambió el tema de la lista");
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

window.clearMarketFilters = function() {
  document.getElementById("searchConcept").value = "";
  document.getElementById("filterStatus").value = "";
  document.getElementById("filterArea").value = "";
  document.getElementById("filterPlace").value = "";
  renderGeneralTable();
};

function renderGeneralTable() {
  const tbody = document.getElementById("tableGeneralBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const searchText = (document.getElementById("searchConcept")?.value || "").toLowerCase();
  const statusFilter = document.getElementById("filterStatus")?.value || "";
  updateMarketFilters();
  const areaFilter = document.getElementById("filterArea")?.value || "";
  const placeFilter = document.getElementById("filterPlace")?.value || "";

  const totals = calculateMarketTotals(window.marketState.generalItems, window.marketState.generalBudget);
  const siTotal = calculateTotalForStatuses(window.marketState.generalItems, ["SI"]);

  let visibleCount = 0;
  window.marketState.generalItems.forEach((item, index) => {
    if (searchText && !item.concept.toLowerCase().includes(searchText)) return;
    if (statusFilter && item.status !== statusFilter) return;
    if (areaFilter && item.area !== areaFilter) return;
    if (placeFilter && item.place !== placeFilter) return;

    visibleCount++;
    const total = item.price * item.qty;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="ps-3" data-label="Estado">
        <select class="form-select form-select-sm fw-semibold" onchange="updateGenStatus(${index}, this.value)">
          <option value="NO" ${item.status === "NO" ? "selected" : ""}>NO</option>
          <option value="SI" ${item.status === "SI" ? "selected" : ""}>SI</option>
          <option value="YA" ${item.status === "YA" ? "selected" : ""}>YA</option>
        </select>
      </td>
      <td class="fw-semibold" data-label="Producto">${escapeHtml(item.concept)}</td>
      <td data-label="Área"><span class="badge bg-secondary-subtle text-secondary border">${escapeHtml(item.area)}</span></td>
      <td data-label="Lugar de compra">${escapeHtml(item.place || "—")}</td>
      <td class="text-end" data-label="Precio unitario">$${item.price.toLocaleString("es-CO")}</td>
      <td class="text-center" data-label="Cantidad">${item.qty}</td>
      <td class="text-end fw-bold" data-label="Total">$${total.toLocaleString("es-CO")}</td>
      <td class="text-center pe-3" data-label="Acciones">
        <button class="btn btn-sm btn-link text-primary p-0 me-2" aria-label="Editar ${escapeHtml(item.concept)}" onclick="openEditGeneralModal(${index})"><i class="bi bi-pencil-fill fs-6"></i></button>
        <button class="btn btn-sm btn-link text-danger p-0" aria-label="Eliminar ${escapeHtml(item.concept)}" onclick="deleteGeneralItem(${index})"><i class="bi bi-trash-fill fs-6"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const budget = Number.isFinite(Number(window.marketState.generalBudget))
    ? Number(window.marketState.generalBudget)
    : DEFAULT_MARKET_BUDGET;
  const countTitle = document.getElementById("itemCountTitle");
  if (countTitle) countTitle.textContent = `Lista Completa (${visibleCount} Ítems)`;

  document.getElementById("genBudget").textContent = `$${budget.toLocaleString("es-CO")}`;
  document.getElementById("genTotal").textContent = `$${totals.purchased.toLocaleString("es-CO")}`;
  document.getElementById("genPending").textContent = `$${totals.pending.toLocaleString("es-CO")}`;
  document.getElementById("genRemaining").textContent = `$${totals.remaining.toLocaleString("es-CO")}`;
  document.getElementById("siTotal").textContent = `$${siTotal.toLocaleString("es-CO")}`;
  document.getElementById("siTotalCard").hidden = statusFilter !== "SI";
  renderCatalogLists();
}

function calculateTotalForStatuses(items, statuses) {
  return items.reduce((total, item) => {
    return statuses.includes(item.status)
      ? total + (item.price * item.qty)
      : total;
  }, 0);
}

function updateMarketFilters() {
  const areas = uniqueValues(window.marketState.areas || []);
  const places = uniqueValues(window.marketState.places || []);

  updateFilterOptions(document.getElementById("filterArea"), "Área: Todas", areas);
  updateFilterOptions(document.getElementById("filterPlace"), "Lugar de compra: Todos", places);
}

function updateFilterOptions(select, placeholder, values) {
  if (!select) return;
  const selectedValue = select.value;
  select.replaceChildren(new Option(placeholder, ""));
  values.forEach(value => select.add(new Option(value, value)));
  if (values.includes(selectedValue)) select.value = selectedValue;
}

function catalogLabel(type) {
  return type === "areas" ? "área" : "lugar de compra";
}

function canonicalCatalogValue(values, value) {
  const normalized = normalizeConcept(value);
  return values.find(entry => normalizeConcept(entry) === normalized) || value;
}

function renderCatalogLists() {
  for (const type of ["areas", "places"]) {
    const list = document.getElementById(type === "areas" ? "areasCatalogList" : "placesCatalogList");
    if (!list) continue;
    list.replaceChildren();
    const values = uniqueValues(window.marketState[type] || []);
    if (!values.length) {
      const empty = document.createElement("li");
      empty.className = "list-group-item text-secondary small";
      empty.textContent = "Todavía no hay opciones.";
      list.appendChild(empty);
      continue;
    }
    values.forEach(value => {
      const row = document.createElement("li");
      row.className = "list-group-item d-flex align-items-center justify-content-between gap-2";
      const name = document.createElement("span");
      name.className = "text-break";
      name.textContent = value;
      const actions = document.createElement("span");
      actions.className = "d-flex gap-1 flex-shrink-0";
      const rename = document.createElement("button");
      rename.type = "button";
      rename.className = "btn btn-outline-secondary btn-sm";
      rename.textContent = "Renombrar";
      rename.addEventListener("click", () => renameMarketCatalogValue(type, value));
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "btn btn-outline-danger btn-sm";
      remove.textContent = "Eliminar";
      remove.addEventListener("click", () => deleteMarketCatalogValue(type, value));
      actions.append(rename, remove);
      row.append(name, actions);
      list.appendChild(row);
    });
  }
}

window.openCatalogManager = function() {
  renderCatalogLists();
  bootstrap.Modal.getOrCreateInstance(document.getElementById("catalogManagerModal")).show();
};

window.addMarketCatalogValue = async function(type) {
  const label = catalogLabel(type);
  const result = await Swal.fire({
    title: `Agregar ${label}`,
    input: "text",
    inputPlaceholder: `Nombre de ${label}`,
    showCancelButton: true,
    confirmButtonText: "Agregar",
    cancelButtonText: "Cancelar",
    inputValidator: value => value.trim() ? undefined : `Escribe el nombre de ${label}.`
  });
  if (!result.isConfirmed) return;
  const value = result.value.trim();
  const saved = await saveData(state => {
    const catalog = uniqueValues(state[type] || []);
    if (catalog.some(entry => normalizeConcept(entry) === normalizeConcept(value))) {
      throw new Error(`Ya existe ${label} con ese nombre.`);
    }
    return { ...state, [type]: uniqueValues([...catalog, value]) };
  }, `Agregó la opción ${value} a ${label}`);
  if (saved) renderCatalogLists();
};

async function renameMarketCatalogValue(type, oldValue) {
  const label = catalogLabel(type);
  const result = await Swal.fire({
    title: `Renombrar ${label}`,
    input: "text",
    inputValue: oldValue,
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    inputValidator: value => value.trim() ? undefined : `Escribe el nombre de ${label}.`
  });
  if (!result.isConfirmed) return;
  const newValue = result.value.trim();
  if (newValue === oldValue) return;
  const saved = await saveData(state => {
    const catalog = state[type] || [];
    if (!catalog.includes(oldValue)) {
      throw new Error(`La opción "${oldValue}" ya fue cambiada desde otro dispositivo.`);
    }
    if (catalog.some(entry => entry !== oldValue && normalizeConcept(entry) === normalizeConcept(newValue))) {
      throw new Error(`Ya existe ${label} con ese nombre.`);
    }
    const field = type === "areas" ? "area" : "place";
    const generalItems = state.generalItems.map(item =>
      item[field] === oldValue ? { ...item, [field]: newValue } : item
    );
    return {
      ...state,
      [type]: uniqueValues(catalog.map(entry => entry === oldValue ? newValue : entry)),
      generalItems
    };
  }, `Renombró ${label} ${oldValue} a ${newValue}`);
  if (saved) renderCatalogLists();
}

async function deleteMarketCatalogValue(type, value) {
  const label = catalogLabel(type);
  const field = type === "areas" ? "area" : "place";
  if (window.marketState.generalItems.some(item => item[field] === value)) {
    await Swal.fire({
      icon: "info",
      title: `No se puede eliminar ${label}`,
      text: `Primero cambia o elimina los productos que usan "${value}".`
    });
    return;
  }
  const result = await Swal.fire({
    icon: "warning",
    title: `¿Eliminar ${label}?`,
    text: `Se quitará "${value}" de las opciones disponibles.`,
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar"
  });
  if (!result.isConfirmed) return;
  const saved = await saveData(state => {
    if (state.generalItems.some(item => item[field] === value)) {
      throw new Error(`La opción "${value}" ya está siendo usada por un producto.`);
    }
    return {
      ...state,
      [type]: (state[type] || []).filter(entry => entry !== value)
    };
  }, `Eliminó la opción ${value} de ${label}`);
  if (saved) renderCatalogLists();
}

window.updateGenStatus = function(index, val) {
  const item = window.marketState.generalItems[index];
  const itemId = item?.id;
  if (!itemId) return;
  saveData(state => ({
    ...state,
    generalItems: updateMarketItem(state.generalItems, itemId, { status: val })
  }), `Cambió el estado de ${item.concept} a ${val}`);
};

window.openAddGeneralModal = function() {
  editingProductOriginal = null;
  document.getElementById("genModalTitle").textContent = "Agregar Producto General";
  document.getElementById("genProdId").value = "";
  document.getElementById("genConcept").value = "";
  const areas = uniqueValues(window.marketState.areas || []);
  const places = uniqueValues(window.marketState.places || []);
  const defaultArea = areas.includes("Aseo Casita") ? "Aseo Casita" : "";
  populateProductSelect(document.getElementById("genArea"), areas, "Selecciona un área", defaultArea, "+ Agregar nueva área...");
  populateProductSelect(document.getElementById("genPlace"), places, "Sin asignar (automático)", "", "+ Agregar nuevo lugar...");
  document.getElementById("newAreaContainer").hidden = true;
  document.getElementById("genNewArea").value = "";
  document.getElementById("genNewArea").required = false;
  document.getElementById("newPlaceContainer").hidden = true;
  document.getElementById("genNewPlace").value = "";
  document.getElementById("genNewPlace").required = false;
  document.getElementById("genPrice").value = "";
  document.getElementById("genQty").value = "1";
  document.getElementById("genStatus").value = "NO";
  new bootstrap.Modal(document.getElementById("genProductModal")).show();
};

window.openEditGeneralModal = function(index) {
  const item = window.marketState.generalItems[index];
  if (!item) return;
  editingProductOriginal = { ...item };
  document.getElementById("genModalTitle").textContent = "Editar Producto General";
  document.getElementById("genProdId").value = item.id;
  document.getElementById("genConcept").value = item.concept;
  const areas = uniqueValues(window.marketState.areas || []);
  const places = uniqueValues(window.marketState.places || []);
  populateProductSelect(document.getElementById("genArea"), areas, "Selecciona un área", item.area, "+ Agregar nueva área...");
  populateProductSelect(document.getElementById("genPlace"), places, "Sin asignar (automático)", item.place || "", "+ Agregar nuevo lugar...");
  document.getElementById("newAreaContainer").hidden = true;
  document.getElementById("genNewArea").value = "";
  document.getElementById("genNewArea").required = false;
  document.getElementById("newPlaceContainer").hidden = true;
  document.getElementById("genNewPlace").value = "";
  document.getElementById("genNewPlace").required = false;
  document.getElementById("genPrice").value = item.price;
  document.getElementById("genQty").value = item.qty;
  document.getElementById("genStatus").value = item.status;
  new bootstrap.Modal(document.getElementById("genProductModal")).show();
};

window.saveGeneralProduct = async function() {
  const itemId = document.getElementById("genProdId").value;
  const concept = document.getElementById("genConcept").value.trim();
  const selectedArea = getProductSelectValue("genArea", "genNewArea", "la nueva área");
  if (selectedArea === null) return;
  if (!selectedArea.trim()) {
    Swal.fire({ icon: "warning", title: "Falta el área", text: "Selecciona un área o agrega una nueva." });
    return;
  }
  const area = canonicalCatalogValue(window.marketState.areas || [], selectedArea.trim());
  const selectedPlace = getProductSelectValue("genPlace", "genNewPlace", "el nuevo lugar de compra");
  if (selectedPlace === null) return;
  const place = canonicalCatalogValue(
    window.marketState.places || [],
    selectedPlace.trim() || defaultPlaceForItem(concept)
  );
  const rawQty = document.getElementById("genQty").value.trim();
  const price = parseNonNegativeNumber(document.getElementById("genPrice").value);
  const qty = Number(rawQty);
  const status = document.getElementById("genStatus").value;

  if (!concept) {
    Swal.fire({ icon: "warning", title: "Atención", text: "El concepto del producto es obligatorio." });
    return;
  }
  if (price === null || !Number.isInteger(price)) {
    Swal.fire({ icon: "warning", title: "Precio no válido", text: "Ingresa un precio entero igual o mayor que cero." });
    return;
  }
  if (!rawQty || !Number.isInteger(qty) || qty < 1) {
    Swal.fire({ icon: "warning", title: "Cantidad no válida", text: "Ingresa una cantidad entera de al menos 1." });
    return;
  }

  const existingItem = itemId === ""
    ? null
    : window.marketState.generalItems.find(item => item.id === itemId);
  if (itemId && !existingItem) {
    Swal.fire({
      icon: "warning",
      title: "Producto ya no disponible",
      text: "Este producto ya no está en la lista compartida. Cierra el formulario y vuelve a cargarlo."
    });
    return;
  }
  const newItem = {
    id: itemId || `item-${crypto.randomUUID()}`,
    status,
    concept,
    area,
    place,
    price,
    qty
  };
  const originalItem = editingProductOriginal
    ? { ...editingProductOriginal }
    : existingItem
      ? { ...existingItem }
      : null;
  const saveButton = document.getElementById("saveProductButton");
  saveButton.disabled = true;
  const saved = await saveData(state => {
    const canonicalArea = canonicalCatalogValue(state.areas || [], area);
    const canonicalPlace = canonicalCatalogValue(state.places || [], place);
    const product = { ...newItem, area: canonicalArea, place: canonicalPlace };
    let generalItems;
    if (existingItem) {
      const latestItem = state.generalItems.find(item => item.id === existingItem.id);
      if (!latestItem) throw new Error("El producto ya no existe en la lista compartida.");
      const changes = {};
      for (const field of ["status", "concept", "area", "place", "price", "qty"]) {
        if (Object.is(originalItem[field], product[field])) continue;
        if (!Object.is(latestItem[field], originalItem[field])
          && !Object.is(latestItem[field], product[field])) {
          throw new Error(`El campo "${field}" cambió desde otro dispositivo. Cierra y vuelve a editar el producto.`);
        }
        changes[field] = product[field];
      }
      generalItems = updateMarketItem(state.generalItems, existingItem.id, changes);
    } else {
      generalItems = [...state.generalItems, product];
    }
    return {
      ...state,
      areas: uniqueValues([...(state.areas || []), canonicalArea]),
      places: uniqueValues([...(state.places || []), canonicalPlace]),
      generalItems
    };
  }, existingItem ? `Editó el producto ${concept}` : `Agregó el producto ${concept}`);
  saveButton.disabled = false;
  if (!saved) return;
  editingProductOriginal = null;
  bootstrap.Modal.getInstance(document.getElementById("genProductModal")).hide();
};

window.deleteGeneralItem = function(index) {
  const itemId = window.marketState.generalItems[index]?.id;
  if (!itemId) return;
  const removedItem = window.marketState.generalItems[index];
  Swal.fire({
    title: '¿Eliminar producto?',
    text: "Puedes deshacer esta eliminación durante los próximos 10 segundos.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      saveData(state => {
        const generalItems = state.generalItems.filter(item => item.id !== itemId);
        if (generalItems.length === state.generalItems.length) {
          throw new Error("El producto ya fue eliminado desde otro dispositivo.");
        }
        return { ...state, generalItems };
      }, `Eliminó el producto ${removedItem.concept}`).then(saved => {
        if (!saved) return;
        Swal.fire({
          toast: true,
          position: "bottom-end",
          icon: "success",
          title: "Producto eliminado",
          showConfirmButton: true,
          confirmButtonText: "Deshacer",
          showCancelButton: false,
          timer: 10000,
          timerProgressBar: true
        }).then(result => {
          if (!result.isConfirmed) return;
          saveData(state => {
            if (state.generalItems.some(item => item.id === removedItem.id)) {
              throw new Error("No se pudo deshacer: ya existe un producto con ese identificador.");
            }
            const generalItems = [...state.generalItems];
            generalItems.splice(Math.min(index, generalItems.length), 0, removedItem);
            return { ...state, generalItems };
          }, `Restauró el producto ${removedItem.concept}`);
        });
      });
    }
  });
};

function updateMarketItem(items, itemId, changes) {
  let found = false;
  const generalItems = items.map(item => {
    if (item.id !== itemId) return item;
    found = true;
    return { ...item, ...changes };
  });
  if (!found) {
    throw new Error("El producto fue modificado o eliminado desde otro dispositivo. Actualiza la lista e inténtalo de nuevo.");
  }
  return generalItems;
}

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
      const budget = Number(res.value);
      saveData(state => ({ ...state, generalBudget: budget }), "Actualizó el presupuesto");
    }
  });
};

async function saveData(updateState, action = "Actualizó la lista de mercado") {
  if (!marketReady) {
    Swal.fire({
      icon: "info",
      title: "Lista cargando",
      text: "Espera a que la lista termine de sincronizar antes de guardar cambios."
    });
    return;
  }

  setSyncStatus("Guardando...");
  try {
    const activityEntry = {
      action,
      actor: auth.currentUser?.email || "Usuario autorizado",
      timestamp: new Date().toISOString()
    };
    await runTransaction(db, async transaction => {
      const snapshot = await transaction.get(sharedMarketRef);
      const activitySnapshot = await transaction.get(activityHistoryRef);
      if (!snapshot.exists()) {
        throw new Error("La lista compartida ya no existe. No se guardaron los cambios.");
      }
      const storedData = snapshot.data().data;
      if (!storedData || !Array.isArray(storedData.generalItems)) {
        throw new Error("Los datos guardados de la lista no tienen un formato válido.");
      }
      const currentState = normalizeMarketState(storedData).state;
      transaction.set(sharedMarketRef, { data: updateState(currentState) }, { merge: true });
      const entries = activitySnapshot.exists() && Array.isArray(activitySnapshot.data().entries)
        ? activitySnapshot.data().entries
        : [];
      transaction.set(activityHistoryRef, {
        entries: [activityEntry, ...entries].slice(0, 50)
      }, { merge: true });
    });
    return true;
  } catch (error) {
    reportSyncError(error);
    return false;
  }
}
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, runTransaction, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signOut, reload } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-functions.js";

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
const functions = getFunctions(app, "us-central1");
const authorizeUser = httpsCallable(functions, "authorizeUser");

const sharedMarketRef = doc(db, "sharedData", "marketCompleteData");
const DEFAULT_MARKET_BUDGET = 400000;
const MARKET_SETUP_VERSION = 1;
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

  return { ...state, generalItems };
}

window.marketState = createDefaultMarketState();
let marketReady = false;
let editingProductOriginal = null;
let activeAuthUid = null;
let stopMarketListener = null;

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initBackToTop();
});

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
  if (!user.emailVerified) {
    showMarketAuthGate("verify", `Verifica el correo ${user.email} para habilitar el acceso.`);
    return;
  }
  if (activeAuthUid === user.uid) {
    document.getElementById("authGate").hidden = true;
    document.getElementById("marketAppSection").hidden = false;
    return;
  }
  try {
    await authorizeUser();
  } catch (error) {
    if (error.code === "functions/permission-denied") {
      await signOut(auth);
      showMarketAuthGate("login", "Esta cuenta no está autorizada para usar la aplicación.");
      return;
    }
    throw error;
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
  document.getElementById("authMessage").textContent = message;
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

    const { state, needsMigration } = normalizeMarketState(storedData);
    const setupVersion = Number(snapshot.data().marketSetupVersion) || 0;
    if (setupVersion < MARKET_SETUP_VERSION) {
      transaction.set(sharedMarketRef, {
        data: applyInitialMarketSetup(state),
        marketSetupVersion: MARKET_SETUP_VERSION
      }, { merge: true });
    } else if (needsMigration) {
      transaction.set(sharedMarketRef, { data: state }, { merge: true });
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
    || !["light", "dark"].includes(data.theme);
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
  });
  const usedIds = new Set();
  const state = {
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
  };
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
    saveData(state => ({ ...state, theme: next }));
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
  updateMarketFilters();
  const areaFilter = document.getElementById("filterArea")?.value || "";
  const placeFilter = document.getElementById("filterPlace")?.value || "";

  const fullSpent = calculateTotalForStatuses(window.marketState.generalItems, ["SI", "YA"]);
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
      <td class="ps-3">
        <select class="form-select form-select-sm fw-semibold" onchange="updateGenStatus(${index}, this.value)">
          <option value="NO" ${item.status === "NO" ? "selected" : ""}>NO</option>
          <option value="SI" ${item.status === "SI" ? "selected" : ""}>SI</option>
          <option value="YA" ${item.status === "YA" ? "selected" : ""}>YA</option>
        </select>
      </td>
      <td class="fw-semibold">${escapeHtml(item.concept)}</td>
      <td><span class="badge bg-secondary-subtle text-secondary border">${escapeHtml(item.area)}</span></td>
      <td>${escapeHtml(item.place || "—")}</td>
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

  const budget = Number.isFinite(Number(window.marketState.generalBudget))
    ? Number(window.marketState.generalBudget)
    : DEFAULT_MARKET_BUDGET;
  const remaining = budget - fullSpent;

  const countTitle = document.getElementById("itemCountTitle");
  if (countTitle) countTitle.textContent = `Lista Completa (${visibleCount} Ítems)`;

  document.getElementById("genBudget").textContent = `$${budget.toLocaleString("es-CO")}`;
  document.getElementById("genTotal").textContent = `$${fullSpent.toLocaleString("es-CO")}`;
  document.getElementById("genRemaining").textContent = `$${remaining.toLocaleString("es-CO")}`;
  document.getElementById("siTotal").textContent = `$${siTotal.toLocaleString("es-CO")}`;
  document.getElementById("siTotalCard").hidden = statusFilter !== "SI";
}

function calculateTotalForStatuses(items, statuses) {
  return items.reduce((total, item) => {
    return statuses.includes(item.status)
      ? total + (item.price * item.qty)
      : total;
  }, 0);
}

function updateMarketFilters() {
  const areas = [...new Set(window.marketState.generalItems
    .map(item => item.area.trim())
    .filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es"));
  const places = [...new Set(window.marketState.generalItems
    .map(item => item.place.trim())
    .filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es"));

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

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

window.updateGenStatus = function(index, val) {
  const itemId = window.marketState.generalItems[index]?.id;
  if (!itemId) return;
  saveData(state => ({
    ...state,
    generalItems: updateMarketItem(state.generalItems, itemId, { status: val })
  }));
};

window.openAddGeneralModal = function() {
  editingProductOriginal = null;
  document.getElementById("genModalTitle").textContent = "Agregar Producto General";
  document.getElementById("genProdId").value = "";
  document.getElementById("genConcept").value = "";
  document.getElementById("genArea").value = "Aseo Casita";
  document.getElementById("genPlace").value = "";
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
  document.getElementById("genArea").value = item.area;
  document.getElementById("genPlace").value = item.place || "";
  document.getElementById("genPrice").value = item.price;
  document.getElementById("genQty").value = item.qty;
  document.getElementById("genStatus").value = item.status;
  new bootstrap.Modal(document.getElementById("genProductModal")).show();
};

window.saveGeneralProduct = function() {
  const itemId = document.getElementById("genProdId").value;
  const concept = document.getElementById("genConcept").value;
  const area = document.getElementById("genArea").value;
  const place = document.getElementById("genPlace").value.trim() || defaultPlaceForItem(concept);
  const price = Number(document.getElementById("genPrice").value) || 0;
  const qty = Number(document.getElementById("genQty").value) || 1;
  const status = document.getElementById("genStatus").value;

  if(!concept) {
    Swal.fire({icon: 'warning', title: 'Atención', text: 'El concepto del producto es obligatorio.'});
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
  saveData(state => ({
    ...state,
    generalItems: existingItem
      ? updateMarketItem(
        state.generalItems,
        existingItem.id,
        Object.fromEntries(
          ["status", "concept", "area", "place", "price", "qty"]
            .filter(field => !Object.is(originalItem?.[field], newItem[field]))
            .map(field => [field, newItem[field]])
        )
      )
      : [...state.generalItems, newItem]
  }));
  editingProductOriginal = null;
  bootstrap.Modal.getInstance(document.getElementById("genProductModal")).hide();
};

window.deleteGeneralItem = function(index) {
  const itemId = window.marketState.generalItems[index]?.id;
  if (!itemId) return;
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
      saveData(state => {
        const generalItems = state.generalItems.filter(item => item.id !== itemId);
        if (generalItems.length === state.generalItems.length) {
          throw new Error("El producto ya fue eliminado desde otro dispositivo.");
        }
        return { ...state, generalItems };
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
      saveData(state => ({ ...state, generalBudget: budget }));
    }
  });
};

window.restoreFullList = function() {
  Swal.fire({
    title: '¿Restablecer lista completa?',
    text: "Se reemplazará toda la lista, incluidos los productos personalizados, por los productos originales en estado NO y el presupuesto volverá a $400.000.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, restablecer',
    cancelButtonText: 'Cancelar'
  }).then((res) => {
    if (res.isConfirmed) {
      document.getElementById("searchConcept").value = "";
      document.getElementById("filterStatus").value = "";
      document.getElementById("filterArea").value = "";
      document.getElementById("filterPlace").value = "";
      saveData(
        () => createDefaultMarketState(),
        "Lista completa recuperada en estado NO con un presupuesto de $400.000."
      );
    }
  });
};

async function saveData(updateState, successMessage) {
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
    await runTransaction(db, async transaction => {
      const snapshot = await transaction.get(sharedMarketRef);
      if (!snapshot.exists()) {
        throw new Error("La lista compartida ya no existe. No se guardaron los cambios.");
      }
      const storedData = snapshot.data().data;
      if (!storedData || !Array.isArray(storedData.generalItems)) {
        throw new Error("Los datos guardados de la lista no tienen un formato válido.");
      }
      const currentState = normalizeMarketState(storedData).state;
      transaction.set(sharedMarketRef, { data: updateState(currentState) }, { merge: true });
    });
    if (successMessage) {
      Swal.fire("Restablecido", successMessage, "success");
    }
  } catch (error) {
    reportSyncError(error);
  }
}
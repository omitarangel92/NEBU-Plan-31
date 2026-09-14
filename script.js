// ==========================================================================
// FIREBASE AUTH (Modular v10)
// ==========================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { GROQ_API_KEY } from "./config.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA8oIEjox4y8vm7vsnwd0JQaixiw_6Chvs",
  authDomain: "fitplan30-76a27.firebaseapp.com",
  projectId: "fitplan30-76a27",
  storageBucket: "fitplan30-76a27.firebasestorage.app",
  messagingSenderId: "1005774749920",
  appId: "1:1005774749920:web:cf088e83804d14fd51d085"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let isRegisterMode = false;
let appInitialized = false;

const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");
const authForm = document.getElementById("authForm");
const authEmailInput = document.getElementById("authEmail");
const authPasswordInput = document.getElementById("authPassword");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const btnAuthSubmit = document.getElementById("btnAuthSubmit");
const btnToggleAuthMode = document.getElementById("btnToggleAuthMode");
const btnLogout = document.getElementById("btnLogout");

btnToggleAuthMode.addEventListener("click", () => {
  isRegisterMode = !isRegisterMode;
  authForm.reset();
  if (isRegisterMode) {
    authTitle.textContent = "Crear Cuenta";
    authSubtitle.textContent = "Regístrate para acceder al plan nutricional";
    btnAuthSubmit.textContent = "Registrarse";
    btnToggleAuthMode.textContent = "¿Ya tienes cuenta? Inicia sesión aquí";
  } else {
    authTitle.textContent = "Iniciar Sesión";
    authSubtitle.textContent = "Ingresa a tu plan de nutrición FitPlan 30";
    btnAuthSubmit.textContent = "Iniciar Sesión";
    btnToggleAuthMode.textContent = "¿No tienes cuenta? Regístrate aquí";
  }
});

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = authEmailInput.value.trim();
  const password = authPasswordInput.value.trim();

  if (!email || !password) {
    Swal.fire({ icon: "warning", title: "Campos incompletos", text: "Completa todos los campos.", confirmButtonColor: "#2ecc71" });
    return;
  }

  Swal.fire({ title: "Procesando...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });

  if (isRegisterMode) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      await signOut(auth);
      Swal.fire({ icon: "info", title: "¡Verifica tu correo!", text: "Te enviamos un enlace de confirmación.", confirmButtonColor: "#2ecc71" });
      btnToggleAuthMode.click();
    } catch (error) { handleAuthError(error); }
  } else {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        Swal.fire({ icon: "warning", title: "Cuenta no verificada", text: "Confirma tu correo antes de ingresar.", confirmButtonColor: "#f39c12" });
        return;
      }
      Swal.fire({ icon: "success", title: "¡Bienvenido!", timer: 1500, showConfirmButton: false });
    } catch (error) { handleAuthError(error); }
  }
});

function handleAuthError(error) {
  let msg = "Ocurrió un error inesperado.";
  switch (error.code) {
    case "auth/email-already-in-use": msg = "El correo ya está registrado."; break;
    case "auth/invalid-email": msg = "Correo con formato inválido."; break;
    case "auth/weak-password": msg = "La contraseña debe tener al menos 6 caracteres."; break;
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential": msg = "Correo o contraseña incorrectos."; break;
  }
  Swal.fire({ icon: "error", title: "Error de Autenticación", text: msg, confirmButtonColor: "#e74c3c" });
}

onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    authSection.classList.add("d-none");
    appSection.classList.remove("d-none");
    if (!appInitialized) {
      appInitialized = true;
      requestAnimationFrame(() => initApp());
    } else {
      loadDay(currentDay);
    }
  } else {
    appSection.classList.add("d-none");
    authSection.classList.remove("d-none");
  }
});

btnLogout.addEventListener("click", () => {
  Swal.fire({
    title: "¿Cerrar Sesión?", icon: "question", showCancelButton: true,
    confirmButtonColor: "#2ecc71", cancelButtonColor: "#d33",
    confirmButtonText: "Sí, salir", cancelButtonText: "Cancelar"
  }).then((r) => { if (r.isConfirmed) signOut(auth); });
});

/* ==========================================================================
   LÓGICA DEL PROYECTO (FitPlan 30)
   ========================================================================== */
const defaultMealPlanData = [
  {
    day: 1,
    meals: [
      {
        id: "d1-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el apio. Cortar el apio en trozos de unos 2 cm. Poner la espinaca, el apio, los cubos de piña y el agua helada en la licuadora. Licuar a velocidad máxima durante 1 a 2 minutos hasta que la mezcla esté completamente homogénea y sin grumos grandes. Servir en un vaso y consumir inmediatamente en ayunas.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d1-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Pericos con Arepa y Aguapanela",
        ingredients: [
          "2 Huevos medianos",
          "1/2 tomate chonto (aprox. 50g)",
          "1 rama pequeña de cebolla larga (aprox. 20g)",
          "1 Arepa de maíz blanco (aprox. 80g)",
          "1 cucharadita (5ml) de aceite de oliva o canola",
          "1 pizca de sal",
          "200ml de leche descremada o deslactosada",
          "1/4 de pastilla de panela (aprox. 15g)"
        ],
        prep: "Picar finamente el tomate (sin piel, opcional) y la cebolla larga. En una sartén antiadherente a fuego medio, agregar el aceite y sofreír el tomate y la cebolla con la pizca de sal durante 3 minutos, revolviendo constantemente hasta formar un hogao. En un plato hondo, batir los dos huevos y añadirlos a la sartén. Bajar a fuego lento y revolver por 2-3 minutos hasta que cuajen al gusto. A la vez, poner la arepa en una parrilla o plancha a fuego medio-alto por unos 3 a 4 minutos por lado hasta que tueste. Para la bebida: hervir un cuarto de taza de agua en una olla pequeña, derretir allí la panela, luego agregar los 200ml de leche y calentar a fuego medio sin dejar que hierva a borbotones. Servir todo caliente.",
        macros: { weight: 320, calories: 380, protein: 18, carbs: 45, fats: 14, sugars: 12 }
      },
      {
        id: "d1-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Papaya Fresca",
        ingredients: [
          "150g de papaya fresca (aprox. 1 taza llena)"
        ],
        prep: "Pelar un trozo de papaya, retirar las semillas con una cuchara y cortar la pulpa en cubos medianos de aproximadamente 2x2 cm. Pesar los 150g, servir en un tazón y consumir fresca a temperatura ambiente o fría.",
        macros: { weight: 150, calories: 60, protein: 1, carbs: 15, fats: 0, sugars: 11 }
      },
      {
        id: "d1-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Carne Molida con Cazuela de Frijoles y Ensalada de Aguacate",
        ingredients: [
          "120g de carne molida de res magra",
          "1/4 cucharadita de ajo en polvo y 1 pizca de sal y pimienta negra (para la carne)",
          "150g de frijoles rojos (previamente remojados y cocidos con sal y medio cubo de caldo de costilla magro)",
          "100g de arroz blanco cocido (aprox. 1/2 taza)",
          "50g de tajada de plátano maduro",
          "40g de aguacate (aprox. 1/4 de aguacate mediano)",
          "Zumo de 1/2 limón y 1 pizca de sal (para la ensalada)"
        ],
        prep: "Calentar los frijoles previamente cocidos en una olla pequeña a fuego medio. En una sartén antiadherente a fuego medio-alto, poner la carne molida (sin aceite adicional), sazonar con la sal, pimienta y el ajo en polvo. Sofreír revolviendo para desmenuzarla bien por 8-10 minutos hasta que dore. Para el plátano, hornear la tajada en airfryer a 180°C por 8 minutos (o asar en sartén antiadherente). Para la ensalada: lavar y trocear la lechuga con las manos, cortar el aguacate en cubos, mezclar en un bowl con el maíz dulce y aderezar con el zumo de limón y la pizca de sal. Servir la carne sobre la cazuela de frijoles, acompañando a un lado con el arroz, el plátano y la ensalada fresca.",
        macros: { weight: 520, calories: 620, protein: 38, carbs: 72, fats: 20, sugars: 8 }
      },
      {
        id: "d1-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cookie",
        name: "Tostadas de Arroz con Arequipe Light y Té/Café",
        ingredients: [
          "2 Tostadas de arroz inflado (aprox. 15g en total)",
          "1 cucharada sopera (15g) de arequipe sin azúcar (light)",
          "1 sobre de té de su elección o 1 cucharadita de café instantáneo",
          "200ml de agua caliente"
        ],
        prep: "Con un cuchillo de mantequilla, esparcir uniformemente media cucharada de arequipe sin azúcar sobre cada tostada de arroz. Calentar los 200ml de agua en una taza (en microondas por 1 minuto o en estufa) y sumergir el sobre de té por 3 minutos, o disolver el café instantáneo. Acompañar las tostadas con la bebida caliente.",
        macros: { weight: 90, calories: 130, protein: 3, carbs: 24, fats: 2, sugars: 4 }
      },
      {
        id: "d1-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa a la Plancha con Queso Campesino y Aromática",
        ingredients: [
          "1 Arepa pequeña de maíz blanco delgada (aprox. 60g)",
          "40g de queso campesino fresco",
          "1 sobre de infusión o aromática (frutos rojos, manzanilla, etc.)",
          "200ml de agua caliente"
        ],
        prep: "Poner la arepa en una parrilla o plancha a fuego medio-alto y asar de 3 a 4 minutos por cada lado hasta que quede bien tostada. Mientras tanto, rallar los 40g de queso campesino con la parte gruesa del rallador. Cuando la arepa esté lista, bajar el fuego al mínimo, poner el queso rallado encima y tapar la sartén por 1 o 2 minutos para que el queso se caliente y derrita un poco. En un pocillo, servir los 200ml de agua casi hirviendo y sumergir la bolsita de aromática por 3 minutos. Servir todo de inmediato.",
        macros: { weight: 180, calories: 230, protein: 10, carbs: 28, fats: 8, sugars: 1 }
      }
    ]
  },
  {
    day: 2,
    meals: [
      {
        id: "d2-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar minuciosamente la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el licuado. Poner en el vaso de la licuadora la espinaca, el apio, los cubos de piña y el agua helada. Licuar a velocidad alta durante 1 a 2 minutos hasta lograr una textura completamente uniforme, sin grumos ni hilos de apio. Servir de inmediato en un vaso y consumir en ayunas.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d2-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevo Cocido y Cereal con Leche",
        ingredients: [
          "1 Huevo mediano",
          "1 pizca de sal (para el agua de cocción del huevo)",
          "40g de cereal integral tipo hojuelas (aprox. 1 taza)",
          "200ml de leche descremada o deslactosada fría"
        ],
        prep: "En una olla pequeña, poner suficiente agua a calentar a fuego alto con una pizca de sal hasta que alcance un hervor fuerte. Introducir con cuidado el huevo y cocinar exactamente de 8 a 10 minutos (para obtener una yema firme pero tierna). Retirar el huevo, sumergirlo en agua fría para cortar la cocción, pelarlo y reservarlo con una pizca de sal por encima. En un tazón hondo, servir los 40g de cereal integral y añadir los 200ml de leche fría. Consumir el cereal junto con el huevo cocido.",
        macros: { weight: 300, calories: 310, protein: 15, carbs: 42, fats: 9, sugars: 12 }
      },
      {
        id: "d2-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Banano Fresco",
        ingredients: [
          "1 Banano mediano maduro (aprox. 120g con cáscara / 100g neto)"
        ],
        prep: "Retirar la cáscara del banano por completo. Consumir la fruta fresca de manera directa, idealmente a temperatura ambiente.",
        macros: { weight: 120, calories: 105, protein: 1, carbs: 27, fats: 0, sugars: 14 }
      },
      {
        id: "d2-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Pechuga a las Finas Hierbas con Ensalada de Zanahoria y Yogur",
        ingredients: [
          "130g de pechuga de pollo en filete",
          "1/2 cucharadita de mezcla de finas hierbas secas (orégano, tomillo, albahaca), 1 pizca de sal y 1 pizca de ajo en polvo (para el pollo)",
          "1 cucharadita (5ml) de aceite de oliva",
          "70g de zanahoria",
          "60g de manzana verde",
          "40g de yogur griego natural sin azúcar",
          "1 pizca de sal y unas gotas de limón (para la ensalada)",
          "100g de arroz blanco cocido (aprox. 1/2 taza)"
        ],
        prep: "Sazonar el filete de pechuga de pollo por ambos lados con la sal, el ajo en polvo y las finas hierbas. Calentar una sartén antiadherente a fuego medio-alto con la cucharadita de aceite de oliva; asar la pechuga durante 5 a 6 minutos por lado hasta que esté completamente cocida por dentro y ligeramente dorada por fuera. Para la ensalada: lavar y pelar la zanahoria, rallarla por la parte fina del rallador. Lavar la manzana verde, descorazonarla y rallarla con cáscara (o picarla en julianas muy finas). En un recipiente, mezclar la zanahoria y la manzana ralladas con el yogur griego, unas gotas de limón y la pizca de sal hasta integrar. Servir la pechuga caliente acompañada de la ensalada cremosa y la porción de arroz blanco.",
        macros: { weight: 440, calories: 480, protein: 42, carbs: 48, fats: 11, sugars: 10 }
      },
      {
        id: "d2-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Gelatina Light",
        ingredients: [
          "1 porción de gelatina light preparada (equivalente a 1 taza o 150ml)"
        ],
        prep: "Disolver el sobre de gelatina light en agua caliente según las indicaciones del fabricante y refrigerar previamente hasta que cuaje por completo en un molde o recipiente individual. Servir bien fría directamente de la nevera.",
        macros: { weight: 150, calories: 20, protein: 2, carbs: 3, fats: 0, sugars: 0 }
      },
      {
        id: "d2-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Wrap de Maíz con Jamón, Huevo y Lechuga",
        ingredients: [
          "1 Tortilla de maíz grande para wrap (aprox. 50g)",
          "1 Huevo mediano",
          "1 pizca de sal y 1 pizca de pimienta negra",
          "1 cucharadita (3ml) de aceite o mantequilla ligera para la sartén",
          "1 tajada delgada de jamón de cerdo o pollo (aprox. 25g)",
          "2 hojas de lechuga crespa fresca"
        ],
        prep: "En un tazón pequeño, batir el huevo con la pizca de sal y de pimienta. Calentar una sartén pequeña a fuego medio con la cucharadita de aceite, verter el huevo y revolver constantemente durante 2 minutos hasta obtener un huevo revuelto tierno y jugoso; retirar del fuego. En la misma sartén limpia o a fuego bajo, calentar la tortilla de maíz por 30 segundos de cada lado para que coja flexibilidad. Para armar el wrap: extender la tortilla caliente sobre un plato, colocar encima las hojas de lechuga lavadas y secas, añadir la tajada de jamón y repartir el huevo revuelto en el centro. Doblar los bordes laterales hacia adentro y enrollar firmemente en forma de cilindro (wrap). Partir a la mitad si se desea y consumir caliente.",
        macros: { weight: 190, calories: 240, protein: 15, carbs: 18, fats: 11, sugars: 2 }
      }
    ]
  },
  {
    day: 3,
    meals: [
      {
        id: "d3-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en rodajas delgadas. Colocar la espinaca, el apio, los cubos de piña y el agua helada dentro de la licuadora. Licuar a velocidad alta durante 1 o 2 minutos hasta que no queden grumos ni trozos grandes. Servir en un vaso inmediatamente y consumir en ayunas.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d3-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Omelette de Espinaca y Queso con Galletas y Café con Leche",
        ingredients: [
          "2 Huevos medianos",
          "25g de espinaca fresca picada finamente",
          "30g de queso campesino o mozzarella rallado",
          "1 cucharadita (3ml) de aceite o mantequilla para la sartén",
          "1 pizca de sal y 1 pizca de pimienta",
          "2 Galletas Saltinas o Ducales",
          "150ml de leche descremada o deslactosada",
          "1 cucharadita de café instantáneo o 1 espresso"
        ],
        prep: "En un tazón, batir los dos huevos con la pizca de sal, la pimienta y la espinaca picada. Calentar una sartén antiadherente a fuego medio con la cucharadita de aceite o mantequilla. Verter la mezcla de huevo, dejar cocinar por 2 minutos hasta que los bordes cuajen, añadir el queso rallado en una mitad y doblar el omelette por la mitad; cocinar 1 minuto más por lado hasta fundir el queso y retirar. Para la bebida: calentar la leche (en microondas o estufa) y disolver el café instantáneo. Servir el omelette caliente acompañado de las 2 galletas y el café con leche.",
        macros: { weight: 280, calories: 350, protein: 19, carbs: 26, fats: 18, sugars: 8 }
      },
      {
        id: "d3-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Mandarina o Naranja",
        ingredients: [
          "1 Mandarina grande o 1 naranja mediana (aprox. 130g de pulpa neta)"
        ],
        prep: "Retirar la cáscara y la mayor cantidad de hebras blancas posibles con las manos. Separar los gajos y consumir la fruta fresca.",
        macros: { weight: 130, calories: 50, protein: 1, carbs: 12, fats: 0, sugars: 9 }
      },
      {
        id: "d3-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Crema de Zanahoria y Atún con Arroz y Plátano",
        ingredients: [
          "1 plato (aprox. 200ml) de crema de zanahoria casera",
          "15g de fosforitos o crutones integrales",
          "1 lata de atún en agua (aprox. 120g escurrido)",
          "80g de arroz blanco cocido",
          "50g de tajadas de plátano maduro",
          "60g de ensalada de lechuga y tomate",
          "Zumo de limón y 1 pizca de sal"
        ],
        prep: "Servir la crema de zanahoria caliente acompañada de los fosforitos. Como plato fuerte, servir el atún escurrido directamente junto con el arroz blanco y las tajadas de plátano maduro. Acompañar con la ensalada de lechuga y tomate, aderezada con zumo de limón y sal.",
        macros: { weight: 520, calories: 540, protein: 32, carbs: 68, fats: 12, sugars: 10 }
      },
      {
        id: "d3-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-box-seam-fill",
        name: "Mix de Frutos Secos",
        ingredients: [
          "1/2 vaso (aprox. 40g) de frutos secos (maní sin sal, almendras, uvas pasas)"
        ],
        prep: "Medir la porción en un vaso y consumir directamente al natural.",
        macros: { weight: 40, calories: 180, protein: 6, carbs: 14, fats: 12, sugars: 6 }
      },
      {
        id: "d3-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich de Jamón, Queso y Tomate con Chocolate",
        ingredients: [
          "2 rebanadas de pan tajado integral o blanco",
          "1 tajada de jamón de buena calidad",
          "1 tajada delgada de queso mozzarella o sabana",
          "4 rodajas delgadas de tomate chonto",
          "200ml de leche descremada y 1 pastilla de chocolate"
        ],
        prep: "Armar el sándwich con el jamón, queso y tomate entre las rebanadas de pan. Dorar en la sartén o sanduchera hasta derretir el queso. Calentar la leche y disolver la pastilla de chocolate. Servir el sándwich caliente acompañado del chocolate.",
        macros: { weight: 320, calories: 340, protein: 18, carbs: 42, fats: 14, sugars: 15 }
      }
    ]
  },
  {
    day: 4,
    meals: [
      {
        id: "d4-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar la espinaca y el apio con agua limpia. Trocear el apio para facilitar el proceso. Colocar la espinaca, el apio, los cubos de piña y el agua helada en el vaso de la licuadora. Procesar a velocidad alta durante 1 a 2 minutos hasta conseguir una mezcla homogénea y sin grumos. Servir inmediatamente y consumir en ayunas.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d4-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Cocidos con Arepa de Queso y Aguapanela Sola",
        ingredients: [
          "2 Huevos medianos",
          "1 pizca de sal (para el agua)",
          "1 arepa mediana de maíz con queso incorporado (aprox. 80g)",
          "1 cucharadita (3ml) de mantequilla o aceite ligero (para dorar la arepa)",
          "250ml de agua y 1 bloque pequeño de panela (aprox. 15g) para la aguapanela"
        ],
        prep: "Colocar agua en una olla pequeña con una pizca de sal, dejar hervir e introducir los dos huevos; cocinar durante 8 a 10 minutos para obtener huevos cocidos firmes. Retirar, pasar por agua fría, pelar y reservar. En una sartén antiadherente a fuego medio con un toque de mantequilla o aceite, dorar la arepa de queso por ambos lados hasta que esté caliente y crujiente por fuera. Para la aguapanela: en otra olla pequeña, hervir los 250ml de agua junto con el bloque de panela hasta que se disuelva por completo y alcance el punto deseado. Servir los huevos cocidos acompañados de la arepa de queso caliente y una taza de aguapanela pura.",
        macros: { weight: 310, calories: 360, protein: 17, carbs: 42, fats: 13, sugars: 14 }
      },
      {
        id: "d4-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Manzana Fresca",
        ingredients: [
          "1 Manzana roja o verde mediana (aprox. 150g)"
        ],
        prep: "Lavar muy bien la manzana con agua. Puede consumirse entera con cáscara o picada en cascos retirando el corazón y las semillas.",
        macros: { weight: 150, calories: 80, protein: 0, carbs: 21, fats: 0, sugars: 16 }
      },
      {
        id: "d4-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Carne Molida de Cerdo con Maduro Dulce y Ensalada de Semillas",
        ingredients: [
          "120g de carne molida de cerdo magra",
          "1 cucharadita de aceite, sal, pimienta y ajo en polvo",
          "50g de aguacate, 30g de apio fresco, 40g de tomate en cubos",
          "1 cucharadita de semillas de sésamo (ajonjolí)",
          "50g de plátano maduro picado asado o en airfryer",
          "Zumo de limón para aderezar"
        ],
        prep: "Sofreír la carne molida de cerdo con los condimentos en una sartén hasta que esté bien dorada y cocida. Asar los cubos de plátano maduro en la airfryer o sartén. Para la ensalada: mezclar el aguacate, el apio y el tomate, aderezar con zumo de limón y espolvorear las semillas de sésamo encima. Servir todo junto de manera armónica.",
        macros: { weight: 450, calories: 490, protein: 34, carbs: 40, fats: 22, sugars: 10 }
      },
      {
        id: "d4-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-pie-chart",
        name: "Moneditas de Papa o Plátano Verde",
        ingredients: [
          "100g de papa sabanera o plátano verde en rodajas",
          "1 rocío de aceite y sal al gusto"
        ],
        prep: "Hornear o cocinar en airfryer a 190°C durante 12 a 15 minutos hasta que estén doradas y crujientes. Servir tibias.",
        macros: { weight: 100, calories: 140, protein: 2, carbs: 28, fats: 2, sugars: 1 }
      },
      {
        id: "d4-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa Pequeña con Carne Desmechada o Molida",
        ingredients: [
          "1 arepa pequeña de maíz blanca o amarilla (aprox. 50g)",
          "60g de carne desmechada o molida sobrante del almuerzo"
        ],
        prep: "Calentar la arepa en la plancha. Calentar la carne ligeramente. Colocar la carne por encima de la arepa caliente y consumir junto con agua saborizada sin calorías.",
        macros: { weight: 170, calories: 250, protein: 16, carbs: 22, fats: 10, sugars: 1 }
      }
    ]
  },
  {
    day: 5,
    meals: [
      {
        id: "d5-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar minuciosamente la espinaca y el apio. Picar el apio en trozos medianos. Incorporar la espinaca, el apio, los cubos de piña y el agua helada en el vaso de la licuadora. Procesar a velocidad alta durante 1 a 2 minutos hasta conseguir una textura homogénea, fluida y sin grumos. Servir inmediatamente y consumir en ayunas.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d5-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Sándwich de Huevo y Queso con Chocolate con Leche",
        ingredients: [
          "2 rebanadas de pan tajado integral o blanco",
          "1 Huevo mediano",
          "1 cucharadita (3ml) de aceite o mantequilla ligera para cocinar el huevo",
          "1 tajada delgada de queso mozzarella o sabana (aprox. 20g)",
          "4 rodajas delgadas de tomate chonto",
          "1 pizca de sal y pimienta",
          "250ml de leche entera o descremada",
          "1 pastilla de chocolate de mesa (sin azúcar o tradicional según preferencia) o 2 cucharadas de cacao en polvo"
        ],
        prep: "En una sartén pequeña con un toque de aceite o mantequilla, preparar el huevo al gusto (frito con poco aceite o revuelto) sazonando con una pizca de sal y pimienta. Para el sándwich: colocar el pan tajado, añadir la tajada de queso, las rodajas de tomate y el huevo caliente; cerrar y opcionalmente dorar el sándwich en la sartén para fundir el queso. Para el chocolate: en una olla pequeña, calentar los 250ml de leche junto con la pastilla de chocolate o cacao hasta que hierva suavemente y se disuelva por completo, batiendo para espumar. Servir el sándwich caliente acompañado del chocolate caliente.",
        macros: { weight: 340, calories: 390, protein: 17, carbs: 40, fats: 17, sugars: 15 }
      },
      {
        id: "d5-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Uvas o Uchuvas",
        ingredients: [
          "1 taza pequeña de uvas frescas (sin semilla) o uchuvas peladas (aprox. 120g)"
        ],
        prep: "Lavar muy bien las uvas o las uchuvas con abundante agua fresca. Retirar los tallos o cáscaras si aplica y consumir directamente.",
        macros: { weight: 120, calories: 70, protein: 1, carbs: 17, fats: 0, sugars: 14 }
      },
      {
        id: "d5-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Pollo al Curry con Guacamole y Patacones",
        ingredients: [
          "130g de alitas o trozos de pechuga de pollo",
          "1/2 cucharadita de curry en polvo, sal, ajo en polvo",
          "1/2 aguacate hass maduro pequeño, tomate y cebolla finamente picados",
          "Culantro o cilantro fresco picado, zumo de limón y sal (para el guacamole)",
          "1 plátano verde mediano (para hacer patacones)"
        ],
        prep: "Hornear o cocinar en airfryer las porciones de pollo sazonadas con curry hasta que queden doradas y bien cocidas. Freír o asar los trozos de plátano verde, aplastar y volver a cocinar para formar los patacones crujientes. Hacer el guacamole artesanal triturando el aguacate con los vegetales y el limón. Servir todo integrado.",
        macros: { weight: 480, calories: 540, protein: 36, carbs: 42, fats: 24, sugars: 3 }
      },
      {
        id: "d5-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Gelatina Light",
        ingredients: [
          "1 taza (aprox. 150ml) de gelatina light preparada"
        ],
        prep: "Refrigerar hasta que cuaje. Servir directamente de la nevera.",
        macros: { weight: 150, calories: 20, protein: 2, carbs: 3, fats: 0, sugars: 0 }
      },
      {
        id: "d5-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Huevos Duros sobre Galletas",
        ingredients: [
          "2 Huevos medianos cocidos (duros)",
          "1 pizca de sal y pimienta negra",
          "2 Galletas Saltinas o Ducales"
        ],
        prep: "Cocinar los huevos durante 8-10 minutos, pelar, cortar a la mitad o en rodajas, sazonar y servirlos junto con las galletas.",
        macros: { weight: 140, calories: 210, protein: 14, carbs: 14, fats: 11, sugars: 1 }
      }
    ]
  },
  {
    day: 6,
    meals: [
      {
        id: "d6-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños. Poner la espinaca, el apio, los cubos de piña y el agua helada en el vaso de la licuadora. Licuar a velocidad alta durante 1 a 2 minutos hasta lograr una consistencia completamente homogénea, sin grumos. Servir inmediatamente y consumir en ayunas.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d6-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Revueltos con Tostada y Café con Leche",
        ingredients: [
          "2 Huevos medianos",
          "1 pizca de sal y una pizca de pimienta",
          "1 cucharadita (3ml) de aceite o mantequilla ligera para la sartén",
          "1 rebanada de pan tajado tostado (integral o blanco)",
          "150ml de leche descremada o deslactosada",
          "1 cucharadita de café instantáneo o 1 espresso"
        ],
        prep: "Batir los dos huevos en un tazón con la pizca de sal y pimienta. Calentar una sartén a fuego medio con el aceite o mantequilla, verter los huevos y revolver constantemente hasta obtener unos huevos revueltos cremosos; retirar del fuego. Aparte, calentar la leche y disolver el café instantáneo. Servir los huevos revueltos calientes acompañados de la tostada crujiente y la taza de café con leche.",
        macros: { weight: 270, calories: 300, protein: 16, carbs: 22, fats: 15, sugars: 7 }
      },
      {
        id: "d6-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Durazno Fresco",
        ingredients: [
          "1 Durazno mediano maduro (aprox. 140g)"
        ],
        prep: "Lavar muy bien el durazno con abundante agua fresca. Consumir la fruta entera o en gajos, con o sin piel según preferencia.",
        macros: { weight: 140, calories: 60, protein: 1, carbs: 14, fats: 0, sugars: 11 }
      },
      {
        id: "d6-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Gulash de Res con Arroz con Fideos y Verduras",
        ingredients: [
          "130g de carne de res magra para gulash en su jugo",
          "60g de brócoli o coliflor cocidos",
          "30g de pimentón, tomate y cebolla picados",
          "80g de arroz blanco cocido con fideos finos dorados",
          "Sal y especias al gusto"
        ],
        prep: "Sofreír la cebolla, tomate y pimentón, añadir la carne en cubos y cocinar a fuego bajo para hacer el gulash en su propio jugo. Preparar el arroz tostando previamente unos fideos de cabello de ángel. Cocinar los vegetales al vapor. Servir el gulash caliente sobre el arroz con fideos, acompañado de las verduras.",
        macros: { weight: 450, calories: 510, protein: 38, carbs: 55, fats: 16, sugars: 5 }
      },
      {
        id: "d6-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-snow",
        name: "Banano Helado",
        ingredients: [
          "1 Banano maduro"
        ],
        prep: "Congelar previamente el banano pelado. Consumir como paleta refrescante.",
        macros: { weight: 120, calories: 105, protein: 1, carbs: 27, fats: 0, sugars: 14 }
      },
      {
        id: "d6-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Salchipapa Casera Ligera",
        ingredients: [
          "1 Papa pequeña cortada en cascos",
          "1 Salchicha de buena calidad (pollo o cerdo, aprox. 50g) picada",
          "1 cucharadita (5ml) de aceite vegetal o de oliva",
          "1 pizca de sal, ajo en polvo y orégano"
        ],
        prep: "Colocar la papa en cascos en la airfryer con un rocío de aceite, sal y ajo en polvo a 200°C por 15 minutos. A mitad de cocción, añadir las rodajas de salchicha para que doren. Servir crujiente.",
        macros: { weight: 180, calories: 260, protein: 8, carbs: 28, fats: 12, sugars: 2 }
      }
    ]
  },
  {
    day: 7,
    meals: [
      {
        id: "d7-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todo hasta homogenizar.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d7-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevo Duro con Cereal y Leche",
        ingredients: ["1 Huevo duro", "1 Taza de cereal con leche"],
        prep: "Acompañar el huevo duro cocido con el tazón de cereal integral y leche fría.",
        macros: { weight: 300, calories: 310, protein: 15, carbs: 42, fats: 9, sugars: 12 }
      },
      {
        id: "d7-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Banano Fresco",
        ingredients: ["1 Banano mediano"],
        prep: "Pelar y consumir.",
        macros: { weight: 120, calories: 105, protein: 1, carbs: 27, fats: 0, sugars: 14 }
      },
      {
        id: "d7-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Pollo Desmechado con Macarrones con Queso",
        ingredients: ["Proteína: Pollo desmechado guisado", "Principio: Macarrones con queso", "Ensalada: Lechuga, tomate, jamón, queso parmesano", "Acompañante: Maicitos y jamón salteado"],
        prep: "Cocinar los macarrones al dente y mezclar con queso fundido. Servir junto con el pollo desmechado y ensalada de vegetales y maicitos.",
        macros: { weight: 470, calories: 530, protein: 42, carbs: 48, fats: 18, sugars: 5 }
      },
      {
        id: "d7-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Yogur Griego con Fresas y Chocolate",
        ingredients: ["1 taza de yogur griego", "Fresas frescas", "Chocolate derretido", "Esencia de vainilla o coco"],
        prep: "Mezclar el yogur con la esencia, poner fresas encima y decorar con los hilos de chocolate derretido.",
        macros: { weight: 180, calories: 170, protein: 12, carbs: 18, fats: 5, sugars: 12 }
      },
      {
        id: "d7-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Cereal con Leche",
        ingredients: ["1 taza de cereal integral o de maíz", "150ml de leche descremada o deslactosada"],
        prep: "Servir en un tazón y consumir de inmediato.",
        macros: { weight: 190, calories: 200, protein: 8, carbs: 32, fats: 4, sugars: 10 }
      }
    ]
  },
  {
    day: 8,
    meals: [
      {
        id: "d8-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el proceso. Colocar todos los ingredientes en el vaso de la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Servir inmediatamente y consumir en ayunas.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d8-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Fritos en Arepa con Queso y Aguapanela con Leche",
        ingredients: [
          "2 Huevos medianos",
          "1 cucharadita (3ml) de aceite o mantequilla para la sartén",
          "1 pizca de sal y pimienta",
          "1 arepa mediana de maíz con queso incorporado (aprox. 80g)",
          "200ml de agua y 1 bloque pequeño de panela (aprox. 15g) para la aguapanela",
          "50ml de leche"
        ],
        prep: "Calentar una sartén antiadherente con un toque de aceite o mantequilla a fuego medio y freír los dos huevos hasta que las claras estén listas y la yema al punto deseado; sazonar con una pizca de sal y pimienta. Aparte, calentar la arepa en una plancha o sartén por ambos lados hasta que esté caliente. Para la aguapanela con leche: hervir el agua con la panela hasta disolver, agregar los 50ml de leche caliente y mezclar bien. Servir la arepa caliente, colocar los huevos fritos encima y acompañar con la aguapanela con leche.",
        macros: { weight: 330, calories: 420, protein: 18, carbs: 44, fats: 19, sugars: 12 }
      },
      {
        id: "d8-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Tajada de Sandía",
        ingredients: [
          "1 tajada mediana de sandía fresca sin semillas (aprox. 200g)"
        ],
        prep: "Retirar la cáscara verde y cortar la pulpa de la sandía en cubos o porcionarla en una tajada limpia. Consumir fresca.",
        macros: { weight: 200, calories: 60, protein: 1, carbs: 15, fats: 0, sugars: 12 }
      },
      {
        id: "d8-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Huevo Cocido con Pan Tostado y Ensalada de Espinaca",
        ingredients: [
          "1 o 2 huevos cocidos en rodajas",
          "1 rebanada de pan tajado tostado",
          "Ensalada: espinaca, pimentón, aguacate, cebolla cabezona, queso parmesano",
          "Aderezo: vinagreta clásica"
        ],
        prep: "Armar el plato distribuyendo la cama de hojas de espinaca, cebolla y pimentón, añadir las rodajas de aguacate y huevo cocido. Espolvorear el queso parmesano, poner el pan tostado al lado y aderezar con la vinagreta.",
        macros: { weight: 400, calories: 420, protein: 18, carbs: 32, fats: 25, sugars: 5 }
      },
      {
        id: "d8-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cookie",
        name: "Tostadas de Arroz con Arequipe Light",
        ingredients: [
          "2 tostadas de arroz",
          "Un untado ligero de arequipe sin azúcar"
        ],
        prep: "Esparcir el arequipe sobre las tostadas y consumir inmediatamente.",
        macros: { weight: 90, calories: 130, protein: 3, carbs: 24, fats: 2, sugars: 4 }
      },
      {
        id: "d8-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich de Atún con Tomate y Mayonesa",
        ingredients: [
          "2 rebanadas de pan tajado",
          "1/2 lata de atún en agua escurrido",
          "1 cucharada de mayonesa",
          "4 rodajas de tomate",
          "200ml de aguapanela caliente"
        ],
        prep: "Mezclar el atún con la mayonesa. Armar el sándwich con las rebanadas de pan, la mezcla de atún y las rodajas de tomate. Servir acompañado de la aguapanela caliente.",
        macros: { weight: 220, calories: 310, protein: 15, carbs: 42, fats: 9, sugars: 15 }
      }
    ]
  },
  {
    day: 9,
    meals: [
      {
        id: "d9-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el proceso. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar y tomar de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d9-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Sándwich de Jamón, Queso y Huevo con Café con Leche",
        ingredients: [
          "2 rebanadas de pan tajado (integral o blanco)",
          "1 tajada de jamón de buena calidad",
          "1 tajada de queso semiduro o sabanela",
          "1 huevo mediano (para hacer revuelto)",
          "1 cucharadita (3ml) de aceite o mantequilla ligera para el huevo",
          "1 pizca de sal y pimienta",
          "150ml de leche descremada o deslactosada",
          "1 cucharadita de café instantáneo o 1 espresso"
        ],
        prep: "Batir ligeramente el huevo con sal y pimienta, cocinarlo en una sartén antiadherente con un toque de aceite o mantequilla hasta que esté revuelto. Armar el sándwich rellenándolo con el huevo revuelto caliente, la tajada de jamón y la tajada de queso entre las dos rebanadas de pan (opcionalmente dorar a la plancha para fundir el queso). Acompañar de café caliente con leche.",
        macros: { weight: 320, calories: 370, protein: 20, carbs: 32, fats: 17, sugars: 8 }
      },
      {
        id: "d9-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Mango Maduro",
        ingredients: [
          "1/2 mango maduro mediano (aprox. 150g de pulpa)"
        ],
        prep: "Pelar el mango maduro, retirar la pulpa de la semilla y cortarla en tajadas o cubos. Porcionar y consumir fresco.",
        macros: { weight: 150, calories: 90, protein: 1, carbs: 23, fats: 0, sugars: 20 }
      },
      {
        id: "d9-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Carne de Cerdo con Lentejas y Plátano Maduro",
        ingredients: [
          "130g de carne de cerdo magra a la plancha o sudada",
          "100g de lentejas guisadas tradicionales",
          "70g de arroz blanco cocido",
          "50g de tajadas de plátano maduro"
        ],
        prep: "Cocinar las lentejas hasta espesar. Asar la porción de carne de cerdo con especias. Hornear las tajadas de plátano. Servir todo junto.",
        macros: { weight: 480, calories: 550, protein: 38, carbs: 58, fats: 16, sugars: 10 }
      },
      {
        id: "d9-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-box-seam-fill",
        name: "Crispetas Caseras Bajas en Grasa",
        ingredients: [
          "1 bolsa pequeña de crispetas caseras (aprox 30g maíz pira)"
        ],
        prep: "Hacer las crispetas en olla con tapa minimizando el uso de aceite. Espolvorear pizca de sal.",
        macros: { weight: 40, calories: 120, protein: 3, carbs: 22, fats: 3, sugars: 0 }
      },
      {
        id: "d9-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Pan con Queso Crema y Chocolate",
        ingredients: [
          "1 rebanada de pan tajado o tostado",
          "1 cucharada de queso crema ligero",
          "1 taza de chocolate caliente"
        ],
        prep: "Untar la rebanada de pan con el queso crema. Servir acompañado del chocolate caliente recién preparado.",
        macros: { weight: 220, calories: 230, protein: 8, carbs: 32, fats: 9, sugars: 12 }
      }
    ]
  },
  {
    day: 10,
    meals: [
      {
        id: "d10-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el licuado. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta lograr una consistencia completamente homogénea, sin grumos. Licuar y tomar fresco inmediatamente en ayunas.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d10-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Revueltos con Maicitos, Arepa y Café con Leche",
        ingredients: [
          "2 huevos medianos",
          "2 cucharadas de maíz dulce (maicitos)",
          "1 cucharadita (3ml) de aceite o mantequilla ligera para la sartén",
          "1 pizca de sal y pimienta",
          "1 arepa mediana de maíz (aprox. 70g)",
          "150ml de leche descremada o deslactosada",
          "1 cucharadita de café instantáneo o 1 espresso"
        ],
        prep: "Batir los huevos en un tazón con la pizca de sal y pimienta, incorporando los maicitos. Cocinar en una sartén antiadherente a fuego medio con el aceite o mantequilla, revolviendo constantemente hasta obtener unos huevos revueltos cremosos y bien integrados con el maíz. Asar la arepa en una plancha o sartén por ambos lados hasta que esté caliente. Aparte, calentar la leche y disolver el café. Servir los huevos revueltos con maicitos acompañados de la arepa asada y la taza de café con leche.",
        macros: { weight: 310, calories: 360, protein: 16, carbs: 42, fats: 14, sugars: 8 }
      },
      {
        id: "d10-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Pera Fresca",
        ingredients: [
          "1 pera mediana madura (aprox. 150g)"
        ],
        prep: "Lavar muy bien la pera con abundante agua fresca. Consumir entera o en gajos según preferencia.",
        macros: { weight: 150, calories: 85, protein: 0, carbs: 22, fats: 0, sugars: 15 }
      },
      {
        id: "d10-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Carne Desmechada con Yuca y Ensalada de Pepino",
        ingredients: [
          "130g de carne de res desmechada (falda) guisada",
          "120g de yuca pelada (frita o al horno)",
          "60g de pepino cohombro, 30g de maíz",
          "2 cucharadas de yogur griego natural para aderezo"
        ],
        prep: "Cocinar la carne y desmecharla para guisarla en hogao ligero. Hornear o freír ligeramente la yuca. Mezclar el pepino y maíz con el aderezo de yogur. Servir de manera armoniosa.",
        macros: { weight: 450, calories: 510, protein: 41, carbs: 48, fats: 15, sugars: 5 }
      },
      {
        id: "d10-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-box-seam-fill",
        name: "Mix de Frutos Secos",
        ingredients: [
          "1/2 vaso de frutos secos (maní sin sal, almendras, uvas pasas)"
        ],
        prep: "Servir en un vaso y consumir.",
        macros: { weight: 40, calories: 180, protein: 6, carbs: 14, fats: 12, sugars: 6 }
      },
      {
        id: "d10-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa con Morcilla y Chocolate",
        ingredients: [
          "1 arepa mediana de maíz blanca o amarilla",
          "1 porción pequeña de morcilla (rellena) asada o al horno",
          "1 taza de chocolate caliente"
        ],
        prep: "Asar la morcilla en airfryer o plancha para retirar el exceso de grasa. Calentar la arepa. Acompañar ambas con la bebida de chocolate caliente.",
        macros: { weight: 200, calories: 310, protein: 9, carbs: 30, fats: 15, sugars: 12 }
      }
    ]
  },
  {
    day: 11,
    meals: [
      {
        id: "d11-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el proceso. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar bien y consumir de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d11-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Pericos con Galletas Ducales y Chocolate con Leche",
        ingredients: [
          "2 huevos medianos",
          "2 cucharadas de cebolla y tomate picados finamente (para el guiso)",
          "1 cucharadita (3ml) de aceite o mantequilla para la sartén",
          "1 pizca de sal y pimienta",
          "2 galletas Ducales tradicionales",
          "200ml de leche descremada o entera",
          "1 pastilla pequeña de chocolate de mesa (o 2 cucharadas de chocolate en polvo)"
        ],
        prep: "En una sartén con un toque de aceite, sofreír la cebolla y el tomate picados hasta armar un guiso base. Agregar los huevos batidos y revolver constantemente a fuego medio hasta que estén listos (huevos pericos); sazonar con sal y pimienta al gusto. Aparte, calentar la leche con la pastilla de chocolate hasta disolver y lograr una consistencia espumosa. Servir los huevos pericos calientes acompañados de las galletas Ducales y la taza de chocolate con leche.",
        macros: { weight: 290, calories: 360, protein: 16, carbs: 32, fats: 18, sugars: 12 }
      },
      {
        id: "d11-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Taza de Fresas",
        ingredients: [
          "1 taza de fresas frescas (aprox. 140g)"
        ],
        prep: "Lavar muy bien las fresas bajo el agua, retirar el pedúnculo (hojitas verdes) y cortarlas por la mitad si se prefiere. Consumir frescas.",
        macros: { weight: 140, calories: 45, protein: 1, carbs: 11, fats: 0, sugars: 7 }
      },
      {
        id: "d11-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Caldo de Pollo y Muslos Sudados con Plátano",
        ingredients: [
          "Sopa: Caldo de pollo con papa y verduras congeladas",
          "Proteína: Muslos de pollo sudado",
          "Acompañante: Plátano maduro en airfryer con queso y un trocito de bocadillo"
        ],
        prep: "Cocinar el caldo base. En olla aparte, hacer el sudado de los muslos de pollo. Asar el plátano en airfryer hasta dorar y rellenarlo con el queso y bocadillo. Servir.",
        macros: { weight: 550, calories: 580, protein: 44, carbs: 55, fats: 16, sugars: 15 }
      },
      {
        id: "d11-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-pie-chart",
        name: "Moneditas de Papa o Plátano Verde",
        ingredients: [
          "100g de papa sabanera o plátano verde",
          "1 rocío o cucharadita (2ml) de aceite",
          "Sal al gusto"
        ],
        prep: "Cortar la papa o el plátano verde en rodajas delgadas (tipo moneditas). Untar o rociar con un toque de aceite y una pizca de sal. Llevar a la airfryer a 190°C durante 12 a 15 minutos, sacudiendo a mitad de tiempo, hasta que estén doradas y crujientes. Servir tibias.",
        macros: { weight: 100, calories: 140, protein: 2, carbs: 28, fats: 2, sugars: 1 }
      },
      {
        id: "d11-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Omelette de 1 Huevo con Espinaca y Aguapanela",
        ingredients: [
          "1 huevo mediano",
          "Espinaca fresca picada",
          "1 taza de aguapanela caliente"
        ],
        prep: "Hacer el omelette delgado de 1 huevo en la sartén. Servir junto con la bebida caliente.",
        macros: { weight: 150, calories: 150, protein: 8, carbs: 12, fats: 5, sugars: 10 }
      }
    ]
  },
  {
    day: 12,
    meals: [
      {
        id: "d12-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el licuado. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar todos los ingredientes y consumir de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d12-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Queso Campesino con Huevos Cocidos, Arepa y Aguapanela Sola",
        ingredients: [
          "60g de queso campesino fresco",
          "1 cucharadita (3ml) de aceite o mantequilla para la plancha",
          "2 huevos medianos",
          "1 arepa mediana de maíz (aprox. 70g)",
          "200ml de agua y 1 bloque pequeño de panela (aprox. 15g) para la aguapanela"
        ],
        prep: "Colocar los huevos en una olla con agua hirviendo y cocinar durante 9-10 minutos para obtener huevos cocidos firmes; retirar, pelar y reservar. En una plancha o sartén caliente con un toque de aceite o mantequilla, asar la tajada de queso campesino hasta que dore ligeramente por ambos lados. Calentar la arepa en la misma plancha. Para la aguapanela: hervir los 200ml de agua con el bloque de panela hasta que se disuelva por completo. Servir el queso campesino a la plancha acompañado de los huevos cocidos, la arepa caliente y una taza de aguapanela caliente sola.",
        macros: { weight: 340, calories: 410, protein: 23, carbs: 38, fats: 18, sugars: 12 }
      },
      {
        id: "d12-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Kiwi Fresco",
        ingredients: [
          "1 kiwi maduro (aprox. 110g)"
        ],
        prep: "Pelar el kiwi con un cuchillo o pelador y cortarlo en rodajas uniformes. Consumir fresco.",
        macros: { weight: 110, calories: 50, protein: 1, carbs: 12, fats: 0, sugars: 8 }
      },
      {
        id: "d12-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Atún con Espaguetis y Ensalada de Manzana",
        ingredients: [
          "1 lata de atún (aprox. 120g)",
          "80g de espaguetis (peso en seco) con salsa de tomate",
          "50g de manzana picada y lechuga",
          "1 cucharada de maní dulce",
          "1 cucharadita de salsa de soya"
        ],
        prep: "Cocinar los espaguetis y mezclarlos con salsa de tomate. Servir el atún escurrido junto a la pasta. Acompañar con la ensalada de lechuga y manzana, aderezada con salsa de soya y espolvoreada con maní dulce.",
        macros: { weight: 420, calories: 480, protein: 32, carbs: 60, fats: 12, sugars: 10 }
      },
      {
        id: "d12-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Gelatina Light",
        ingredients: [
          "1 taza (aprox. 150ml) de gelatina light o sin azúcar preparada"
        ],
        prep: "Disolver el sobre de gelatina light en agua caliente y completar con agua fría según las instrucciones del empaque; refrigerar hasta que cuaje por completo. Consumir fría.",
        macros: { weight: 150, calories: 20, protein: 2, carbs: 3, fats: 0, sugars: 0 }
      },
      {
        id: "d12-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Plátano Maduro con Queso y Bocadillo",
        ingredients: [
          "1 Plátano maduro asado",
          "Trozos de queso que funda y bocadillo",
          "1 vaso de agua saborizada sin azúcar"
        ],
        prep: "Asar o calentar el plátano y rellenarlo en el centro con queso y bocadillo. Consumir con la bebida.",
        macros: { weight: 180, calories: 260, protein: 6, carbs: 45, fats: 7, sugars: 16 }
      }
    ]
  },
  {
    day: 13,
    meals: [
      {
        id: "d13-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el licuado. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar todos los ingredientes y consumir de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d13-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Omelette de Champiñones con Galletas Saltinas y Café con Leche",
        ingredients: [
          "2 huevos medianos",
          "40g de champiñones frescos laminados",
          "1 cucharadita (3ml) de aceite o mantequilla ligera para la sartén",
          "1 pizca de sal, pimienta y finas hierbas",
          "2 galletas Saltinas",
          "150ml de leche descremada o entera",
          "1 cucharadita de café instantáneo o 1 espresso"
        ],
        prep: "Saltear los champiñones laminados en una sartén con un toque de aceite hasta que reduzcan y doren ligeramente; retirar y reservar. En un tazón, batir los huevos con la pizca de sal, pimienta y finas hierbas, agregar los champiñones salteados e integrarlos bien. Verter la mezcla en la sartén antiadherente a fuego medio-bajo para cocinar el omelette hasta el punto deseado. Aparte, calentar la leche y disolver el café. Servir el omelette caliente acompañado de las galletas Saltinas y la taza de café con leche.",
        macros: { weight: 270, calories: 320, protein: 17, carbs: 24, fats: 16, sugars: 7 }
      },
      {
        id: "d13-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Coco Fresco",
        ingredients: [
          "60g de coco fresco laminado o en trozos pequeños"
        ],
        prep: "Porcionar el coco fresco en trozos o láminas limpias. Consumir al natural.",
        macros: { weight: 60, calories: 160, protein: 2, carbs: 6, fats: 15, sugars: 3 }
      },
      {
        id: "d13-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Albóndigas de Res en Salsa con Arroz y Ensalada de Ajonjolí",
        ingredients: [
          "130g de carne molida de res magra",
          "1/2 huevo (opcional para amasar) o pan rallado, ajo, cebolla picada y sal",
          "1/2 taza de salsa de tomate natural casera o puré de tomate (salsa rosada opcional)",
          "70g de arroz blanco cocido (peso en seco aprox. 50g)",
          "60g de lechuga fresca troceada, 40g de aguacate",
          "1 cucharadita de semillas de ajonjolí (sésamo)",
          "Zumo de limón, 1 cucharadita de aceite de oliva y sal (para el aderezo)"
        ],
        prep: "Para las albóndigas: mezclar la carne molida de res con ajo, cebolla picada fina, una pizca de sal y un toque de pan rallado o huevo para compactar; formar bolitas pequeñas y cocinarlas directamente en una sartén con la salsa a fuego medio-bajo durante 15-20 minutos hasta que estén bien cocidas por dentro. Para el complemento: cocinar el arroz blanco de forma tradicional hasta que quede suelto. Para la ensalada: combinar la lechuga fresca con los cubos de aguacate, aderezar con aceite de oliva, zumo de limón y sal, y espolvorear por encima las semillas de ajonjolí. Servir todo integrado.",
        macros: { weight: 460, calories: 510, protein: 36, carbs: 46, fats: 20, sugars: 6 }
      },
      {
        id: "d13-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-snow",
        name: "Banano Helado",
        ingredients: [
          "1 banano maduro"
        ],
        prep: "Retirar del congelador y consumir en forma de postre frío.",
        macros: { weight: 120, calories: 105, protein: 1, carbs: 27, fats: 0, sugars: 14 }
      },
      {
        id: "d13-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa con Chorizo Asado",
        ingredients: [
          "1 Arepa de maíz pequeña",
          "1 Chorizo asado al sartén o airfryer"
        ],
        prep: "Asar la arepa y el chorizo minimizando grasas, servir caliente.",
        macros: { weight: 150, calories: 280, protein: 14, carbs: 24, fats: 16, sugars: 1 }
      }
    ]
  },
  {
    day: 14,
    meals: [
      {
        id: "d14-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el proceso. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad hasta obtener una consistencia completamente homogénea, sin grumos. Licuar a alta velocidad y tomar de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d14-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Tibios con Tostadas y Chocolate con Leche",
        ingredients: [
          "2 huevos medianos",
          "2 rebanadas de pan tajado (integral o blanco)",
          "200ml de leche descremada o entera",
          "1 pastilla pequeña de chocolate de mesa (o 2 cucharadas de chocolate en polvo)"
        ],
        prep: "Colocar los huevos en una olla con agua hirviendo durante 4-5 minutos para lograr unos huevos tibios con la clara firme y la yema líquida; retirar y servir en copas o recipientes adecuados. Tostar las rebanadas de pan. Aparte, calentar la leche con el chocolate hasta disolver y conseguir una bebida caliente y espumosa. Servir los huevos tibios acompañados de las tostadas y el chocolate caliente.",
        macros: { weight: 310, calories: 360, protein: 17, carbs: 36, fats: 16, sugars: 14 }
      },
      {
        id: "d14-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Ciruelas Frescas",
        ingredients: [
          "2 ciruelas rojas frescas (aprox. 130g)"
        ],
        prep: "Lavar muy bien las ciruelas con agua fresca. Consumir enteras.",
        macros: { weight: 130, calories: 60, protein: 1, carbs: 14, fats: 0, sugars: 12 }
      },
      {
        id: "d14-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Sancocho con Menudencias y Pico de Gallo",
        ingredients: [
          "Sopa de Sancocho base (papa, plátano verde, mazorca)",
          "Proteína: Menudencias o Espinazo bien cocidos",
          "Pico de gallo fresco (cebolla, tomate, cilantro)"
        ],
        prep: "Servir el plato principal tipo sancocho tradicional de manera moderada, acompañando con las menudencias o espinazo y el pico de gallo encima.",
        macros: { weight: 550, calories: 580, protein: 38, carbs: 68, fats: 18, sugars: 6 }
      },
      {
        id: "d14-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Yogur Griego con Fresas y Chocolate",
        ingredients: [
          "1 taza de yogur griego",
          "Fresas frescas picadas",
          "Hilos de chocolate derretido y esencia de vainilla o coco"
        ],
        prep: "Combinar el yogur con la esencia, adornar con las fresas y rociar los hilos de chocolate oscuro derretido.",
        macros: { weight: 180, calories: 170, protein: 12, carbs: 18, fats: 5, sugars: 12 }
      },
      {
        id: "d14-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Cereal con Leche",
        ingredients: [
          "1 taza de cereal",
          "150ml de leche"
        ],
        prep: "Servir de manera directa.",
        macros: { weight: 190, calories: 200, protein: 8, carbs: 32, fats: 4, sugars: 10 }
      }
    ]
  },
  {
    day: 15,
    meals: [
      {
        id: "d15-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el proceso. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar todo hasta integrar y consumir de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d15-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Arepa con Huevos Revueltos y Aguapanela con Leche",
        ingredients: [
          "1 arepa mediana de maíz (aprox. 70g)",
          "2 huevos medianos revueltos con guiso",
          "150ml de aguapanela caliente sola y 50ml de leche"
        ],
        prep: "Asar la arepa en una plancha. Sofreír la cebolla y el tomate hasta formar un guiso base, añadir los huevos batidos revolviendo. Preparar la aguapanela y mezclar la leche. Servir.",
        macros: { weight: 330, calories: 380, protein: 18, carbs: 44, fats: 15, sugars: 12 }
      },
      {
        id: "d15-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Piña Fresca",
        ingredients: [
          "1 taza de piña fresca pelada y cortada en cubos (aprox. 150g)"
        ],
        prep: "Porcionar la piña fresca en cubos limpios. Consumir la fruta fresca porcionada.",
        macros: { weight: 150, calories: 75, protein: 1, carbs: 19, fats: 0, sugars: 14 }
      },
      {
        id: "d15-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Tortas de Lentejas con Papa Francesa y Ensalada Dulce",
        ingredients: [
          "Tortas de lentejas hechas en casa a la plancha",
          "Papa a la francesa en airfryer",
          "Ensalada de lechuga, mango maduro, queso en cuadros y uvas pasas",
          "Aderezo: crema de leche o yogur griego"
        ],
        prep: "Dorar las tortas de lentejas. Hacer las papas francesas libres de fritura profunda usando la airfryer. Acompañar con la fresca ensalada dulce.",
        macros: { weight: 450, calories: 510, protein: 25, carbs: 68, fats: 18, sugars: 15 }
      },
      {
        id: "d15-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cookie",
        name: "Tostadas de Arroz con Arequipe Light",
        ingredients: [
          "2 tostadas de arroz inflado",
          "Arequipe light para untar"
        ],
        prep: "Esparcir el dulce ligeramente.",
        macros: { weight: 90, calories: 130, protein: 3, carbs: 24, fats: 2, sugars: 4 }
      },
      {
        id: "d15-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa Pequeña con Queso Campesino Rallado",
        ingredients: [
          "1 arepa de maíz pequeña",
          "Queso campesino rallado encima",
          "1 taza de aromática o aguapanela pura"
        ],
        prep: "Asar la arepa y agregar el queso hasta derretir.",
        macros: { weight: 140, calories: 220, protein: 10, carbs: 24, fats: 9, sugars: 2 }
      }
    ]
  },
  {
    day: 16,
    meals: [
      {
        id: "d16-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el proceso. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar a alta velocidad y tomar de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d16-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevo Cocido con Cereal y Leche",
        ingredients: [
          "1 huevo mediano cocido",
          "1 taza (aprox. 40g) de cereal de maíz o integral",
          "200ml de leche descremada o entera"
        ],
        prep: "Colocar el huevo en una olla con agua hirviendo y cocinar durante 9-10 minutos para obtener un huevo duro cocido. En un tazón hondo, servir el cereal acompañado de la leche fría. Consumir todo en conjunto.",
        macros: { weight: 300, calories: 310, protein: 15, carbs: 42, fats: 9, sugars: 12 }
      },
      {
        id: "d16-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Taza de Fresas",
        ingredients: [
          "1 taza de fresas frescas (aprox. 140g)"
        ],
        prep: "Lavar muy bien las fresas con agua fresca, retirar el pedúnculo (hojitas verdes) y cortar por la mitad si se desea. Consumir las fresas lavadas.",
        macros: { weight: 140, calories: 45, protein: 1, carbs: 11, fats: 0, sugars: 7 }
      },
      {
        id: "d16-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Champiñones Salteados con Pasta",
        ingredients: [
          "Proteína: Porción grande de champiñones salteados",
          "Principio: Pasta Penne o en Espiral",
          "Verduras: Habichuelas cocidas con zanahoria en cubos"
        ],
        prep: "Cocinar la pasta y servir junto con el salteado de champiñones, integrando con las verduras cocidas.",
        macros: { weight: 450, calories: 420, protein: 15, carbs: 65, fats: 8, sugars: 6 }
      },
      {
        id: "d16-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-box-seam-fill",
        name: "Crispetas Caseras Bajas en Grasa",
        ingredients: [
          "1 bolsa pequeña de crispetas caseras"
        ],
        prep: "Hacer las palomitas en olla con mínimo de aceite o airfryer.",
        macros: { weight: 40, calories: 120, protein: 3, carbs: 22, fats: 3, sugars: 0 }
      },
      {
        id: "d16-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Tortilla de Maíz con Jamón, Huevo y Lechuga",
        ingredients: [
          "1 tortilla de maíz o wrap mediano",
          "1 tajada de jamón, hojas de lechuga fresca",
          "1 huevo revuelto"
        ],
        prep: "Rellenar la tortilla con el huevo recién hecho, el jamón y la lechuga, enrollar tipo wrap. Servir con agua saborizada.",
        macros: { weight: 190, calories: 240, protein: 15, carbs: 18, fats: 11, sugars: 2 }
      }
    ]
  },
  {
    day: 17,
    meals: [
      {
        id: "d17-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el proceso. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar todos los ingredientes y consumir de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d17-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Sándwich de Huevo, Jamón, Queso y Tomate",
        ingredients: [
          "2 rebanadas de pan tajado",
          "1 huevo en tortilla o frito",
          "1 tajada de jamón, 1 tajada de queso, tomate en rodajas",
          "1 taza de café con leche"
        ],
        prep: "Armar el sándwich de tres capas calentando todo a la sartén o plancha. Acompañar de café con leche.",
        macros: { weight: 320, calories: 380, protein: 21, carbs: 32, fats: 18, sugars: 8 }
      },
      {
        id: "d17-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Papaya Fresca",
        ingredients: [
          "1 taza de papaya madura picada en cubos (aprox. 150g)"
        ],
        prep: "Pelar la papaya, retirar las semillas y picarla en cubos medianos. Consumir fresca porcionada.",
        macros: { weight: 150, calories: 60, protein: 1, carbs: 15, fats: 0, sugars: 11 }
      },
      {
        id: "d17-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Arroz con Pollo Ligero y Vegetales",
        ingredients: [
          "Proteína: Pechuga de pollo desmechada y trocitos de salchicha de pollo",
          "Principio: Arroz blanco integrado con la proteína",
          "Verduras: Habichuela, arvejas y zanahoria",
          "Aderezo opcional: Un toque de salsa de tomate"
        ],
        prep: "Mezclar el arroz con el pollo, la salchicha ligera y el mix de verduras. Acompañar con un pequeño toque de salsa al gusto.",
        macros: { weight: 480, calories: 530, protein: 35, carbs: 62, fats: 14, sugars: 5 }
      },
      {
        id: "d17-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-nut",
        name: "Mix de Frutos Secos",
        ingredients: [
          "1/2 vaso de maní sin sal, almendras y uvas pasas"
        ],
        prep: "Servir en un vaso directamente.",
        macros: { weight: 40, calories: 180, protein: 6, carbs: 14, fats: 12, sugars: 6 }
      },
      {
        id: "d17-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich de Jamón, Queso y Tomate",
        ingredients: [
          "2 rebanadas de pan tajado",
          "1 tajada de jamón y queso",
          "Rodajas de tomate",
          "1 taza de chocolate caliente"
        ],
        prep: "Preparar el sándwich en sandwichera hasta derretir, acompañar con el chocolate caliente.",
        macros: { weight: 280, calories: 310, protein: 14, carbs: 42, fats: 11, sugars: 14 }
      }
    ]
  },
  {
    day: 18,
    meals: [
      {
        id: "d18-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el proceso. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar a alta velocidad y tomar de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d18-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Cocidos en Rodajas con Arepa y Aguapanela Sola",
        ingredients: [
          "2 huevos medianos cocidos cortados en rodajas",
          "1 pizca de sal y pimienta",
          "1 arepa mediana de maíz",
          "200ml de aguapanela caliente pura (sin leche)"
        ],
        prep: "Colocar los huevos en agua hirviendo durante 9-10 minutos para obtener huevos duros; retirar, enfriar, pelar y cortar en rodajas. Calentar la arepa en la plancha. Sazonar las rodajas de huevo y servir junto a la arepa.",
        macros: { weight: 310, calories: 350, protein: 17, carbs: 42, fats: 12, sugars: 14 }
      },
      {
        id: "d18-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Banano Fresco",
        ingredients: [
          "1 banano maduro mediano (aprox. 120g con cáscara / 100g neto)"
        ],
        prep: "Pelar el banano fresco. Consumir fresco.",
        macros: { weight: 120, calories: 105, protein: 1, carbs: 27, fats: 0, sugars: 14 }
      },
      {
        id: "d18-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Frijoles Rojos con Carne de Res y Plátano",
        ingredients: [
          "120g de carne de res magra a la plancha",
          "100g de frijoles rojos guisados",
          "70g de arroz blanco",
          "Tajadas de plátano maduro en airfryer o plancha"
        ],
        prep: "Acompañar los frijoles sobre el arroz. Colocar las tajadas maduras y la carne de res asada y sazonada.",
        macros: { weight: 480, calories: 570, protein: 42, carbs: 65, fats: 15, sugars: 8 }
      },
      {
        id: "d18-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-pie-chart",
        name: "Moneditas de Papa o Plátano Verde",
        ingredients: [
          "1 porción de moneditas de plátano o papa",
          "Pizca de sal"
        ],
        prep: "Hacer las moneditas en la airfryer hasta que tuesten.",
        macros: { weight: 85, calories: 110, protein: 2, carbs: 22, fats: 3, sugars: 0 }
      },
      {
        id: "d18-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa con Carne Desmechada o Molida",
        ingredients: [
          "1 arepa pequeña",
          "Carne desmechada o molida del almuerzo",
          "Agua saborizada"
        ],
        prep: "Montar la porción sobrante de carne bien caliente sobre la arepa recién asada.",
        macros: { weight: 170, calories: 250, protein: 16, carbs: 22, fats: 10, sugars: 1 }
      }
    ]
  },
  {
    day: 19,
    meals: [
      {
        id: "d19-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el proceso. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar y tomar fresco.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d19-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Queso a la Plancha con Huevo Frito en Arepa y Chocolate",
        ingredients: [
          "50g de queso cuajada o campesino (para pasar por la plancha)",
          "1 huevo mediano frito",
          "1 arepa mediana de maíz",
          "200ml de leche y 1 pastilla de chocolate de mesa"
        ],
        prep: "Dorar el queso a la plancha, freír el huevo al punto deseado. Calentar la arepa y colocar encima el queso y el huevo frito. Acompañar con el chocolate caliente.",
        macros: { weight: 340, calories: 430, protein: 22, carbs: 36, fats: 22, sugars: 14 }
      },
      {
        id: "d19-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Mandarina o Naranja",
        ingredients: [
          "1 mandarina fresca o naranja mediana (aprox. 130g neto)"
        ],
        prep: "Pelar y separar en gajos limpios. Consumir la fruta fresca.",
        macros: { weight: 130, calories: 50, protein: 1, carbs: 12, fats: 0, sugars: 9 }
      },
      {
        id: "d19-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Carne Molida con Maíz Gratinado y Crema",
        ingredients: [
          "Sopa: Crema de espinaca o ahuyama casera",
          "Proteína: Carne de res molida",
          "Principio: Maíz gratinado",
          "Acompañante: Papa en cascos con orégano",
          "Ensalada: Tomate con sal y limón"
        ],
        prep: "Servir la crema de sopa como entrada. Plato fuerte incluye la carne molida jugosa, el maíz dulce gratinado, cascos de papa horneados y la ensalada de tomate rojo.",
        macros: { weight: 550, calories: 590, protein: 42, carbs: 58, fats: 21, sugars: 8 }
      },
      {
        id: "d19-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Gelatina Light",
        ingredients: [
          "1 taza de gelatina light sin azúcar"
        ],
        prep: "Servir directamente del refrigerador.",
        macros: { weight: 150, calories: 20, protein: 2, carbs: 3, fats: 0, sugars: 0 }
      },
      {
        id: "d19-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Huevos Cocidos con Galletas",
        ingredients: [
          "2 huevos cocidos",
          "2 galletas Saltinas o Ducales"
        ],
        prep: "Servir los huevos duros partidos a la mitad junto con las galletas.",
        macros: { weight: 140, calories: 190, protein: 14, carbs: 12, fats: 10, sugars: 1 }
      }
    ]
  },
  {
    day: 20,
    meals: [
      {
        id: "d20-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el proceso. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar todos los ingredientes y consumir de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d20-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Omelette con Jamón, Queso y Café",
        ingredients: [
          "2 huevos medianos batidos para omelette",
          "1 tajada de jamón picada y queso",
          "1 tostada de pan",
          "150ml de leche descremada o entera con café"
        ],
        prep: "Preparar el omelette incluyendo el jamón y queso. Servir con la tostada crujiente y café caliente.",
        macros: { weight: 310, calories: 350, protein: 22, carbs: 25, fats: 16, sugars: 8 }
      },
      {
        id: "d20-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Manzana Fresca",
        ingredients: [
          "1 manzana verde o roja mediana (aprox. 150g)"
        ],
        prep: "Lavar y consumir entera, o cortar en gajos al gusto.",
        macros: { weight: 150, calories: 80, protein: 0, carbs: 21, fats: 0, sugars: 16 }
      },
      {
        id: "d20-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Sardinas con Arroz Blanco y Plátano",
        ingredients: [
          "1 lata de sardinas en salsa de tomate o aceite",
          "80g de arroz blanco cocido",
          "50g de tajadas de plátano maduro",
          "60g de trozos de zanahoria cocida o cruda",
          "1 cucharadita de vinagreta"
        ],
        prep: "Servir las sardinas calientes o frías acompañadas del arroz blanco y las tajadas de plátano maduro. Agregar la zanahoria en trozos aderezada con la vinagreta.",
        macros: { weight: 430, calories: 510, protein: 25, carbs: 55, fats: 18, sugars: 8 }
      },
      {
        id: "d20-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-snow",
        name: "Banano Helado",
        ingredients: [
          "1 banano maduro, congelado sin cáscara"
        ],
        prep: "Retirar del congelador y consumir inmediatamente.",
        macros: { weight: 100, calories: 105, protein: 1, carbs: 27, fats: 0, sugars: 14 }
      },
      {
        id: "d20-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Salchipapa Casera Ligera",
        ingredients: [
          "1 papa pequeña cortada en cascos",
          "1 salchicha picada asada"
        ],
        prep: "Hornear la papa en cascos en airfryer e incorporar la salchicha hasta que doren.",
        macros: { weight: 180, calories: 260, protein: 8, carbs: 28, fats: 12, sugars: 2 }
      }
    ]
  },
  {
    day: 21,
    meals: [
      {
        id: "d21-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el proceso. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar bien y consumir de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d21-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Revueltos con Arepa y Aguapanela con Leche",
        ingredients: [
          "2 huevos medianos",
          "1 arepa pequeña",
          "1 taza de aguapanela caliente con leche"
        ],
        prep: "Batir y hacer los huevos revueltos. Asar la arepa y acompañar con la aguapanela.",
        macros: { weight: 310, calories: 370, protein: 17, carbs: 36, fats: 17, sugars: 14 }
      },
      {
        id: "d21-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Uvas o Uchuvas",
        ingredients: [
          "1 porción de uvas frescas o uchuvas limpias (aprox 120g)"
        ],
        prep: "Lavar muy bien antes de consumir.",
        macros: { weight: 120, calories: 70, protein: 1, carbs: 17, fats: 0, sugars: 14 }
      },
      {
        id: "d21-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Chicharrón o Nuggets en Airfryer con Ensalada Rusa",
        ingredients: [
          "Proteína: Porción de chicharrón magro o Nuggets de pollo en airfryer",
          "Acompañante: Patacón",
          "Ensalada Rusa: papa en cubitos, salchicha picada, cilantro, toque de mayonesa"
        ],
        prep: "Preparar la proteína libre de aceites usando la freidora de aire. Hacer el patacón y la tradicional ensalada rusa de acompañamiento.",
        macros: { weight: 510, calories: 610, protein: 37, carbs: 70, fats: 19, sugars: 6 }
      },
      {
        id: "d21-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Yogur Griego con Fresas y Chocolate",
        ingredients: [
          "1 taza de yogur griego",
          "Fresas picadas y esencia de vainilla o coco",
          "Hilos de chocolate derretido encima"
        ],
        prep: "Mezclar el yogur y decorar con la fruta y chocolate.",
        macros: { weight: 180, calories: 170, protein: 12, carbs: 18, fats: 5, sugars: 12 }
      },
      {
        id: "d21-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Cereal con Leche",
        ingredients: [
          "1 porción de cereal de hojuelas",
          "1 vaso de leche descremada"
        ],
        prep: "Servir mezclado en el plato hondo.",
        macros: { weight: 190, calories: 200, protein: 8, carbs: 32, fats: 4, sugars: 10 }
      }
    ]
  },
  {
    day: 22,
    meals: [
      {
        id: "d22-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el proceso. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar y tomar de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d22-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Revueltos con Guiso, Arepa con Queso y Café",
        ingredients: [
          "2 huevos batidos con guiso de cebolla y tomate",
          "1 arepa mediana con queso asada a la plancha",
          "1 taza de café con leche"
        ],
        prep: "Cocinar los huevos tipo pericos. Asar la arepa. Acompañar todo caliente con el café con leche.",
        macros: { weight: 320, calories: 410, protein: 20, carbs: 36, fats: 18, sugars: 8 }
      },
      {
        id: "d22-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Durazno Fresco",
        ingredients: [
          "1 durazno maduro mediano (aprox. 140g)"
        ],
        prep: "Lavar muy bien el durazno fresco. Consumir entero o en gajos al gusto.",
        macros: { weight: 140, calories: 60, protein: 1, carbs: 14, fats: 0, sugars: 11 }
      },
      {
        id: "d22-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Pollo Apanado/BBQ con Papa Criolla",
        ingredients: [
          "Proteína: Pieza de pollo preparada BBQ o apanada ligera",
          "Papa criolla cocida y dorada",
          "Ensalada: Lechuga, manzana verde, zanahoria",
          "Aderezo: crema de leche o yogur griego"
        ],
        prep: "Cocinar el pollo al estilo deseado, preferiblemente en airfryer. Acompañar con la papa criolla crujiente y la ensalada fresca de manzana verde.",
        macros: { weight: 460, calories: 510, protein: 39, carbs: 46, fats: 17, sugars: 8 }
      },
      {
        id: "d22-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cookie",
        name: "Tostadas de Arroz con Arequipe Light",
        ingredients: [
          "2 tostadas de arroz inflado",
          "Arequipe light untado ligeramente"
        ],
        prep: "Preparar las tostadas en el instante.",
        macros: { weight: 90, calories: 130, protein: 3, carbs: 24, fats: 2, sugars: 4 }
      },
      {
        id: "d22-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich de Atún con Tomate",
        ingredients: [
          "2 rebanadas de pan tajado",
          "1/2 lata de atún en agua escurrido",
          "1 cucharada de mayonesa",
          "4 rodajas de tomate",
          "200ml de aguapanela caliente"
        ],
        prep: "Mezclar el atún con la mayonesa y armar el sándwich con el tomate. Acompañar con la aguapanela caliente.",
        macros: { weight: 220, calories: 310, protein: 15, carbs: 42, fats: 9, sugars: 15 }
      }
    ]
  },
  {
    day: 23,
    meals: [
      {
        id: "d23-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el proceso. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar todos los ingredientes y consumir de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d23-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Sándwich de Huevo con Orégano y Chocolate",
        ingredients: [
          "1 huevo revuelto sazonado con orégano",
          "Pan tajado con rebanada de queso",
          "1 taza de chocolate caliente con leche"
        ],
        prep: "Revuelva el huevo agregando un toque de orégano, prepare el sándwich de queso y sirva con chocolate caliente.",
        macros: { weight: 320, calories: 370, protein: 18, carbs: 42, fats: 13, sugars: 12 }
      },
      {
        id: "d23-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Pera",
        ingredients: [
          "1 pera madura entera o en rodajas"
        ],
        prep: "Lavar bien la pera, cortar y consumir.",
        macros: { weight: 150, calories: 85, protein: 0, carbs: 22, fats: 0, sugars: 15 }
      },
      {
        id: "d23-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Carne de Falda con Arroz y Plátano Sudado",
        ingredients: [
          "Sopa de arvejas y papa",
          "Proteína: Carne de falda cocida y en salsa",
          "Principio: Arroz blanco",
          "Acompañante: Plátano maduro sudado en sus propios jugos"
        ],
        prep: "Servir como entrada la sopa de arvejas. De plato fuerte la carne de falda sobre el arroz y acompañar del plátano maduro sudado.",
        macros: { weight: 510, calories: 590, protein: 38, carbs: 60, fats: 14, sugars: 12 }
      },
      {
        id: "d23-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-box-seam-fill",
        name: "Crispetas Caseras Bajas en Grasa",
        ingredients: [
          "1 bolsa pequeña de crispetas caseras"
        ],
        prep: "Preparar las crispetas en olla tapada minimizando el aceite, hasta que revienten.",
        macros: { weight: 40, calories: 120, protein: 3, carbs: 22, fats: 3, sugars: 0 }
      },
      {
        id: "d23-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Pan con Queso Crema y Chocolate",
        ingredients: [
          "Rebanada de pan (integral o blanco)",
          "1 porción de queso crema para untar",
          "1 taza de chocolate caliente"
        ],
        prep: "Untar el pan y servir acompañado de la bebida.",
        macros: { weight: 160, calories: 240, protein: 8, carbs: 32, fats: 9, sugars: 12 }
      }
    ]
  },
  {
    day: 24,
    meals: [
      {
        id: "d24-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el licuado. Colocar todos los ingredientes en el vaso de la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta conseguir una textura completamente integrada y sin grumos. Licuar a alta velocidad y tomar de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d24-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Sándwich de Atún y Café con Leche",
        ingredients: [
          "2 rebanadas de pan tajado",
          "1/2 lata de atún en agua escurrido",
          "1 cucharada de mayonesa ligera",
          "150ml de leche y 1 cucharadita de café instantáneo"
        ],
        prep: "Preparar el sándwich de atún mezclando el pescado con la mayonesa. Calentar la leche y disolver el café. Servir todo fresco.",
        macros: { weight: 280, calories: 330, protein: 18, carbs: 32, fats: 10, sugars: 8 }
      },
      {
        id: "d24-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Mango Maduro Fresco",
        ingredients: [
          "1 porción de mango maduro pelado (aprox. 150g)"
        ],
        prep: "Cortar en dados limpios y consumir.",
        macros: { weight: 150, calories: 90, protein: 1, carbs: 23, fats: 0, sugars: 20 }
      },
      {
        id: "d24-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Lasaña de Carne y Pollo",
        ingredients: [
          "Láminas de pasta para lasaña",
          "Carne de res molida y pechuga desmechada (relleno mixto)",
          "Aderezo: Salsa bechamel o salsa boloñesa"
        ],
        prep: "Armar la porción de lasaña en un refractario intercalando la pasta, carnes y la salsa. Hornear hasta gratinar ligeramente y servir.",
        macros: { weight: 420, calories: 540, protein: 38, carbs: 50, fats: 20, sugars: 6 }
      },
      {
        id: "d24-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-nut",
        name: "Mix de Frutos Secos",
        ingredients: [
          "1/2 vaso de frutos secos (maní, almendras, uvas pasas)"
        ],
        prep: "Porcionar y consumir al natural.",
        macros: { weight: 40, calories: 180, protein: 6, carbs: 14, fats: 12, sugars: 6 }
      },
      {
        id: "d24-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa con Morcilla y Chocolate",
        ingredients: [
          "1 arepa pequeña asada",
          "Porción de morcilla (rellena) asada al horno o airfryer para eliminar exceso de grasa",
          "1 taza de chocolate caliente"
        ],
        prep: "Consumir en conjunto.",
        macros: { weight: 200, calories: 310, protein: 9, carbs: 30, fats: 15, sugars: 12 }
      }
    ]
  },
  {
    day: 25,
    meals: [
      {
        id: "d25-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el licuado. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar todos los ingredientes y consumir de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d25-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Cocidos con Arepa y Aguapanela",
        ingredients: [
          "2 huevos cocidos",
          "1 arepa de maíz asada",
          "200ml de aguapanela caliente sola"
        ],
        prep: "Poner a hervir los huevos 9 minutos. Servir con la arepa y la aguapanela.",
        macros: { weight: 320, calories: 390, protein: 18, carbs: 42, fats: 16, sugars: 14 }
      },
      {
        id: "d25-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Sandía Fresca",
        ingredients: [
          "1 porción grande de sandía en cubos (aprox. 200g)"
        ],
        prep: "Lavar, retirar cáscara, cortar en cubos y servir fresca.",
        macros: { weight: 200, calories: 60, protein: 1, carbs: 15, fats: 0, sugars: 12 }
      },
      {
        id: "d25-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Chorizo en Airfryer con Papa y Ensalada",
        ingredients: [
          "Proteína: Chorizo asado en la airfryer para desgrasar",
          "Complemento: Papa con guiso criollo",
          "Ensalada: Rodajas de tomate, aguacate, pepino"
        ],
        prep: "Pinchar el chorizo y cocinarlo en airfryer. Cocinar la papa y bañarla en guiso. Acompañar de las rodajas de vegetales frescos.",
        macros: { weight: 450, calories: 520, protein: 28, carbs: 40, fats: 25, sugars: 5 }
      },
      {
        id: "d25-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-pie-chart",
        name: "Moneditas de Papa o Plátano Verde",
        ingredients: [
          "100g de moneditas (rodajas finas de papa o plátano)",
          "1 rocío de aceite, pizca de sal"
        ],
        prep: "Cocinar en airfryer u horno hasta tostar.",
        macros: { weight: 120, calories: 140, protein: 2, carbs: 28, fats: 2, sugars: 1 }
      },
      {
        id: "d25-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Omelette de Espinaca y Aguapanela",
        ingredients: [
          "1 Huevo hecho omelette",
          "Espinaca fresca picada",
          "1 taza de aguapanela caliente"
        ],
        prep: "Mezclar el huevo con espinaca y hacerlo en sartén. Acompañar con la bebida caliente.",
        macros: { weight: 160, calories: 150, protein: 8, carbs: 12, fats: 5, sugars: 10 }
      }
    ]
  },
  {
    day: 26,
    meals: [
      {
        id: "d26-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el licuado. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta conseguir una textura homogénea y sin grumos. Licuar a alta velocidad y consumir de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d26-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevo Duro y Cereal con Leche",
        ingredients: [
          "1 Huevo duro (cocido)",
          "1 porción de cereal integral o tradicional",
          "1 vaso de leche descremada"
        ],
        prep: "Cocinar el huevo. Servir el cereal en un tazón con leche.",
        macros: { weight: 310, calories: 310, protein: 15, carbs: 42, fats: 9, sugars: 12 }
      },
      {
        id: "d26-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Banano Fresco",
        ingredients: [
          "1 banano maduro mediano"
        ],
        prep: "Pelar y comer.",
        macros: { weight: 120, calories: 105, protein: 1, carbs: 27, fats: 0, sugars: 14 }
      },
      {
        id: "d26-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Salchicha con Maicitos Gratinados",
        ingredients: [
          "Proteína: Porción de salchicha asada",
          "Acompañante: Maicitos gratinados con queso y papas a la francesa o en cascos",
          "Verduras: Lechuga fresca",
          "Aderezo: Salsa de aguacate, yogur griego y cilantro mezclado"
        ],
        prep: "Saltear la salchicha, asar las papas en airfryer. Gratinar el maíz. Montar todo acompañado de la lechuga aderezada con la salsa cremosa de yogur y aguacate.",
        macros: { weight: 450, calories: 530, protein: 22, carbs: 55, fats: 25, sugars: 6 }
      },
      {
        id: "d26-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Gelatina Light",
        ingredients: [
          "1 taza de gelatina light (sin azúcar)"
        ],
        prep: "Mantener refrigerada hasta el momento de servir.",
        macros: { weight: 150, calories: 20, protein: 2, carbs: 3, fats: 0, sugars: 0 }
      },
      {
        id: "d26-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Plátano Maduro con Queso y Bocadillo",
        ingredients: [
          "1 plátano maduro pequeño asado",
          "Trozos de queso y bocadillo al interior",
          "1 vaso de agua saborizada sin calorías"
        ],
        prep: "Abrir el plátano por la mitad y rellenar, derretir el queso en horno o sartén con tapa. Servir con la bebida.",
        macros: { weight: 180, calories: 260, protein: 6, carbs: 45, fats: 7, sugars: 16 }
      }
    ]
  },
  {
    day: 27,
    meals: [
      {
        id: "d27-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el licuado. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta conseguir una textura completamente integrada y sin grumos. Licuar todo hasta homogenizar y consumir de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d27-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Sándwich de Huevo, Jamón, Queso y Tomate",
        ingredients: [
          "2 rebanadas de pan tajado",
          "1 huevo, 1 tajada jamón, 1 tajada queso, tomate",
          "1 taza de chocolate caliente"
        ],
        prep: "Armar en sandwichera y servir junto al chocolate caliente.",
        macros: { weight: 320, calories: 380, protein: 21, carbs: 32, fats: 18, sugars: 12 }
      },
      {
        id: "d27-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Taza de Fresas",
        ingredients: [
          "1 porción de fresas (aprox 140g)"
        ],
        prep: "Lavar bien, retirar corona y comer.",
        macros: { weight: 140, calories: 45, protein: 1, carbs: 11, fats: 0, sugars: 7 }
      },
      {
        id: "d27-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Huevo Cocido con Espinaca y Pan Tostado",
        ingredients: [
          "Proteína: 2 huevos cocidos (duros) en rodajas",
          "Ensalada: Espinaca fresca, trozos de pan tostado, queso mozzarella",
          "Aderezo: Vinagreta ligera"
        ],
        prep: "Mezclar la base verde de espinaca con el pan tostado (croutones), espolvorear el queso y colocar las rodajas de huevo. Aliñar con vinagreta.",
        macros: { weight: 420, calories: 410, protein: 22, carbs: 25, fats: 22, sugars: 4 }
      },
      {
        id: "d27-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-snow",
        name: "Banano Helado",
        ingredients: [
          "1 banano maduro"
        ],
        prep: "Congelar y comer.",
        macros: { weight: 120, calories: 105, protein: 1, carbs: 27, fats: 0, sugars: 14 }
      },
      {
        id: "d27-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa Pequeña con Chorizo Asado",
        ingredients: [
          "1 arepa pequeña asada a la plancha",
          "1 chorizo asado (airfryer o sartén sin aceite)"
        ],
        prep: "Servir el chorizo en rodajas sobre la arepa caliente.",
        macros: { weight: 150, calories: 270, protein: 12, carbs: 18, fats: 17, sugars: 1 }
      }
    ]
  },
  {
    day: 28,
    meals: [
      {
        id: "d28-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el proceso. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar y tomar fresco de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d28-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Omelette de Verduras con Arepa y Café",
        ingredients: [
          "2 huevos medianos batidos con verduras finamente picadas (tomate, cebolla, etc.)",
          "1 arepa mediana",
          "150ml de leche con café instantáneo"
        ],
        prep: "Asar el omelette de verduras. Servir con la arepa asada y café caliente.",
        macros: { weight: 310, calories: 360, protein: 17, carbs: 36, fats: 16, sugars: 10 }
      },
      {
        id: "d28-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Piña Fresca",
        ingredients: [
          "1 taza de piña madura picada en cubos (aprox. 150g)"
        ],
        prep: "Retirar la cáscara y las semillas, cortar en cubos limpios y consumir fresca.",
        macros: { weight: 150, calories: 75, protein: 1, carbs: 19, fats: 0, sugars: 14 }
      },
      {
        id: "d28-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Carne Desmechada con Pepino Relleno y Arroz",
        ingredients: [
          "Proteína: Carne de res desmechada guisada y 1 huevo cocido",
          "Verduras: Pepino cohombro preparado para rellenar, y papa cocida",
          "Acompañante: Arroz blanco",
          "Aderezo: Crema bechamel ligera para bañar el pepino relleno"
        ],
        prep: "Rellenar el pepino ahuecado con la mezcla de carne desmechada, trozos de papa y huevo cocido picado, bañando con crema bechamel. Acompañar con porción de arroz blanco.",
        macros: { weight: 510, calories: 540, protein: 38, carbs: 55, fats: 18, sugars: 6 }
      },
      {
        id: "d28-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Yogur Griego con Fresas y Chocolate",
        ingredients: [
          "1 taza de yogur griego",
          "Fresas frescas",
          "Chocolate derretido y esencia de vainilla o coco"
        ],
        prep: "Mezclar ingredientes y decorar con hilos de chocolate.",
        macros: { weight: 180, calories: 170, protein: 12, carbs: 18, fats: 5, sugars: 12 }
      },
      {
        id: "d28-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Cereal con Leche",
        ingredients: [
          "1 taza de cereal de maíz o integral",
          "1 vaso de leche descremada o deslactosada"
        ],
        prep: "Servir mezclado en tazón.",
        macros: { weight: 190, calories: 200, protein: 8, carbs: 32, fats: 4, sugars: 10 }
      }
    ]
  },
  {
    day: 29,
    meals: [
      {
        id: "d29-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el proceso. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar a alta velocidad y tomar de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d29-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Revueltos con Tostadas y Aguapanela",
        ingredients: [
          "2 huevos medianos revueltos",
          "2 tostadas de pan",
          "1 taza de aguapanela caliente con leche"
        ],
        prep: "Servir los huevos revueltos con las tostadas. Acompañar de aguapanela con leche.",
        macros: { weight: 320, calories: 380, protein: 18, carbs: 45, fats: 14, sugars: 12 }
      },
      {
        id: "d29-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Coco",
        ingredients: [
          "1 porción de coco fresco cortado en láminas o cubos"
        ],
        prep: "Lavar y consumir directo.",
        macros: { weight: 60, calories: 160, protein: 2, carbs: 6, fats: 15, sugars: 3 }
      },
      {
        id: "d29-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Torta de Carne Molida con Arroz y Patacones",
        ingredients: [
          "Proteína: Torta asada de carne molida cubierta con una lonja de queso",
          "Complemento: Arroz blanco y patacones crujientes",
          "Ensalada: Lechuga fresca, tomate en rodajas y zumo de limón"
        ],
        prep: "Asar la torta de carne, ponerle el queso para fundir ligeramente. Acompañar con arroz, patacones y ensalada de vegetales.",
        macros: { weight: 450, calories: 530, protein: 44, carbs: 48, fats: 18, sugars: 3 }
      },
      {
        id: "d29-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-box-seam-fill",
        name: "Crispetas Caseras Bajas en Grasa",
        ingredients: [
          "1 bolsa pequeña de crispetas caseras"
        ],
        prep: "Hacer las palomitas al calor con un mínimo rocío de aceite, agregar pizca de sal.",
        macros: { weight: 40, calories: 120, protein: 3, carbs: 22, fats: 3, sugars: 0 }
      },
      {
        id: "d29-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich de Jamón, Queso y Tomate",
        ingredients: [
          "2 rebanadas de pan tajado",
          "1 tajada de jamón y 1 tajada de queso",
          "Rodajas de tomate",
          "1 taza de chocolate caliente"
        ],
        prep: "Armar y dorar el sándwich en sandwichera a fuego medio hasta derretir el queso. Acompañar de chocolate.",
        macros: { weight: 280, calories: 310, protein: 14, carbs: 42, fats: 11, sugars: 14 }
      }
    ]
  },
  {
    day: 30,
    meals: [
      {
        id: "d30-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: [
          "30g de espinaca fresca (aprox. 1 puñado generoso)",
          "1 tallo de apio mediano (aprox. 40g)",
          "80g de piña pelada y cortada en cubos",
          "150ml de agua helada"
        ],
        prep: "Licuar todos los ingredientes a alta velocidad. Servir y tomar de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d30-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Arepa con Queso, Huevo Frito y Café con Leche",
        ingredients: [
          "1 Arepa asada a la plancha con queso derretido",
          "1 Huevo frito colocado encima",
          "1 taza de Café caliente con leche"
        ],
        prep: "Dorar la arepa, asar el queso, freír el huevo al punto y servir montado. Tomar el café con leche.",
        macros: { weight: 270, calories: 350, protein: 16, carbs: 28, fats: 18, sugars: 7 }
      },
      {
        id: "d30-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Ciruelas Frescas",
        ingredients: [
          "Porción de ciruelas frescas enteras"
        ],
        prep: "Lavar bien las ciruelas y consumir.",
        macros: { weight: 130, calories: 60, protein: 1, carbs: 14, fats: 0, sugars: 12 }
      },
      {
        id: "d30-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Atún con Espaguetis y Ensalada de Manzana",
        ingredients: [
          "1 lata de atún (aprox. 120g)",
          "80g de espaguetis con salsa de tomate",
          "50g de manzana picada y lechuga",
          "1 cucharada de maní dulce",
          "1 cucharadita de salsa de soya"
        ],
        prep: "Servir el atún acompañado de los espaguetis en salsa de tomate. Preparar la ensalada mezclando la lechuga, manzana y maní, y aderezar con soya.",
        macros: { weight: 420, calories: 480, protein: 32, carbs: 60, fats: 12, sugars: 10 }
      },
      {
        id: "d30-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-pie-chart",
        name: "Moneditas de Papa o Plátano Verde",
        ingredients: [
          "Porción de moneditas de papa o plátano",
          "Pizca de sal y rocío de aceite"
        ],
        prep: "Tostar en airfryer.",
        macros: { weight: 100, calories: 140, protein: 2, carbs: 28, fats: 2, sugars: 1 }
      },
      {
        id: "d30-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Huevos Cocidos con Galletas",
        ingredients: [
          "2 huevos duros (cocidos)",
          "2 galletas Saltinas o Ducales"
        ],
        prep: "Partir a la mitad los huevos cocidos, agregar pizca de sal y pimienta y acompañar con las galletas.",
        macros: { weight: 140, calories: 190, protein: 14, carbs: 12, fats: 10, sugars: 1 }
      }
    ]
  }
];

let mealPlanData = JSON.parse(localStorage.getItem("nebu_custom_meals")) || defaultMealPlanData;

let currentDay = 1;
let caloriesChartInstance = null;

// Detectar el día actual según hora de Colombia
function getColombiaDayOfMonth() {
  try {
    const fmt = new Intl.DateTimeFormat("es-CO", { timeZone: "America/Bogota", day: "numeric" });
    const day = parseInt(fmt.format(new Date()), 10);
    if (isNaN(day) || day < 1) return 1;
    if (day > 30) return 30;
    return day;
  } catch (e) {
    return 1;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
});

function initApp() {
  currentDay = getColombiaDayOfMonth();
  renderDaySelector();
  loadDay(currentDay);
  setTimeout(() => {
    const activeBtn = document.querySelector(".btn-day.active");
    if (activeBtn) activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, 200);
}

function renderDaySelector() {
  const container = document.getElementById("daySelector");
  if (!container) return;
  container.innerHTML = "";
  mealPlanData.forEach((dayData) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `btn btn-day ${dayData.day === currentDay ? "active" : ""}`;
    btn.textContent = `Día ${dayData.day}`;
    btn.onclick = () => {
      currentDay = dayData.day;
      highlightSelectedDayButton();
      loadDay(currentDay);
    };
    container.appendChild(btn);
  });
}

function highlightSelectedDayButton() {
  const buttons = document.querySelectorAll(".btn-day");
  buttons.forEach((btn) => {
    const num = parseInt(btn.textContent.replace("Día ", ""), 10);
    btn.classList.toggle("active", num === currentDay);
  });
}

function loadDay(dayNum) {
  const dayData = mealPlanData.find((d) => d.day === dayNum);
  if (!dayData) return;
  const titleEl = document.getElementById("selectedDayTitle");
  if (titleEl) titleEl.textContent = `Comidas del Día ${dayNum}`;
  renderMealsAndIngredients(dayData.meals);
  updateMacrosAndProgress(dayData.meals);
  updateConsumedCalories(dayData.meals);
}

function renderMealsAndIngredients(meals) {
  const accordion = document.getElementById("mealsAccordion");
  if (!accordion) return;
  accordion.innerHTML = "";

  meals.forEach((meal, index) => {
    const isExpanded = index === 0 ? "show" : "";
    const isCollapsedClass = index === 0 ? "" : "collapsed";
    const ariaExpanded = index === 0 ? "true" : "false";

    const item = document.createElement("div");
    item.className = "accordion-item";
    item.innerHTML = `
      <h2 class="accordion-header" id="heading-${meal.id}">
        <button class="accordion-button ${isCollapsedClass}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${meal.id}" aria-expanded="${ariaExpanded}" aria-controls="collapse-${meal.id}">
          <div class="d-flex align-items-center w-100 justify-content-between pe-3">
            <div>
              <i class="bi ${meal.icon} text-success me-2"></i>
              <span class="meal-title">${meal.type}: ${meal.name}</span>
<button class="btn btn-sm btn-link text-secondary p-0 ms-2" onclick="event.stopPropagation(); window.editMeal('${meal.id}')" title="Editar Comida">
  <i class="bi bi-pencil-square"></i>
</button>
            </div>
            <span class="badge-time"><i class="bi bi-clock me-1"></i>${meal.time}</span>
          </div>
        </button>
      </h2>
      <div id="collapse-${meal.id}" class="accordion-collapse collapse ${isExpanded}" aria-labelledby="heading-${meal.id}" data-bs-parent="#mealsAccordion">
        <div class="accordion-body">
          <div class="form-check mb-3">
            <input class="form-check-input meal-checkbox" type="checkbox" id="check-${meal.id}" data-day="${currentDay}">
            <label class="form-check-label fw-semibold text-success" for="check-${meal.id}">
              Marcar comida como consumida
            </label>
          </div>
          <h6 class="fw-bold text-secondary mb-2"><i class="bi bi-basket me-1"></i> Ingredientes:</h6>
          <ul class="mb-3 ps-3">${meal.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
          <h6 class="fw-bold text-secondary mb-2"><i class="bi bi-journal-text me-1"></i> Preparación:</h6>
          <p class="prep-box mb-3">${meal.prep}</p>
          <div class="table-responsive">
            <table class="table table-sm table-bordered table-nutrition mb-0">
              <thead><tr><th>Peso</th><th>Calorías</th><th>Proteínas</th><th>Carbos</th><th>Grasas</th><th>Azúcares</th></tr></thead>
              <tbody><tr>
                <td>${meal.macros.weight}g</td>
                <td>${meal.macros.calories} kcal</td>
                <td>${meal.macros.protein}g</td>
                <td>${meal.macros.carbs}g</td>
                <td>${meal.macros.fats}g</td>
                <td>${meal.macros.sugars}g</td>
              </tr></tbody>
            </table>
          </div>
        </div>
      </div>`;
    accordion.appendChild(item);
  });

  const allIngredients = [];
  meals.forEach(m => m.ingredients.forEach(i => allIngredients.push(i)));

  const generalItem = document.createElement("div");
  generalItem.className = "accordion-item";
  generalItem.innerHTML = `
    <h2 class="accordion-header" id="heading-general-ingredients">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-general-ingredients" aria-expanded="false" aria-controls="collapse-general-ingredients">
        <div class="d-flex align-items-center w-100 justify-content-between pe-3">
          <div>
            <i class="bi bi-basket3-fill text-success me-2"></i>
            <span class="meal-title">Ingredientes Totales del Día</span>
          </div>
          <span class="badge-time"><i class="bi bi-list-check me-1"></i>${allIngredients.length} ítems</span>
        </div>
      </button>
    </h2>
    <div id="collapse-general-ingredients" class="accordion-collapse collapse" aria-labelledby="heading-general-ingredients" data-bs-parent="#mealsAccordion">
      <div class="accordion-body">
        <ul class="mb-0 ps-3">
          ${allIngredients.length ? allIngredients.map(i => `<li class="py-1">${i}</li>`).join("") : '<li class="text-muted">Sin ingredientes.</li>'}
        </ul>
      </div>
    </div>`;
  accordion.appendChild(generalItem);

  document.querySelectorAll(".meal-checkbox").forEach(cb => {
    cb.addEventListener("change", saveCheckboxState);
  });

  loadCheckboxState();
}

function updateMacrosAndProgress(meals) {
  let totalCal = 0, totalProt = 0, totalCarb = 0, totalFat = 0, totalSug = 0;
  meals.forEach(m => {
    totalCal += m.macros.calories;
    totalProt += m.macros.protein;
    totalCarb += m.macros.carbs;
    totalFat += m.macros.fats;
    totalSug += m.macros.sugars;
  });

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("totalCalories", `${totalCal} kcal`);
  set("totalProtein", `${totalProt}g`);
  set("totalCarbs", `${totalCarb}g`);
  set("totalFats", `${totalFat}g`);
  set("totalSugars", `${totalSug}g`);

  updateProgress();
}

function updateConsumedCalories(meals) {
  let consumed = 0;
  meals.forEach(m => {
    const cb = document.getElementById(`check-${m.id}`);
    if (cb && cb.checked) consumed += m.macros.calories;
  });
  updateCaloriesChart(consumed);
}

function updateCaloriesChart(consumedCalories) {
  const targetCalories = 2000;
  const remaining = Math.max(0, targetCalories - consumedCalories);
  const canvasEl = document.getElementById("caloriesChart");
  if (!canvasEl) return;

  if (canvasEl.offsetParent === null || canvasEl.clientWidth === 0) {
    setTimeout(() => updateCaloriesChart(consumedCalories), 150);
    return;
  }

  const ctx = canvasEl.getContext("2d");
  if (caloriesChartInstance) {
    caloriesChartInstance.data.datasets[0].data = [consumedCalories, remaining];
    caloriesChartInstance.update();
  } else {
    caloriesChartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Consumidas", "Restantes"],
        datasets: [{
          data: [consumedCalories, remaining],
          backgroundColor: ["#2ecc71", "#e0e0e0"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        cutout: "75%"
      }
    });
  }
}

function saveCheckboxState() {
  const checkboxes = document.querySelectorAll(".meal-checkbox");
  const state = {};
  checkboxes.forEach(cb => { state[cb.id] = cb.checked; });
  localStorage.setItem(`fitplan_day_${currentDay}_state`, JSON.stringify(state));
  updateProgress();

  const dayData = mealPlanData.find(d => d.day === currentDay);
  if (dayData) updateConsumedCalories(dayData.meals);
}

function loadCheckboxState() {
  const saved = localStorage.getItem(`fitplan_day_${currentDay}_state`);
  if (saved) {
    const state = JSON.parse(saved);
    for (const id in state) {
      const cb = document.getElementById(id);
      if (cb) cb.checked = state[id];
    }
  }
  updateProgress();
}

// Vinculada globalmente para acceso en HTML
window.resetDayCheckboxes = function () {
  localStorage.removeItem(`fitplan_day_${currentDay}_state`);
  document.querySelectorAll(".meal-checkbox").forEach(cb => cb.checked = false);
  updateProgress();

  const dayData = mealPlanData.find(d => d.day === currentDay);
  if (dayData) updateConsumedCalories(dayData.meals);
};

function updateProgress() {
  const checkboxes = document.querySelectorAll(".meal-checkbox");
  const textEl = document.getElementById("progressText");
  const barEl = document.getElementById("progressBar");
  if (checkboxes.length === 0) {
    if (textEl) textEl.textContent = "0%";
    if (barEl) barEl.style.width = "0%";
    return;
  }
  let checked = 0;
  checkboxes.forEach(cb => { if (cb.checked) checked++; });
  const pct = Math.round((checked / checkboxes.length) * 100);
  if (textEl) textEl.textContent = `${pct}%`;
  if (barEl) barEl.style.width = `${pct}%`;
}

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
  });
}

function updateThemeIcon(theme, iconElement) {
  if (!iconElement) return;
  iconElement.className = theme === "dark" ? "bi bi-sun-fill text-warning" : "bi bi-moon-stars-fill";
}

// ==========================================================
// FUNCIONES GLOBALES PARA EL MODAL (Expuestas a Window)
// ==========================================================
let editModalInstance = null;

window.editMeal = function(mealId) {
  const dayIndex = mealPlanData.findIndex(d => d.day === currentDay);
  if (dayIndex === -1) return;
  const mealIndex = mealPlanData[dayIndex].meals.findIndex(m => m.id === mealId);
  if (mealIndex === -1) return;

  const meal = mealPlanData[dayIndex].meals[mealIndex];

  document.getElementById('editMealId').value = mealId;
  document.getElementById('editName').value = meal.name;
  document.getElementById('editTime').value = meal.time;
  document.getElementById('editIngredients').value = meal.ingredients.join('\n');
  document.getElementById('editPrep').value = meal.prep;
  
  document.getElementById('editCals').value = meal.macros.calories;
  document.getElementById('editProt').value = meal.macros.protein;
  document.getElementById('editCarbs').value = meal.macros.carbs;
  document.getElementById('editFats').value = meal.macros.fats;
  document.getElementById('editSugars').value = meal.macros.sugars;

  if (!editModalInstance) {
    editModalInstance = new bootstrap.Modal(document.getElementById('editMealModal'));
  }
  editModalInstance.show();
}

window.saveMealChanges = function() {
  const mealId = document.getElementById('editMealId').value;
  
  const dayIndex = mealPlanData.findIndex(d => d.day === currentDay);
  if (dayIndex === -1) return;
  const mealIndex = mealPlanData[dayIndex].meals.findIndex(m => m.id === mealId);
  if (mealIndex === -1) return;

  const meal = mealPlanData[dayIndex].meals[mealIndex];

  meal.name = document.getElementById('editName').value || meal.name;
  meal.time = document.getElementById('editTime').value || meal.time;
  meal.prep = document.getElementById('editPrep').value || meal.prep;
  
  const ingText = document.getElementById('editIngredients').value;
  if (ingText.trim() !== "") {
    meal.ingredients = ingText.split('\n').map(ing => ing.trim()).filter(ing => ing !== "");
  }

  meal.macros.calories = Number(document.getElementById('editCals').value) || meal.macros.calories;
  meal.macros.protein = Number(document.getElementById('editProt').value) || meal.macros.protein;
  meal.macros.carbs = Number(document.getElementById('editCarbs').value) || meal.macros.carbs;
  meal.macros.fats = Number(document.getElementById('editFats').value) || meal.macros.fats;
  meal.macros.sugars = Number(document.getElementById('editSugars').value) || meal.macros.sugars;

  localStorage.setItem("nebu_custom_meals", JSON.stringify(mealPlanData));

  editModalInstance.hide();
  loadDay(currentDay);
}

window.autoCalculateMacros = async function() {
  const ingredients = document.getElementById('editIngredients').value;
  const btn = document.getElementById('btnAutoCalc');
  
  if (!ingredients || ingredients.trim() === "") {
    alert("Por favor, ingresa los ingredientes primero para poder calcular.");
    return;
  }

  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Calculando...';
  btn.disabled = true;

  const endpoint = "https://api.groq.com/openai/v1/chat/completions";

  const promptText = `
    Eres un nutricionista experto. Estima los macronutrientes para estos ingredientes: 
    ${ingredients}
    Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta y valores numéricos enteros:
    {"calories": 0, "protein": 0, "carbs": 0, "fats": 0, "sugars": 0}
  `;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${GROQ_API_KEY}`, // Usamos la variable importada
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "user",
            content: promptText
          }
        ],
        response_format: { type: "json_object" } 
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error de conexión con Groq: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    const macros = JSON.parse(data.choices[0].message.content);

    document.getElementById('editCals').value = macros.calories || 0;
    document.getElementById('editProt').value = macros.protein || 0;
    document.getElementById('editCarbs').value = macros.carbs || 0;
    document.getElementById('editFats').value = macros.fats || 0;
    document.getElementById('editSugars').value = macros.sugars || 0;
    
    btn.innerHTML = '<i class="bi bi-check-circle me-1"></i> ¡Calculado!';
    btn.classList.replace('btn-outline-primary', 'btn-success');
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.replace('btn-success', 'btn-outline-primary');
    }, 2000);

  } catch (error) {
    console.error("Detalle del error:", error);
    alert("Ocurrió un problema conectando con Groq.\n\nDetalle: " + error.message);
    btn.innerHTML = originalText;
  } finally {
    btn.disabled = false;
  }
}
// ==========================================================================
// FIREBASE AUTH (Modular v10)
// ==========================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
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
const mealPlanData = [
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
        name: "Atún Salteado con Hogao y Pasta Penne",
        ingredients: [
          "1 lata de atún en agua (aprox. 120g escurrido)",
          "1/2 tomate chonto maduro picado en cuadros pequeños (aprox. 50g)",
          "2 cucharadas de cebolla larga finamente picada (aprox. 25g)",
          "1 cucharadita (5ml) de aceite de oliva o vegetal",
          "1 pizca de sal, ajo en polvo y comino (para el hogao)",
          "80g de pasta tipo Penne o coditos (medidos en seco, luego cocidos al dente en agua con sal)",
          "60g de pepino cohombro en rodajas",
          "40g de tomate en rodajas",
          "Zumo de 1/2 limón y 1 pizca de sal (para la ensalada)"
        ],
        prep: "Cocinar la pasta en una olla con abundante agua hirviendo y sal durante 8-10 minutos hasta que esté al dente; escurrir. En una sartén a fuego medio, calentar el aceite y sofreír el tomate y la cebolla con la pizca de sal, ajo en polvo y comino durante 3 minutos para armar el hogao. Escurrir la lata de atún, incorporarla a la sartén con el hogao y saltear todo junto por 2 minutos. Añadir la pasta cocida a la sartén y mezclar bien para que absorba el sabor. Para la ensalada: en un plato colocar las rodajas de pepino y tomate, aderezando con el zumo de limón y la pizca de sal. Servir la pasta con atún caliente junto a la ensalada.",
        macros: { weight: 420, calories: 470, protein: 36, carbs: 54, fats: 11, sugars: 5 }
      },
      {
        id: "d3-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-box-seam-fill",
        name: "Crispetas Caseras Bajas en Grasa",
        ingredients: [
          "30g de maíz pira (maíz para crispetas)",
          "1 cucharadita (5ml) de aceite de maíz o girasol",
          "1 pizca de sal fina"
        ],
        prep: "En una olla mediana con tapa (o en airfryer adaptado), calentar la cucharadita de aceite a fuego medio-alto. Añadir los granos de maíz pira, tapar la olla y dejar cocinar. Mover la olla ocasionalmente para evitar que se quemen. Una vez comiencen a explotar de manera constante y el sonido disminuya (aprox. 3-4 minutos), retirar del fuego. Pasar a un recipiente y espolvorear la pizca de sal.",
        macros: { weight: 40, calories: 120, protein: 3, carbs: 22, fats: 3, sugars: 0 }
      },
      {
        id: "d3-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich Sencillo Caliente de Queso y Tomate",
        ingredients: [
          "2 rebanadas de pan tajado integral o blanco",
          "2 tajadas delgadas de queso mozzarella o sabana (aprox. 40g)",
          "4 rodajas delgadas de tomate chonto",
          "1 pizca de orégano seco (opcional)",
          "1/2 cucharadita de mantequilla ligera (para dorar el pan)"
        ],
        prep: "Untar una capa muy fina de mantequilla ligera por la cara externa de las rebanadas de pan. Colocar una rebanada de pan en una sartén a fuego medio-bajo. Sobre el pan, poner una tajada de queso, las rodajas de tomate, la pizca de orégano y la segunda tajada de queso. Cubrir con la otra rebanada de pan. Presionar ligeramente con una espátula y dorar de 2 a 3 minutos por cada lado hasta que el pan esté crujiente y el queso se encuentre fundido por completo.",
        macros: { weight: 160, calories: 220, protein: 10, carbs: 24, fats: 9, sugars: 3 }
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
        name: "Milanesa de Cerdo al Horno con Puré de Papa Criolla",
        ingredients: [
          "120g de lomo de cerdo en filete delgado",
          "1 cucharada de harina de trigo y 1 huevo batido (para el apanado ligero)",
          "20g de miga de pan o harina de maíz precocida",
          "1 cucharadita (5ml) de aceite de oliva, sal, pimienta y ajo en polvo",
          "120g de papa criolla",
          "1 cucharadita de mantequilla ligera y un toque de leche para el puré",
          "50g de hojas de espinaca fresca",
          "40g de pimentón rojo asado en tiras",
          "30g de cebolla cabezona en julianas finas",
          "Zumo de limón, 1 cucharadita de aceite de oliva y sal (para la vinagreta de la ensalada)"
        ],
        prep: "Sazonar el filete de cerdo con sal, pimienta y ajo en polvo. Pasar el filete primero por la harina de trigo, luego por el huevo batido y finalmente cubrir con la miga de pan. Colocar en una bandeja para horno o en la airfryer rociando con la cucharadita de aceite de oliva; hornear a 190°C durante 12-15 minutos hasta que esté dorada y cocida por dentro. Para el puré: cocinar la papa criolla en agua con sal hasta que esté blanda; escurrir, aplastar con un tenedor e incorporar la mantequilla y un chorrito de leche hasta obtener una textura cremosa. Para la ensalada: mezclar en un bol la espinaca, las tiras de pimentón asado y la cebolla, aderezando con el aceite de oliva, el zumo de limón y la sal. Servir la milanesa de cerdo crujiente acompañada del puré de papa criolla y la ensalada fresca.",
        macros: { weight: 450, calories: 510, protein: 37, carbs: 44, fats: 18, sugars: 4 }
      },
      {
        id: "d4-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-nut",
        name: "Mix de Frutos Secos",
        ingredients: [
          "40g de mix de frutos secos (maní tostado sin sal, almendras enteras y uvas pasas)"
        ],
        prep: "Medir la porción de 40g de frutos secos y consumir al natural directamente.",
        macros: { weight: 40, calories: 180, protein: 6, carbs: 14, fats: 12, sugars: 6 }
      },
      {
        id: "d4-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa Pequeña con Carne Desmechada o Molida",
        ingredients: [
          "1 arepa pequeña de maíz blanca o amarilla (aprox. 50g)",
          "60g de carne desmechada o molida sazonada (preparada previamente o sobrante de almuerzos anteriores)"
        ],
        prep: "Calentar la arepa pequeña en una sartén o plancha a fuego medio por ambos lados hasta que esté caliente en su interior. Aparte, calentar la porción de carne desmechada o molida en una sartén pequeña con un chorrito de agua o caldo para que mantenga su humedad. Abrir ligeramente la arepa o servir la carne caliente generosamente por encima en forma de plato abierto. Consumir de inmediato.",
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
          "130g de muslos o pechuga de pollo cortados en trozos",
          "1/2 cucharadita de curry en polvo, 1 pizca de sal, ajo en polvo y 1 cucharadita de aceite de oliva (para el pollo)",
          "1/2 aguacate hass maduro pequeño (aprox. 60g)",
          "2 cucharadas de tomate chonto y cebolla cabezona picados finamente",
          "Culantro o cilantro fresco picado, zumo de limón y sal (para el guacamole)",
          "1 plátano verde mediano (aprox. 150g con cáscara) y aceite vegetal para freír los patacones"
        ],
        prep: "Para el pollo: sazonar los trozos de pollo con el curry, la sal, el ajo en polvo y dorar en una sartén con la cucharadita de aceite de oliva a fuego medio durante 10-12 minutos hasta que estén bien cocidos y dorados. Para los patacones: pelar el plátano verde, cortarlo en rodajas gruesas (aprox. 3-4 cm), freírlos en aceite caliente a fuego medio hasta que estén suaves por dentro; retirarlos, aplastarlos con una pataconera o tabla para dar forma de patacón y volver a sumergir en aceite caliente por 1 minuto hasta que queden crujientes; escurrir sobre papel absorbente y agregar una pizca de sal. Para el guacamole: en un bol, triturar el aguacate con un tenedor y mezclar con el tomate, la cebolla, el cilantro, unas gotas de zumo de limón y sal al gusto. Servir el pollo al curry acompañado de los patacones crujientes y el guacamole fresco.",
        macros: { weight: 480, calories: 540, protein: 36, carbs: 42, fats: 24, sugars: 3 }
      },
      {
        id: "d5-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Yogur Griego con Avena",
        ingredients: [
          "1 taza de yogur griego natural sin azúcar (aprox. 150g)",
          "1 cucharada sopera de avena en hojuelas (aprox. 15g)"
        ],
        prep: "Servir la taza de yogur griego en un recipiente hondo. Agregar la cucharada de avena en hojuelas por encima, mezclar suavemente de manera uniforme y consumir de inmediato.",
        macros: { weight: 170, calories: 150, protein: 14, carbs: 16, fats: 3, sugars: 8 }
      },
      {
        id: "d5-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Huevo Duro sobre Galletas Saltinas / Ducales",
        ingredients: [
          "1 Huevo mediano",
          "1 pizca de sal y una pizca de pimienta negra molida",
          "2 Galletas Saltinas o Ducales"
        ],
        prep: "Cocinar el huevo en una olla con agua hirviendo durante 8 a 10 minutos. Retirar, enfriar con agua fría, quitar la cáscara y picar el huevo duro en cubos pequeños o triturarlo con un tenedor. Sazonar el huevo picado con la pizca de sal y pimienta. Disponer las 2 galletas Saltinas o Ducales en un plato y distribuir encima el huevo picado sazonado de manera uniforme. Consumir de inmediato.",
        macros: { weight: 110, calories: 160, protein: 8, carbs: 14, fats: 8, sugars: 1 }
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
        name: "Gulash de Res con Arroz con Fideos y Ensalada de Fresas",
        ingredients: [
          "130g de carne de res magra para gulash cortada en cubos",
          "1/2 tomate chonto, 2 cucharadas de cebolla y 1/2 pimentón picados (para el guiso)",
          "1 cucharadita (5ml) de aceite, sal, pimentón dulce (paprika) y comino",
          "80g de arroz blanco y 15g de fideos finos (cabello de ángel) para el arroz con fideos",
          "60g de lechuga crespa fresca",
          "40g de fresas maduras en láminas",
          "1 cucharadita de semillas de ajonjolí (sesamo)",
          "Zumo de limón, 1 cucharadita de aceite de oliva y sal (para la vinagreta)"
        ],
        prep: "Para el gulash: en una olla con un chorrito de aceite, sofreír la cebolla, el tomate y el pimentón; agregar los cubos de carne de res, sellar por todos lados, añadir especias (paprika, comino, sal) y agua o caldo para estofar a fuego lento durante 30-40 minutos hasta que la carne esté suave y en su jugo. Para el arroz con fideos: dorar los fideos finos en una sartén con unas gotas de aceite hasta que tomen color tostado, agregar el arroz y el doble de agua con sal, cocinar a fuego medio hasta que seque y tapar para terminar cocción. Para la ensalada: mezclar la lechuga crespa troceada con las láminas de fresa y espolvorear el ajonjolí, aderezando con aceite de oliva, zumo de limón y sal. Servir el gulash de res caliente sobre el arroz con fideos y acompañar con la ensalada fresca de fresas.",
        macros: { weight: 460, calories: 530, protein: 39, carbs: 55, fats: 16, sugars: 6 }
      },
      {
        id: "d6-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-circle",
        name: "Huevo Duro en Tostada de Arroz",
        ingredients: [
          "1 Huevo mediano",
          "1 pizca de sal y pimienta negra",
          "1 Tostada de arroz inflado"
        ],
        prep: "Cocinar el huevo en una olla con agua hirviendo durante 8 a 10 minutos. Retirar, pasar por agua fría, pelar y picar finamente o triturar con un tenedor. Sazonar el huevo picado con la pizca de sal y pimienta. Extender y acomodar el huevo picado por encima de la tostada de arroz de manera uniforme. Consumir de inmediato.",
        macros: { weight: 85, calories: 110, protein: 7, carbs: 8, fats: 5, sugars: 0 }
      },
      {
        id: "d6-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Salchipapa Casera Ligera",
        ingredients: [
          "1 Papa mediana (aprox. 120g) cortada en cascos o bastones",
          "1 Salchicha de buena calidad (pollo o cerdo, aprox. 50g) picada en rodajas",
          "1 cucharadita (5ml) de aceite vegetal o de oliva",
          "1 pizca de sal, ajo en polvo y orégano"
        ],
        prep: "Precalentar la airfryer o el horno a 200°C. Lavar y secar muy bien los cascos de papa, colocarlos en un recipiente junto con la cucharadita de aceite, la sal y el ajo en polvo, mezclando bien. Distribuir los cascos de papa en la canasta de la airfryer y cocinar durante 15 minutos; a mitad de tiempo, incorporar las rodajas de salchicha picada junto con las papas para que se doren juntas de manera uniforme. Retirar cuando todo esté crujiente y dorado, espolvorear una pizca de orégano y servir caliente.",
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
        name: "Lomo de Cerdo con Champiñones y Plátano Maduro Asado",
        ingredients: ["Proteína: Lomo de cerdo salteado con champiñones", "Ensalada: Tomate, aguacate, cilantro, vinagreta de limón", "Complemento: Plátano maduro asado con queso costeño"],
        prep: "Saltear el lomo de cerdo con champiñones. Asar el plátano maduro al horno con un toque de queso costeño y acompañar de ensalada de tomate y aguacate.",
        macros: { weight: 470, calories: 520, protein: 40, carbs: 46, fats: 18, sugars: 12 }
      },
      {
        id: "d7-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-snow",
        name: "Banano Helado",
        ingredients: ["1 Banano previamente congelado"],
        prep: "Consumir el banano en rodajas o entero congelado a modo de paleta natural.",
        macros: { weight: 120, calories: 105, protein: 1, carbs: 27, fats: 0, sugars: 14 }
      },
      {
        id: "d7-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich de Atún con Lechuga",
        ingredients: ["2 Cucharadas de atún en agua", "Jugo de limón", "Lechuga fresca", "Pan tajado"],
        prep: "Mezclar el atún con limón y mezclar con la lechuga. Armar el sándwich en el pan tajado.",
        macros: { weight: 150, calories: 190, protein: 16, carbs: 20, fats: 4, sugars: 2 }
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
        name: "Chorizo y Huevo Frito con Lentejas Guisadas y Arroz",
        ingredients: [
          "1 chorizo de buena calidad (aprox. 80g)",
          "1 Huevo mediano",
          "1 cucharadita (3ml) de aceite",
          "120g de lentejas guisadas tradicionales",
          "80g de arroz blanco cocido",
          "60g de zanahoria rallada",
          "40g de tomate en cubos",
          "1 cucharadita de miel, 1 cucharadita de mostaza, zumo de limón y una pizca de sal (para la vinagreta)"
        ],
        prep: "Asar el chorizo a la parrilla o en una sartén a fuego medio hasta que esté bien cocido y dorado por todos lados. En la misma sartén o aparte, freír el huevo con un toque de aceite. Para la ensalada: en un recipiente, mezclar la zanahoria rallada y el tomate en cubos, aderezando con la vinagreta hecha a base de mostaza, miel, zumo de limón y sal. Servir el plato combinando las lentejas guisadas calientes, el arroz blanco, el chorizo asado, el huevo frito encima y la ensalada de zanahoria aderezada.",
        macros: { weight: 510, calories: 650, protein: 35, carbs: 68, fats: 26, sugars: 6 }
      },
      {
        id: "d8-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-hot",
        name: "Frappé de Café",
        ingredients: [
          "150ml de leche descremada o entera fría",
          "1 cucharadita colmada de café instantáneo",
          "1 taza de cubos de hielo (aprox. 6-8 cubos)"
        ],
        prep: "Colocar la leche fría, la cucharadita de café instantáneo y la taza de cubos de hielo en la licuadora. Licuar a velocidad alta durante 1 minuto hasta que el hielo esté completamente triturado y se logre una consistencia espumosa tipo frappé. Servir inmediatamente en un vaso alto.",
        macros: { weight: 220, calories: 90, protein: 4, carbs: 10, fats: 3, sugars: 8 }
      },
      {
        id: "d8-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa con Huevo Frito Encima",
        ingredients: [
          "1 arepa mediana de maíz (aprox. 60g)",
          "1 Huevo mediano",
          "1 cucharadita (3ml) de aceite o mantequilla ligera para la sartén",
          "1 pizca de sal y pimienta"
        ],
        prep: "Asar o calentar la arepa en una sartén o plancha a fuego medio por ambos lados hasta que esté dorada y crujiente por fuera. En una sartén antiadherente pequeña con la cucharadita de aceite o mantequilla, freír el huevo hasta que la clara cuaje y la yema mantenga la textura deseada; sazonar con una pizca de sal y pimienta. Colocar la arepa caliente en un plato y montar el huevo frito recién preparado justo encima. Consumir de inmediato.",
        macros: { weight: 150, calories: 230, protein: 10, carbs: 22, fats: 11, sugars: 1 }
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
        name: "Muslos de Pollo Sudados con Papa al Vapor y Ensalada de Mango",
        ingredients: [
          "150g de muslos de pollo (sin piel o con control de grasa)",
          "1/2 tomate, 2 cucharadas de cebolla, ajo y pimentón picados (para la salsa criolla y hogao)",
          "1 cucharadita (5ml) de aceite, comino, achiote y sal",
          "1 papa mediana (aprox. 100g) pelada",
          "60g de lechuga crespa fresca",
          "40g de mango maduro en cubos",
          "1 cucharadita de uvas pasas",
          "30g de queso campesino en cubitos",
          "Zumo de limón, 1 cucharadita de aceite de oliva y sal (para la vinagreta de la ensalada)"
        ],
        prep: "Para el pollo: en una olla, preparar una base de salsa criolla con la cebolla, el tomate, el ajo y el pimentón picados con un toque de aceite y achiote; añadir los muslos de pollo, agua o caldo, tapar y sudar a fuego medio-bajo durante 25-30 minutos hasta que el pollo esté tierno y bien cocido. Para la papa: cocinar la papa al vapor con una pizca de sal y bañar con una cucharada del hogao preparado. Para la ensalada: mezclar la lechuga crespa limpia y troceada con los cubos de mango maduro, las uvas pasas y los cubitos de queso campesino, aderezando con aceite de oliva, zumo de limón y sal. Servir los muslos de pollo sudados acompañados de la papa al vapor con hogao y la ensalada dulce de lechuga, mango y queso.",
        macros: { weight: 490, calories: 520, protein: 38, carbs: 52, fats: 16, sugars: 12 }
      },
      {
        id: "d9-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-emoji-smile",
        name: "Mango Biche con Limón, Sal y Pimienta",
        ingredients: [
          "140g de mango biche (verde) pelado",
          "Zumo de 1/2 limón",
          "Sal y pimienta negra al gusto"
        ],
        prep: "Cortar el mango biche en tiras delgadas o bastones. Colocar en un recipiente y sazonar con el zumo de limón fresco, una pizca de sal y pimienta al gusto. Consumir de inmediato.",
        macros: { weight: 140, calories: 70, protein: 1, carbs: 17, fats: 0, sugars: 10 }
      },
      {
        id: "d9-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Tortilla de Maíz con Jamón y Queso a la Plancha",
        ingredients: [
          "1 tortilla de maíz delgada (aprox. 50g)",
          "1 tajada de jamón de buena calidad",
          "1 tajada de queso que funda bien (sabanela o mozzarella)",
          "1 cucharadita (3ml) de mantequilla o aceite para la plancha"
        ],
        prep: "Calentar la tortilla de maíz ligeramente en una sartén o plancha. Colocar sobre una mitad de la tortilla la tajada de jamón y la tajada de queso. Doblar la tortilla por la mitad cubriendo el relleno. Dorar a la plancha a fuego medio por ambos lados, presionando ligeramente, hasta que la tortilla esté crujiente y el queso funda por completo. Servir caliente.",
        macros: { weight: 130, calories: 210, protein: 12, carbs: 16, fats: 10, sugars: 1 }
      },
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
          "130g de falda de res para desmechar",
          "1/2 tomate, 2 cucharadas de cebolla, ajo y pimentón picados (para el guiso)",
          "1 cucharadita (5ml) de aceite, comino, achiote y sal",
          "120g de yuca pelada y cortada en trozos",
          "60g de pepino cohombro en cubos o rodajas delgadas",
          "30g de maíz tierno desgranado",
          "2 cucharadas de yogur griego natural (para el aderezo)",
          "Zumo de limón, sal y un toque de cilantro picado"
        ],
        prep: "Para la carne: cocinar la falda de res en agua con sal hasta que esté blanda, luego desmecharla. En una sartén u olla con un toque de aceite, preparar un guiso con la cebolla, el tomate, el ajo y el pimentón, añadir la carne desmechada, especias y un poco de caldo, cocinando a fuego bajo hasta que tome sabor. Para la yuca: cocinar los trozos de yuca en agua con sal hasta que estén suaves, o llevarlos al horno/airfryer con un rocío de aceite a 200°C por 15 minutos para dorar ligeramente. Para la ensalada: mezclar el pepino cohombro con el maíz tierno y aderezar con el yogur griego natural mezclado con zumo de limón, sal y cilantro picado. Servir la carne desmechada en su guiso acompañada de la yuca y la ensalada de pepino.",
        macros: { weight: 450, calories: 510, protein: 41, carbs: 48, fats: 15, sugars: 5 }
      },
      {
        id: "d10-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Yogur Griego con Fresas y Chocolate",
        ingredients: [
          "120g de yogur griego natural o bajo en grasa",
          "40g de fresas maduras picadas",
          "1 cuadrito (aprox. 10g) de chocolate oscuro derretido",
          "1 gotita de esencia de vainilla o coco"
        ],
        prep: "Servir el yogur griego en una copa o tazón pequeño, incorporar y mezclar la esencia de vainilla o coco. Añadir las fresas picadas por encima y decorar vertiendo los hilos de chocolate oscuro derretido de forma uniforme. Consumir frío.",
        macros: { weight: 180, calories: 170, protein: 12, carbs: 18, fats: 5, sugars: 12 }
      },
      {
        id: "d10-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Omelette de 1 Huevo con Champiñones",
        ingredients: [
          "1 huevo mediano",
          "40g de champiñones frescos laminados",
          "1 cucharadita (3ml) de aceite o mantequilla ligera",
          "1 pizca de sal, pimienta y finas hierbas"
        ],
        prep: "Calentar una sartén antiadherente con media cucharadita de aceite y saltear los champiñones laminados hasta que doren y se reduzca su humedad; retirar y reservar. En un tazón, batir el huevo con la pizca de sal, pimienta y finas hierbas. Verter el huevo batido en la misma sartén engrasada a fuego medio-bajo, colocar los champiñones salteados en el centro cuando empiece a cuajar, doblar el omelette por la mitad y cocinar por un minuto más hasta el punto deseado. Servir caliente.",
        macros: { weight: 120, calories: 130, protein: 8, carbs: 2, fats: 9, sugars: 1 }
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
        name: "Tiras de Pollo con Champiñones y Espaguetis Integrales",
        ingredients: [
          "130g de pechuga de pollo cortada en tiras",
          "50g de champiñones frescos laminados",
          "1 cucharadita (5ml) de aceite, ajo picado, sal y pimienta",
          "70g de espaguetis integrales o tradicionales (peso en seco)",
          "50g de espinaca fresca",
          "1 tallo de apio crujiente en rodajas delgadas",
          "40g de aguacate en cubos",
          "Zumo de limón, 1 cucharadita de aceite de oliva y sal (para el aderezo de la ensalada)"
        ],
        prep: "Cocinar los espaguetis en agua hirviendo con sal hasta que estén al dente; escurrir. En una sartén antiadherente con una cucharadita de aceite, dorar el ajo y las tiras de pollo hasta que estén bien cocidas, añadir los champiñones laminados y saltear hasta que reduzcan y se integren con el pollo; sazonar al gusto y mezclar con la pasta cocida. Para la ensalada: combinar la espinaca fresca, el apio crujiente y los cubos de aguacate, aderezando con aceite de oliva, zumo de limón y sal. Servir las tiras de pollo con champiñones y espaguetis junto a la ensalada fresca.",
        macros: { weight: 440, calories: 490, protein: 41, carbs: 49, fats: 14, sugars: 3 }
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
        name: "Tostada de Pan con Aguacate y Sal Marina",
        ingredients: [
          "1 rebanada de pan integral de buena calidad",
          "40g de aguacate maduro",
          "1 pizca de escamas de sal marina o sal común"
        ],
        prep: "Tostar la rebanada de pan integral en una tostadora o sartén hasta que esté firme y crujiente. En un plato, triturar el aguacate con un tenedor y esparcirlo uniformemente sobre la tostada caliente. Sazonar por encima con las escamas de sal marina. Consumir de inmediato.",
        macros: { weight: 110, calories: 170, protein: 4, carbs: 16, fats: 10, sugars: 1 }
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
        name: "Chuleta de Cerdo con Coleslaw y Plátano con Bocadillo",
        ingredients: [
          "140g de chuleta de cerdo magra",
          "1 cucharadita (5ml) de aceite, ajo en polvo, comino, sal y pimienta",
          "50g de repollo blanco y 30g de repollo morado finamente picados",
          "30g de zanahoria rallada",
          "2 cucharadas de mayonesa ligera o yogur griego (para el aderezo Coleslaw)",
          "1 plátano maduro pequeño (aprox. 120g)",
          "20g de dulce de bocadillo y 20g de queso campesino o mozzarella"
        ],
        prep: "Para la chuleta: sazonar la chuleta de cerdo con ajo, comino, sal y pimienta; asar a la plancha a fuego medio con una cucharadita de aceite hasta que esté bien cocida y dorada por ambos lados. Para la ensalada: en un recipiente, mezclar el repollo blanco, el repollo morado y la zanahoria rallada, aderezando con la mayonesa ligera o yogur griego y una pizca de sal. Para el complemento: abrir el plátano maduro longitudinalmente sin cortarlo del todo, rellenarlo con el bocadillo y el queso, y hornear o cocinar a fuego lento tapado hasta que el plátano esté suave y el relleno fundido. Servir la chuleta de cerdo a la plancha acompañada de la ensalada Coleslaw fresca y el plátano maduro relleno.",
        macros: { weight: 480, calories: 560, protein: 38, carbs: 50, fats: 22, sugars: 16 }
      },
      {
        id: "d12-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-emoji-smile",
        name: "Bastones de Zanahoria con Limón y Sal",
        ingredients: [
          "120g de zanahoria fresca",
          "Zumo de 1/2 limón",
          "Sal y pimienta negra al gusto"
        ],
        prep: "Lavar, pelar y cortar la zanahoria en bastones delgados y uniformes. Colocar en un recipiente y aderezar con zumo de limón fresco, una pizca de sal y pimienta negra al gusto. Consumir de inmediato.",
        macros: { weight: 120, calories: 40, protein: 1, carbs: 9, fats: 0, sugars: 5 }
      },
      {
        id: "d12-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa Pequeña con Chorizo Asado",
        ingredients: [
          "1 arepa pequeña de maíz (aprox. 50g)",
          "1 chorizo pequeño de buena calidad (aprox. 70g)",
          "1 cucharadita (3ml) de aceite (opcional para la sartén)"
        ],
        prep: "Asar el chorizo en una sartén a fuego medio o en la airfryer durante 10-12 minutos hasta que esté completamente cocido y dorado de manera uniforme. En la misma sartén o plancha, calentar y dorar la arepa pequeña por ambos lados. Servir el chorizo asado caliente acompañado de la arepa.",
        macros: { weight: 150, calories: 270, protein: 12, carbs: 18, fats: 17, sugars: 1 }
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
          "1/2 taza de salsa de tomate natural casera o puré de tomate",
          "70g de arroz blanco cocido (peso en seco aprox. 50g)",
          "60g de lechuga fresca troceada",
          "40g de aguacate en cubos",
          "1 cucharadita de semillas de ajonjolí (sésamo)",
          "Zumo de limón, 1 cucharadita de aceite de oliva y sal (para el aderezo)"
        ],
        prep: "Para las albóndigas: mezclar la carne molida de res con ajo, cebolla picada fina, una pizca de sal y un toque de pan rallado o huevo para compactar; formar bolitas pequeñas y cocinarlas directamente en una sartén con la salsa de tomate natural a fuego medio-bajo durante 15-20 minutos hasta que estén bien cocidas por dentro. Para el complemento: cocinar el arroz blanco de forma tradicional hasta que quede suelto. Para la ensalada: combinar la lechuga fresca con los cubos de aguacate, aderezar con aceite de oliva, zumo de limón y sal, y espolvorear por encima las semillas de ajonjolí. Servir las albóndigas de res en salsa acompañadas del arroz blanco suelto y la ensalada fresca de ajonjolí.",
        macros: { weight: 460, calories: 510, protein: 36, carbs: 46, fats: 20, sugars: 6 }
      },
      {
        id: "d13-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cookie",
        name: "Tostadas de Arroz con Arequipe Light y Té/Café",
        ingredients: [
          "2 tostadas de arroz inflado",
          "2 cucharaditas (aprox. 15g) de arequipe sin azúcar o light",
          "1 taza de té o café caliente sin azúcar o con edulcorante al gusto"
        ],
        prep: "Untar la capa ligera de arequipe sin azúcar de manera uniforme sobre la superficie de cada tostada de arroz. Acompañar con la taza de té o café caliente recién preparado.",
        macros: { weight: 90, calories: 130, protein: 3, carbs: 24, fats: 2, sugars: 4 }
      },
      {
        id: "d13-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Crema de Verduras con Tostadas",
        ingredients: [
          "1 pocillo pequeño (aprox. 180ml) de crema de verduras casera sencilla (a base de ahuyama, zanahoria, calabacín o papa)",
          "2 tostadas de pan integral o blanco"
        ],
        prep: "Calentar la crema de verduras casera en una olla a fuego medio hasta que alcance la temperatura deseada. Servir en un tazón hondo acompañada de las dos tostadas de pan para sumergir o comer a un lado.",
        macros: { weight: 220, calories: 170, protein: 5, carbs: 28, fats: 4, sugars: 4 }
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
        name: "Pechuga Gratinada con Papa Criolla y Ensalada Caprese",
        ingredients: [
          "140g de pechuga de pollo en filete",
          "1 tajada de jamón y 1 tajada de queso que funda (sabanela o mozzarella)",
          "1 cucharadita (5ml) de aceite, sal, pimienta y orégano",
          "100g de papa criolla pequeña",
          "80g de tomate maduro en rodajas",
          "Zumo de limón, 1 cucharadita de aceite de oliva y sal (para la ensalada Caprese)"
        ],
        prep: "Para la pechuga: sazonar el filete de pechuga con sal y pimienta; colocar en una bandeja de horno o sartén, cubrir con la tajada de jamón y coronar con la tajada de queso, llevando al horno o gratinador hasta que el queso funda y dore ligeramente. Para la papa criolla: lavar las papas criollas, agregar un toque de aceite y sal, y dorar en la airfryer a 200°C durante 15-18 minutos hasta que estén crujientes por fuera y suaves por dentro. Para la ensalada: acomodar las rodajas de tomate maduro, espolvorear orégano, sal, aceite de oliva y un toque de zumo de limón. Servir la pechuga gratinada acompañada de la papa criolla de airfryer y la ensalada Caprese.",
        macros: { weight: 450, calories: 530, protein: 44, carbs: 36, fats: 22, sugars: 3 }
      },
      {
        id: "d14-m5",
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
        id: "d14-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich de Huevo Revuelto con Guiso",
        ingredients: [
          "2 rebanadas de pan tajado",
          "1 huevo mediano",
          "2 cucharadas de cebolla y tomate picados finamente (para el guiso)",
          "1 cucharadita (3ml) de aceite, sal y pimienta"
        ],
        prep: "En una sartén con un toque de aceite, sofreír la cebolla y el tomate hasta formar un guiso base. Agregar el huevo batido con sal y pimienta, revolviendo constantemente hasta obtener un huevo perico jugoso bien integrado con el guiso. Armar el sándwich colocando el huevo perico caliente entre las dos rebanadas de pan tajado (opcionalmente dorar a la plancha). Servir de inmediato.",
        macros: { weight: 160, calories: 210, protein: 10, carbs: 22, fats: 9, sugars: 3 }
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
        name: "Arepa con Huevos Pericos y Aguapanela con Leche",
        ingredients: [
          "1 arepa mediana de maíz (aprox. 70g)",
          "2 huevos medianos",
          "2 cucharadas de cebolla y tomate picados finamente (para el guiso)",
          "1 cucharadita (3ml) de aceite o mantequilla para la sartén",
          "1 pizca de sal y pimienta",
          "150ml de aguapanela caliente sola y 50ml de leche"
        ],
        prep: "Asar la arepa en una plancha o sartén por ambos lados hasta que esté caliente. En una sartén con un toque de aceite, sofreír la cebolla y el tomate hasta formar un guiso base, añadir los huevos batidos con sal y pimienta, revolviendo constantemente hasta obtener unos huevos pericos jugosos. Preparar la aguapanela caliente y agregar un chorrito de leche. Servir los huevos revueltos con guiso sobre o al lado de la arepa caliente, acompañados de la aguapanela con leche.",
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
        name: "Sancocho Trifásico de Pollo y Carne con Arroz",
        ingredients: [
          "80g de pechuga o pierna de pollo y 60g de carne de res en trozos (para el caldo)",
          "1 trozo pequeño de papa criolla o sabanera, 1 trozo de yuca y 1 rodaja de plátano verde",
          "Cebolla, ajo, cilantro, comino y sal al gusto",
          "70g de arroz blanco cocido (peso en seco aprox. 50g)",
          "50g de tomate, cebolla y cilantro finamente picados con zumo de limón y sal (para el pico de gallo)"
        ],
        prep: "Para el sancocho: en una olla con agua y sofrito de cebolla/ajo, cocinar las carnes de pollo y res junto con los trozos de papa, yuca y plátano verde a fuego medio hasta que todo esté blando y el caldo tome consistencia; sazonar con cilantro fresco al final. Para el complemento: cocinar el arroz blanco de manera tradicional hasta que quede suelto. Para la ensalada: mezclar el tomate, la cebolla y el cilantro picados con limón y sal para formar el pico de gallo fresco. Servir el sancocho trifásico bien caliente acompañado del plato de arroz blanco y el pico de gallo.",
        macros: { weight: 550, calories: 610, protein: 42, carbs: 68, fats: 18, sugars: 4 }
      },
      {
        id: "d15-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-box-seam-fill",
        name: "Crispetas Caseras Bajas en Grasa",
        ingredients: [
          "40g de maíz pira (crispetas)",
          "1 cucharadita (3ml) de aceite de maíz o coco y sal al gusto"
        ],
        prep: "Colocar el maíz pira en una olla con la cucharadita de aceite (o preparar en airfryer con accesorio apto sin exceso de grasa), tapar y cocinar a fuego medio hasta que exploten la mayoría de los granos. Retirar del fuego, pasar a un recipiente y agregar una pizca de sal al gusto. Consumir tibias o frías.",
        macros: { weight: 40, calories: 120, protein: 3, carbs: 22, fats: 3, sugars: 0 }
      },
      {
        id: "d15-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Tortilla de Maíz con Lechuga, Tomate y Queso",
        ingredients: [
          "1 tortilla de maíz mediana",
          "30g de lechuga fresca en julianas",
          "40g de tomate maduro en rodajas",
          "40g de queso campesino desmenuzado o en cubos pequeños",
          "1 pizca de sal y orégano"
        ],
        prep: "Calentar la tortilla de maíz en una sartén o plancha durante un minuto por cada lado hasta que esté flexible. Rellenar la tortilla con la lechuga fresca, las rodajas de tomate y el queso campesino; sazonar con una pizca de sal y orégano al gusto. Doblar o enrollar y servir de inmediato.",
        macros: { weight: 140, calories: 180, protein: 8, carbs: 18, fats: 8, sugars: 2 }
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
          "1 huevo mediano",
          "1 taza (aprox. 40g) de cereal de maíz o integral",
          "200ml de leche descremada o entera"
        ],
        prep: "Colocar el huevo en una olla con agua hirviendo y cocinar durante 9-10 minutos para obtener un huevo duro cocido; retirar, enfriar, pelar y reservar. En un tazón hondo, servir el cereal acompañado de la leche fría o tibia. Consumir el huevo cocido junto con el cereal con leche.",
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
        name: "Frijoles Antioqueños con Chicharrón Ligero o Carne en Polvo",
        ingredients: [
          "120g de frijoles cargamanto cocidos con guiso tradicional",
          "60g de chicharrón magro (preparado en airfryer) o 80g de carne en polvo",
          "70g de arroz blanco cocido (peso en seco aprox. 50g)",
          "1 arepa pequeña de maíz (aprox. 50g)",
          "60g de lechuga fresca, 50g de tomate en rodajas y 30g de aguacate",
          "Zumo de limón, 1 cucharadita de aceite de oliva y sal (para la ensalada)"
        ],
        prep: "Para los frijoles: calentar los frijoles antioqueños previamente cocinados con su hogao. Para la proteína: si se usa chicharrón, cocinar en la airfryer a 200°C hasta que esté crujiente y sin exceso de grasa; si es carne en polvo, saltear la carne molida sazonada hasta dorar. Para el complemento: cocinar el arroz blanco suelto y asar la arepa pequeña. Para la ensalada: combinar la lechuga, el tomate y el aguacate, aderezando con aceite de oliva, zumo de limón y sal. Servir los frijoles acompañados de arroz blanco, la arepa, la proteína elegida y la ensalada fresca.",
        macros: { weight: 530, calories: 640, protein: 38, carbs: 70, fats: 22, sugars: 4 }
      },
      {
        id: "d16-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-nut",
        name: "Mix de Frutos Secos",
        ingredients: [
          "40g de mix de frutos secos (maní sin sal, almendras y uvas pasas)"
        ],
        prep: "Porcionar los frutos secos en un recipiente limpio. Consumir frutos secos al natural.",
        macros: { weight: 40, calories: 180, protein: 6, carbs: 14, fats: 12, sugars: 6 }
      },
      {
        id: "d16-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa con Queso a la Plancha",
        ingredients: [
          "1 arepa mediana de maíz (aprox. 70g)",
          "50g de queso cuajada fresco o queso campesino",
          "1 cucharadita (3ml) de aceite o mantequilla ligera para la plancha"
        ],
        prep: "Calentar una plancha o sartén a fuego medio con un toque de aceite o mantequilla. Asar la arepa de maíz por ambos lados y colocar el queso cuajada o campesino encima de la arepa para que se gratine suavemente con el calor de la plancha. Servir caliente.",
        macros: { weight: 140, calories: 220, protein: 10, carbs: 24, fats: 9, sugars: 1 }
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
        name: "Sándwich de Huevos Revueltos con Queso y Café con Leche",
        ingredients: [
          "2 rebanadas de pan tajado (integral o blanco)",
          "2 huevos medianos",
          "1 tajada de queso que funda (sabanela o mozzarella)",
          "1 cucharadita (3ml) de aceite o mantequilla ligera para la sartén",
          "1 pizca de sal y pimienta",
          "150ml de leche descremada o entera",
          "1 cucharadita de café instantáneo o 1 espresso"
        ],
        prep: "En una sartén antiadherente con un toque de aceite o mantequilla, preparar los huevos revueltos a fuego medio con una pizca de sal y pimienta hasta que estén jugosos. Tostar ligeramente las rebanadas de pan y colocar la tajada de queso sobre el pan caliente para que funda un poco, luego añadir los huevos revueltos para armar el sándwich. Aparte, calentar la leche y disolver el café. Servir el sándwich acompañado del café con leche caliente.",
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
        name: "Pollo en Cubos con Pimentón y Moneditas de Plátano Verde",
        ingredients: [
          "130g de pechuga de pollo cortada en cubos",
          "1/2 pimentón rojo o verde en tiras y 2 cucharadas de cebolla picada",
          "1 cucharadita (5ml) de aceite, ajo, comino, sal y pimienta",
          "80g de zanahoria rallada o en rodajas delgadas y 1 cucharadita de maní dulce picado",
          "100g de plátano verde"
        ],
        prep: "Para el pollo: saltear los cubos de pechuga de pollo en una sartén con una cucharadita de aceite, cebolla y las tiras de pimentón hasta que el pollo esté bien cocido y doradito; sazonar con ajo, comino, sal y pimienta. Para las moneditas: cortar el plátano verde en rodajas delgadas, rociar un toque de aceite y sal, y llevar a la airfryer a 190°C durante 12-15 minutos hasta que estén crunchy. Para la ensalada: saltear ligeramente la zanahoria y mezclarla con el maní dulce picado. Servir el pollo salteado con pimentón acompañado de las moneditas de plátano verde y la ensalada de zanahoria.",
        macros: { weight: 440, calories: 490, protein: 42, carbs: 45, fats: 14, sugars: 7 }
      },
      {
        id: "d17-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Yogur Griego con Avena",
        ingredients: [
          "1 taza (aprox. 150g) de yogur griego natural o bajo en grasa",
          "1 cucharada (aprox. 15g) de hojuelas de avena tradicional o instantánea"
        ],
        prep: "Servir el yogur griego en un tazón y añadir la cucharada de avena por encima. Mezclar bien los ingredientes antes de consumir.",
        macros: { weight: 170, calories: 150, protein: 14, carbs: 16, fats: 3, sugars: 8 }
      },
      {
        id: "d17-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa Pequeña con Chorizo Picado",
        ingredients: [
          "1 arepa pequeña de maíz (aprox. 50g)",
          "60g de chorizo de buena calidad",
          "1 cucharadita de salsa de la casa (opcional: hogao ligero o salsa de tomate natural)"
        ],
        prep: "Picar el chorizo en rodajas o trozos pequeños y cocinar en una sartén o airfryer hasta que esté completamente dorado y cocido. Calentar la arepa pequeña en la plancha. Servir la arepa acompañada del chorizo picado por encima y coronar con un hilo de la salsa de la casa.",
        macros: { weight: 160, calories: 280, protein: 13, carbs: 20, fats: 17, sugars: 2 }
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
          "2 huevos medianos",
          "1 pizca de sal y pimienta",
          "1 arepa mediana de maíz (aprox. 70g)",
          "200ml de aguapanela caliente pura (sin leche)"
        ],
        prep: "Colocar los huevos en agua hirviendo durante 9-10 minutos para obtener huevos duros; retirar, enfriar, pelar y cortar en rodajas. Calentar la arepa en la plancha. Sazonar las rodajas de huevo con sal y pimienta y servirlas sobre o al lado de la arepa caliente. Acompañar con la aguapanela pura caliente.",
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
        name: "Sardinas Guisadas con Pasta Tornillos y Ensalada de Maíz",
        ingredients: [
          "1 lata (aprox. 120g) de sardinas en aceite o tomate",
          "1/2 taza de tomate picado, 2 cucharadas de cebolla y 1 pizca de orégano",
          "70g de pasta en forma de tornillos o conchas (peso en seco aprox. 50g)",
          "60g de lechuga fresca, 30g de aguacate en cubos y 30g de maíz tierno cocido",
          "Zumo de limón, 1 cucharadita de aceite de oliva y sal"
        ],
        prep: "Para la pasta: cocinar los tornillos en agua hirviendo con sal hasta que estén al dente, luego escurrir. Para las sardinas: en una sartén, sofreír el tomate y la cebolla, añadir las sardinas y el orégano, dejando guisar a fuego bajo durante unos minutos para integrar los sabores. Para la ensalada: mezclar la lechuga picada, el aguacate y el maíz tierno, aderezando con limón, aceite de oliva y sal. Servir las sardinas guisadas sobre la pasta de tornillos caliente y acompañar con la ensalada de maíz y aguacate.",
        macros: { weight: 450, calories: 480, protein: 37, carbs: 50, fats: 15, sugars: 5 }
      },
      {
        id: "d18-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-circle",
        name: "Huevo Duro sobre Tostada de Arroz",
        ingredients: [
          "1 huevo duro previamente cocido",
          "1 pizca de sal y pimienta",
          "1 tortita o tostada de arroz inflado"
        ],
        prep: "Picar o machacar ligeramente el huevo duro y sazonar con una pizca de sal y pimienta. Colocar el huevo picado por encima de la tostada de arroz inflado. Consumir de inmediato.",
        macros: { weight: 85, calories: 110, protein: 7, carbs: 8, fats: 5, sugars: 0 }
      },
      {
        id: "d18-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich de Jamón, Queso y Lechuga",
        ingredients: [
          "2 rebanadas de pan tajado (integral o blanco)",
          "1 tajada de jamón de cerdo o pollo de buena calidad",
          "1 tajada de queso semi-maduro o mozzarella",
          "20g de hojas de lechuga fresca"
        ],
        prep: "Tostar ligeramente las rebanadas de pan si se prefiere crujiente. Colocar la tajada de queso, el jamón y las hojas de lechuga fresca entre las dos rebanadas de pan para armar el sándwich. Cortar a la mitad y servir.",
        macros: { weight: 150, calories: 210, protein: 11, carbs: 22, fats: 8, sugars: 2 }
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
          "1 huevo medianos",
          "1 arepa mediana de maíz (aprox. 70g)",
          "1 cucharadita (3ml) de aceite para la sartén",
          "200ml de leche y 1 pastilla de chocolate de mesa (sin azúcar o tradicional)"
        ],
        prep: "En una sartén con un toque de aceite, dorar el queso a la plancha por ambos lados hasta que forme costra y freír el huevo al punto deseado. Calentar la arepa y colocar encima el queso a la plancha y el huevo frito. Aparte, preparar el chocolate caliente disolviendo la pastilla en la leche caliente. Servir la arepa con los complementos y acompañar con el chocolate.",
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
        name: "Tortas de Carne de Res con Arroz de Coco y Ensalada de Pepino",
        ingredients: [
          "130g de carne de res molida magra",
          "Cebolla, ajo, comino, sal y pimienta (para sazonar la carne)",
          "70g de arroz blanco cocido (peso en seco aprox. 50g) y 2 cucharadas de leche de coco",
          "80g de pepino cohombro en rodajas delgadas",
          "1 cucharadita de vinagre de manzana, una pizca de eneldo seco y sal"
        ],
        prep: "Para las tortas: mezclar la carne molida con cebolla picada, ajo, comino, sal y pimienta, formar las tortas y asar a la plancha hasta que estén bien cocidas. Para el arroz: cocinar el arroz añadiendo un toque de leche de coco para darle sabor. Para la ensalada: marinar las rodajas de pepino con el vinagre de manzana, la sal y el eneldo. Servir las tortas de carne caseras acompañadas del arroz de coco y la ensalada de pepino aderezada.",
        macros: { weight: 460, calories: 540, protein: 38, carbs: 48, fats: 21, sugars: 8 }
      },
      {
        id: "d19-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-snow",
        name: "Banano Helado",
        ingredients: [
          "1 banano maduro mediano"
        ],
        prep: "Pelar el banano, cortarlo en rodajas, colocar en un recipiente y llevar al congelador durante al menos 2 horas hasta que esté firme. Consumir en rodajas congeladas.",
        macros: { weight: 120, calories: 105, protein: 1, carbs: 27, fats: 0, sugars: 14 }
      },
      {
        id: "d19-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Wrap Ligero de Queso y Tomate",
        ingredients: [
          "1 tortilla de trigo ligera o wrap integral",
          "50g de tomate maduro en rodajas",
          "40g de queso laminado (sabanela o mozzarella)"
        ],
        prep: "Calentar la tortilla en una sartén seca durante unos segundos por lado para que ablande. Colocar las rodajas de tomate y el queso laminado sobre la tortilla, envolver firmemente en forma de burrito o rollo y calentar un minuto más en la sartén para fundir el queso. Servir caliente.",
        macros: { weight: 140, calories: 190, protein: 8, carbs: 20, fats: 8, sugars: 2 }
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
        name: "Huevos Pericos con Arepa y Café con Leche",
        ingredients: [
          "2 huevos medianos",
          "2 cucharadas de tomate y cebolla picados (para el hogao)",
          "1 arepa mediana de maíz (aprox. 70g)",
          "1 cucharadita (3ml) de aceite para la sartén",
          "150ml de leche descremada o entera",
          "1 cucharadita de café instantáneo o 1 espresso"
        ],
        prep: "En una sartén con un toque de aceite, sofría el tomate y la cebolla picados hasta que estén bien cocidos, luego agregue los huevos y revuelva hasta obtener unos huevos pericos jugosos. Aparte, caliente la arepa en la plancha y prepare el café con leche caliente mezclando la leche y el café. Sirva los huevos pericos acompañados de la arepa asada y el café con leche.",
        macros: { weight: 310, calories: 350, protein: 17, carbs: 38, fats: 14, sugars: 8 }
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
        name: "Pechuga a la Plancha con Puré de Papa y Ensalada Mixta",
        ingredients: [
          "130g de pechuga de pollo marinada con ajo, sal, pimienta y hierbas",
          "100g de papa criolla o pastusa para el puré con un toque de mantequilla ligera",
          "60g de lechuga fresca, 40g de tomate en rodajas y 20g de maíz tierno",
          "1 cucharadita de aceite de oliva y zumo de limón para el aderezo"
        ],
        prep: "Para la pechuga: cocinar la pechuga de pollo en una plancha caliente con un toque de aceite hasta que esté dorada y bien jugosa por dentro. Para el puré: cocinar las papas en agua con sal hasta que estén suaves, luego machacar y mezclar con un toque de mantequilla ligera. Para la ensalada: combinar la lechuga, el tomate y el maíz tierno, aderezando con aceite de oliva y zumo de limón. Servir la pechuga a la plancha acompañada del puré de papa y la ensalada mixta fresca.",
        macros: { weight: 430, calories: 460, protein: 41, carbs: 42, fats: 12, sugars: 4 }
      },
      {
        id: "d20-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cookie",
        name: "Tostadas de Arroz con Arequipe Light",
        ingredients: [
          "2 tortitas o tostadas de arroz inflado",
          "2 cucharaditas (aprox. 15g) de arequipe light o tradicional"
        ],
        prep: "Untar uniformemente el arequipe sobre la superficie de las tostadas de arroz. Servir inmediatamente.",
        macros: { weight: 90, calories: 130, protein: 3, carbs: 24, fats: 2, sugars: 4 }
      },
      {
        id: "d20-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa con Queso y Aromática",
        ingredients: [
          "1 arepa mediana de maíz (aprox. 70g)",
          "40g de queso campesino fresco",
          "250ml de agua e infusión de hierbas (aromática de manzanilla, cidrón o limoncillo sin azúcar)"
        ],
        prep: "Calentar una plancha y asar la arepa de maíz hasta que esté dorada por ambos lados, colocar el queso campesino encima de la arepa caliente para que se funda ligeramente. Aparte, calentar agua y preparar la infusión de aromática al gusto. Servir la arepa con queso acompañada de la aromática caliente.",
        macros: { weight: 170, calories: 220, protein: 9, carbs: 26, fats: 8, sugars: 1 }
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
        name: "Huevos Revueltos con Tostadas y Chocolate con Leche",
        ingredients: [
          "2 huevos medianos",
          "2 rebanadas de pan tajado (para tostar)",
          "1 cucharadita (3ml) de aceite o mantequilla ligera para la sartén",
          "1 pizca de sal y pimienta",
          "200ml de leche y 1 pastilla de chocolate de mesa"
        ],
        prep: "En una sartén antiadherente con un toque de aceite o mantequilla, preparar los huevos revueltos a fuego medio con una pizca de sal y pimienta hasta obtener el punto deseado. Tostar las rebanadas de pan. Aparte, preparar el chocolate caliente disolviendo la pastilla en la leche caliente. Servir los huevos revueltos acompañados de las tostadas crujientes y el chocolate con leche.",
        macros: { weight: 310, calories: 370, protein: 17, carbs: 36, fats: 17, sugars: 14 }
      },
      {
        id: "d21-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Papaya",
        ingredients: [
          "1 taza de papaya madura picada en cubos (aprox. 150g)"
        ],
        prep: "Pelar la papaya, retirar las semillas y picar en cubos medianos. Consumir fresca.",
        macros: { weight: 150, calories: 60, protein: 1, carbs: 15, fats: 0, sugars: 11 }
      },
      {
        id: "d21-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Carne Molida con Arroz, Frijoles y Ensalada de Aguacate",
        ingredients: [
          "130g de carne molida de res sazonada con cebolla, ajo, comino y sal",
          "70g de arroz blanco cocido (peso en seco aprox. 50g)",
          "100g de frijoles cocidos con su guiso tradicional",
          "60g de lechuga fresca, 40g de tomate en rodajas y 35g de aguacate",
          "Zumo de limón, 1 cucharadita de aceite de oliva y sal para la ensalada"
        ],
        prep: "Para la carne: sofreír la carne molida con cebolla, ajo y especias en una sartén hasta que esté bien cocida y doradita. Para los acompañamientos: servir el arroz blanco suelto y calentar la porción de frijoles. Para la ensalada: combinar la lechuga, el tomate y el aguacate en rodajas, aderezando con aceite de oliva, zumo de limón y sal. Servir la carne molida acompañada del arroz, la cazuela de frijoles y la ensalada de aguacate fresca.",
        macros: { weight: 510, calories: 610, protein: 37, carbs: 70, fats: 19, sugars: 6 }
      },
      {
        id: "d21-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-nut",
        name: "Mix de Frutos Secos",
        ingredients: [
          "40g de mix de frutos secos (maní sin sal, almendras y uvas pasas)"
        ],
        prep: "Porcionar los frutos secos en un recipiente limpio. Consumir al natural.",
        macros: { weight: 40, calories: 180, protein: 6, carbs: 14, fats: 12, sugars: 6 }
      },
      {
        id: "d21-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich de Queso y Jamón Caliente",
        ingredients: [
          "2 rebanadas de pan tajado",
          "1 tajada de queso que funda (sabanela o mozzarella)",
          "1 tajada de jamón de cerdo o pollo de buena calidad",
          "1 cucharadita de mantequilla ligera para dorar"
        ],
        prep: "Armar el sándwich colocando el queso y el jamón entre las dos rebanadas de pan. Untar un toque de mantequilla ligera por el exterior del pan y dorar en una sartén a fuego medio por ambos lados hasta que el queso esté completamente fundido y el pan crujiente. Servir caliente.",
        macros: { weight: 150, calories: 230, protein: 12, carbs: 22, fats: 10, sugars: 2 }
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
        name: "Omelette de Queso y Espinaca con Galletas Ducales",
        ingredients: [
          "2 huevos medianos",
          "30g de queso que funda (sabanela o mozzarella) en cubitos o rallado",
          "20g de espinaca fresca picada",
          "1 cucharadita (3ml) de aceite o mantequilla ligera para la sartén",
          "2 galletas Ducales tradicionales",
          "150ml de leche descremada o entera y 1 cucharadita de café instantáneo o espresso"
        ],
        prep: "Batir los huevos en un recipiente con una pizca de sal, incorporar la espinaca picada y el queso. En una sartén antiadherente con un toque de aceite o mantequilla, verter la mezcla y cocinar a fuego medio-bajo doblando en forma de omelette hasta que esté cocido y el queso fundido. Aparte, calentar la leche y mezclar con el café. Servir el omelette caliente acompañado de las galletas Ducales y el café con leche.",
        macros: { weight: 280, calories: 350, protein: 18, carbs: 26, fats: 18, sugars: 8 }
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
        name: "Lomo de Cerdo con Patacones y Ensalada Dulce",
        ingredients: [
          "130g de lomo de cerdo magro en filete",
          "100g de plátano verde (para los patacones)",
          "60g de lechuga fresca, 35g de maíz tierno y 40g de piña en cubos",
          "1 cucharadita de aceite de oliva, zumo de limón y sal (para el aderezo)"
        ],
        prep: "Para el cerdo: sazonar el filete de lomo de cerdo con ajo, sal y pimienta, y asar a la plancha con un toque de aceite hasta que esté bien cocido y jugoso. Para los patacones: cortar el plátano verde en trozos, freír u hornear ligeramente, aplastar y dorar para obtener patacones crujientes. Para la ensalada: combinar la lechuga, el maíz tierno y los cubos de piña, aderezando con aceite de oliva, zumo de limón y una pizca de sal. Servir el lomo de cerdo acompañado de los patacones y la ensalada dulce.",
        macros: { weight: 460, calories: 510, protein: 39, carbs: 46, fats: 17, sugars: 8 }
      },
      {
        id: "d22-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Yogur Griego con Avena",
        ingredients: [
          "1 taza (aprox. 150g) de yogur griego natural o bajo en grasa",
          "1 cucharada (aprox. 15g) de hojuelas de avena tradicional"
        ],
        prep: "Servir el yogur griego en un tazón, añadir la avena por encima y mezclar bien antes de consumir.",
        macros: { weight: 170, calories: 150, protein: 14, carbs: 16, fats: 3, sugars: 8 }
      },
      {
        id: "d22-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa con Huevo Duro Picado Encima",
        ingredients: [
          "1 arepa mediana de maíz (aprox. 70g)",
          "1 huevo mediano",
          "1 pizca de sal, pimienta y un toque de mantequilla ligera o hogao (opcional)"
        ],
        prep: "Cocinar el huevo en agua hirviendo durante 9-10 minutos para obtener un huevo duro; retirar, enfriar, pelar y picar finamente. Calentar la arepa en la plancha hasta que esté dorada. Sazonar el huevo duro picado con sal y pimienta y colocarlo generosamente encima de la arepa caliente. Servir de inmediato.",
        macros: { weight: 150, calories: 210, protein: 10, carbs: 22, fats: 8, sugars: 1 }
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
        name: "Huevos Cocidos con Arepa y Aguapanela con Leche",
        ingredients: [
          "2 huevos medianos",
          "1 pizca de sal y pimienta",
          "1 arepa mediana de maíz (aprox. 70g)",
          "150ml de aguapanela caliente pura y 50ml de leche"
        ],
        prep: "Colocar los huevos en agua hirviendo durante 9-10 minutos para obtener huevos duros; retirar, enfriar, pelar y cortar al gusto. Calentar la arepa en la plancha hasta que esté dorada. Aparte, preparar la aguapanela caliente y agregar un toque de leche al gusto. Servir los huevos cocidos junto con la arepa asada y acompañar con la aguapanela con leche.",
        macros: { weight: 320, calories: 370, protein: 18, carbs: 42, fats: 13, sugars: 12 }
      },
      {
        id: "d23-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Piña",
        ingredients: [
          "1 taza de piña fresca madura cortada en cubos (aprox. 150g)"
        ],
        prep: "Pelar la piña fresca, retirar el centro duro y cortar en cubos limpios. Consumir la piña fresca.",
        macros: { weight: 150, calories: 75, protein: 1, carbs: 19, fats: 0, sugars: 14 }
      },
      {
        id: "d23-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Atún Salteado con Hogao, Arroz y Ensalada de Pepino",
        ingredients: [
          "1 lata (aprox. 120g) de atún en agua, escurrido",
          "3 cucharadas de tomate y cebolla picados (para el hogao)",
          "70g de arroz blanco cocido (peso en seco aprox. 50g)",
          "70g de pepino cohombro en rodajas y 30g de tomate en cubos",
          "Zumo de limón, 1 cucharadita de aceite de oliva y sal para la ensalada"
        ],
        prep: "Para el atún: en una sartén con un toque de aceite, sofreír el tomate y la cebolla hasta armar un hogao ligero, incorporar el atún escurrido y saltear durante un par de minutos para integrar sabores. Para el complemento: servir el arroz blanco suelto y caliente. Para la ensalada: mezclar el pepino en rodajas y el tomate, aderezando con zumo de limón, aceite de oliva y sal. Servir el atún salteado con hogao sobre o al lado del arroz blanco y acompañar con la ensalada fresca.",
        macros: { weight: 420, calories: 450, protein: 35, carbs: 52, fats: 10, sugars: 4 }
      },
      {
        id: "d23-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-box-seam-fill",
        name: "Crispetas Caseras Bajas en Grasa",
        ingredients: [
          "30g de maíz pira (crispetas)",
          "1 cucharadita (3ml) de aceite vegetal o de coco y una pizca de sal"
        ],
        prep: "Preparar las crispetas en una olla tapada con la cucharadita de aceite y fuego medio hasta que exploten, procurando usar poca sal y mínimo aceite. Servir en un tazón.",
        macros: { weight: 40, calories: 120, protein: 3, carbs: 22, fats: 3, sugars: 0 }
      },
      {
        id: "d23-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Tortilla de Maíz con Jamón y Queso",
        ingredients: [
          "1 tortilla de maíz o wrap pequeño",
          "1 tajada de jamón de cerdo o pollo",
          "1 tajada de queso que funda (sabanela o mozzarella)"
        ],
        prep: "Calentar la tortilla de maíz en una sartén a fuego medio. Colocar la tajada de jamón y la tajada de queso dentro de la tortilla, doblar o enrollar y calentar durante 1-2 minutos por lado hasta que el queso se funda por completo y la tortilla esté ligeramente tostada. Servir caliente.",
        macros: { weight: 130, calories: 210, protein: 12, carbs: 16, fats: 10, sugars: 1 }
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
        name: "Sándwich de Huevo con Queso y Café con Leche",
        ingredients: [
          "2 rebanadas de pan tajado",
          "1 huevo medianos",
          "1 tajada de queso que funda (sabanela o mozzarella)",
          "1 cucharadita (3ml) de aceite o mantequilla ligera",
          "150ml de leche descremada o entera y 1 cucharadita de café instantáneo o espresso"
        ],
        prep: "Preparar el huevo en sartén a la plancha o revuelto con una pizca de sal. Armar el sándwich colocando el pan, el huevo y la tajada de queso; opcionalmente dorar en la sartén para fundir el queso. Aparte, calentar la leche y mezclar con el café. Acompañar el sándwich con el café con leche.",
        macros: { weight: 300, calories: 360, protein: 17, carbs: 32, fats: 16, sugars: 8 }
      },
      {
        id: "d24-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Banano Fresco",
        ingredients: [
          "1 banano maduro mediano (aprox. 120g con cáscara)"
        ],
        prep: "Retirar la cáscara del banano fresco. Consumir el banano fresco al natural.",
        macros: { weight: 120, calories: 105, protein: 1, carbs: 27, fats: 0, sugars: 14 }
      },
      {
        id: "d24-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Pollo al Horno con Yuca y Ensalada de Zanahoria",
        ingredients: [
          "130g de muslo o pechuga de pollo",
          "100g de yuca fresca",
          "60g de zanahoria rallada, 40g de manzana en cubitos y 1 cucharada de mayonesa light",
          "Especias al gusto (paprika, ajo en polvo, sal y pimienta) y 1 cucharadita de aceite"
        ],
        prep: "Para el pollo: sazonar la pieza de pollo con especias y llevar al horno o airfryer a 190°C por 20-25 minutos hasta que esté dorada y bien cocida. Para la yuca: cocinar los trozos de yuca en agua con sal hasta que estén blandos (o dorar ligeramente si se prefiere). Para la ensalada: mezclar la zanahoria rallada con la manzana en cubitos y la mayonesa light. Hornear el pollo sazonado y servir acompañado de la yuca cocida y la ensalada.",
        macros: { weight: 470, calories: 510, protein: 40, carbs: 48, fats: 16, sugars: 8 }
      },
      {
        id: "d24-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Gelatina Light",
        ingredients: [
          "1 taza (aprox. 150ml) de gelatina sin azúcar o light preparada previamente"
        ],
        prep: "Preparar la gelatina siguiendo las instrucciones del empaque con agua caliente y fría, refrigerar hasta que cuaje por completo. Servir fría.",
        macros: { weight: 150, calories: 20, protein: 2, carbs: 3, fats: 0, sugars: 0 }
      },
      {
        id: "d24-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa Pequeña con Queso Campesino",
        ingredients: [
          "1 arepa pequeña de maíz (aprox. 60g)",
          "40g de queso campesino fresco desmoronado o en tajada"
        ],
        prep: "Asar la arepa en una sartén o plancha a fuego medio por ambos lados hasta que esté caliente y ligeramente tostada. Servir la arepa y cubrir con el queso campesino por encima.",
        macros: { weight: 140, calories: 200, protein: 9, carbs: 24, fats: 7, sugars: 1 }
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
        name: "Huevos Pericos con Arepa de Queso y Aguapanela Sola",
        ingredients: [
          "2 huevos medianos",
          "30g de tomate picado y 20g de cebolla picada (para el hogao de los huevos pericos)",
          "1 cucharadita (3ml) de aceite o mantequilla ligera",
          "1 arepa de queso mediana (aprox. 80g)",
          "200ml de aguapanela caliente pura (sin leche)"
        ],
        prep: "Para los huevos pericos: sofreír el tomate y la cebolla picados en una sartén con un toque de aceite o mantequilla, agregar los huevos y revolver hasta cocinar al punto deseado con una pizca de sal. Calentar la arepa de queso en la plancha hasta que esté dorada. Servir los huevos pericos calientes sobre la arepa de queso y acompañar con la aguapanela caliente sola.",
        macros: { weight: 320, calories: 390, protein: 18, carbs: 42, fats: 16, sugars: 14 }
      },
      {
        id: "d25-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Kiwi Fresco",
        ingredients: [
          "1 kiwi maduro mediano (aprox. 110g)"
        ],
        prep: "Pelar cuidadosamente el kiwi fresco, retirar los extremos y cortar en rodajas uniformes. Consumir en rodajas.",
        macros: { weight: 110, calories: 50, protein: 1, carbs: 12, fats: 0, sugars: 8 }
      },
      {
        id: "d25-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Gulash de Res con Arroz y Ensalada de Lechuga",
        ingredients: [
          "130g de carne de res magra en cubos (para el gulash)",
          "40g de tomate, 30g de cebolla y pasta de tomate o pimentón para la salsa criolla",
          "70g de arroz blanco cocido (peso en seco aprox. 50g)",
          "60g de lechuga fresca y 40g de tomate en rodajas",
          "1 cucharadita de aceite de oliva, vinagre, sal y pimienta (para la vinagreta)"
        ],
        prep: "Para el gulash: cocinar los cubos de res con la salsa criolla (tomate, cebolla y especias) a fuego lento hasta que la carne esté tierna y la salsa espesa. Para el complemento: servir el arroz blanco suelto y caliente. Para la ensalada: limpiar la lechuga, agregar el tomate en rodajas y aderezar con la vinagreta de aceite de oliva, vinagre y sal. Servir el gulash de res caliente acompañado del arroz blanco y la ensalada de lechuga fresca.",
        macros: { weight: 450, calories: 520, protein: 38, carbs: 50, fats: 17, sugars: 5 }
      },
      {
        id: "d25-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-emoji-smile",
        name: "Bastones de Zanahoria con Limón y Sal",
        ingredients: [
          "1 zanahoria mediana (aprox. 120g)",
          "Zumo de medio limón fresco y una pizca de sal"
        ],
        prep: "Lavar, pelar y cortar la zanahoria en bastones firmes. Mezclar la zanahoria en bastones con el zumo de limón y una pizca de sal al gusto antes de consumir.",
        macros: { weight: 120, calories: 40, protein: 1, carbs: 9, fats: 0, sugars: 5 }
      },
      {
        id: "d25-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich de Atún con Tomate y Lechuga",
        ingredients: [
          "2 rebanadas de pan tajado",
          "1 lata pequeña (aprox. 80g) de atún en agua, escurrido",
          "40g de tomate en rodajas y 30g de hojas de lechuga fresca",
          "Unas gotas de zumo de limón y una pizca de sal y pimienta"
        ],
        prep: "Mezclar el atún escurrido con un toque de zumo de limón, sal y pimienta al gusto. Armar el sándwich colocando las rebanadas de pan, el atún preparado, las rodajas de tomate y las hojas de lechuga fresca. Opcionalmente dorar ligeramente en la sartén.",
        macros: { weight: 160, calories: 200, protein: 17, carbs: 22, fats: 4, sugars: 2 }
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
        name: "Huevos Fritos con Tostadas y Chocolate con Leche",
        ingredients: [
          "2 huevos medianos",
          "1 cucharadita (3ml) de aceite o mantequilla para la sartén",
          "2 rebanadas de pan tostado",
          "150ml de leche descremada o entera, 1 cucharadita de cacao en polvo y un toque de endulzante al gusto"
        ],
        prep: "Freír los huevos en una sartén con un toque de aceite o mantequilla al punto deseado (con pizca de sal). Aparte, preparar el chocolate caliente mezclando el cacao con la leche caliente. Servir los huevos fritos con las tostadas crujientes y acompañar con el chocolate con leche.",
        macros: { weight: 310, calories: 380, protein: 17, carbs: 36, fats: 18, sugars: 14 }
      },
      {
        id: "d26-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Taza de Fresas",
        ingredients: [
          "1 taza de fresas frescas maduras (aprox. 140g)"
        ],
        prep: "Lavar muy bien las fresas, retirar los tallos verdes y cortarlas a la mitad si se prefiere. Consumir las fresas lavadas.",
        macros: { weight: 140, calories: 45, protein: 1, carbs: 11, fats: 0, sugars: 7 }
      },
      {
        id: "d26-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Milanesa de Cerdo con Puré de Papa Criolla y Ensalada",
        ingredients: [
          "130g de filete de lomo de cerdo (empanizado ligero)",
          "100g de papa criolla",
          "60g de espinaca fresca y 30g de cebolla morada en plumas",
          "1 cucharadita de aceite de oliva, vinagre, sal y pimienta para el puré y la ensalada"
        ],
        prep: "Para la milanesa: pasar el filete de cerdo por huevo y miga de pan ligera, luego hornear a 190°C hasta que esté dorada y crujiente. Para el puré: cocinar las papas criollas en agua con sal hasta que estén blandas y hacer un puré suave con un toque de mantequilla o leche. Para la ensalada: mezclar la espinaca y la cebolla, aderezando con aceite de oliva y vinagre. Hornear la milanesa de cerdo y acompañar con el puré de papa criolla y la ensalada de espinaca.",
        macros: { weight: 450, calories: 500, protein: 36, carbs: 44, fats: 18, sugars: 4 }
      },
      {
        id: "d26-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-circle",
        name: "Huevo Duro sobre Tostada de Arroz",
        ingredients: [
          "1 huevo medianos",
          "1 tostada o galleta de arroz inflado",
          "Una pizca de sal, pimienta y opcionalmente un toque de yogur griego o queso crema light"
        ],
        prep: "Cocinar el huevo en agua hirviendo durante 9-10 minutos, retirar, enfriar, pelar y picar finamente. Colocar el huevo duro picado sobre la tostada de arroz, sazonando con sal y pimienta al gusto.",
        macros: { weight: 85, calories: 110, protein: 7, carbs: 8, fats: 5, sugars: 0 }
      },
      {
        id: "d26-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa Pequeña con Queso a la Plancha",
        ingredients: [
          "1 arepa pequeña de maíz (aprox. 60g)",
          "40g de queso campesino o doble crema en tajada"
        ],
        prep: "Colocar la arepa y la tajada de queso campesino juntas en la plancha o sartén a fuego medio, asando hasta que la arepa esté dorada y el queso adquiera una textura fundida y dorada en los bordes. Asar la arepa y el queso juntos y servir calientes.",
        macros: { weight: 140, calories: 220, protein: 10, carbs: 24, fats: 9, sugars: 1 }
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
        name: "Huevos Revueltos con Maicitos, Arepa y Café con Leche",
        ingredients: [
          "2 huevos medianos",
          "30g de maíz tierno (maicitos)",
          "1 cucharadita (3ml) de aceite o mantequilla ligera para la sartén",
          "1 arepa mediana de maíz (aprox. 70g)",
          "150ml de leche descremada o entera y 1 cucharadita de café instantáneo o espresso"
        ],
        prep: "Batir los huevos en un recipiente con una pizca de sal, incorporar los maicitos dulces. En una sartén con un toque de aceite o mantequilla, verter la mezcla y revolver a fuego medio hasta cocinar los huevos al punto deseado. Calentar la arepa en la plancha hasta que esté dorada. Aparte, calentar la leche y mezclar con el café. Servir los huevos revueltos con maíz acompañados de la arepa asada y el café con leche.",
        macros: { weight: 310, calories: 360, protein: 16, carbs: 42, fats: 14, sugars: 8 }
      },
      {
        id: "d27-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Mandarina o Naranja",
        ingredients: [
          "1 mandarina fresca mediana (aprox. 130g)"
        ],
        prep: "Pelar cuidadosamente la mandarina, retirar los hilos blancos y separar los gajos. Pelar y consumir la fruta.",
        macros: { weight: 130, calories: 50, protein: 1, carbs: 12, fats: 0, sugars: 9 }
      },
      {
        id: "d27-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Pechuga a la Plancha con Patacones y Guacamole",
        ingredients: [
          "130g de filete de pechuga de pollo",
          "100g de plátano verde (para los patacones)",
          "50g de aguacate maduro, 20g de tomate picado, 10g de cebolla, zumo de limón y sal (para el guacamole)",
          "1 cucharadita de aceite, sal, pimienta y ajo en polvo para el pollo"
        ],
        prep: "Para el pollo: sazonar la pechuga con sal, pimienta y ajo, y asar a la plancha con un toque de aceite hasta que esté jugosa y bien cocida. Para los patacones: cortar el plátano verde, freír u hornear ligeramente, aplastar y dorar para obtener patacones crujientes. Para el guacamole: machacar el aguacate y mezclar con el tomate, la cebolla, el zumo de limón y una pizca de sal. Servir la pechuga a la plancha acompañada de los patacones y abundante guacamole artesanal.",
        macros: { weight: 460, calories: 520, protein: 42, carbs: 40, fats: 20, sugars: 3 }
      },
      {
        id: "d27-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Yogur Griego con Avena",
        ingredients: [
          "1 taza (aprox. 150g) de yogur griego natural o bajo en grasa",
          "1 cucharada (aprox. 15g) de hojuelas de avena tradicional"
        ],
        prep: "Servir el yogur griego en un recipiente, incorporar la avena y mezclar bien ambos ingredientes y consumir frío.",
        macros: { weight: 170, calories: 150, protein: 14, carbs: 16, fats: 3, sugars: 8 }
      },
      {
        id: "d27-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Crema de Verduras Sencilla con Tostadas",
        ingredients: [
          "1 pocillo (aprox. 180ml) de crema de verduras casera (zanahoria, ahuyama o zucchini)",
          "2 tostadas de pan integral o blanco"
        ],
        prep: "Calentar la crema de verduras en una olla pequeña a fuego medio hasta que alcance la temperatura ideal. Servir caliente y acompañar de las tostadas de pan para sumergir o trocear encima.",
        macros: { weight: 220, calories: 170, protein: 5, carbs: 28, fats: 4, sugars: 4 }
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar y tomar fresco.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d28-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Tibios con Tostadas y Chocolate con Leche",
        ingredients: ["2 Huevos tibios", "2 Tostadas de pan", "Chocolate caliente con leche"],
        prep: "Cocinar los huevos durante 4 minutos. Servir en copa con tostadas y chocolate.",
        macros: { weight: 310, calories: 360, protein: 17, carbs: 36, fats: 16, sugars: 14 }
      },
      {
        id: "d28-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Papaya",
        ingredients: ["1 Taza de papaya picada"],
        prep: "Consumir fresca.",
        macros: { weight: 150, calories: 60, protein: 1, carbs: 15, fats: 0, sugars: 11 }
      },
      {
        id: "d28-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Albóndigas de Res en Salsa con Arroz y Ensalada Mixta",
        ingredients: ["Proteína: Albóndigas de res en salsa", "Ensalada: Lechuga, tomate y aguacate", "Complemento: Arroz blanco"],
        prep: "Guisar las albóndigas en su salsa. Servir con arroz blanco y ensalada fresca.",
        macros: { weight: 460, calories: 510, protein: 36, carbs: 46, fats: 20, sugars: 6 }
      },
      {
        id: "d28-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cookie",
        name: "Tostadas de Arroz con Arequipe Light",
        ingredients: ["2 Tostadas de arroz", "Arequipe light"],
        prep: "Untar el arequipe sobre las tostadas de arroz.",
        macros: { weight: 90, calories: 130, protein: 3, carbs: 24, fats: 2, sugars: 4 }
      },
      {
        id: "d28-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa Pequeña con Chorizo Asado",
        ingredients: ["1 Arepa pequeña", "1 Chorizo pequeño"],
        prep: "Asar el chorizo y servir sobre la arepa caliente.",
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
        name: "Huevos Tibios con Tostadas y Chocolate con Leche",
        ingredients: [
          "2 huevos medianos frescos",
          "2 rebanadas de pan tostado",
          "150ml de leche descremada o entera, 1 cucharadita de cacao en polvo y un toque de endulzante al gusto"
        ],
        prep: "Cocinar los huevos en agua hirviendo durante exactamente 4 minutos para obtener huevos tibios (con clara cocida y yema líquida). Retirar y servir en una copa o recipiente. Aparte, preparar el chocolate caliente mezclando el cacao con la leche caliente. Servir los huevos tibios acompañados de las tostadas de pan crujientes y el chocolate con leche.",
        macros: { weight: 310, calories: 360, protein: 17, carbs: 36, fats: 16, sugars: 14 }
      },
      {
        id: "d28-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Papaya",
        ingredients: [
          "1 taza de papaya madura picada en cubos (aprox. 150g)"
        ],
        prep: "Retirar la cáscara y las semillas de la papaya fresca, cortar en cubos limpios y consumir fresca.",
        macros: { weight: 150, calories: 60, protein: 1, carbs: 15, fats: 0, sugars: 11 }
      },
      {
        id: "d28-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Albóndigas de Res en Salsa con Arroz y Ensalada Mixta",
        ingredients: [
          "130g de carne molida de res moldeada en albóndigas",
          "60g de tomate, 30g de cebolla y caldo para la salsa de tomate criolla",
          "70g de arroz blanco cocido (peso en seco aprox. 50g)",
          "50g de lechuga, 30g de tomate en rodajas y 30g de aguacate",
          "1 cucharadita de aceite, sal, pimienta y comino"
        ],
        prep: "Para las albóndigas: formar las albóndigas con la carne sazonada y guisarlas en una sartén con la salsa de tomate y cebolla a fuego medio hasta que estén bien cocidas por dentro y la salsa espese. Para el complemento: servir el arroz blanco suelto y caliente. Para la ensalada: combinar la lechuga, el tomate en rodajas y el aguacate en tajadas, aderezando con un toque de limón y sal. Servir las albóndigas en salsa acompañadas del arroz blanco y la ensalada mixta.",
        macros: { weight: 460, calories: 510, protein: 36, carbs: 46, fats: 20, sugars: 6 }
      },
      {
        id: "d28-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cookie",
        name: "Tostadas de Arroz con Arequipe Light",
        ingredients: [
          "2 tostadas o galletas de arroz inflado",
          "2 cucharadas (aprox. 25g) de arequipe light o arequipe tradicional bajo en azúcar"
        ],
        prep: "Untar de manera uniforme el arequipe light sobre la superficie de las tostadas de arroz. Servir de inmediato.",
        macros: { weight: 90, calories: 130, protein: 3, carbs: 24, fats: 2, sugars: 4 }
      },
      {
        id: "d28-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa Pequeña con Chorizo Asado",
        ingredients: [
          "1 arepa pequeña de maíz (aprox. 60g)",
          "1 chorizo pequeño de cerdo o pollo (aprox. 70g-80g)"
        ],
        prep: "Asar el chorizo en la plancha o sartén a fuego medio-bajo pinchándolo ligeramente para que se cocine bien por dentro y quede dorado por fuera. Asar también la arepa pequeña hasta que esté tostada. Servir el chorizo asado caliente sobre la arepa caliente.",
        macros: { weight: 150, calories: 270, protein: 12, carbs: 18, fats: 17, sugars: 1 }
      }
    ]
  },
  {
    day: 29,
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
        prep: "Lavar muy bien la espinaca y el tallo de apio. Cortar el apio en trozos pequeños para facilitar el proceso. Colocar todos los ingredientes en la licuadora y procesar a alta velocidad durante 1 a 2 minutos hasta obtener una consistencia completamente homogénea, sin grumos. Licuar a alta velocidad y tomar de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d30-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Pericos con Arepa y Aguapanela con Leche",
        ingredients: [
          "2 huevos medianos",
          "30g de tomate picado y 20g de cebolla picada (para el guiso)",
          "1 cucharadita (3ml) de aceite o mantequilla ligera",
          "1 arepa mediana de maíz (aprox. 70g)",
          "150ml de aguapanela caliente pura y 50ml de leche"
        ],
        prep: "Para los huevos pericos: sofreír el tomate y la cebolla picados en una sartén con un toque de aceite o mantequilla hasta armar un guiso ligero, agregar los huevos y revolver hasta cocinar al punto deseado con una pizca de sal. Calentar la arepa de maíz en la plancha hasta que esté dorada. Aparte, preparar la aguapanela caliente y agregar un toque de leche al gusto. Revolver los huevos con el guiso, servir sobre la arepa y acompañar con la aguapanela con leche.",
        macros: { weight: 320, calories: 380, protein: 18, carbs: 45, fats: 14, sugars: 12 }
      },
      {
        id: "d30-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Durazno Fresco",
        ingredients: [
          "1 durazno maduro mediano (aprox. 140g)"
        ],
        prep: "Lavar muy bien el durazno fresco con agua potable. Lavar y consumir entero o en gajos al gusto.",
        macros: { weight: 140, calories: 60, protein: 1, carbs: 14, fats: 0, sugars: 11 }
      },
      {
        id: "d30-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Pechuga Gratinada con Papa Criolla y Ensalada Caprese",
        ingredients: [
          "130g de filete de pechuga de pollo",
          "1 tajada de jamón y 30g de queso que funda (sabanela o mozzarella) para gratinar",
          "100g de papa criolla",
          "60g de tomate en rodajas, hojas de albahaca fresca u orégano",
          "1 cucharadita de aceite de oliva, sal, pimienta y un toque de vinagre bálsemico o limón"
        ],
        prep: "Para el pollo: asar la pechuga a la plancha, luego cubrir con la tajada de jamón y el queso, y gratinar en el horno o airfryer hasta que el queso esté fundido y dorado. Para la papa criolla: cocinar ligeramente o llevar a la airfryer con un toque de aceite y sal hasta dorar. Para la ensalada: disponer las rodajas de tomate, agregar orégano o albahaca y aderezar con aceite de oliva y sal. Servir la pechuga gratinada acompañada de la papa criolla dorada y la ensalada de tomate.",
        macros: { weight: 450, calories: 530, protein: 44, carbs: 36, fats: 22, sugars: 3 }
      },
      {
        id: "d30-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Gelatina Light",
        ingredients: [
          "1 taza (aprox. 150ml) de gelatina sin azúcar o light preparada previamente"
        ],
        prep: "Preparar la gelatina siguiendo las instrucciones del empaque con agua caliente y fría, refrigerar hasta que cuaje completamente. Servir fría.",
        macros: { weight: 150, calories: 20, protein: 2, carbs: 3, fats: 0, sugars: 0 }
      },
      {
        id: "d30-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich Sencillo de Queso y Tomate",
        ingredients: [
          "2 rebanadas de pan tajado",
          "1 o 2 tajadas de queso que funda (sabanela o mozzarella)",
          "40g de tomate maduro en rodajas",
          "1 pizca de orégano, sal y un toque de mantequilla ligera (opcional)"
        ],
        prep: "Armar el sándwich colocando el queso y las rodajas de tomate entre las rebanadas de pan, añadiendo una pizca de orégano y sal al gusto. Dorar en sartén o sandwichera a fuego medio hasta derretir el queso y obtener un exterior crujiente.",
        macros: { weight: 160, calories: 220, protein: 10, carbs: 24, fats: 9, sugars: 3 }
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todos los ingredientes.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d30-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Revueltos con Tostadas y Café con Leche",
        ingredients: ["2 Huevos revueltos", "2 Tostadas de pan", "Café caliente con leche"],
        prep: "Hacer los huevos revueltos, servir con tostadas crujientes y café con leche.",
        macros: { weight: 270, calories: 300, protein: 16, carbs: 22, fats: 15, sugars: 7 }
      },
      {
        id: "d30-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Piña Fresca",
        ingredients: ["1 Taza de piña fresca"],
        prep: "Consumir la piña fresca porcionada.",
        macros: { weight: 150, calories: 75, protein: 1, carbs: 19, fats: 0, sugars: 14 }
      },
      {
        id: "d30-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Sancocho Trifásico de Pollo y Carne con Arroz",
        ingredients: ["Proteína: Pollo y carne de res en caldo", "Ensalada: Pico de gallo", "Complemento: Sancocho (papa, plátano verde, yuca) + Arroz blanco"],
        prep: "Servir el sancocho con papa, yuca, plátano y las carnes acompañando con arroz blanco.",
        macros: { weight: 550, calories: 610, protein: 42, carbs: 68, fats: 18, sugars: 4 }
      },
      {
        id: "d30-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-box-seam-fill",
        name: "Crispetas Caseras Bajas en Grasa",
        ingredients: ["1 Bolsa pequeña de crispetas caseras"],
        prep: "Preparar en airfryer u olla sin exceso de grasa.",
        macros: { weight: 40, calories: 120, protein: 3, carbs: 22, fats: 3, sugars: 0 }
      },
      {
        id: "d30-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa Pequeña con Queso Campesino y Aromática",
        ingredients: ["1 Arepa pequeña a la plancha", "Queso campesino", "Infusión o aromática caliente"],
        prep: "Asar la arepa con queso hasta derretir y acompañar con la aromática.",
        macros: { weight: 180, calories: 230, protein: 10, carbs: 28, fats: 8, sugars: 1 }
      }
    ]
  }
];

let currentDay = 1;
let caloriesChartInstance = null;

// Detectar el día actual según hora de Colombia (America/Bogota)
function getColombiaDayOfMonth() {
  try {
    const fmt = new Intl.DateTimeFormat("es-CO", {
      timeZone: "America/Bogota",
      day: "numeric"
    });
    const day = parseInt(fmt.format(new Date()), 10);
    if (isNaN(day)) return 1;
    if (day < 1) return 1;
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
  updateConsumedCalories(dayData.meals); // ← recalcula gráfico según checks guardados
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

  // Ingredientes Totales del Día (al final)
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

  // Enlazar checkboxes
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

// Calcula calorías SOLO de las comidas marcadas y actualiza el gráfico
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

  // Si el canvas aún no tiene tamaño (contenedor oculto), reintentar
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

  // Recalcular calorías consumidas del día actual
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

// Reiniciar marcas → vuelve el gráfico a 0
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

// Modo oscuro / claro
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
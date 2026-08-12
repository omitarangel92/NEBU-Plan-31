// Base de datos exacta de los 31 días según la tabla oficial
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todos los ingredientes a alta velocidad hasta obtener una consistencia homogénea y consumir inmediatamente en ayunas.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d1-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Pericos con Arepa y Aguapanela",
        ingredients: ["2 Huevos pericos (con guiso de tomate y cebolla)", "1 Arepa de maíz", "Aguapanela caliente con leche"],
        prep: "Saltear el tomate y la cebolla, añadir los huevos batidos y revolver. Servir con la arepa asada a la plancha y la aguapanela con leche.",
        macros: { weight: 320, calories: 380, protein: 18, carbs: 45, fats: 14, sugars: 12 }
      },
      {
        id: "d1-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Papaya Fresca",
        ingredients: ["1 Taza de papaya picada en cubos"],
        prep: "Consumir la fruta fresca porcionada.",
        macros: { weight: 150, calories: 60, protein: 1, carbs: 15, fats: 0, sugars: 11 }
      },
      {
        id: "d1-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Carne Molida con Cazuela de Frijoles y Ensalada de Aguacate",
        ingredients: ["Proteína: Carne molida de res", "Ensalada: Lechuga, aguacate, maíz dulce, limón", "Complemento: Cazuela de frijoles rojos, arroz blanco, tajada de plátano maduro"],
        prep: "Cocinar la carne molida sazonada. Servir sobre la cazuela de frijoles acompañando con el arroz blanco, la tajada frita o al horno y la ensalada aderezada con limón.",
        macros: { weight: 520, calories: 620, protein: 38, carbs: 72, fats: 20, sugars: 8 }
      },
      {
        id: "d1-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cookie",
        name: "Tostadas de Arroz con Arequipe Light y Té/Café",
        ingredients: ["2 Tostadas de arroz", "Untado ligero de arequipe sin azúcar", "Té o café caliente"],
        prep: "Esparcir el arequipe sobre las tostadas de arroz y acompañar con la bebida caliente de su preferencia.",
        macros: { weight: 90, calories: 130, protein: 3, carbs: 24, fats: 2, sugars: 4 }
      },
      {
        id: "d1-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa a la Plancha con Queso Campesino y Aromática",
        ingredients: ["1 Arepa pequeña a la plancha", "Queso campesino rallado", "Infusión o aromática caliente"],
        prep: "Asar la arepa en la plancha y cubrir con el queso campesino hasta que derrita ligeramente. Acompañar con la aromática.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todos los ingredientes a alta velocidad hasta obtener una consistencia homogénea y consumir inmediatamente.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d2-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevo Cocido y Cereal con Leche",
        ingredients: ["1 Huevo cocido", "1 Taza de cereal integral", "1 Taza de leche"],
        prep: "Cocinar el huevo en agua hirviendo durante 8-10 minutos. Servir el cereal en un tazón con leche fría.",
        macros: { weight: 300, calories: 310, protein: 15, carbs: 42, fats: 9, sugars: 12 }
      },
      {
        id: "d2-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Banano Fresco",
        ingredients: ["1 Banano mediano"],
        prep: "Consumir el banano fresco.",
        macros: { weight: 120, calories: 105, protein: 1, carbs: 27, fats: 0, sugars: 14 }
      },
      {
        id: "d2-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Pechuga a las Finas Hierbas con Ensalada de Zanahoria y Yogur",
        ingredients: ["Proteína: Pechuga de pollo a la plancha con finas hierbas", "Ensalada: Zanahoria rallada, manzana verde, yogur griego", "Complemento: Arroz blanco"],
        prep: "Asar la pechuga sazonada con finas hierbas. Rallar la zanahoria y manzana verde y mezclar con yogur griego para la ensalada. Servir con arroz blanco.",
        macros: { weight: 440, calories: 480, protein: 42, carbs: 48, fats: 11, sugars: 10 }
      },
      {
        id: "d2-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Gelatina Light",
        ingredients: ["1 Taza de gelatina light del sabor preferido"],
        prep: "Servir bien fría la gelatina previamente preparada.",
        macros: { weight: 150, calories: 20, protein: 2, carbs: 3, fats: 0, sugars: 0 }
      },
      {
        id: "d2-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Wrap de Maíz con Jamón, Huevo y Lechuga",
        ingredients: ["1 Tortilla de maíz", "1 Tajada de jamón", "Lechuga fresca", "1 Huevo revuelto"],
        prep: "Hacer el huevo revuelto. Calentar la tortilla, colocar la lechuga, la tajada de jamón y el huevo revuelto. Envolver en forma de wrap.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todos los ingredientes a alta velocidad y tomar de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d3-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Omelette de Espinaca y Queso con Galletas y Café con Leche",
        ingredients: ["Omelette de 2 huevos con espinaca y queso", "2 Galletas Saltinas o Ducales", "Café con leche"],
        prep: "Batir los 2 huevos, incorporar la espinaca picada y el queso en una sartén. Acompañar con las galletas y el café caliente.",
        macros: { weight: 280, calories: 350, protein: 19, carbs: 26, fats: 18, sugars: 8 }
      },
      {
        id: "d3-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Mandarina o Naranja",
        ingredients: ["1 Mandarina fresca o Naranja en cascos"],
        prep: "Pelar y consumir la fruta fresca.",
        macros: { weight: 130, calories: 50, protein: 1, carbs: 12, fats: 0, sugars: 9 }
      },
      {
        id: "d3-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Atún Salteado con Hogao y Pasta Penne",
        ingredients: ["Proteína: Atún en agua salteado con hogao", "Ensalada: Pepino en rodajas, tomate, vinagreta", "Complemento: Penne Rigate o coditos salteados"],
        prep: "Escurrir el atún y saltearlo con un hogao tradicional (tomate y cebolla). Saltear la pasta cocida y acompañar de la ensalada fresca aderezada.",
        macros: { weight: 420, calories: 470, protein: 36, carbs: 54, fats: 11, sugars: 5 }
      },
      {
        id: "d3-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-box-seam-fill",
        name: "Crispetas Caseras Bajas en Grasa",
        ingredients: ["1 Bolsa pequeña de crispetas caseras (maíz pira preparado con mínimo aceite y poca sal)"],
        prep: "Hacer las crispetas en olla o airfryer utilizando poco aceite y sal moderada.",
        macros: { weight: 40, calories: 120, protein: 3, carbs: 22, fats: 3, sugars: 0 }
      },
      {
        id: "d3-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich Sencillo Caliente de Queso y Tomate",
        ingredients: ["Pan tajado", "Queso tajado", "Rodajas de tomate"],
        prep: "Armar el sándwich con el queso y el tomate. Dorar por ambos lados en una sartén caliente hasta que el queso se funda.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todos los ingredientes a alta velocidad y servir.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d4-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Cocidos con Arepa de Queso y Aguapanela Sola",
        ingredients: ["2 Huevos cocidos", "1 Arepa con queso", "Aguapanela caliente sola"],
        prep: "Cocinar los huevos en agua hirviendo. Servir con la arepa de queso dorada a la plancha y la aguapanela pura.",
        macros: { weight: 310, calories: 360, protein: 17, carbs: 42, fats: 13, sugars: 14 }
      },
      {
        id: "d4-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Manzana Fresca",
        ingredients: ["1 Manzana roja o verde mediana"],
        prep: "Lavar y consumir entera o en cascos.",
        macros: { weight: 150, calories: 80, protein: 0, carbs: 21, fats: 0, sugars: 16 }
      },
      {
        id: "d4-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Milanesa de Cerdo al Horno con Puré de Papa Criolla",
        ingredients: ["Proteína: Milanesa de cerdo al horno o airfryer", "Ensalada: Espinaca, pimentón asado, cebolla, vinagreta", "Complemento: Puré de papa criolla"],
        prep: "Sazonar y hornear la milanesa de cerdo. Cocinar la papa criolla y triturarla hasta formar puré. Servir con la ensalada de espinaca y pimentón.",
        macros: { weight: 450, calories: 510, protein: 37, carbs: 44, fats: 18, sugars: 4 }
      },
      {
        id: "d4-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-nut",
        name: "Mix de Frutos Secos",
        ingredients: ["1 Puñado de frutos secos (maní sin sal, almendras, uvas pasas)"],
        prep: "Consumir la porción de frutos secos al natural.",
        macros: { weight: 40, calories: 180, protein: 6, carbs: 14, fats: 12, sugars: 6 }
      },
      {
        id: "d4-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa Pequeña con Carne Desmechada o Molida",
        ingredients: ["1 Arepa pequeña", "Porción pequeña de carne desmechada o molida (sobrante del almuerzo)"],
        prep: "Calentar la arepa y colocar la carne caliente por encima.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todos los ingredientes y consumir.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d5-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Sándwich de Huevo y Queso con Chocolate con Leche",
        ingredients: ["Pan tajado", "1 Huevo frito o revuelto", "Queso tajado", "Rodajas de tomate", "Chocolate caliente preparado con leche"],
        prep: "Preparar el huevo al gusto, armar el sándwich con queso y tomate. Acompañar de chocolate con leche caliente.",
        macros: { weight: 340, calories: 390, protein: 17, carbs: 40, fats: 17, sugars: 15 }
      },
      {
        id: "d5-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Uvas o Uchuvas",
        ingredients: ["1 Taza pequeña de uvas o uchuvas frescas"],
        prep: "Lavar y consumir las frutas frescas.",
        macros: { weight: 120, calories: 70, protein: 1, carbs: 17, fats: 0, sugars: 14 }
      },
      {
        id: "d5-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Pollo al Curry con Guacamole y Patacones",
        ingredients: ["Proteína: Muslos o alitas de pollo al curry o pimentón", "Ensalada: Guacamole (aguacate, tomate, cebolla, cilantro, limón)", "Complemento: Patacones de plátano verde"],
        prep: "Cocinar las piezas de pollo al curry. Preparar patacones de plátano verde e integrar el guacamole con aguacate triturado y verduras. Servir junto.",
        macros: { weight: 480, calories: 540, protein: 36, carbs: 42, fats: 24, sugars: 3 }
      },
      {
        id: "d5-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Yogur Griego con Avena",
        ingredients: ["1 Taza de yogur griego o natural", "1 Cucharada de avena en hojuelas"],
        prep: "Mezclar la cucharada de avena en la taza de yogur griego.",
        macros: { weight: 170, calories: 150, protein: 14, carbs: 16, fats: 3, sugars: 8 }
      },
      {
        id: "d5-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Huevo Duro sobre Galletas Saltinas / Ducales",
        ingredients: ["1 Huevo duro picado", "Sal y pimienta", "2 Galletas Saltinas o Ducales"],
        prep: "Picar el huevo duro, sazonar con sal y pimienta y distribuir sobre las galletas.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todos los ingredientes y consumir inmediatamente.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d6-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Revueltos con Tostada y Café con Leche",
        ingredients: ["2 Huevos revueltos", "1 Tostada de pan", "Café caliente con leche"],
        prep: "Hacer los huevos revueltos al gusto. Acompañar con la tostada crujiente y una taza de café con leche.",
        macros: { weight: 270, calories: 300, protein: 16, carbs: 22, fats: 15, sugars: 7 }
      },
      {
        id: "d6-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Durazno Fresco",
        ingredients: ["1 Durazno mediano"],
        prep: "Lavar y consumir la fruta entera.",
        macros: { weight: 140, calories: 60, protein: 1, carbs: 14, fats: 0, sugars: 11 }
      },
      {
        id: "d6-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Gulash de Res con Arroz con Fideos y Ensalada de Fresas",
        ingredients: ["Proteína: Carne de res para gulash en su jugo con vegetales", "Ensalada: Lechuga crespa, fresas, ajonjolí", "Complemento: Arroz con fideos fritos"],
        prep: "Estofarlo la carne de res cortada en cubos con vegetales. Servir sobre el arroz con fideos fritos y acompañar con la ensalada de lechuga, fresas y ajonjolí.",
        macros: { weight: 460, calories: 530, protein: 39, carbs: 55, fats: 16, sugars: 6 }
      },
      {
        id: "d6-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-circle",
        name: "Huevo Duro en Tostada de Arroz",
        ingredients: ["1 Huevo duro picado", "Sal y pimienta", "1 Tostada de arroz"],
        prep: "Colocar el huevo duro picado y sazonado sobre la tostada de arroz.",
        macros: { weight: 85, calories: 110, protein: 7, carbs: 8, fats: 5, sugars: 0 }
      },
      {
        id: "d6-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Salchipapa Casera Ligera",
        ingredients: ["1 Papa pequeña cortada en cascos", "1 Salchicha picada"],
        prep: "Cocinar los cascos de papa y la salchicha picada en airfryer o al horno con mínimo aceite hasta dorar.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar a alta velocidad y consumir.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d8-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Fritos en Arepa con Queso y Aguapanela con Leche",
        ingredients: ["2 Huevos fritos", "1 Arepa con queso", "Aguapanela caliente con leche"],
        prep: "Freír los huevos en sartén antiadherente. Colocar sobre la arepa caliente y acompañar con la aguapanela con leche.",
        macros: { weight: 330, calories: 420, protein: 18, carbs: 44, fats: 19, sugars: 12 }
      },
      {
        id: "d8-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Tajada de Sandía",
        ingredients: ["1 Tajada mediana de sandía fresca"],
        prep: "Consumir porcionada en cubos o tajada.",
        macros: { weight: 200, calories: 60, protein: 1, carbs: 15, fats: 0, sugars: 12 }
      },
      {
        id: "d8-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Chorizo y Huevo Frito con Lentejas Guisadas y Arroz",
        ingredients: ["Proteína: Chorizo a la parrilla + 1 Huevo frito", "Ensalada: Zanahoria rallada, tomate, vinagreta de mostaza y miel", "Complemento: Lentejas guisadas con arroz blanco"],
        prep: "Asar el chorizo a la parrilla y freír el huevo. Servir con un buen plato de lentejas guisadas, arroz blanco y la ensalada de zanahoria aderezada.",
        macros: { weight: 510, calories: 650, protein: 35, carbs: 68, fats: 26, sugars: 6 }
      },
      {
        id: "d8-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-hot",
        name: "Frappé de Café",
        ingredients: ["Leche", "Café instantáneo", "Hielo"],
        prep: "Licuar la leche con el café instantáneo y abundante hielo hasta lograr consistencia frappé.",
        macros: { weight: 220, calories: 90, protein: 4, carbs: 10, fats: 3, sugars: 8 }
      },
      {
        id: "d8-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa con Huevo Frito Encima",
        ingredients: ["1 Arepa", "1 Huevo frito en sartén antiadherente"],
        prep: "Asar la arepa y colocar encima el huevo frito recién preparado.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar y tomar de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d9-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Sándwich de Jamón, Queso y Huevo con Café con Leche",
        ingredients: ["Pan tajado", "1 Tajada de jamón", "1 Tajada de queso", "1 Huevo revuelto", "Café con leche"],
        prep: "Armar el sándwich rellenándolo con el huevo revuelto, jamón y queso. Acompañar de café caliente con leche.",
        macros: { weight: 320, calories: 370, protein: 20, carbs: 32, fats: 17, sugars: 8 }
      },
      {
        id: "d9-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Mango Maduro",
        ingredients: ["1/2 Mango maduro en tajadas"],
        prep: "Porcionar y consumir fresco.",
        macros: { weight: 150, calories: 90, protein: 1, carbs: 23, fats: 0, sugars: 20 }
      },
      {
        id: "d9-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Muslos de Pollo Sudados con Papa al Vapor y Ensalada de Mango",
        ingredients: ["Proteína: Muslos de pollo sudados en salsa criolla", "Ensalada: Lechuga, mango maduro, uvas pasas, queso campesino", "Complemento: Papa al vapor bañada en hogao"],
        prep: "Sudar los muslos de pollo en salsa criolla. Cocinar la papa al vapor con un toque de hogao y acompañar con la ensalada dulce de lechuga, mango y queso.",
        macros: { weight: 490, calories: 520, protein: 38, carbs: 52, fats: 16, sugars: 12 }
      },
      {
        id: "d9-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-emoji-smile",
        name: "Mango Biche con Limón, Sal y Pimienta",
        ingredients: ["Mango biche en tiras", "Limón, sal y pimienta al gusto"],
        prep: "Cortar el mango biche en tiras delgadas y sazonar con zumo de limón, sal y pimienta.",
        macros: { weight: 140, calories: 70, protein: 1, carbs: 17, fats: 0, sugars: 10 }
      },
      {
        id: "d9-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Tortilla de Maíz con Jamón y Queso a la Plancha",
        ingredients: ["1 Tortilla de maíz", "1 Tajada de queso", "1 Tajada de jamón"],
        prep: "Doblar la tortilla con el queso y el jamón adentro y dorar a la plancha hasta que fundan.",
        macros: { weight: 130, calories: 210, protein: 12, carbs: 16, fats: 10, sugars: 1 }
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar y tomar fresco.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d10-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Revueltos con Maicitos, Arepa y Café con Leche",
        ingredients: ["2 Huevos revueltos con maíz dulce", "1 Arepa", "Café caliente con leche"],
        prep: "Mezclar los maicitos con los huevos y revuelver en sartén. Servir con la arepa asada y café con leche.",
        macros: { weight: 310, calories: 360, protein: 16, carbs: 42, fats: 14, sugars: 8 }
      },
      {
        id: "d10-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Pera Fresca",
        ingredients: ["1 Pera mediana"],
        prep: "Lavar y consumir entera.",
        macros: { weight: 150, calories: 85, protein: 0, carbs: 22, fats: 0, sugars: 15 }
      },
      {
        id: "d10-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Carne Desmechada con Yuca y Ensalada de Pepino",
        ingredients: ["Proteína: Carne de res desmechada (falda)", "Ensalada: Pepino cohombro, maíz tierno, aderezo de yogur", "Complemento: Yuca frita o al horno"],
        prep: "Cocinar y desmechar la falda de res en guiso. Preparar la yuca al horno o en airfryer y acompañar con ensalada de pepino y maíz.",
        macros: { weight: 450, calories: 510, protein: 41, carbs: 48, fats: 15, sugars: 5 }
      },
      {
        id: "d10-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Yogur Griego con Fresas y Chocolate",
        ingredients: ["Yogur griego", "Fresas picadas", "Hilos de chocolate derretido", "Esencia de vainilla o coco"],
        prep: "Servir el yogur en copa, mezclar la esencia, añadir las fresas y decorar con chocolate derretido.",
        macros: { weight: 180, calories: 170, protein: 12, carbs: 18, fats: 5, sugars: 12 }
      },
      {
        id: "d10-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Omelette de 1 Huevo con Champiñones",
        ingredients: ["1 Huevo", "Champiñones laminados salteados"],
        prep: "Saltear los champiñones, batir el huevo y preparar un omelette ligero relleno con los champiñones.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar bien y consumir.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d11-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Pericos con Galletas Ducales y Chocolate con Leche",
        ingredients: ["2 Huevos pericos", "2 Galletas Ducales", "Chocolate con leche"],
        prep: "Hacer los huevos pericos con guiso. Servir acompañados de galletas Ducales y chocolate caliente con leche.",
        macros: { weight: 290, calories: 360, protein: 16, carbs: 32, fats: 18, sugars: 12 }
      },
      {
        id: "d11-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Taza de Fresas",
        ingredients: ["1 Taza de fresas frescas"],
        prep: "Lavar, retirar el pedúnculo y consumir.",
        macros: { weight: 140, calories: 45, protein: 1, carbs: 11, fats: 0, sugars: 7 }
      },
      {
        id: "d11-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Tiras de Pollo con Champiñones y Espaguetis Integrales",
        ingredients: ["Proteína: Tiras de pollo con champiñones", "Ensalada: Espinaca, apio crujiente, aguacate", "Complemento: Espaguetis integrales o tradicionales"],
        prep: "Saltear las tiras de pollo con champiñones en sartén. Mezclar con la pasta cocida y servir con ensalada fresca de espinaca y aguacate.",
        macros: { weight: 440, calories: 490, protein: 41, carbs: 49, fats: 14, sugars: 3 }
      },
      {
        id: "d11-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-pie-chart",
        name: "Moneditas de Papa o Plátano Verde",
        ingredients: ["Moneditas de papa o plátano verde horneadas/airfryer"],
        prep: "Cortar la papa o el plátano en tajadas delgadas y dorar en airfryer con un toque de sal.",
        macros: { weight: 100, calories: 140, protein: 2, carbs: 28, fats: 2, sugars: 1 }
      },
      {
        id: "d11-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Tostada de Pan con Aguacate y Sal Marina",
        ingredients: ["1 Tostada de pan integral", "Aguacate triturado", "Sal marina"],
        prep: "Triturar el aguacate, esparcir sobre la tostada de pan y sazonar con escamas de sal marina.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todos los ingredientes.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d12-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Queso Campesino con Huevos Cocidos, Arepa y Aguapanela Sola",
        ingredients: ["Queso campesino a la plancha", "2 Huevos cocidos", "1 Arepa", "Aguapanela caliente sola"],
        prep: "Asar el queso a la plancha. Acompañar de los huevos cocidos, la arepa asada y aguapanela caliente.",
        macros: { weight: 340, calories: 410, protein: 23, carbs: 38, fats: 18, sugars: 12 }
      },
      {
        id: "d12-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Kiwi Fresco",
        ingredients: ["1 Kiwi pelado y troceado"],
        prep: "Pelar y cortar en rodajas.",
        macros: { weight: 110, calories: 50, protein: 1, carbs: 12, fats: 0, sugars: 8 }
      },
      {
        id: "d12-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Chuleta de Cerdo con Coleslaw y Plátano con Bocadillo",
        ingredients: ["Proteína: Chuleta de cerdo a la plancha", "Ensalada: Coleslaw (repollo blanco, morado, zanahoria, mayonesa ligera)", "Complemento: Plátano maduro en cocción lenta con bocadillo y queso"],
        prep: "Asar la chuleta a la plancha. Preparar la ensalada Coleslaw. Hornear el plátano maduro relleno con bocadillo y queso hasta fundir.",
        macros: { weight: 480, calories: 560, protein: 38, carbs: 50, fats: 22, sugars: 16 }
      },
      {
        id: "d12-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-emoji-smile",
        name: "Bastones de Zanahoria con Limón y Sal",
        ingredients: ["Bastones de zanahoria fresca", "Limón, sal y pimienta"],
        prep: "Cortar la zanahoria en bastones delgados y aderezar con zumo de limón, sal y pimienta.",
        macros: { weight: 120, calories: 40, protein: 1, carbs: 9, fats: 0, sugars: 5 }
      },
      {
        id: "d12-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa Pequeña con Chorizo Asado",
        ingredients: ["1 Arepa pequeña", "1 Chorizo pequeño asado a la sartén o airfryer"],
        prep: "Asar el chorizo y la arepa. Servir juntos.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todos los ingredientes.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d13-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Omelette de Champiñones con Galletas Saltinas y Café con Leche",
        ingredients: ["Omelette de 2 huevos con champiñones", "2 Galletas Saltinas", "Café con leche"],
        prep: "Batir los huevos, saltear los champiñones e integrarlos. Servir con galletas y café caliente.",
        macros: { weight: 270, calories: 320, protein: 17, carbs: 24, fats: 16, sugars: 7 }
      },
      {
        id: "d13-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Coco Fresco",
        ingredients: ["Porción pequeña de coco laminado o en trozos"],
        prep: "Consumir al natural.",
        macros: { weight: 60, calories: 160, protein: 2, carbs: 6, fats: 15, sugars: 3 }
      },
      {
        id: "d13-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Albóndigas de Res en Salsa con Arroz y Ensalada de Ajonjolí",
        ingredients: ["Proteína: Albóndigas de res caseras en salsa de tomate", "Ensalada: Lechuga, aguacate, ajonjolí", "Complemento: Arroz blanco"],
        prep: "Cocinar las albóndigas en salsa de tomate natural. Acompañar de arroz blanco suelto y ensalada fresca con ajonjolí.",
        macros: { weight: 460, calories: 510, protein: 36, carbs: 46, fats: 20, sugars: 6 }
      },
      {
        id: "d13-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cookie",
        name: "Tostadas de Arroz con Arequipe Light y Té/Café",
        ingredients: ["2 Tostadas de arroz", "Untado ligero de arequipe sin azúcar", "Té o café caliente"],
        prep: "Untar las tostadas con el arequipe y acompañar con la bebida caliente.",
        macros: { weight: 90, calories: 130, protein: 3, carbs: 24, fats: 2, sugars: 4 }
      },
      {
        id: "d13-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Crema de Verduras con Tostadas",
        ingredients: ["Crema de verduras casera sencilla (1 pocillo pequeño)", "2 Tostadas de pan"],
        prep: "Calentar la crema de verduras y servir acompañada de las tostadas.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar a alta velocidad y tomar.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d14-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Tibios con Tostadas y Chocolate con Leche",
        ingredients: ["2 Huevos tibios", "2 Tostadas de pan", "Chocolate con leche"],
        prep: "Cocinar los huevos en agua hirviendo durante 4-5 minutos. Servir en copas con las tostadas y el chocolate caliente.",
        macros: { weight: 310, calories: 360, protein: 17, carbs: 36, fats: 16, sugars: 14 }
      },
      {
        id: "d14-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Ciruelas Frescas",
        ingredients: ["2 Ciruelas rojas frescas"],
        prep: "Lavar y consumir.",
        macros: { weight: 130, calories: 60, protein: 1, carbs: 14, fats: 0, sugars: 12 }
      },
      {
        id: "d14-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Pechuga Gratinada con Papa Criolla y Ensalada Caprese",
        ingredients: ["Proteína: Pechuga gratinada con queso y jamón", "Ensalada: Tomate en rodajas con orégano, aceite de oliva y sal", "Complemento: Papa criolla frita en airfryer"],
        prep: "Gratinar la pechuga cubriéndola con jamón y queso al horno. Acompañar con papa criolla dorada en airfryer y ensalada de tomate aderezada.",
        macros: { weight: 450, calories: 530, protein: 44, carbs: 36, fats: 22, sugars: 3 }
      },
      {
        id: "d14-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Gelatina Light",
        ingredients: ["1 Taza de gelatina light"],
        prep: "Consumir fría.",
        macros: { weight: 150, calories: 20, protein: 2, carbs: 3, fats: 0, sugars: 0 }
      },
      {
        id: "d14-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich de Huevo Revuelto con Guiso",
        ingredients: ["Pan tajado", "1 Huevo revuelto con guiso de tomate y cebolla"],
        prep: "Preparar el huevo perico con guiso y armar el sándwich en pan tajado.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todo hasta integrar.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d15-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Arepa con Huevos Pericos y Aguapanela con Leche",
        ingredients: ["1 Arepa", "2 Huevos revueltos con guiso", "Aguapanela caliente con leche"],
        prep: "Hacer los huevos revueltos con guiso, servir sobre la arepa caliente y acompañar con la aguapanela.",
        macros: { weight: 330, calories: 380, protein: 18, carbs: 44, fats: 15, sugars: 12 }
      },
      {
        id: "d15-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Piña Fresca",
        ingredients: ["1 Taza de piña fresca en cubos"],
        prep: "Consumir la fruta fresca porcionada.",
        macros: { weight: 150, calories: 75, protein: 1, carbs: 19, fats: 0, sugars: 14 }
      },
      {
        id: "d15-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Sancocho Trifásico de Pollo y Carne con Arroz",
        ingredients: ["Proteína: Pollo y carne de res en caldo", "Ensalada: Pico de gallo o ensalada de aguacate", "Complemento: Sancocho (papa, plátano verde, yuca) + Arroz blanco"],
        prep: "Cocinar el sancocho con papa, yuca, plátano y las carnes. Servir acompañado de plato de arroz blanco y pico de gallo.",
        macros: { weight: 550, calories: 610, protein: 42, carbs: 68, fats: 18, sugars: 4 }
      },
      {
        id: "d15-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-box-seam-fill",
        name: "Crispetas Caseras Bajas en Grasa",
        ingredients: ["1 Bolsa pequeña de crispetas caseras"],
        prep: "Preparar al momento en airfryer u olla sin exceso de grasa.",
        macros: { weight: 40, calories: 120, protein: 3, carbs: 22, fats: 3, sugars: 0 }
      },
      {
        id: "d15-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Tortilla de Maíz con Lechuga, Tomate y Queso",
        ingredients: ["1 Tortilla de maíz", "Lechuga", "Rodajas de tomate", "Queso campesino"],
        prep: "Rellenar la tortilla con lechuga, tomate y queso campesino.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar a alta velocidad.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d16-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevo Cocido con Cereal y Leche",
        ingredients: ["1 Huevo cocido", "1 Taza de cereal con leche"],
        prep: "Servir el huevo duro cocido acompañado del cereal con leche.",
        macros: { weight: 300, calories: 310, protein: 15, carbs: 42, fats: 9, sugars: 12 }
      },
      {
        id: "d16-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Taza de Fresas",
        ingredients: ["1 Taza de fresas frescas"],
        prep: "Consumir las fresas lavadas.",
        macros: { weight: 140, calories: 45, protein: 1, carbs: 11, fats: 0, sugars: 7 }
      },
      {
        id: "d16-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Frijoles Antioqueños con Chicharron Ligero o Carne en Polvo",
        ingredients: ["Proteína: Chicharrón crujiente en airfryer o carne en polvo", "Ensalada: Lechuga, tomate, aguacate, limón", "Complemento: Frijoles antioqueños con arroz blanco y arepa"],
        prep: "Servir los frijoles con arroz blanco, arepa pequeña, la proteína elegida y la ensalada fresca aderezada con limón.",
        macros: { weight: 530, calories: 640, protein: 38, carbs: 70, fats: 22, sugars: 4 }
      },
      {
        id: "d16-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-nut",
        name: "Mix de Frutos Secos",
        ingredients: ["1 Puñado de frutos secos (maní sin sal, almendras, uvas pasas)"],
        prep: "Consumir frutos secos al natural.",
        macros: { weight: 40, calories: 180, protein: 6, carbs: 14, fats: 12, sugars: 6 }
      },
      {
        id: "d16-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa con Queso a la Plancha",
        ingredients: ["1 Arepa", "Queso cuajada o campesino"],
        prep: "Asar la arepa a la plancha con el queso hasta que se gratine suavemente.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todos los ingredientes.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d17-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Sándwich de Huevos Revueltos con Queso y Café con Leche",
        ingredients: ["Pan tajado", "2 Huevos revueltos", "Queso tajado", "Café caliente con leche"],
        prep: "Revolver los huevos, armar el sándwich con queso y acompañar con café con leche.",
        macros: { weight: 320, calories: 380, protein: 21, carbs: 32, fats: 18, sugars: 8 }
      },
      {
        id: "d17-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Papaya Fresca",
        ingredients: ["1 Taza de papaya picada"],
        prep: "Consumir fresca porcionada.",
        macros: { weight: 150, calories: 60, protein: 1, carbs: 15, fats: 0, sugars: 11 }
      },
      {
        id: "d17-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Pollo en Cubos con Pimentón y Moneditas de Plátano Verde",
        ingredients: ["Proteína: Pechuga en cubos salteada con pimentón y cebolla", "Ensalada: Zanahoria salteada con maní dulce", "Complemento: Moneditas de plátano verde crunchy"],
        prep: "Saltear el pollo con pimentón y cebolla. Preparar las moneditas de plátano verde en airfryer y acompañar con la ensalada de zanahoria.",
        macros: { weight: 440, calories: 490, protein: 42, carbs: 45, fats: 14, sugars: 7 }
      },
      {
        id: "d17-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Yogur Griego con Avena",
        ingredients: ["1 Taza de yogur griego o natural", "1 Cucharada de avena"],
        prep: "Mezclar el yogur con la avena.",
        macros: { weight: 170, calories: 150, protein: 14, carbs: 16, fats: 3, sugars: 8 }
      },
      {
        id: "d17-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa Pequeña con Chorizo Picado",
        ingredients: ["1 Arepa pequeña", "1 Chorizo picado", "Un hilo de salsa de la casa"],
        prep: "Asar la arepa y el chorizo picado. Servir juntos con un toque de salsa.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar a alta velocidad y tomar de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d18-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Cocidos en Rodajas con Arepa y Aguapanela Sola",
        ingredients: ["2 Huevos cocidos", "Sal y pimienta", "1 Arepa", "Aguapanela caliente sola"],
        prep: "Cortar los huevos cocidos en rodajas, sazonar y servir sobre la arepa. Acompañar de aguapanela pura caliente.",
        macros: { weight: 310, calories: 350, protein: 17, carbs: 42, fats: 12, sugars: 14 }
      },
      {
        id: "d18-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Banano Fresco",
        ingredients: ["1 Banano mediano"],
        prep: "Consumir fresco.",
        macros: { weight: 120, calories: 105, protein: 1, carbs: 27, fats: 0, sugars: 14 }
      },
      {
        id: "d18-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Sardinas Guisadas con Pasta Tornillos y Ensalada de Maíz",
        ingredients: ["Proteína: Sardinas guisadas con tomate, cebolla y orégano", "Ensalada: Lechuga, aguacate, maíz", "Complemento: Pasta Tornillos o Conchas"],
        prep: "Guisar las sardinas con tomate, cebolla y orégano. Servir sobre la pasta cocida y acompañar con ensalada de aguacate y maíz.",
        macros: { weight: 450, calories: 480, protein: 37, carbs: 50, fats: 15, sugars: 5 }
      },
      {
        id: "d18-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-circle",
        name: "Huevo Duro sobre Tostada de Arroz",
        ingredients: ["1 Huevo duro picado", "Sal y pimienta", "1 Tostada de arroz"],
        prep: "Servir el huevo duro sazonado sobre la tostada de arroz.",
        macros: { weight: 85, calories: 110, protein: 7, carbs: 8, fats: 5, sugars: 0 }
      },
      {
        id: "d18-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich de Jamón, Queso y Lechuga",
        ingredients: ["Pan tajado", "1 Tajada de jamón", "1 Tajada de queso", "Lechuga fresca"],
        prep: "Armar el sándwich de jamón y queso con hojas de lechuga fresca.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar y tomar fresco.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d19-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Queso a la Plancha con Huevo Frito en Arepa y Chocolate",
        ingredients: ["Queso a la plancha", "1 Huevo frito", "1 Arepa", "Chocolate caliente con leche"],
        prep: "Colocar el queso a la plancha y el huevo frito sobre la arepa. Acompañar con chocolate caliente.",
        macros: { weight: 340, calories: 430, protein: 22, carbs: 36, fats: 22, sugars: 14 }
      },
      {
        id: "d19-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Mandarina o Naranja",
        ingredients: ["1 Mandarina fresca o Naranja"],
        prep: "Pelar y consumir la fruta fresca.",
        macros: { weight: 130, calories: 50, protein: 1, carbs: 12, fats: 0, sugars: 9 }
      },
      {
        id: "d19-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Tortas de Carne de Res con Arroz de Coco y Ensalada de Pepino",
        ingredients: ["Proteína: Tortas caseras de carne de res molida", "Ensalada: Pepino en rodajas con vinagre de manzana y eneldo", "Complemento: Arroz de coco sencillito"],
        prep: "Formar y asar las tortas de carne molida a la plancha. Servir con porción de arroz de coco y ensalada de pepino aderezada.",
        macros: { weight: 460, calories: 540, protein: 38, carbs: 48, fats: 21, sugars: 8 }
      },
      {
        id: "d19-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-snow",
        name: "Banano Helado",
        ingredients: ["1 Banano congelado"],
        prep: "Consumir en rodajas congeladas.",
        macros: { weight: 120, calories: 105, protein: 1, carbs: 27, fats: 0, sugars: 14 }
      },
      {
        id: "d19-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Wrap Ligero de Queso y Tomate",
        ingredients: ["1 Tortilla ligera", "Rodajas de tomate", "Queso laminado"],
        prep: "Calentar la tortilla, colocar el queso y tomate, envolver y servir caliente.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todos los ingredientes.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d20-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Pericos con Arepa y Café con Leche",
        ingredients: ["2 Huevos pericos con tomate y cebolla", "1 Arepa", "Café caliente con leche"],
        prep: "Preparar los huevos pericos en sartén. Servir con arepa asada y café con leche.",
        macros: { weight: 310, calories: 350, protein: 17, carbs: 38, fats: 14, sugars: 8 }
      },
      {
        id: "d20-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Manzana Fresca",
        ingredients: ["1 Manzana verde o roja"],
        prep: "Lavar y consumir entera.",
        macros: { weight: 150, calories: 80, protein: 0, carbs: 21, fats: 0, sugars: 16 }
      },
      {
        id: "d20-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Pechuga a la Planche con Puré de Papa y Ensalada Mixta",
        ingredients: ["Proteína: Pechuga de pollo a la plancha", "Ensalada: Lechuga, tomate, maíz", "Complemento: Puré de papa criolla"],
        prep: "Asar la pechuga. Preparar el puré de papa y acompañar con la ensalada fresca de lechuga y tomate.",
        macros: { weight: 430, calories: 460, protein: 41, carbs: 42, fats: 12, sugars: 4 }
      },
      {
        id: "d20-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cookie",
        name: "Tostadas de Arroz con Arequipe Light",
        ingredients: ["2 Tostadas de arroz", "Arequipe light"],
        prep: "Untar el arequipe sobre las tostadas de arroz.",
        macros: { weight: 90, calories: 130, protein: 3, carbs: 24, fats: 2, sugars: 4 }
      },
      {
        id: "d20-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa con Queso y Aromática",
        ingredients: ["1 Arepa", "Queso campesino", "Infusión o aromática"],
        prep: "Asar la arepa con queso y acompañar de aromática caliente.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar bien y consumir.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d21-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Revueltos con Tostadas y Chocolate con Leche",
        ingredients: ["2 Huevos revueltos", "2 Tostadas de pan", "Chocolate con leche"],
        prep: "Hacer los huevos revueltos, servir con tostadas y chocolate caliente.",
        macros: { weight: 310, calories: 370, protein: 17, carbs: 36, fats: 17, sugars: 14 }
      },
      {
        id: "d21-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Papaya",
        ingredients: ["1 Taza de papaya picada"],
        prep: "Consumir fresca.",
        macros: { weight: 150, calories: 60, protein: 1, carbs: 15, fats: 0, sugars: 11 }
      },
      {
        id: "d21-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Carne Molida con Arroz, Frijoles y Ensalada de Aguacate",
        ingredients: ["Proteína: Carne molida de res", "Ensalada: Lechuga, tomate y aguacate", "Complemento: Arroz blanco y frijoles"],
        prep: "Cocinar la carne molida y servir con arroz, cazuela de frijoles y ensalada de aguacate.",
        macros: { weight: 510, calories: 610, protein: 37, carbs: 70, fats: 19, sugars: 6 }
      },
      {
        id: "d21-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-nut",
        name: "Mix de Frutos Secos",
        ingredients: ["1 Puñado de frutos secos"],
        prep: "Consumir al natural.",
        macros: { weight: 40, calories: 180, protein: 6, carbs: 14, fats: 12, sugars: 6 }
      },
      {
        id: "d21-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich de Queso y Jamón Caliente",
        ingredients: ["Pan tajado", "Queso", "Jamón"],
        prep: "Armar el sándwich y dorar en sartén.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar y tomar de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d22-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Omelette de Queso y Espinaca con Galletas Ducales",
        ingredients: ["Omelette de 2 huevos con queso y espinaca", "2 Galletas Ducales", "Café con leche"],
        prep: "Preparar el omelette en sartén. Servir con galletas Ducales y café con leche.",
        macros: { weight: 280, calories: 350, protein: 18, carbs: 26, fats: 18, sugars: 8 }
      },
      {
        id: "d22-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Durazno Fresco",
        ingredients: ["1 Durazno mediano"],
        prep: "Consumir entero.",
        macros: { weight: 140, calories: 60, protein: 1, carbs: 14, fats: 0, sugars: 11 }
      },
      {
        id: "d22-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Lomo de Cerdo con Patacones y Ensalada Dulce",
        ingredients: ["Proteína: Lomo de cerdo a la plancha", "Ensalada: Lechuga, maíz, piña en cubos", "Complemento: Patacones de plátano verde"],
        prep: "Asar el lomo de cerdo. Servir con patacones de plátano verde y ensalada fresca con piña.",
        macros: { weight: 460, calories: 510, protein: 39, carbs: 46, fats: 17, sugars: 8 }
      },
      {
        id: "d22-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Yogur Griego con Avena",
        ingredients: ["Yogur griego", "Avena"],
        prep: "Mezclar el yogur con la avena.",
        macros: { weight: 170, calories: 150, protein: 14, carbs: 16, fats: 3, sugars: 8 }
      },
      {
        id: "d22-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa con Huevo Duro Picado Encima",
        ingredients: ["1 Arepa", "1 Huevo duro picado"],
        prep: "Calentar la arepa y cubrir con el huevo duro picado sazonado.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todos los ingredientes.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d23-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Cocidos con Arepa y Aguapanela con Leche",
        ingredients: ["2 Huevos cocidos", "1 Arepa", "Aguapanela caliente con leche"],
        prep: "Servir los huevos cocidos con la arepa asada y la aguapanela con leche.",
        macros: { weight: 320, calories: 370, protein: 18, carbs: 42, fats: 13, sugars: 12 }
      },
      {
        id: "d23-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Piña",
        ingredients: ["1 Taza de piña en cubos"],
        prep: "Consumir la piña fresca.",
        macros: { weight: 150, calories: 75, protein: 1, carbs: 19, fats: 0, sugars: 14 }
      },
      {
        id: "d23-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Atún Salteado con Hogao, Arroz y Ensalada de Pepino",
        ingredients: ["Proteína: Atún en agua salteado con guiso de tomate y cebolla", "Ensalada: Pepino y tomate", "Complemento: Arroz blanco"],
        prep: "Saltear el atún con el hogao. Servir sobre arroz blanco caliente y acompañar con ensalada.",
        macros: { weight: 420, calories: 450, protein: 35, carbs: 52, fats: 10, sugars: 4 }
      },
      {
        id: "d23-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-box-seam-fill",
        name: "Crispetas Caseras Bajas en Grasa",
        ingredients: ["1 Bolsa pequeña de crispetas"],
        prep: "Preparar las crispetas con poca sal y mínimo aceite.",
        macros: { weight: 40, calories: 120, protein: 3, carbs: 22, fats: 3, sugars: 0 }
      },
      {
        id: "d23-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Tortilla de Maíz con Jamón y Queso",
        ingredients: ["1 Tortilla de maíz", "1 Tajada de jamón", "1 Tajada de queso"],
        prep: "Calentar la tortilla con el jamón y el queso hasta fundir.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar a alta velocidad y tomar de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d24-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Sándwich de Huevo con Queso y Café con Leche",
        ingredients: ["Pan tajado", "1 Huevo frito o revuelto", "Queso tajado", "Café con leche"],
        prep: "Armar el sándwich con el huevo y el queso. Acompañar de café con leche.",
        macros: { weight: 300, calories: 360, protein: 17, carbs: 32, fats: 16, sugars: 8 }
      },
      {
        id: "d24-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Banano Fresco",
        ingredients: ["1 Banano mediano"],
        prep: "Consumir el banano fresco.",
        macros: { weight: 120, calories: 105, protein: 1, carbs: 27, fats: 0, sugars: 14 }
      },
      {
        id: "d24-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Pollo al Horno con Yuca y Ensalada de Zanahoria",
        ingredients: ["Proteína: Muslo o pechuga de pollo al horno", "Ensalada: Zanahoria rallada, manzana y mayonesa light", "Complemento: Yuca al vapor o frita"],
        prep: "Hornear el pollo sazonado. Acompañar de la yuca cocida y la ensalada de zanahoria rallada.",
        macros: { weight: 470, calories: 510, protein: 40, carbs: 48, fats: 16, sugars: 8 }
      },
      {
        id: "d24-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Gelatina Light",
        ingredients: ["1 Taza de gelatina light"],
        prep: "Servir fría.",
        macros: { weight: 150, calories: 20, protein: 2, carbs: 3, fats: 0, sugars: 0 }
      },
      {
        id: "d24-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa Pequeña con Queso Campesino",
        ingredients: ["1 Arepa pequeña", "Queso campesino"],
        prep: "Asar la arepa y servir con queso campesino por encima.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todos los ingredientes.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d25-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Pericos con Arepa de Queso y Aguapanela Sola",
        ingredients: ["2 Huevos pericos", "1 Arepa con queso", "Aguapanela caliente sola"],
        prep: "Preparar los huevos pericos y servir sobre la arepa de queso caliente. Acompañar con aguapanela.",
        macros: { weight: 320, calories: 390, protein: 18, carbs: 42, fats: 16, sugars: 14 }
      },
      {
        id: "d25-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Kiwi Fresco",
        ingredients: ["1 Kiwi pelado"],
        prep: "Consumir en rodajas.",
        macros: { weight: 110, calories: 50, protein: 1, carbs: 12, fats: 0, sugars: 8 }
      },
      {
        id: "d25-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Gulash de Res con Arroz y Ensalada de Lechuga",
        ingredients: ["Proteína: Gulash de res en salsa criolla", "Ensalada: Lechuga, tomate y vinagreta", "Complemento: Arroz blanco"],
        prep: "Cocinar el gulash de res hasta ablandar. Servir con arroz blanco y ensalada fresca.",
        macros: { weight: 450, calories: 520, protein: 38, carbs: 50, fats: 17, sugars: 5 }
      },
      {
        id: "d25-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-emoji-smile",
        name: "Bastones de Zanahoria con Limón y Sal",
        ingredients: ["Bastones de zanahoria fresca", "Limón y sal"],
        prep: "Mezclar la zanahoria en bastones con zumo de limón y sal.",
        macros: { weight: 120, calories: 40, protein: 1, carbs: 9, fats: 0, sugars: 5 }
      },
      {
        id: "d25-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich de Atún con Tomate y Lechuga",
        ingredients: ["Pan tajado", "Atún en agua", "Tomate y lechuga"],
        prep: "Mezclar el atún con un toque de limón y armar el sándwich con tomate y lechuga.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar a alta velocidad y consumir.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d26-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Fritos con Tostadas y Chocolate con Leche",
        ingredients: ["2 Huevos fritos", "2 Tostadas de pan", "Chocolate caliente con leche"],
        prep: "Freír los huevos y servir con las tostadas crujientes y chocolate con leche.",
        macros: { weight: 310, calories: 380, protein: 17, carbs: 36, fats: 18, sugars: 14 }
      },
      {
        id: "d26-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Taza de Fresas",
        ingredients: ["1 Taza de fresas frescas"],
        prep: "Consumir las fresas lavadas.",
        macros: { weight: 140, calories: 45, protein: 1, carbs: 11, fats: 0, sugars: 7 }
      },
      {
        id: "d26-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Milanesa de Cerdo con Puré de Papa Criolla y Ensalada",
        ingredients: ["Proteína: Milanesa de cerdo al horno", "Ensalada: Espinaca, cebolla y vinagreta", "Complemento: Puré de papa criolla"],
        prep: "Hornear la milanesa de cerdo. Acompañar con puré de papa criolla y ensalada de espinaca.",
        macros: { weight: 450, calories: 500, protein: 36, carbs: 44, fats: 18, sugars: 4 }
      },
      {
        id: "d26-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-circle",
        name: "Huevo Duro sobre Tostada de Arroz",
        ingredients: ["1 Huevo duro picado", "1 Tostada de arroz"],
        prep: "Picar el huevo duro y colocar sobre la tostada de arroz.",
        macros: { weight: 85, calories: 110, protein: 7, carbs: 8, fats: 5, sugars: 0 }
      },
      {
        id: "d26-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Arepa Pequeña con Queso a la Plancha",
        ingredients: ["1 Arepa pequeña", "Queso campesino a la plancha"],
        prep: "Asar la arepa y el queso juntos.",
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
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todo hasta homogenizar.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d27-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Revueltos con Maicitos, Arepa y Café con Leche",
        ingredients: ["2 Huevos revueltos con maíz dulce", "1 Arepa", "Café caliente con leche"],
        prep: "Revolver los huevos con el maíz dulce. Servir con la arepa asada y café con leche.",
        macros: { weight: 310, calories: 360, protein: 16, carbs: 42, fats: 14, sugars: 8 }
      },
      {
        id: "d27-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Mandarina o Naranja",
        ingredients: ["1 Mandarina fresca"],
        prep: "Pelar y consumir la fruta.",
        macros: { weight: 130, calories: 50, protein: 1, carbs: 12, fats: 0, sugars: 9 }
      },
      {
        id: "d27-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Pechuga a la Planche con Patacones y Guacamole",
        ingredients: ["Proteína: Pechuga de pollo a la plancha", "Ensalada: Guacamole artesanal", "Complemento: Patacones de plátano verde"],
        prep: "Asar la pechuga. Preparar los patacones y acompañar con abundante guacamole.",
        macros: { weight: 460, calories: 520, protein: 42, carbs: 40, fats: 20, sugars: 3 }
      },
      {
        id: "d27-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Yogur Griego con Avena",
        ingredients: ["Yogur griego", "Avena"],
        prep: "Mezclar ambos ingredientes y consumir frío.",
        macros: { weight: 170, calories: 150, protein: 14, carbs: 16, fats: 3, sugars: 8 }
      },
      {
        id: "d27-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Crema de Verduras Sencilla con Tostadas",
        ingredients: ["1 Pocillo de crema de verduras", "2 Tostadas de pan"],
        prep: "Calentar la crema y acompañar de las tostadas de pan.",
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
    day: 29,
    meals: [
      {
        id: "d29-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todos los ingredientes.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d29-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Omelette de Champiñones con Galletas Saltinas y Café",
        ingredients: ["Omelette de 2 huevos con champiñones", "2 Galletas Saltinas", "Café con leche"],
        prep: "Hacer el omelette con champiñones. Servir con galletas Saltinas y café caliente.",
        macros: { weight: 270, calories: 320, protein: 17, carbs: 24, fats: 16, sugars: 7 }
      },
      {
        id: "d29-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Manzana Fresca",
        ingredients: ["1 Manzana roja"],
        prep: "Consumir entera.",
        macros: { weight: 150, calories: 80, protein: 0, carbs: 21, fats: 0, sugars: 16 }
      },
      {
        id: "d29-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Carne Desmechada con Yuca y Ensalada de Pepino",
        ingredients: ["Proteína: Carne de res desmechada", "Ensalada: Pepino cohombro y maíz tierno", "Complemento: Yuca al vapor"],
        prep: "Servir la carne desmechada con yuca caliente y ensalada de pepino.",
        macros: { weight: 450, calories: 510, protein: 41, carbs: 48, fats: 15, sugars: 5 }
      },
      {
        id: "d29-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-nut",
        name: "Mix de Frutos Secos",
        ingredients: ["1 Puñado de frutos secos"],
        prep: "Consumir al natural.",
        macros: { weight: 40, calories: 180, protein: 6, carbs: 14, fats: 12, sugars: 6 }
      },
      {
        id: "d29-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Wrap de Maíz con Jamón, Huevo y Lechuga",
        ingredients: ["1 Tortilla de maíz", "1 Tajada de jamón", "1 Huevo revuelto", "Lechuga"],
        prep: "Calentar la tortilla, colocar lechuga, jamón y el huevo revuelto. Envolver.",
        macros: { weight: 190, calories: 240, protein: 15, carbs: 18, fats: 11, sugars: 2 }
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
        prep: "Licuar a alta velocidad y tomar de inmediato.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d30-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Pericos con Arepa y Aguapanela con Leche",
        ingredients: ["2 Huevos pericos con guiso", "1 Arepa de maíz", "Aguapanela caliente con leche"],
        prep: "Revolver los huevos con el guiso, servir sobre la arepa y acompañar con la aguapanela.",
        macros: { weight: 320, calories: 380, protein: 18, carbs: 45, fats: 14, sugars: 12 }
      },
      {
        id: "d30-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Durazno Fresco",
        ingredients: ["1 Durazno mediano"],
        prep: "Lavar y consumir.",
        macros: { weight: 140, calories: 60, protein: 1, carbs: 14, fats: 0, sugars: 11 }
      },
      {
        id: "d30-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Pechuga Gratinada con Papa Criolla y Ensalada Caprese",
        ingredients: ["Proteína: Pechuga gratinada con queso y jamón", "Ensalada: Tomate con orégano y aceite de oliva", "Complemento: Papa criolla frita en airfryer"],
        prep: "Gratinar la pechuga en el horno. Servir con la papa criolla dorada y la ensalada de tomate.",
        macros: { weight: 450, calories: 530, protein: 44, carbs: 36, fats: 22, sugars: 3 }
      },
      {
        id: "d30-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-cup-straw",
        name: "Gelatina Light",
        ingredients: ["1 Taza de gelatina light"],
        prep: "Servir fría.",
        macros: { weight: 150, calories: 20, protein: 2, carbs: 3, fats: 0, sugars: 0 }
      },
      {
        id: "d30-m6",
        type: "Cena",
        time: "07:00 PM - 08:30 PM",
        icon: "bi-moon-stars-fill",
        name: "Sándwich Sencillo de Queso y Tomate",
        ingredients: ["Pan tajado", "Queso tajado", "Rodajas de tomate"],
        prep: "Armar el sándwich y dorar en sartén hasta derretir el queso.",
        macros: { weight: 160, calories: 220, protein: 10, carbs: 24, fats: 9, sugars: 3 }
      }
    ]
  },
  {
    day: 31,
    meals: [
      {
        id: "d31-m1",
        type: "Batido Verde",
        time: "06:00 AM - 07:00 AM",
        icon: "bi-cup-hot-fill",
        name: "Batido Verde Desintoxicante",
        ingredients: ["Espinaca fresca", "Apio", "Piña en cubos", "Agua helada"],
        prep: "Licuar todos los ingredientes.",
        macros: { weight: 250, calories: 110, protein: 3, carbs: 24, fats: 1, sugars: 14 }
      },
      {
        id: "d31-m2",
        type: "Desayuno",
        time: "07:00 AM - 08:30 AM",
        icon: "bi-egg-fried",
        name: "Huevos Revueltos con Tostadas y Café con Leche",
        ingredients: ["2 Huevos revueltos", "2 Tostadas de pan", "Café caliente con leche"],
        prep: "Hacer los huevos revueltos, servir con tostadas crujientes y café con leche.",
        macros: { weight: 270, calories: 300, protein: 16, carbs: 22, fats: 15, sugars: 7 }
      },
      {
        id: "d31-m3",
        type: "Fruta de la Mañana",
        time: "09:30 AM - 10:30 AM",
        icon: "bi-apple",
        name: "Porción de Piña Fresca",
        ingredients: ["1 Taza de piña fresca"],
        prep: "Consumir la piña fresca porcionada.",
        macros: { weight: 150, calories: 75, protein: 1, carbs: 19, fats: 0, sugars: 14 }
      },
      {
        id: "d31-m4",
        type: "Almuerzo",
        time: "12:30 PM - 01:30 PM",
        icon: "bi-pie-chart-fill",
        name: "Sancocho Trifásico de Pollo y Carne con Arroz",
        ingredients: ["Proteína: Pollo y carne de res en caldo", "Ensalada: Pico de gallo", "Complemento: Sancocho (papa, plátano verde, yuca) + Arroz blanco"],
        prep: "Servir el sancocho con papa, yuca, plátano y las carnes acompañando con arroz blanco.",
        macros: { weight: 550, calories: 610, protein: 42, carbs: 68, fats: 18, sugars: 4 }
      },
      {
        id: "d31-m5",
        type: "Snack de la Tarde",
        time: "03:30 PM - 04:30 PM",
        icon: "bi-box-seam-fill",
        name: "Crispetas Caseras Bajas en Grasa",
        ingredients: ["1 Bolsa pequeña de crispetas caseras"],
        prep: "Preparar en airfryer u olla sin exceso de grasa.",
        macros: { weight: 40, calories: 120, protein: 3, carbs: 22, fats: 3, sugars: 0 }
      },
      {
        id: "d31-m6",
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

// Estado Global de la aplicación
let currentDay = 1;
let caloriesChart = null;

// Inicialización de la aplicación al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderDaySelector();
  initChart();
  loadDay(currentDay);
});

// Control del Tema (Modo Claro / Oscuro)
function initTheme() {
  const themeToggleBtn = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-bs-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener("click", () => {
    const activeTheme = document.documentElement.getAttribute("data-bs-theme");
    const newTheme = activeTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById("themeIcon");
  if (theme === "dark") {
    themeIcon.className = "bi bi-sun-fill text-warning";
  } else {
    themeIcon.className = "bi bi-moon-stars-fill";
  }
}

// Renderizar Selector Horizontal de Días (Día 1 a Día 31)
function renderDaySelector() {
  const container = document.getElementById("daySelector");
  container.innerHTML = "";

  for (let i = 1; i <= 31; i++) {
    const btn = document.createElement("button");
    btn.className = `btn btn-day ${i === currentDay ? "active" : ""}`;
    btn.textContent = `Día ${i}`;
    btn.onclick = () => selectDay(i);
    container.appendChild(btn);
  }
}

// Cambiar de día seleccionado
function selectDay(dayNumber) {
  currentDay = dayNumber;

  // Actualizar la clase activa en los botones de selección de días
  const buttons = document.querySelectorAll(".btn-day");
  buttons.forEach((btn, index) => {
    if (index + 1 === dayNumber) {
      btn.classList.add("active");
      btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    } else {
      btn.classList.remove("active");
    }
  });

  loadDay(dayNumber);
}

// Cargar la información del día seleccionado
function loadDay(dayNumber) {
  const dayData = mealPlanData.find(d => d.day === dayNumber);
  document.getElementById("selectedDayTitle").textContent = `Comidas del Día ${dayNumber}`;

  renderMeals(dayData ? dayData.meals : []);
  updateNutritionDashboard();
}

// Renderizar el acordeón de comidas con la casilla de verificación
function renderMeals(meals) {
  const accordionContainer = document.getElementById("mealsAccordion");
  accordionContainer.innerHTML = "";

  if (!meals || meals.length === 0) {
    accordionContainer.innerHTML = `<div class="alert alert-info text-center">No hay datos disponibles para este día.</div>`;
    return;
  }

  meals.forEach((meal, index) => {
    const isChecked = localStorage.getItem(`meal_check_${meal.id}`) === "true";

    const item = document.createElement("div");
    item.className = "accordion-item";

    item.innerHTML = `
      <h2 class="accordion-header" id="heading-${meal.id}">
        <div class="d-flex align-items-center w-100 pe-3">
          <div class="form-check ms-3 my-auto" onclick="event.stopPropagation();">
            <input class="form-check-input meal-checkbox" 
                   type="checkbox" 
                   id="check-${meal.id}" 
                   data-meal-id="${meal.id}"
                   ${isChecked ? "checked" : ""} 
                   onchange="toggleMealCheck('${meal.id}')"
                   style="transform: scale(1.25); cursor: pointer;">
          </div>
          <button class="accordion-button collapsed flex-grow-1" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${meal.id}" aria-expanded="false" aria-controls="collapse-${meal.id}">
            <div class="d-flex flex-column text-start">
              <span class="meal-title text-success fw-bold d-flex align-items-center gap-2">
                <i class="bi ${meal.icon}"></i> ${meal.type}
                <span class="badge-time">${meal.time}</span>
              </span>
              <span class="fw-semibold text-dark fs-6 mt-1">${meal.name}</span>
            </div>
          </button>
        </div>
      </h2>
      <div id="collapse-${meal.id}" class="accordion-collapse collapse" aria-labelledby="heading-${meal.id}" data-bs-parent="#mealsAccordion">
        <div class="accordion-body">
          <div class="mb-3">
            <strong class="text-secondary d-block mb-1"><i class="bi bi-basket me-1"></i> Ingredientes:</strong>
            <ul class="mb-0 ps-3">
              ${meal.ingredients.map(ing => `<li>${ing}</li>`).join("")}
            </ul>
          </div>
          <div class="mb-3 prep-box">
            <strong class="text-success d-block mb-1"><i class="bi bi-journal-text me-1"></i> Preparación:</strong>
            <p class="mb-0 text-secondary">${meal.prep}</p>
          </div>
          <div>
            <strong class="text-secondary d-block mb-2"><i class="bi bi-card-checklist me-1"></i> Información Nutricional (1 Porción):</strong>
            <div class="table-responsive">
              <table class="table table-sm table-bordered text-center align-middle table-nutrition mb-0">
                <thead>
                  <tr>
                    <th>Peso</th>
                    <th>Calorías</th>
                    <th>Proteína</th>
                    <th>Carbos</th>
                    <th>Grasas</th>
                    <th>Azúcares</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${meal.macros.weight}g</td>
                    <td><strong>${meal.macros.calories} kcal</strong></td>
                    <td>${meal.macros.protein}g</td>
                    <td>${meal.macros.carbs}g</td>
                    <td>${meal.macros.fats}g</td>
                    <td>${meal.macros.sugars}g</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    accordionContainer.appendChild(item);
  });
}

// Guardar/Actualizar la marca de la comida y refrescar el panel
function toggleMealCheck(mealId) {
  const checkbox = document.getElementById(`check-${mealId}`);
  if (checkbox) {
    localStorage.setItem(`meal_check_${mealId}`, checkbox.checked ? "true" : "false");
  }
  updateNutritionDashboard();
}

// Reiniciar marcas de las comidas del día actual
function resetDayCheckboxes() {
  const dayData = mealPlanData.find(d => d.day === currentDay);
  if (!dayData) return;

  dayData.meals.forEach(meal => {
    localStorage.removeItem(`meal_check_${meal.id}`);
    const checkbox = document.getElementById(`check-${meal.id}`);
    if (checkbox) {
      checkbox.checked = false;
    }
  });

  updateNutritionDashboard();
}

// Inicializar Gráfica Circular con Chart.js
function initChart() {
  const ctx = document.getElementById("caloriesChart").getContext("2d");
  caloriesChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Consumido", "Restante"],
      datasets: [{
        data: [0, 100],
        backgroundColor: ["#2ecc71", "#e0e0e0"],
        borderWidth: 0
      }]
    },
    options: {
      cutout: "75%",
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      responsive: true,
      maintainAspectRatio: true
    }
  });
}

// Calcular y actualizar Dashboard de Nutrición a partir de las comidas MARCADAS
function updateNutritionDashboard() {
  const dayData = mealPlanData.find(d => d.day === currentDay);
  if (!dayData) return;

  let totalCaloriesDay = 0;
  let consumedCalories = 0;
  let consumedProtein = 0;
  let consumedCarbs = 0;
  let consumedFats = 0;
  let consumedSugars = 0;

  let totalMeals = dayData.meals.length;
  let checkedMealsCount = 0;

  dayData.meals.forEach(meal => {
    totalCaloriesDay += meal.macros.calories;
    const isChecked = localStorage.getItem(`meal_check_${meal.id}`) === "true";

    if (isChecked) {
      checkedMealsCount++;
      consumedCalories += meal.macros.calories;
      consumedProtein += meal.macros.protein;
      consumedCarbs += meal.macros.carbs;
      consumedFats += meal.macros.fats;
      consumedSugars += meal.macros.sugars;
    }
  });

  // Si no hay calorías totales definidas para el día, evitamos dividir por cero
  const maxCaloriesTarget = totalCaloriesDay > 0 ? totalCaloriesDay : 2000;

  // Actualizar la interfaz de texto con los valores acumulados
  document.getElementById("totalCalories").textContent = `${consumedCalories} kcal`;
  document.getElementById("totalProtein").textContent = `${consumedProtein}g`;
  document.getElementById("totalCarbs").textContent = `${consumedCarbs}g`;
  document.getElementById("totalFats").textContent = `${consumedFats}g`;
  document.getElementById("totalSugars").textContent = `${consumedSugars}g`;

  // Calcular porcentaje de cumplimiento por número de comidas
  const percentage = totalMeals > 0 ? Math.round((checkedMealsCount / totalMeals) * 100) : 0;
  document.getElementById("progressText").textContent = `${percentage}%`;
  document.getElementById("progressBar").style.width = `${percentage}%`;

  // Actualizar la gráfica circular (Empieza desde 0 y suma con las casillas seleccionadas)
  if (caloriesChart) {
    const remainingCalories = Math.max(0, maxCaloriesTarget - consumedCalories);
    
    // Si nada está seleccionado, la gráfica es completamente neutra/vacía
    if (consumedCalories === 0) {
      caloriesChart.data.datasets[0].data = [0, maxCaloriesTarget];
      caloriesChart.data.datasets[0].backgroundColor = ["#2ecc71", "#e0e0e0"];
    } else {
      caloriesChart.data.datasets[0].data = [consumedCalories, remainingCalories];
      caloriesChart.data.datasets[0].backgroundColor = ["#2ecc71", "#e0e0e0"];
    }
    
    caloriesChart.update();
  }
}






/**
 * Auto-selector del día actual según la fecha del sistema.
 * Selecciona automáticamente el día correspondiente del 1 al 31.
 */
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const currentDayNumber = today.getDate(); // Retorna el día del mes (1 - 31)

  // Verifica que exista la función selectDay y que el día esté en el rango de 1 a 31
  if (typeof selectDay === "function" && currentDayNumber >= 1 && currentDayNumber <= 31) {
    selectDay(currentDayNumber);

    // Hace scroll horizontal automático para mostrar el botón activo
    const container = document.getElementById("daySelector");
    if (container) {
      const activeBtn = container.children[currentDayNumber - 1];
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }
});
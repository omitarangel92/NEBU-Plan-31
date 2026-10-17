import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateConsumedCalories,
  calculateMarketTotals,
  escapeHtml,
  migrateMarketCatalogs,
  mergeMealChanges,
  parseNonNegativeNumber,
  uniqueValues
} from "../shared-logic.mjs";

test("market totals distinguish bought from pending products", () => {
  const totals = calculateMarketTotals([
    { status: "YA", price: 2500, qty: 2 },
    { status: "SI", price: 1000, qty: 3 },
    { status: "NO", price: 5000, qty: 1 }
  ], 15000);

  assert.deepEqual(totals, {
    purchased: 5000,
    pending: 3000,
    projected: 8000,
    remaining: 7000
  });
});

test("catalog migration keeps custom values and removes accent-insensitive duplicates", () => {
  const original = {
    generalBudget: 45000,
    generalItems: [
      { concept: "Papaya", area: "Frutas", place: "Zapatoca", price: 3200, qty: 2 }
    ],
    areas: ["Frutas", "Frutas", "Compras futuras"],
    places: ["Zapatoca"]
  };
  const migrated = migrateMarketCatalogs(original);
  assert.deepEqual(migrated.generalItems, original.generalItems);
  assert.equal(migrated.generalBudget, original.generalBudget);
  assert.deepEqual(migrated.areas, ["Compras futuras", "Frutas"]);
  assert.deepEqual(migrated.places, ["Zapatoca"]);
  assert.deepEqual(uniqueValues(["Frutas", "frutas", "Aseo", "  Carnes  ", "Cárnes"]), [
    "Aseo",
    "Carnes",
    "Frutas"
  ]);
});

test("meal edits on separate fields merge without losing either change", () => {
  const original = {
    name: "A",
    prep: "Paso inicial",
    ingredients: ["arroz", "agua"],
    macros: { calories: 100, protein: 10 }
  };
  const latest = {
    name: "A",
    prep: "Paso actualizado",
    ingredients: ["arroz", "agua"],
    macros: { calories: 100, protein: 10 }
  };
  const proposed = {
    name: "B",
    prep: "Paso inicial",
    ingredients: ["arroz", "agua"],
    macros: { calories: 100, protein: 10 }
  };

  assert.deepEqual(mergeMealChanges(original, latest, proposed), {
    merged: {
      name: "B",
      prep: "Paso actualizado",
      ingredients: ["arroz", "agua"],
      macros: { calories: 100, protein: 10 }
    },
    conflicts: []
  });
});

test("concurrent edits to the same meal field are reported as conflicts", () => {
  const result = mergeMealChanges(
    { name: "Original" },
    { name: "Cambio remoto" },
    { name: "Cambio local" }
  );

  assert.deepEqual(result.conflicts, ["name"]);
  assert.equal(result.merged.name, "Cambio remoto");
});

test("restored checkbox states correctly recalculate consumed calories", () => {
  const meals = [
    { id: "meal-a", macros: { calories: 320 } },
    { id: "meal-b", macros: { calories: 180 } }
  ];
  assert.equal(calculateConsumedCalories(meals, { "check-meal-a": true }), 320);
});

test("zero is a valid numeric value while empty input is rejected", () => {
  assert.equal(parseNonNegativeNumber("0"), 0);
  assert.equal(parseNonNegativeNumber(""), null);
  assert.equal(parseNonNegativeNumber("-1"), null);
});

test("user-provided meal text is escaped before HTML rendering", () => {
  assert.equal(escapeHtml("<script>alert('x')</script>"), "&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;");
});

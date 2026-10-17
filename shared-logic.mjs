export function uniqueValues(values) {
  const seen = new Set();
  return values
    .map(value => String(value || "").trim())
    .filter(value => {
      const key = normalizeCatalogValue(value);
      if (!value || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.localeCompare(b, "es"));
}

function normalizeCatalogValue(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

export function migrateMarketCatalogs(data) {
  const items = Array.isArray(data.generalItems) ? data.generalItems : [];
  const areas = uniqueValues([...(Array.isArray(data.areas) ? data.areas : []), ...items.map(item => item?.area)]);
  const places = uniqueValues([...(Array.isArray(data.places) ? data.places : []), ...items.map(item => item?.place)]);
  const canonicalValue = (catalog, value) => catalog.find(entry =>
    normalizeCatalogValue(entry) === normalizeCatalogValue(String(value || "").trim())
  ) || value;
  return {
    ...data,
    areas,
    places,
    generalItems: items.map(item => ({
      ...item,
      area: canonicalValue(areas, item?.area || ""),
      place: canonicalValue(places, item?.place || "")
    }))
  };
}

export function calculateMarketTotals(items, budget) {
  const purchased = items.reduce(
    (sum, item) => sum + (item.status === "YA" ? item.price * item.qty : 0),
    0
  );
  const pending = items.reduce(
    (sum, item) => sum + (item.status === "SI" ? item.price * item.qty : 0),
    0
  );
  const projected = purchased + pending;
  return {
    purchased,
    pending,
    projected,
    remaining: budget - projected
  };
}

export function calculateConsumedCalories(meals, checkboxStates) {
  return meals.reduce((total, meal) => {
    return checkboxStates[`check-${meal.id}`] === true
      ? total + Number(meal.macros.calories || 0)
      : total;
  }, 0);
}

export function parseNonNegativeNumber(value) {
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  const number = Number(trimmed);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export function mergeMealChanges(original, latest, proposed) {
  const conflicts = [];
  const equals = (left, right) => {
    if (Object.is(left, right)) return true;
    if (!left || !right || typeof left !== "object" || typeof right !== "object") return false;
    if (Array.isArray(left) !== Array.isArray(right)) return false;
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    return leftKeys.length === rightKeys.length
      && leftKeys.every(key => Object.hasOwn(right, key) && equals(left[key], right[key]));
  };
  const merge = (before, current, next, path = "") => {
    if (equals(next, before)) return current;
    if (before && current && next
      && typeof before === "object"
      && typeof current === "object"
      && typeof next === "object"
      && !Array.isArray(before)
      && !Array.isArray(current)
      && !Array.isArray(next)) {
      const result = { ...current };
      for (const key of Object.keys(next)) {
        result[key] = merge(before[key], current[key], next[key], path ? `${path}.${key}` : key);
      }
      return result;
    }
    if (!equals(current, before) && !equals(current, next)) {
      conflicts.push(path || "contenido");
      return current;
    }
    return next;
  };

  return { merged: merge(original, latest, proposed), conflicts };
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

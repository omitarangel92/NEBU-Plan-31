import { doc, getDoc, getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { escapeHtml } from "./shared-logic.mjs";

export function installActivityHistory(app, auth) {
  const historyRef = doc(getFirestore(app), "sharedData", "activityHistory");

  window.showRecentActivity = async function() {
    if (!auth.currentUser) {
      await window.Swal.fire({ icon: "info", text: "Inicia sesión para consultar los cambios recientes." });
      return;
    }
    try {
      const snapshot = await getDoc(historyRef);
      const entries = snapshot.exists() && Array.isArray(snapshot.data().entries)
        ? snapshot.data().entries
        : [];
      const content = entries.length
        ? `<div class="text-start" style="max-height: 55vh; overflow-y: auto"><ul class="list-group">${
          entries.map(entry => `<li class="list-group-item">
            <div class="fw-semibold">${escapeHtml(entry.action || "Actualización")}</div>
            <small class="text-secondary">${escapeHtml(entry.actor || "Usuario")} · ${formatDate(entry.timestamp)}</small>
          </li>`).join("")
        }</ul></div>`
        : '<p class="text-secondary mb-0">Todavía no hay cambios registrados.</p>';
      await window.Swal.fire({
        title: "Cambios recientes",
        html: content,
        confirmButtonText: "Cerrar",
        width: 600
      });
    } catch (error) {
      console.error("Error leyendo el historial de cambios:", error);
      await window.Swal.fire({
        icon: "error",
        title: "No se pudo cargar el historial",
        text: "Revisa la conexión e inténtalo de nuevo."
      });
    }
  };
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  if (!Number.isFinite(date.getTime())) return "Fecha desconocida";
  return escapeHtml(date.toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short"
  }));
}

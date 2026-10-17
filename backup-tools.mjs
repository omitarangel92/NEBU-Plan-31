import { doc, getDoc, getFirestore, runTransaction } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export function installBackupTools(app, auth) {
  const db = getFirestore(app);
  const planRef = doc(db, "sharedData", "mainPlan");
  const marketRef = doc(db, "sharedData", "marketCompleteData");
  const historyRef = doc(db, "sharedData", "activityHistory");

  window.downloadAppBackup = async function() {
    const user = auth.currentUser;
    if (!user) {
      showBackupMessage("Inicia sesión para crear un respaldo.");
      return;
    }
    try {
      const [planSnapshot, marketSnapshot, userSnapshot, historySnapshot] = await Promise.all([
        getDoc(planRef),
        getDoc(marketRef),
        getDoc(doc(db, "users", user.uid)),
        getDoc(historyRef)
      ]);
      if (!planSnapshot.exists() || !marketSnapshot.exists()) {
        throw new Error("No se encontraron todos los datos compartidos para crear el respaldo.");
      }

      const backup = {
        format: "nebu-backup",
        version: 1,
        exportedAt: new Date().toISOString(),
        userUid: user.uid,
        plan: planSnapshot.data(),
        market: marketSnapshot.data(),
        activityHistory: historySnapshot.exists() ? historySnapshot.data() : { entries: [] },
        userData: userSnapshot.exists() ? userSnapshot.data() : {}
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `nebu-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showBackupMessage("Respaldo descargado. Guárdalo en un lugar seguro.");
    } catch (error) {
      console.error("Error descargando respaldo:", error);
      showBackupError("No se pudo descargar el respaldo. Revisa la conexión e inténtalo de nuevo.");
    }
  };

  window.selectAppBackup = function() {
    const input = document.getElementById("backupFileInput");
    if (input) input.click();
  };

  window.restoreAppBackup = async function(event) {
    const input = event.target;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showBackupError("El archivo supera el tamaño máximo de 10 MB.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      showBackupMessage("Inicia sesión para restaurar un respaldo.");
      return;
    }

    let backup;
    try {
      backup = JSON.parse(await file.text());
      validateBackup(backup);
    } catch (error) {
      console.error("Respaldo inválido:", error);
      showBackupError("El archivo no parece ser un respaldo válido de NEBU.");
      return;
    }

    const confirmation = await window.Swal.fire({
      icon: "warning",
      title: "¿Restaurar este respaldo?",
      text: "Se reemplazarán el plan y la lista compartidos por los datos del archivo. Esta operación puede sobrescribir cambios recientes.",
      input: "text",
      inputLabel: "Escribe RESTAURAR para confirmar",
      inputValidator: value => value === "RESTAURAR" ? undefined : "Escribe RESTAURAR para continuar.",
      showCancelButton: true,
      confirmButtonText: "Restaurar",
      cancelButtonText: "Cancelar"
    });
    if (!confirmation.isConfirmed) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await runTransaction(db, async transaction => {
        await transaction.get(planRef);
        await transaction.get(marketRef);
        const historySnapshot = await transaction.get(historyRef);
        if (backup.userUid === user.uid && backup.userData) {
          await transaction.get(userRef);
          transaction.set(userRef, backup.userData, { merge: true });
        }
        transaction.set(planRef, backup.plan);
        transaction.set(marketRef, backup.market);
        const history = backup.activityHistory?.entries
          ?? (historySnapshot.exists() && Array.isArray(historySnapshot.data().entries)
            ? historySnapshot.data().entries
            : []);
        transaction.set(historyRef, {
          entries: [{
            action: "Restauró un respaldo",
            actor: user.email || "Usuario autorizado",
            timestamp: new Date().toISOString()
          }, ...history].slice(0, 50)
        }, { merge: true });
      });
      const personalMessage = backup.userUid === user.uid
        ? "También se restauraron tus marcas personales."
        : "Tus marcas personales se conservaron porque el respaldo fue creado por la otra cuenta.";
      await window.Swal.fire({
        icon: "success",
        title: "Respaldo restaurado",
        text: `El plan y la lista compartidos fueron restaurados. ${personalMessage}`
      });
    } catch (error) {
      console.error("Error restaurando respaldo:", error);
      showBackupError("No se pudo restaurar el respaldo. Los datos no se reemplazaron.");
    }
  };
}

function validateBackup(backup) {
  if (!backup || backup.format !== "nebu-backup" || backup.version !== 1
    || !backup.plan || !Array.isArray(backup.plan.plan)
    || !backup.market?.data || !Array.isArray(backup.market.data.generalItems)
    || typeof backup.userUid !== "string"
    || !backup.plan.plan.every(day => Number.isInteger(day.day) && Array.isArray(day.meals)
      && day.meals.every(meal => typeof meal.id === "string"
        && Array.isArray(meal.ingredients)
        && meal.macros && typeof meal.macros === "object"))
    || !backup.market.data.generalItems.every(item => item && typeof item.id === "string"
      && typeof item.concept === "string"
      && typeof item.area === "string"
      && Number.isFinite(Number(item.price))
      && Number.isFinite(Number(item.qty)))
    || (backup.userData !== undefined
      && (!backup.userData || typeof backup.userData !== "object" || Array.isArray(backup.userData)))
    || (backup.activityHistory !== undefined
      && (!backup.activityHistory || !Array.isArray(backup.activityHistory.entries)
        || !backup.activityHistory.entries.every(entry => entry && typeof entry.action === "string"
          && typeof entry.timestamp === "string")))) {
    throw new Error("Formato de respaldo inválido.");
  }
}

function showBackupMessage(message) {
  if (window.Swal) window.Swal.fire({ icon: "info", text: message });
}

function showBackupError(message) {
  if (window.Swal) window.Swal.fire({ icon: "error", title: "Respaldo", text: message });
}

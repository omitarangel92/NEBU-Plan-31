const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");

initializeApp();
const groqApiKey = defineSecret("GROQ_API_KEY");
const macroFields = ["calories", "protein", "carbs", "fats", "sugars"];
const authorizedUserIds = new Set([
  "khWRDuGHOxbih1kTdgLxgiv6Rd52",
  "eBt7BBTdc4MLRzQx3arbgVxjM2F3"
]);

function assertAuthorizedUser(request) {
  if (!request.auth || request.auth.token.email_verified !== true) {
    throw new HttpsError("permission-denied", "Debes iniciar sesión con un correo verificado.");
  }
  if (!authorizedUserIds.has(request.auth.uid)) {
    throw new HttpsError("permission-denied", "Esta cuenta no está autorizada para usar la aplicación.");
  }
}

exports.calculateMacros = onCall(
  { region: "us-central1", secrets: [groqApiKey], timeoutSeconds: 60 },
  async request => {
    await assertAuthorizedUser(request);

    const ingredients = request.data?.ingredients;
    if (typeof ingredients !== "string" || !ingredients.trim() || ingredients.length > 4000) {
      throw new HttpsError("invalid-argument", "Los ingredientes no son válidos.");
    }

    let response;
    try {
      response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqApiKey.value()}`,
          "Content-Type": "application/json"
        },
        signal: AbortSignal.timeout(45000),
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [{
            role: "user",
            content: `Eres un nutricionista experto. Estima los macronutrientes para estos ingredientes:\n${ingredients.trim()}\nDevuelve únicamente un objeto JSON válido con valores numéricos enteros: {"calories":0,"protein":0,"carbs":0,"fats":0,"sugars":0}`
          }],
          response_format: { type: "json_object" }
        })
      });
    } catch (error) {
      console.error("Error conectando con Groq:", error);
      throw new HttpsError("unavailable", "El servicio de macros no está disponible.");
    }

    if (!response.ok) {
      console.error("Groq respondió con error HTTP:", response.status);
      throw new HttpsError("unavailable", "El servicio de macros no pudo completar el cálculo.");
    }

    let macros;
    try {
      const result = await response.json();
      macros = JSON.parse(result.choices?.[0]?.message?.content || "");
    } catch (error) {
      console.error("Groq devolvió una respuesta inválida:", error);
      throw new HttpsError("internal", "El resultado de macros no tenía un formato válido.");
    }

    return Object.fromEntries(macroFields.map(field => {
      const value = Number(macros[field]);
      if (!Number.isFinite(value) || value < 0 || value > 1000000) {
        throw new HttpsError("internal", "El resultado de macros contenía un valor inválido.");
      }
      return [field, Math.round(value)];
    }));
  }
);

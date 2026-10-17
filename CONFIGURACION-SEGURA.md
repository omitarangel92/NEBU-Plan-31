# Configuración segura de NEBU

El frontend requiere autenticación de correo verificado. Firestore y la función de IA autorizan únicamente las cuentas guardadas por el administrador en `appConfig/access`; esa lista no está incluida en el repositorio.

## Preparación de Firebase

1. En Firebase Console, abre **Authentication → Sign-in method** y habilita **Email/Password**. Crea cuentas para los dos correos de uso personal y comparte las contraseñas iniciales por un canal privado. No guardes contraseñas en este repositorio.
2. En **Authentication → Settings → Authorized domains**, agrega el dominio donde se publica la web.
3. Cambia el proyecto a **Blaze** si Firebase lo requiere para Cloud Functions.
4. Instala Firebase CLI, inicia sesión y selecciona el proyecto:

   ```powershell
   npm install -g firebase-tools
   firebase login
   firebase use fitplan30-76a27
   ```

5. Publica las reglas restrictivas:

   ```powershell
   firebase deploy --only firestore:rules
   ```

6. En **Firestore Database → Data**, crea `appConfig/access` con este documento:

   ```json
   {
     "allowedEmails": [
       "correo-del-propietario",
       "correo-de-la-esposa"
     ]
   }
   ```

   Sustituye los valores por los dos correos exactos de las cuentas de Firebase. Las reglas impiden que la web lea o cambie este documento.
7. En Groq, revoca la clave anterior, genera otra y guárdala directamente como secreto de Firebase. No la pegues en el código, en GitHub ni en el chat:

   ```powershell
   firebase functions:secrets:set GROQ_API_KEY
   ```

8. Instala las dependencias y publica las funciones:

   ```powershell
   Set-Location functions
   npm install
   Set-Location ..
   firebase deploy --only functions
   ```

   `GROQ_API_KEY` permanece en Secret Manager. La función lee los correos autorizados desde `appConfig/access`.

9. Cada persona inicia sesión en la web, solicita el correo de verificación y confirma la dirección antes de usar el plan o la lista.

## Reglas

`firestore.rules` concede acceso únicamente a cuentas autenticadas, verificadas y presentes en `appConfig/access`. Cada usuario solo puede leer y guardar su propio documento `users/{uid}`; los documentos compartidos del plan y mercado se sincronizan entre las cuentas autorizadas. El acceso a cualquier otra ruta queda denegado.

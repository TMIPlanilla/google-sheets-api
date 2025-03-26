const { google } = require("googleapis");

/**
 * Autenticación usando credenciales desde variable de entorno o archivo.
 */
function auth() {
  let credentials;

  if (process.env.CREDENTIALS_JSON) {
    // Usar variable de entorno en Render
    credentials = JSON.parse(process.env.CREDENTIALS_JSON);
  } else {
    // Usar archivo local en desarrollo
    credentials = require("./credentials.json");
  }

  const authClient = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return authClient;
}

module.exports = auth;

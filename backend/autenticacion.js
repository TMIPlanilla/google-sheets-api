const { google } = require("googleapis");
const dotenv = require("dotenv");

dotenv.config();

if (!process.env.CREDENTIALS_JSON) {
    console.error("❌ ERROR: La variable de entorno CREDENTIALS_JSON no está definida.");
    process.exit(1); // Termina la ejecución si no hay credenciales
}

let credentials;
try {
    credentials = JSON.parse(process.env.CREDENTIALS_JSON);
    console.log("✅ CREDENTIALS_JSON cargado correctamente.");
} catch (error) {
    console.error("❌ ERROR al analizar CREDENTIALS_JSON:", error);
    process.exit(1);
}

const auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = { auth, sheets };

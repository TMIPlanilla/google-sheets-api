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

// Definir variables de entorno para los IDs de hojas
const SHEET_RESPUESTAS = process.env.SHEET_RESPUESTAS;
const SHEET_SEMANAS = process.env.SHEET_SEMANAS;

if (!SHEET_RESPUESTAS || !SHEET_SEMANAS) {
    console.error("❌ ERROR: SHEET_RESPUESTAS o SHEET_SEMANAS no están definidos en las variables de entorno.");
    process.exit(1);
}

module.exports = { auth, sheets, SHEET_RESPUESTAS, SHEET_SEMANAS };

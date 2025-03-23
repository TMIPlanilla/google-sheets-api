const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const credentialsPath = path.join(__dirname, "credentials.json");

if (!fs.existsSync(credentialsPath)) {
    console.error("❌ ERROR: No se encontró 'credentials.json' en la carpeta 'backend'.");
    process.exit(1);
}

let credentials;
try {
    credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
    console.log("✅ CREDENTIALS_JSON cargado correctamente desde 'credentials.json'.");
} catch (error) {
    console.error("❌ ERROR al analizar 'credentials.json':", error);
    process.exit(1);
}

const auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SHEET_RESPUESTAS = process.env.SHEET_RESPUESTAS;
const SHEET_SEMANAS = process.env.SHEET_SEMANAS;

if (!SHEET_RESPUESTAS || !SHEET_SEMANAS) {
    console.error("❌ ERROR: SHEET_RESPUESTAS o SHEET_SEMANAS no están definidos en las variables de entorno.");
    process.exit(1);
}

module.exports = { auth, sheets, SHEET_RESPUESTAS, SHEET_SEMANAS };

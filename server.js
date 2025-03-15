const express = require("express");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const path = require("path"); // 📌 Importar 'path' para manejar rutas de archivos

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 📌 Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// 📌 Ruta para servir index.html en "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Configurar autenticación con Google Sheets usando la variable de entorno
const credentials = JSON.parse(process.env.CREDENTIALS_JSON);

const auth = new google.auth.GoogleAuth({
    credentials: credentials, // Usa las credenciales desde la variable de entorno
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Función para obtener datos de Google Sheets
async function getSheetData(sheetId, range) {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: range,
    });

    return response.data.values;
}

// Ruta para obtener datos de una hoja específica
app.get("/data/:sheet/:range", async (req, res) => {
    try {
        const sheetName = req.params.sheet.toUpperCase();
        const range = req.params.range;

        // Buscar el ID de la hoja en el archivo .env
        const sheetId = process.env[`GOOGLE_SHEET_${sheetName}`];

        if (!sheetId) {
            return res.status(400).json({ error: "Hoja no encontrada en .env" });
        }

        const data = await getSheetData(sheetId, range);
        res.json({ data });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error obteniendo los datos");
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

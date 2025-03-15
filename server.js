const express = require("express");
const { google } = require("googleapis");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos de "public"
app.use(express.static("public"));

// Servir archivos estáticos de "funciones"
app.use("/funciones", express.static("funciones"));

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

// ✅ NUEVA RUTA: Importar datos desde Google Sheets
app.post("/importar-datos", async (req, res) => {
    try {
        const sheetId = process.env.GOOGLE_SHEET_RESPUESTASFORMULARIO; // ID de la hoja
        const sheetName = "Respuestasformulario"; // Nombre de la hoja
        const range = "A1:H1000"; // Rango de datos

        const data = await getSheetData(sheetId, `${sheetName}!${range}`);

        if (!data || data.length === 0) {
            return res.status(400).json({ success: false, error: "No se encontraron datos en la hoja." });
        }

        console.log("✅ Datos importados:", data.length, "filas.");
        res.json({ success: true, data });
    } catch (error) {
        console.error("❌ Error al importar datos:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

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
    console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});

const express = require("express");
const { google } = require("googleapis");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir JSON en las solicitudes POST
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
    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: "v4", auth: client });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: range,
        });

        return response.data.values;
    } catch (error) {
        console.error("❌ Error al obtener los datos:", error);
        return null;
    }
}

// Función para insertar datos en la hoja destino
async function appendToSheet(sheetId, data) {
    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: "v4", auth: client });

        // Buscar la primera fila vacía
        const range = "A:A"; // Se usa la columna A para determinar la primera fila vacía
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: range,
        });

        const numRows = response.data.values ? response.data.values.length : 0;
        const startRow = numRows + 1; // Siguiente fila vacía

        console.log(`📌 Insertando datos en la hoja con ID: ${sheetId}`);
        console.log(`📌 Insertando en la fila: ${startRow}`);

        // Insertar datos en la hoja de destino
        const result = await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: `A${startRow}`,
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            resource: { values: data },
        });

        console.log(`✅ Datos insertados correctamente en la fila ${startRow}.`);
        return { success: true };
    } catch (error) {
        console.error("❌ Error al insertar datos en Google Sheets:", error);
        return { success: false, error: error.message };
    }
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
        if (!data) {
            return res.status(500).json({ error: "Error obteniendo los datos" });
        }

        res.json({ data });
    } catch (error) {
        console.error("❌ Error en la solicitud de datos:", error);
        res.status(500).json({ error: "Error en la solicitud" });
    }
});

// Ruta para importar datos a la hoja de destino
app.post("/importar-datos", async (req, res) => {
    try {
        const sheetId = process.env.GOOGLE_SHEET_SEMANAS;
        if (!sheetId) {
            return res.status(400).json({ error: "ID de la hoja destino no configurado." });
        }

        // Datos de ejemplo para insertar (debes reemplazar esto con los datos correctos desde el frontend)
        const datosAInsertar = [
            ["Ejemplo Nombre", "Fecha", "Entrada", "Salida", "Actividad"]
        ];

        const resultado = await appendToSheet(sheetId, datosAInsertar);

        res.json(resultado);
    } catch (error) {
        console.error("❌ Error en la importación:", error);
        res.status(500).json({ error: "Error en la importación" });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

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

// Función para encontrar la última fila vacía en la hoja
async function getFirstEmptyRow(sheetId, sheetName) {
    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: "v4", auth: client });

        const range = `${sheetName}!A:A`; // Se usa la columna A para determinar la primera fila vacía
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: range,
        });

        const numRows = response.data.values ? response.data.values.length : 0;
        
        // Buscar manualmente la primera fila realmente vacía
        for (let i = 0; i < numRows; i++) {
            if (!response.data.values[i] || response.data.values[i][0] === "") {
                return i + 1; // Retorna la primera fila vacía
            }
        }

        return numRows + 1; // Si no hay filas vacías en el medio, retorna la siguiente disponible
    } catch (error) {
        console.error("❌ Error al obtener la última fila vacía:", error);
        return null;
    }
}

// Función para insertar datos en la hoja destino
async function appendToSheet(sheetId, sheetName, data) {
    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: "v4", auth: client });

        const startRow = await getFirstEmptyRow(sheetId, sheetName);
        if (!startRow) {
            throw new Error("No se pudo determinar la última fila vacía.");
        }

        console.log(`📌 Insertando datos en la hoja con ID: ${sheetId}`);
        console.log(`📌 Insertando en la fila: ${startRow}`);

        // Insertar datos en la hoja de destino
        const result = await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `${sheetName}!A${startRow}`,
            valueInputOption: "RAW",
            resource: { values: data },
        });

        console.log(`✅ Datos insertados correctamente en la fila ${startRow}.`);
        return { success: true, insertedRow: startRow };
    } catch (error) {
        console.error("❌ Error al insertar datos en Google Sheets:", error);
        return { success: false, error: error.message };
    }
}

// Ruta para obtener datos de una hoja específica
app.get("/data/:sheet/:range", async (req, res) => {
    try {
        const sheetName = req.params.sheet;
        const range = req.params.range;
        const sheetId = process.env.GOOGLE_SHEET_SEMANAS;

        if (!sheetId) {
            return res.status(400).json({ error: "Hoja no encontrada en .env" });
        }

        const data = await getSheetData(sheetId, `${sheetName}!${range}`);
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
        const sheetName = "Semanas"; // Asegurarnos de usar la hoja correcta

        if (!sheetId) {
            return res.status(400).json({ error: "ID de la hoja destino no configurado." });
        }

        // Datos de ejemplo para insertar (debes reemplazar esto con los datos correctos desde el frontend)
        const datosAInsertar = [
            ["Ejemplo Nombre", "Fecha", "Entrada", "Salida", "Actividad"]
        ];

        const resultado = await appendToSheet(sheetId, sheetName, datosAInsertar);

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

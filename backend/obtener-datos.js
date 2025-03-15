const { sheets } = require("./autenticacion");

const SHEET_RESPUESTAS = process.env.SHEET_RESPUESTAS; // Leer desde variables de entorno

async function obtenerDatos(req, res) {
    try {
        const { range } = req.params;
        
        if (!SHEET_RESPUESTAS) {
            throw new Error("El ID de la hoja SHEET_RESPUESTAS no está definido en las variables de entorno.");
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_RESPUESTAS,
            range: range,
        });

        res.json({ data: response.data.values || [] });
    } catch (error) {
        console.error("❌ Error al obtener datos:", error);
        res.status(500).json({ error: "Error al obtener datos de Google Sheets" });
    }
}

module.exports = obtenerDatos;


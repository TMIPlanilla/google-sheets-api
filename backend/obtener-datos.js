const { sheets } = require("./autenticacion");

const SHEET_RESPUESTAS = process.env.SHEET_RESPUESTAS; // ID del archivo de Google Sheets

async function obtenerDatos(req, res) {
    try {
        const { range } = req.params;

        if (!SHEET_RESPUESTAS) {
            throw new Error("El ID de la hoja SHEET_RESPUESTAS no está definido en las variables de entorno.");
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_RESPUESTAS,
            range: `Respuestasformulario!${range}`, // Asegurar que obtiene de la hoja fuente correcta
        });

        res.json({ data: response.data.values || [] });
    } catch (error) {
        console.error("❌ Error al obtener datos:", error);
        res.status(500).json({ error: "Error al obtener datos de Google Sheets" });
    }
}

module.exports = obtenerDatos;

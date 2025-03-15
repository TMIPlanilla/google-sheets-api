const { sheets } = require("./autenticacion");
const { SHEET_RESPUESTAS } = require("./credentials");

async function obtenerDatos(req, res) {
    try {
        const { range } = req.params;
        
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
 

const { sheets } = require("./autenticacion");

const SHEET_RESPUESTAS = process.env.SHEET_RESPUESTAS; // Leer desde variables de entorno

async function obtenerDatos(req, res) {
    try {
        const { range } = req.params;

        if (!SHEET_RESPUESTAS) {
            return res.status(500).json({ error: "El ID de la hoja SHEET_RESPUESTAS no está definido en las variables de entorno." });
        }

        console.log(`📌 Obteniendo datos de la hoja: ${SHEET_RESPUESTAS} con rango: ${range}`);

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_RESPUESTAS,
            range: range,
        });

        const data = response.data.values || [];

        if (data.length === 0) {
            console.warn("⚠️ La hoja de cálculo está vacía o no se encontraron datos en el rango proporcionado.");
        } else {
            console.log(`📌 Datos obtenidos: ${data.length} filas`);
            console.log("📌 Vista previa de los datos obtenidos:", data.slice(0, 5)); // Mostrar primeras 5 filas
        }

        res.json({ data });
    } catch (error) {
        console.error("❌ Error al obtener datos:", error);
        res.status(500).json({ error: "Error al obtener datos de Google Sheets" });
    }
}

module.exports = obtenerDatos;

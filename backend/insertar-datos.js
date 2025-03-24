const { sheets } = require("./autenticacion");

const SHEET_SEMANAS = process.env.SHEET_SEMANAS; // ID del archivo correcto

async function insertarDatos(req, res) {
    try {
        const newData = req.body.data.slice(2); // ✅ Eliminar encabezado

        if (!SHEET_SEMANAS) {
            return res.status(500).json({ success: false, message: "El ID de la hoja SHEET_SEMANAS no está definido." });
        }

        if (!Array.isArray(newData) || newData.length === 0) {
            return res.status(400).json({ success: false, message: "No se recibieron datos válidos para importar." });
        }

        // ✅ Obtener datos actuales de la hoja "Semanas"
        const existingDataResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_SEMANAS,
            range: "Semanas!A:G",
        });

        const existingData = existingDataResponse.data.values || [];

        // ✅ Filtrar solo datos nuevos
        const filteredData = newData.filter(row =>
            !existingData.some(existingRow =>
                existingRow.slice(0, 7).join("|") === row.slice(0, 7).join("|")
            )
        );

        if (filteredData.length === 0) {
            return res.json({ success: false, message: "No hay datos nuevos para importar." });
        }

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_SEMANAS,
            range: "Semanas!A1",
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            resource: { values: filteredData },
        });

        res.json({ success: true, message: `✅ ${filteredData.length} filas añadidas en 'Semanas'.` });
    } catch (error) {
        console.error("❌ Error al insertar datos:", error);
        res.status(500).json({ error: "Error al insertar datos en Google Sheets" });
    }
}

module.exports = insertarDatos;

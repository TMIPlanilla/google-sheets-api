const { SHEET_RESPUESTAS, SHEET_SEMANAS } = require("./autenticacion");


async function insertarDatos(req, res) {
    try {
        const newData = req.body.data;

        // Obtener datos actuales de la hoja
        const existingDataResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_SEMANAS,
            range: "A:G",
        });

        const existingData = existingDataResponse.data.values || [];

        // Filtrar datos nuevos que no estén en la hoja destino
        const filteredData = newData.filter(row =>
            !existingData.some(existingRow =>
                existingRow.slice(0, 7).join("") === row.slice(0, 7).join("")
            )
        );

        if (filteredData.length === 0) {
            return res.json({ success: false, message: "No hay datos nuevos para importar." });
        }

        // Buscar la primera fila vacía
        const startRow = existingData.length + 1;
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_SEMANAS,
            range: `A${startRow}`,
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            resource: { values: filteredData },
        });

        res.json({ success: true, message: `✅ ${filteredData.length} nuevas filas añadidas.` });
    } catch (error) {
        console.error("❌ Error al insertar datos:", error);
        res.status(500).json({ error: "Error al insertar datos en Google Sheets" });
    }
}

module.exports = insertarDatos;
 

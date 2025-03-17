const { sheets } = require("./autenticacion");

const SHEET_SEMANAS = process.env.SHEET_SEMANAS;

async function insertarDatos(req, res) {
    try {
        const newData = req.body.data;

        if (!SHEET_SEMANAS) {
            return res.status(500).json({ success: false, message: "El ID de la hoja SHEET_SEMANAS no está definido." });
        }

        if (!Array.isArray(newData) || newData.length < 3) {
            return res.status(400).json({ success: false, message: "No se recibieron datos válidos para importar." });
        }

        const datosSinEncabezado = newData.slice(2); // Omitir las dos primeras filas

        const existingDataResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_SEMANAS,
            range: "Semanas!A:G",
        });

        const existingData = existingDataResponse.data.values || [];

        const filteredData = datosSinEncabezado.filter(row =>
            !existingData.some(existingRow =>
                existingRow.slice(0, 7).join("|") === row.slice(0, 7).join("|")
            )
        );

        if (filteredData.length === 0) {
            return res.json({ success: false, message: "No hay datos nuevos para importar." });
        }

        const startRow = existingData.length + 1;

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_SEMANAS,
            range: `Semanas!A${startRow}`,
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            resource: { values: filteredData },
        });

        res.json({ success: true, message: `✅ ${filteredData.length} nuevas filas añadidas en "Semanas".` });
    } catch (error) {
        console.error("❌ Error al insertar datos:", error);
        res.status(500).json({ error: "Error al insertar datos en Google Sheets" });
    }
}

module.exports = insertarDatos;

const { sheets } = require("./autenticacion");

const SHEET_SEMANAS = process.env.SHEET_SEMANAS; // Asegurar que está correctamente definida

async function insertarDatos(req, res) {
    try {
        const newData = req.body.data;

        console.log(`📌 ID de SHEET_SEMANAS: ${SHEET_SEMANAS}`);
        console.log(`📌 Datos recibidos para importar: ${newData.length} filas`);
        console.log("📌 Vista previa de los datos recibidos:", newData.slice(0, 5)); // Mostrar primeras 5 filas

        if (!SHEET_SEMANAS) {
            return res.status(500).json({ success: false, message: "El ID de la hoja SHEET_SEMANAS no está definido." });
        }

        if (!Array.isArray(newData) || newData.length <= 1) {
            return res.status(400).json({ success: false, message: "No se recibieron datos válidos para importar." });
        }

        // Asegurar que no se envía el encabezado
        const datosSinEncabezado = newData.filter((_, index) => index !== 0);

        console.log(`📌 Datos después de eliminar encabezado: ${datosSinEncabezado.length} filas`);

        // Obtener datos actuales de la hoja destino
        const existingDataResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_SEMANAS,
            range: "A:G",
        });

        const existingData = existingDataResponse.data.values || [];

        console.log(`📌 Datos existentes en la hoja destino: ${existingData.length} filas`);

        // Filtrar solo los datos que no estén ya en la hoja destino
        const filteredData = datosSinEncabezado.filter(row =>
            !existingData.some(existingRow =>
                existingRow.slice(0, 7).join("|") === row.slice(0, 7).join("|")
            )
        );

        console.log(`📌 Filas a insertar después de filtrar: ${filteredData.length}`);

        if (filteredData.length === 0) {
            return res.json({ success: false, message: "No hay datos nuevos para importar." });
        }

        // Insertar los datos en la hoja de destino
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_SEMANAS,
            range: "A:G",
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

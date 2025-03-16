const { sheets } = require("./autenticacion");

const SHEET_SEMANAS = process.env.SHEET_SEMANAS; // Definir desde variables de entorno

async function insertarDatos(req, res) {
    try {
        // 🔹 Validar si los datos existen y son un array
        if (!req.body || !req.body.data || !Array.isArray(req.body.data)) {
            throw new Error("❌ Error: No se recibieron datos válidos para importar.");
        }

        const newData = req.body.data;

        if (!SHEET_SEMANAS) {
            throw new Error("El ID de la hoja SHEET_SEMANAS no está definido en las variables de entorno.");
        }

        console.log("📌 Obteniendo datos actuales de la hoja...");
        const existingDataResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_SEMANAS,
            range: "A:G",
        });

        const existingData = existingDataResponse.data.values || [];

        console.log(`📌 Datos existentes: ${existingData.length} filas encontradas.`);

        // 🔹 Validar que `existingData` es un array antes de aplicar `.some()`
        if (!Array.isArray(existingData)) {
            throw new Error("❌ Error: Los datos obtenidos de la hoja no son un array válido.");
        }

        // 🔹 Filtrar solo los datos nuevos que no están en la hoja destino
        const filteredData = newData.filter(row =>
            !existingData.some(existingRow =>
                Array.isArray(existingRow) && existingRow.slice(0, 7).join("") === row.slice(0, 7).join("")
            )
        );

        if (filteredData.length === 0) {
            console.log("🔹 No hay datos nuevos para importar.");
            return res.json({ success: false, message: "No hay datos nuevos para importar." });
        }

        // 🔹 Buscar la primera fila vacía
        const startRow = existingData.length + 1;
        console.log(`📌 Insertando ${filteredData.length} filas nuevas en la hoja a partir de la fila ${startRow}...`);

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_SEMANAS,
            range: `A${startRow}`,
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            resource: { values: filteredData },
        });

        console.log("✅ Importación completada con éxito.");
        res.json({ success: true, message: `✅ ${filteredData.length} nuevas filas añadidas.` });
    } catch (error) {
        console.error("❌ Error al insertar datos:", error.message);
        res.status(500).json({ error: error.message });
    }
}

module.exports = insertarDatos;

const { sheets } = require("./autenticacion");

const SHEET_SEMANAS = process.env.SHEET_SEMANAS; // Definir desde variables de entorno

async function insertarDatos(req, res) {
    try {
        // Verificar si el cuerpo de la solicitud contiene datos
        if (!req.body.data || !Array.isArray(req.body.data)) {
            return res.status(400).json({ error: "Los datos enviados no son válidos." });
        }

        const newData = req.body.data;
        console.log("📌 Datos recibidos para insertar:", newData);

        if (!SHEET_SEMANAS) {
            throw new Error("El ID de la hoja SHEET_SEMANAS no está definido en las variables de entorno.");
        }

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
            console.log("📌 No hay datos nuevos para importar.");
            return res.json({ success: false, message: "No hay datos nuevos para importar." });
        }

        // Buscar la primera fila vacía
        const startRow = existingData.length + 1;
        console.log(`📌 Insertando ${filteredData.length} nuevas filas en la fila ${startRow}.`);

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_SEMANAS,
            range: `A${startRow}`,
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            resource: { values: filteredData },
        });

        console.log(`✅ ${filteredData.length} filas añadidas correctamente.`);
        res.json({ success: true, message: `✅ ${filteredData.length} nuevas filas añadidas.` });

    } catch (error) {
        console.error("❌ Error al insertar datos:", error);
        res.status(500).json({ error: "Error al insertar datos en Google Sheets" });
    }
}

module.exports = insertarDatos;

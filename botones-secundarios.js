const express = require("express");
const { getSheetsClient } = require("./auth");

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/importar-datos", async (req, res) => {
    console.log("🚀 Ejecutando importarDatosDesdeGoogleSheets...");

    const sheetId = "1OjieaBUcl7O181IGUTLlZOLHiH7aV_7Yy7UKr0hnshI";
    const sheetName = "Respuestasformulario";
    const range = "A1:H1000";

    try {
        const sheets = await getSheetsClient();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `${sheetName}!${range}`,
        });

        if (!response.data.values || response.data.values.length === 0) {
            return res.json({ success: false, error: "⚠️ No se encontraron datos en la hoja de cálculo." });
        }

        console.log("✅ Datos obtenidos de Google Sheets:", response.data.values);
        await insertarDatosEnDestino(response.data.values);
        res.json({ success: true });
    } catch (error) {
        console.error("❌ Error en importarDatosDesdeGoogleSheets:", error);
        res.json({ success: false, error: error.message });
    }
});

async function insertarDatosEnDestino(datos) {
    console.log("🚀 Ejecutando insertarDatosEnDestino...");

    const sheetIdDestino = "1vqK4_8cxheoA8nxSPrytvxRsOnHIPv8GuJ5WzL-RB90";
    const hojaDestino = "Semanas";

    try {
        const sheets = await getSheetsClient();
        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetIdDestino,
            range: `${hojaDestino}!A1`,
            valueInputOption: "USER_ENTERED",
            resource: { values: datos },
        });

        console.log("✅ Importación completada correctamente.");
    } catch (error) {
        console.error("❌ Error en insertarDatosEnDestino:", error);
    }
}

app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});

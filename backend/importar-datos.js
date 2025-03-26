const { google } = require("googleapis");
const auth = require("./autenticacion");

const SHEET_ID_ORIGEN = "1OjieaBUcl7O181IGUTLlZOLHiH7aV_7Yy7UKr0hnshI";
const SHEET_NAME_ORIGEN = "Respuestasformulario";
const RANGO_ORIGEN = `${SHEET_NAME_ORIGEN}!A3:H1000`;

const SHEET_ID_DESTINO = "1vqK4_8cxheoA8nxSPrytvxRsOnHIPv8GuJ5WzL-RB90";
const SHEET_NAME_DESTINO = "Semanas";

async function importarDatos(req, res) {
  console.log("🔄 Iniciando proceso de importación...");

  try {
    const client = await auth();
    const sheets = google.sheets({ version: "v4", auth: client });

    // Leer datos desde hoja fuente
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID_ORIGEN,
      range: RANGO_ORIGEN,
    });

    const filas = response.data.values;
    if (!filas || filas.length === 0) {
      console.log("⚠️ No se encontraron datos para importar.");
      return res.status(200).json({ message: "No se encontraron datos para importar." });
    }

    console.log(`📥 ${filas.length} filas leídas desde la hoja fuente.`);

    // Insertar en hoja destino usando append
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID_DESTINO,
      range: `${SHEET_NAME_DESTINO}!A1:H1`,
      valueInputOption: "RAW",
      resource: {
        values: filas,
      },
    });

    const rangoDestino = appendResponse.data.updates.updatedRange || "desconocido";
    console.log(`✅ Datos importados correctamente en rango: ${rangoDestino}`);
    res.status(200).json({ message: `Datos importados correctamente en rango: ${rangoDestino}` });
  } catch (error) {
    console.error("❌ Error al importar datos:", error);
    res.status(500).json({ message: "Error al importar datos", error });
  }
}

module.exports = importarDatos;

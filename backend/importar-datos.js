const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const auth = require("./autenticacion");

// IDs y rangos fijos
const ID_HOJA_ORIGEN = "1OjieaBUcl7O181IGUTLlZOLHiH7aV_7Yy7UKr0hnshI";
const NOMBRE_HOJA_ORIGEN = "Respuestasformulario";
const RANGO_ORIGEN = "A3:H1000";

const ID_HOJA_DESTINO = "1vqK4_8cxheoA8nxSPrytvxRsOnHIPv8GuJ5WzL-RB90";
const NOMBRE_HOJA_DESTINO = "Semanas";
const RANGO_DESTINO_BASE = "Semanas!A1:H1";

router.get("/importar-datos", async (req, res) => {
  console.log("\n🔄 Iniciando proceso de importación...");
  try {
    const authClient = await auth();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    // Leer datos desde la hoja fuente (A3:H1000)
    const respuesta = await sheets.spreadsheets.values.get({
      spreadsheetId: ID_HOJA_ORIGEN,
      range: `${NOMBRE_HOJA_ORIGEN}!${RANGO_ORIGEN}`,
    });

    const filas = respuesta.data.values || [];
    console.log(`📥 ${filas.length} filas leídas desde la hoja fuente.`);

    if (!filas.length) {
      return res.status(200).json({ mensaje: "No hay datos nuevos para importar." });
    }

    // Leer todos los datos actuales en la hoja destino para evitar duplicados
    const existentesRes = await sheets.spreadsheets.values.get({
      spreadsheetId: ID_HOJA_DESTINO,
      range: `${NOMBRE_HOJA_DESTINO}!A3:H` // omitimos encabezados (A1 y A2)
    });

    const existentes = existentesRes.data.values || [];

    // Filtrar filas que no estén ya presentes en la hoja destino
    const nuevasFilas = filas.filter(nueva => {
      return !existentes.some(existente => JSON.stringify(existente) === JSON.stringify(nueva));
    });

    if (!nuevasFilas.length) {
      console.log("⚠️ No se encontraron filas nuevas para importar.");
      return res.status(200).json({ mensaje: "No se encontraron filas nuevas para importar." });
    }

    // Agregar las nuevas filas usando append (expande la hoja automáticamente)
    const resultado = await sheets.spreadsheets.values.append({
      spreadsheetId: ID_HOJA_DESTINO,
      range: RANGO_DESTINO_BASE,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: nuevasFilas,
      },
    });

    const rangoDestino = resultado.data.updates?.updatedRange || "(rango desconocido)";
    console.log(`✅ Datos importados correctamente en rango: ${rangoDestino}`);

    res.json({ mensaje: `✅ Datos importados correctamente en rango: ${rangoDestino}` });
  } catch (error) {
    console.error("❌ Error al importar datos:", error);
    res.status(500).json({ error: `❌ Error inesperado: ${error.message}` });
  }
});

module.exports = router;

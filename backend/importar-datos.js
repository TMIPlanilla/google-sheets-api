const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const auth = require("./autenticacion");

const ID_HOJA_DESTINO = "1vqK4_8cxheoA8nxSPrytvxRsOnHIPv8GuJ5WzL-RB90";
const ID_HOJA_ORIGEN = "1OjieaBUcl7O181IGUTLlZOLHiH7aV_7Yy7UKr0hnshI";

router.get("/importar-datos", async (req, res) => {
  console.log("🔄 Iniciando proceso de importación...");

  try {
    const authClient = await auth();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    // Leer datos desde la hoja fuente (A3:H1000)
    const rangoOrigen = "Respuestasformulario!A3:H1000";
    const respuesta = await sheets.spreadsheets.values.get({
      spreadsheetId: ID_HOJA_ORIGEN,
      range: rangoOrigen,
    });

    const filas = respuesta.data.values || [];
    console.log(`📥 ${filas.length} filas leídas desde la hoja fuente.`);

    if (filas.length === 0) {
      return res.json({ mensaje: "❌ No se encontraron datos para importar." });
    }

    // Leer datos existentes en hoja destino
    const rangoDestino = "Semanas!A3:H1000";
    const datosExistentes = await sheets.spreadsheets.values.get({
      spreadsheetId: ID_HOJA_DESTINO,
      range: rangoDestino,
    });

    const filasExistentes = datosExistentes.data.values || [];

    // Convertir a strings para comparar filas completas
    const existentesComoTexto = filasExistentes.map((fila) => JSON.stringify(fila));
    const nuevasFilas = filas.filter((fila) => !existentesComoTexto.includes(JSON.stringify(fila)));

    if (nuevasFilas.length === 0) {
      console.log("✅ No se encontraron filas nuevas para importar.");
      return res.json({ mensaje: "✅ No se encontraron filas nuevas para importar." });
    }

    // Agregar nuevas filas usando append
    await sheets.spreadsheets.values.append({
      spreadsheetId: ID_HOJA_DESTINO,
      range: "Semanas!A1:H1",
      valueInputOption: "RAW",
      resource: { values: nuevasFilas },
    });

    const filaInicio = filasExistentes.length + 3;
    console.log(`✅ Datos importados correctamente en rango: Semanas!A${filaInicio}`);
    res.json({ mensaje: `✅ Datos importados correctamente en rango: Semanas!A${filaInicio}` });

  } catch (error) {
    console.error("❌ Error al importar datos:", error.message || error);
    res.status(500).json({ mensaje: "❌ Error inesperado: " + (error.message || error) });
  }
});

module.exports = router;

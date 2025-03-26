// backend/importar-datos.js

const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const auth = require("./autenticacion");

// IDs y nombres fijos
const ID_HOJA_ORIGEN = "1OjieaBUcl7O181IGUTLlZOLHiH7aV_7Yy7UKr0hnshI";
const NOMBRE_HOJA_ORIGEN = "Respuestasformulario";
const RANGO_ORIGEN = `${NOMBRE_HOJA_ORIGEN}!A3:H1000`;

const ID_HOJA_DESTINO = "1vqK4_8cxheoA8nxSPrytvxRsOnHIPv8GuJ5WzL-RB90";
const NOMBRE_HOJA_DESTINO = "Semanas";
const RANGO_DESTINO_BASE = `${NOMBRE_HOJA_DESTINO}!A1:H1`; // Para append

router.post("/importar-datos", async (req, res) => {
  console.log("\u{1F504} Iniciando proceso de importación...");

  try {
    const authClient = await auth();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    // Leer datos desde hoja de origen
    const respuestaOrigen = await sheets.spreadsheets.values.get({
      spreadsheetId: ID_HOJA_ORIGEN,
      range: RANGO_ORIGEN,
    });

    const datosNuevos = respuestaOrigen.data.values || [];
    console.log(`📥 ${datosNuevos.length} filas leídas desde la hoja fuente.`);

    if (datosNuevos.length === 0) {
      return res.status(200).send("No hay datos nuevos para importar.");
    }

    // Leer datos actuales en hoja de destino para evitar duplicados
    const respuestaDestino = await sheets.spreadsheets.values.get({
      spreadsheetId: ID_HOJA_DESTINO,
      range: `${NOMBRE_HOJA_DESTINO}!A3:H1000`,
    });

    const datosExistentes = (respuestaDestino.data.values || []).map((fila) => fila.join("||"));

    const datosFiltrados = datosNuevos.filter((fila) => fila.join("||").trim() !== "" && !datosExistentes.includes(fila.join("||")));

    if (datosFiltrados.length === 0) {
      console.log("✅ No hay filas nuevas para agregar (todo está actualizado).\n");
      return res.status(200).send("No hay filas nuevas para agregar.");
    }

    // Agregar datos nuevos al final usando append
    await sheets.spreadsheets.values.append({
      spreadsheetId: ID_HOJA_DESTINO,
      range: RANGO_DESTINO_BASE,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: datosFiltrados,
      },
    });

    console.log(`✅ ${datosFiltrados.length} filas importadas correctamente.\n`);
    res.status(200).send(`Importación completada. ${datosFiltrados.length} filas nuevas agregadas.`);
  } catch (error) {
    console.error("❌ Error al importar datos:", error);
    res.status(500).send("Error al importar datos");
  }
});

module.exports = router;

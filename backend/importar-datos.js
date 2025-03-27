// importar-datos.js

const express = require("express");
const { google } = require("googleapis");
const auth = require("./autenticacion");
const router = express.Router();

// IDs fijos
const ID_HOJA_DESTINO = "1vqK4_8cxheoA8nxSPrytvxRsOnHIPv8GuJ5WzL-RB90";
const ID_HOJA_ORIGEN = "1OjieaBUcl7O181IGUTLlZOLHiH7aV_7Yy7UKr0hnshI";

// Nombres de las hojas
const NOMBRE_HOJA_ORIGEN = "Respuestasformulario";
const NOMBRE_HOJA_DESTINO = "Semanas";

router.get("/importar-datos", async (req, res) => {
  console.log("\u{1F504} Iniciando proceso de importación...");

  try {
    const authClient = await auth();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    // Leer datos desde la hoja fuente (omitir encabezados en fila 1 y 2)
    const rangoOrigen = `${NOMBRE_HOJA_ORIGEN}!A3:H1000`;
    const respuesta = await sheets.spreadsheets.values.get({
      spreadsheetId: ID_HOJA_ORIGEN,
      range: rangoOrigen,
    });

    const nuevasFilas = respuesta.data.values || [];
    console.log(`\u{1F4E5} ${nuevasFilas.length} filas leídas desde la hoja fuente.`);

    if (nuevasFilas.length === 0) {
      return res.status(200).send("Sin datos nuevos para importar.");
    }

    // Leer datos actuales en la hoja destino
    const respuestaDestino = await sheets.spreadsheets.values.get({
      spreadsheetId: ID_HOJA_DESTINO,
      range: `${NOMBRE_HOJA_DESTINO}!A1:H1000`,
    });

    const filasExistentes = respuestaDestino.data.values || [];
    const filasTexto = filasExistentes.map((fila) => JSON.stringify(fila));

    // Filtrar filas nuevas que no estén ya en destino
    const filasParaAgregar = nuevasFilas.filter(
      (fila) => !filasTexto.includes(JSON.stringify(fila))
    );

    if (filasParaAgregar.length === 0) {
      console.log("\u{274C} No hay filas nuevas para agregar.");
      return res.status(200).send("No hay filas nuevas para agregar.");
    }

    // Insertar datos nuevos con append
    await sheets.spreadsheets.values.append({
      spreadsheetId: ID_HOJA_DESTINO,
      range: `${NOMBRE_HOJA_DESTINO}!A1:H1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: filasParaAgregar,
      },
    });

    const filaInicio = filasExistentes.length + 1;
    console.log(`\u{2705} Datos importados correctamente en rango: ${NOMBRE_HOJA_DESTINO}!A${filaInicio}`);
    res.status(200).send(`Importación completada: ${filasParaAgregar.length} filas nuevas.`);
  } catch (error) {
    console.error("\u{274C} Error al importar datos:", error);
    res.status(500).send("Error en el servidor al importar datos.");
  }
});

module.exports = router;

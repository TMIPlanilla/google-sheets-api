const { google } = require('googleapis');
const { auth } = require('./autenticacion');

/**
 * Importar datos desde Google Sheets:
 * Fuente: archivo con hoja "Respuestasformulario"
 * Destino: archivo con hoja "Semanas"
 */
async function importarDatos(req, res) {
  console.log("🔄 Iniciando proceso de importación...");

  try {
    const authClient = await auth();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // IDs y nombres de hoja fijos
    const ID_ORIGEN = '1OjieaBUcl7O181IGUTLlZOLHiH7aV_7Yy7UKr0hnshI';
    const HOJA_ORIGEN = 'Respuestasformulario';
    const ID_DESTINO = '1vqK4_8cxheoA8nxSPrytvxRsOnHIPv8GuJ5WzL-RB90';
    const HOJA_DESTINO = 'Semanas';

    const rangoLectura = `${HOJA_ORIGEN}!A1:H1000`;

    // Leer datos desde la hoja fuente
    const respuesta = await sheets.spreadsheets.values.get({
      spreadsheetId: ID_ORIGEN,
      range: rangoLectura,
    });

    const datos = respuesta.data.values || [];

    if (datos.length === 0) {
      console.log("⚠️ No se encontraron datos en la hoja origen.");
      return res.status(200).json({ mensaje: "La hoja origen está vacía." });
    }

    console.log(`📥 ${datos.length} filas leídas desde la hoja fuente.`);

    // Buscar primera fila vacía en la hoja destino
    const respuestaDestino = await sheets.spreadsheets.values.get({
      spreadsheetId: ID_DESTINO,
      range: `${HOJA_DESTINO}!A:A`,
    });

    const filasExistentes = respuestaDestino.data.values?.length || 0;
    const rangoPegado = `${HOJA_DESTINO}!A${filasExistentes + 1}`;

    // Escribir los datos en la hoja destino
    await sheets.spreadsheets.values.update({
      spreadsheetId: ID_DESTINO,
      range: rangoPegado,
      valueInputOption: 'RAW',
      requestBody: { values: datos },
    });

    console.log(`✅ Datos importados correctamente en rango: ${rangoPegado}`);
    res.status(200).json({ mensaje: "Datos importados correctamente." });

  } catch (error) {
    console.error("❌ Error al importar datos:", error);
    res.status(500).json({ error: "Ocurrió un error al importar los datos." });
  }
}
// backend/importar-datos.js
const { google } = require("googleapis");
const auth = require("./autenticacion");

const ID_HOJA_ORIGEN = "1OjieaBUcl7O181IGUTLlZOLHiH7aV_7Yy7UKr0hnshI";
const HOJA_ORIGEN = "Respuestasformulario";
const RANGO_ORIGEN = `${HOJA_ORIGEN}!A3:H1000`; // Omitimos las filas 1 y 2

const ID_HOJA_DESTINO = "1vqK4_8cxheoA8nxSPrytvxRsOnHIPv8GuJ5WzL-RB90";
const HOJA_DESTINO = "Semanas";
const RANGO_BASE_DESTINO = `${HOJA_DESTINO}!A1:H1`; // Para usar con append

async function importarDatos(req, res) {
  console.log("\u{1F504} Iniciando proceso de importación...");
  try {
    const client = await auth();
    const sheets = google.sheets({ version: "v4", auth: client });

    // Leer datos desde la hoja origen (omitimos encabezados)
    const respuesta = await sheets.spreadsheets.values.get({
      spreadsheetId: ID_HOJA_ORIGEN,
      range: RANGO_ORIGEN,
    });

    const filas = respuesta.data.values || [];
    console.log(`\u{1F4E5} ${filas.length} filas leídas desde la hoja fuente.`);

    if (filas.length === 0) {
      return res.status(200).send("No hay datos nuevos para importar.");
    }

    // Agregar los datos al final de la hoja destino
    await sheets.spreadsheets.values.append({
      spreadsheetId: ID_HOJA_DESTINO,
      range: RANGO_BASE_DESTINO,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: filas,
      },
    });

    console.log(`\u{2705} Datos importados correctamente.`);
    res.status(200).send("Datos importados correctamente.");
  } catch (error) {
    console.error("\u{274C} Error al importar datos:", error);
    res.status(500).send("Error al importar datos.");
  }
}

module.exports = importarDatos;

module.exports = importarDatos;

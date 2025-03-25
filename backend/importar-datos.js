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

module.exports = importarDatos;

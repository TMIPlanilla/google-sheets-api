const { google } = require('googleapis');
const auth = require('./autenticacion');

const SHEET_ID_ORIGEN = '1OjieaBUcl7O181IGUTLlZOLHiH7aV_7Yy7UKr0hnshI';
const SHEET_ID_DESTINO = '1lgu13gDLZUPz8k35mOhWQxImfAKtie8qNWxdtMkjslY';

async function importarDatos(req, res) {
  try {
    const sheets = google.sheets({ version: 'v4', auth });

    // 1. Leer datos desde la hoja fuente
    const origen = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID_ORIGEN,
      range: 'Respuestasformulario!A1:H1000',
    });

    const datos = origen.data.values || [];
    if (datos.length === 0) {
      return res.status(400).json({ mensaje: '⚠️ No se encontraron datos en la hoja de origen.' });
    }

    // 2. Leer la celda IDENT!D9 del archivo destino
    const meta = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID_DESTINO,
      range: 'IDENT!D9',
    });

    const celdaD9 = meta.data.values?.[0]?.[0] || '(vacía)';

    // 3. Usar siempre la hoja "Semanas"
    const hojaDestino = 'Semanas';

    // 4. Buscar la primera fila vacía en la hoja destino
    const lecturaDestino = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID_DESTINO,
      range: `${hojaDestino}!A1:A10000`,
    });

    const filasExistentes = lecturaDestino.data.values ? lecturaDestino.data.values.length : 0;
    const filaInicio = filasExistentes + 1;

    // 5. Escribir los datos importados
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID_DESTINO,
      range: `${hojaDestino}!A${filaInicio}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: datos,
      },
    });

    return res.json({
      mensaje: `✅ Importación completada.`,
      origen: `${datos.length} filas extraídas desde 'Respuestasformulario'`,
      destino: `Insertadas en hoja '${hojaDestino}' desde la fila ${filaInicio}`,
      referenciaD9: `Valor leído de IDENT!D9: "${celdaD9}"`,
    });

  } catch (error) {
    console.error('❌ Error al importar datos:', error);
    return res.status(500).json({ mensaje: '❌ Error al importar datos', error: error.message });
  }
}

module.exports = importarDatos;

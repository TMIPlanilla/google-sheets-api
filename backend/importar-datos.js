// backend/importar-datos.js

const express = require('express');
const { google } = require('googleapis');
const auth = require('./autenticacion');

const router = express.Router();

const SHEET_ID_ORIGEN = '1OjieaBUcl7O181IGUTLlZOLHiH7aV_7Yy7UKr0hnshI';
const SHEET_ID_DESTINO = '1vqK4_8cxheoA8nxSPrytvxRsOnHIPv8GuJ5WzL-RB90';
const HOJA_ORIGEN = 'Respuestasformulario';
const HOJA_DESTINO = 'Semanas';

router.post('/importar-datos', async (req, res) => {
  console.log('🔄 Iniciando proceso de importación...');
  try {
    const authClient = await auth();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Leer datos desde la hoja fuente
    const respuestaFuente = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID_ORIGEN,
      range: `${HOJA_ORIGEN}!A1:H1000`,
    });
    const filasFuente = respuestaFuente.data.values || [];

    if (filasFuente.length <= 1) {
      return res.status(400).send('⚠️ No hay datos nuevos para importar.');
    }

    // Leer datos existentes en la hoja destino
    const respuestaDestino = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID_DESTINO,
      range: `${HOJA_DESTINO}!A1:H1000`,
    });
    const filasDestino = respuestaDestino.data.values || [];

    // Convertir filas destino a strings para comparación
    const hashDestino = new Set(filasDestino.map(fila => fila.join('||')));

    // Filtrar filas únicas (omitir encabezado)
    const nuevasFilas = filasFuente.slice(1).filter(fila => {
      return !hashDestino.has(fila.join('||'));
    });

    if (nuevasFilas.length === 0) {
      return res.status(200).send('✅ No se encontraron nuevas filas para agregar.');
    }

    // Agregar nuevas filas con append
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID_DESTINO,
      range: `${HOJA_DESTINO}!A1:H1`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: nuevasFilas,
      },
    });

    console.log(`✅ ${nuevasFilas.length} filas nuevas importadas correctamente.`);
    res.status(200).send(`✅ ${nuevasFilas.length} filas nuevas importadas correctamente.`);
  } catch (error) {
    console.error('❌ Error al importar datos:', error);
    res.status(500).send('❌ Error al importar datos.');
  }
});

module.exports = router;

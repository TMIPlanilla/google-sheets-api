 
const fs = require('fs');
const { google } = require('googleapis');

// Cargar credenciales de la cuenta de servicio
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json', // Archivo JSON de la cuenta de servicio
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

async function obtenerIDDesdeGoogleSheets() {
    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        // ID de la hoja y celda donde está el ID real
        const spreadsheetId = "1lgu13gDLZUPz8k35mOhWQxImfAKtie8qNWxdtMkjslY";
        const range = "ID!D6"; // Celda que contiene el ID de la hoja de destino

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        return response.data.values[0][0];
    } catch (error) {
        console.error("Error obteniendo el ID:", error);
        return null;
    }
}

// Crear un servidor en Node.js para servir este dato
const express = require('express');
const app = express();
const port = 3001;

app.get('/obtener-sheet-id', async (req, res) => {
    const sheetId = await obtenerIDDesdeGoogleSheets();
    if (sheetId) {
        res.json({ sheetId });
    } else {
        res.status(500).json({ error: "No se pudo obtener el ID del Sheet" });
    }
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

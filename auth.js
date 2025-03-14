const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Ruta del archivo JSON de credenciales
const CREDENTIALS_PATH = path.join(__dirname, 'credentialOA.json');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function getAuthClient() {
    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: SCOPES
    });
    return auth.getClient();
}

async function getSheetsClient() {
    const auth = await getAuthClient();
    return google.sheets({ version: 'v4', auth });
}

module.exports = { getSheetsClient };

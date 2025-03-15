const { google } = require("googleapis");
const dotenv = require("dotenv");

dotenv.config();

const credentials = JSON.parse(process.env.CREDENTIALS_JSON);

const auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = { auth, sheets };
 

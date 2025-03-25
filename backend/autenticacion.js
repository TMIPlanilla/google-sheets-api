const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const auth = async () => {
  const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));

  const authClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  await authClient.authorize();
  return authClient;
};

module.exports = { auth };

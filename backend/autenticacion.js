const { google } = require('googleapis');

const auth = async () => {
  const credentials = JSON.parse(process.env.CREDENTIALS_JSON);

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

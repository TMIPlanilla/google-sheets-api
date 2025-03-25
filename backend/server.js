const express = require('express');
const cors = require('cors');
const path = require('path');

const importarDatos = require('./importar-datos');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// Endpoint para importar datos desde Google Sheets
app.get('/importar-datos', importarDatos);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor backend escuchando en http://localhost:${PORT}`);
});

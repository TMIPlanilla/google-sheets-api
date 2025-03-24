const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Servir carpeta pública y funciones
app.use(express.static(path.join(__dirname, "../public")));
app.use("/funciones", express.static(path.join(__dirname, "../funciones")));

// Ruta raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

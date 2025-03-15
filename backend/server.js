const express = require("express");
const dotenv = require("dotenv");
const obtenerDatos = require("./obtener-datos");
const insertarDatos = require("./insertar-datos");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir JSON en las solicitudes POST
app.use(express.json());

// Servir archivos estáticos
app.use(express.static("public"));
app.use("/funciones", express.static("funciones"));

// Rutas
app.get("/api/data/:range", obtenerDatos);
app.post("/api/importar-datos", insertarDatos);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

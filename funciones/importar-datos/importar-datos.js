async function enviarSolicitudAlServidor() {
    console.log("🚀 Enviando solicitud al servidor para importar datos...");

    try {
        // ✅ Deshabilitar el botón y desmarcar el checkbox tras el primer click
        const botonImportar = document.getElementById("importarDatos");
        const checkImportar = document.getElementById("checkImportar");
        const mensajeImportacion = document.getElementById("mensajeImportacion");

        botonImportar.disabled = true; // Deshabilitar botón tras el click
        checkImportar.checked = false; // Desmarcar checkbox

        // ✅ Obtener datos de la hoja fuente antes de enviarlos
        const responseDatos = await fetch("/api/data/A1:H1000");
        const datos = await responseDatos.json();

        console.log("📌 Datos obtenidos desde la hoja fuente:", datos.data.slice(0, 5));

        if (!datos.data || datos.data.length < 3) {
            console.error("❌ No se encontraron datos válidos en la hoja fuente.");
            mensajeImportacion.innerHTML = "⚠ No hay datos nuevos para importar.";
            mostrarNotificacion("❌ No hay datos nuevos para importar.", "error");
            return;
        }

        // ✅ Enviar datos al servidor para importar
        const response = await fetch("/api/importar-datos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: datos.data }),
        });

        const data = await response.json();
        console.log("📌 Respuesta del servidor:", data);

        if (data.success) {
            mensajeImportacion.innerHTML = `✔ ${data.message}`; // Mantener mensaje hasta nueva ejecución
            mostrarNotificacion(`✅ Importación completada. ${data.message}`, "success");
        } else {
            mensajeImportacion.innerHTML = `❌ Error en la importación: ${data.message}`;
            mostrarNotificacion(`❌ Error en la importación: ${data.message}`, "error");
        }

    } catch (error) {
        console.error("❌ Error en la solicitud al servidor:", error);
        mensajeImportacion.innerHTML = "❌ Error en la comunicación con el servidor.";
        mostrarNotificacion("❌ Error en la comunicación con el servidor.", "error");
    }
}

// ✅ Escuchar cambios en el `checkbox` para habilitar/deshabilitar el botón de importación
document.getElementById("checkImportar").addEventListener("change", function () {
    const botonImportar = document.getElementById("importarDatos");
    const mensajeImportacion = document.getElementById("mensajeImportacion");

    if (this.checked) {
        botonImportar.disabled = false; // Habilitar botón
        mensajeImportacion.innerHTML = ""; // Borrar mensaje solo al activar el check
    } else {
        botonImportar.disabled = true; // Mantener botón deshabilitado
    }
});

function asignarEventoImportar() {
    const botonImportar = document.getElementById("importarDatos");

    if (botonImportar) {
        botonImportar.removeEventListener("click", enviarSolicitudAlServidor);
        botonImportar.addEventListener("click", enviarSolicitudAlServidor);
        console.log("✅ Evento 'click' agregado correctamente al botón 'Importar Datos'.");
    } else {
        console.error("❌ ERROR: No se encontró el botón 'Importar Datos'. Intentando nuevamente en 500ms...");
        setTimeout(asignarEventoImportar, 500);
    }
}

// Ejecutar la asignación después de un tiempo para garantizar que el botón existe
setTimeout(asignarEventoImportar, 500);

function enviarSolicitudAlServidor() {
    console.log("🚀 Enviando solicitud al servidor para importar datos...");
    
    fetch("/importar-datos", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarNotificacion("✅ Importación completada correctamente.", "success");
            } else {
                mostrarNotificacion("❌ Error en la importación: " + data.error, "error");
            }
        })
        .catch(error => {
            console.error("❌ Error en la solicitud al servidor:", error);
            mostrarNotificacion("❌ Error en la comunicación con el servidor.", "error");
        });
}

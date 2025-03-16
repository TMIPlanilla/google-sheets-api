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

async function enviarSolicitudAlServidor() {
    console.log("🚀 Enviando solicitud al servidor para importar datos...");

    try {
        const response = await fetch("/api/importar-datos", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: [] }) // Aquí se deben enviar los datos correctos
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        console.log("📌 Respuesta del servidor:", data);

        if (data.success) {
            mostrarNotificacion(`✅ ${data.message}`, "success");
        } else {
            mostrarNotificacion(`❌ Error en la importación: ${data.error || data.message}`, "error");
        }
    } catch (error) {
        console.error("❌ Error en la solicitud al servidor:", error);
        mostrarNotificacion("❌ Error en la comunicación con el servidor.", "error");
    }
}

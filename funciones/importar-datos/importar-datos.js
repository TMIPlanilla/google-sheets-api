function asignarEventoImportar() {
    const botonImportar = document.getElementById("importarDatos");
    const checkbox = document.getElementById("validacion");

    if (botonImportar && checkbox) {
        botonImportar.removeEventListener("click", enviarSolicitudAlServidor);
        botonImportar.addEventListener("click", enviarSolicitudAlServidor);
        console.log("✅ Evento 'click' agregado correctamente al botón 'Importar Datos'.");
    } else {
        console.error("❌ ERROR: No se encontró el botón o el checkbox.");
        setTimeout(asignarEventoImportar, 500);
    }
}

// ✅ Asegurar asignación después de que la interfaz se haya cargado completamente
setTimeout(asignarEventoImportar, 500);

async function enviarSolicitudAlServidor() {
    console.log("🚀 Enviando solicitud al servidor para importar datos...");

    try {
        // ✅ Deshabilitar el botón y el checkbox tras el primer click
        document.getElementById("importarDatos").disabled = true;
        document.getElementById("validacion").checked = false;

        // ✅ Borrar mensajes previos de éxito o error
        document.getElementById("notificaciones").innerHTML = "";

        // ✅ Obtener datos de la hoja fuente
        const responseDatos = await fetch("/api/data/A1:H1000");
        const datos = await responseDatos.json();

        console.log("📌 Datos obtenidos desde la hoja fuente:", datos.data.slice(0, 5));

        if (!datos.data || datos.data.length < 3) {
            console.error("❌ No se encontraron datos válidos en la hoja fuente.");
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
            mostrarNotificacion(`✅ Importación completada. ${data.message}`, "success");
        } else {
            mostrarNotificacion(`❌ Error en la importación: ${data.message}`, "error");
        }
    } catch (error) {
        console.error("❌ Error en la solicitud al servidor:", error);
        mostrarNotificacion("❌ Error en la comunicación con el servidor.", "error");
    }
}

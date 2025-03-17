function asignarEventoImportar() {
    const botonImportar = document.getElementById("importarDatos");
    const checkboxImportar = document.getElementById("checkImportar");

    if (botonImportar && checkboxImportar) {
        botonImportar.disabled = !checkboxImportar.checked; // Habilitar/deshabilitar basado en el checkbox

        checkboxImportar.addEventListener("change", () => {
            botonImportar.disabled = !checkboxImportar.checked; // Re-habilitar el botón solo si el checkbox se marca
            limpiarMensaje(); // Limpiar mensaje al reactivar el botón
        });

        botonImportar.removeEventListener("click", enviarSolicitudAlServidor);
        botonImportar.addEventListener("click", enviarSolicitudAlServidor);
        console.log("✅ Evento 'click' agregado correctamente al botón 'Importar Datos'.");
    } else {
        console.error("❌ ERROR: No se encontró el botón o el checkbox.");
        setTimeout(asignarEventoImportar, 500); // Reintentar asignar evento después de un breve tiempo
    }
}

// ✅ Limpiar mensaje al marcar nuevamente el checkbox
function limpiarMensaje() {
    const mensaje = document.getElementById("mensajeImportacion");
    if (mensaje) {
        mensaje.innerHTML = "";
    }
}

// Ejecutar la asignación después de un tiempo para garantizar que el botón existe
setTimeout(asignarEventoImportar, 500);

async function enviarSolicitudAlServidor() {
    console.log("🚀 Enviando solicitud al servidor para importar datos...");

    try {
        const botonImportar = document.getElementById("importarDatos");
        const checkboxImportar = document.getElementById("checkImportar");

        if (!botonImportar || !checkboxImportar) {
            console.error("❌ ERROR: No se encontró el botón o el checkbox.");
            return;
        }

        // ✅ Deshabilitar el botón y desmarcar el checkbox tras el primer click
        botonImportar.disabled = true;
        checkboxImportar.checked = false;

        // ✅ Borrar mensajes previos de éxito o error
        limpiarMensaje();

        // ✅ Obtener datos de la hoja fuente antes de enviarlos
        const responseDatos = await fetch("/api/data/A1:H1000");
        const datos = await responseDatos.json();

        console.log("📌 Datos obtenidos desde la hoja fuente:", datos.data.slice(0, 5));

        if (!datos.data || datos.data.length < 3) { // Evitar encabezados, deben ser más de 2 filas
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

function asignarEventoImportar() {
    const botonImportar = document.getElementById("importarDatos");
    const checkImportar = document.getElementById("checkImportar");

    if (botonImportar && checkImportar) {
        botonImportar.removeEventListener("click", enviarSolicitudAlServidor);
        botonImportar.addEventListener("click", enviarSolicitudAlServidor);
        console.log("✅ Evento 'click' agregado correctamente al botón 'Importar Datos'.");

        // ✅ Rehabilitar botón cuando el usuario vuelva a marcar el checkbox
        checkImportar.addEventListener("change", () => {
            if (checkImportar.checked) {
                botonImportar.disabled = false;
                document.getElementById("mensajeImportacion").innerHTML = "";
            }
        });
    } else {
        console.error("❌ ERROR: No se encontró el botón o checkbox. Intentando nuevamente en 500ms...");
        setTimeout(asignarEventoImportar, 500);
    }
}

// Ejecutar la asignación después de un tiempo para garantizar que el botón existe
setTimeout(asignarEventoImportar, 500);

async function enviarSolicitudAlServidor() {
    console.log("🚀 Enviando solicitud al servidor para importar datos...");

    try {
        const botonImportar = document.getElementById("importarDatos");
        const checkImportar = document.getElementById("checkImportar");

        // ✅ Deshabilitar el botón y desmarcar el checkbox tras el primer click
        botonImportar.disabled = true;
        checkImportar.checked = false;

        // ✅ Borrar mensajes previos de éxito o error
        document.getElementById("mensajeImportacion").innerHTML = "";

        // ✅ Obtener datos de la hoja fuente antes de enviarlos
        const responseDatos = await fetch("/api/data/A1:H1000"); // Asegurar que se toman todas las filas
        const datos = await responseDatos.json();

        console.log("📌 Datos obtenidos desde la hoja fuente:", datos.data.slice(0, 5)); // Mostrar primeras 5 filas

        if (!datos.data || datos.data.length < 3) { // Se asegura que haya más de 2 filas (evitando encabezado)
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

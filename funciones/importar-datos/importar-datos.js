async function enviarSolicitudAlServidor() {
    console.log("🚀 Enviando solicitud al servidor para importar datos...");

    try {
        // Obtener datos de la hoja fuente antes de enviarlos
        const responseDatos = await fetch("/api/data/A1:H1000"); // Asegurar que se toman todas las filas
        const datos = await responseDatos.json();

        if (!datos.data || datos.data.length <= 1) {
            console.error("❌ No se encontraron datos válidos en la hoja fuente.");
            mostrarNotificacion("❌ No hay datos nuevos para importar.", "error");
            return;
        }

        // Filtrar los datos para no incluir el encabezado
        const datosSinEncabezado = datos.data.slice(1);

        console.log(`📌 Datos obtenidos: ${datos.data.length} filas`);
        console.log("📌 Vista previa de los datos obtenidos:", datosSinEncabezado.slice(0, 5)); // Mostrar primeras 5 filas

        // Enviar datos al servidor para importar
        const response = await fetch("/api/importar-datos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: datosSinEncabezado }),
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

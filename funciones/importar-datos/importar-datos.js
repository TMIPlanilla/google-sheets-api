async function enviarSolicitudAlServidor() {
    console.log("🚀 Enviando solicitud al servidor para importar datos...");

    // Simulación de datos de prueba (reemplazar con datos reales)
    const datosParaEnviar = { 
        data: [
            ["Ejemplo Nombre", "Fecha", "Entrada", "Salida", "Actividad"]
        ] 
    };

    try {
        const response = await fetch("/api/importar-datos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosParaEnviar) // 🔹 Asegurar que se envía el JSON correctamente
        });

        const data = await response.json();
        console.log("📌 Respuesta del servidor:", data);

        if (data.success) {
            mostrarNotificacion("✅ Importación completada correctamente.", "success");
        } else {
            mostrarNotificacion("❌ Error en la importación: " + data.message, "error");
        }
    } catch (error) {
        console.error("❌ Error en la solicitud al servidor:", error);
        mostrarNotificacion("❌ Error en la comunicación con el servidor.", "error");
    }
}

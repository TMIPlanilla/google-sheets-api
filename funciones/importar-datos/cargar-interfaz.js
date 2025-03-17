function cargarInterfazImportarDatos() {
    console.log("🔄 Cargando interfaz de Importar Datos...");

    const botonImportar = document.getElementById("importarDatos");

    if (botonImportar) {
        botonImportar.disabled = true; // 🔹 Se deshabilita inicialmente
        console.log("⏳ Botón 'Importar Datos' deshabilitado al inicio.");

        // Esperar que el checkbox se marque antes de habilitar el botón
        const checkbox = document.getElementById("confirmarImportacion");
        if (checkbox) {
            checkbox.addEventListener("change", function () {
                botonImportar.disabled = !checkbox.checked; // 🔹 Se habilita solo si el checkbox está marcado
                console.log(checkbox.checked ? "✅ Botón habilitado." : "❌ Botón deshabilitado.");
            });
        } else {
            console.error("❌ ERROR: No se encontró el checkbox de confirmación.");
        }

        // Asignar evento click correctamente
        asignarEventoImportar();
    } else {
        console.error("❌ ERROR: No se encontró el botón 'Importar Datos'. Reintentando...");
        setTimeout(cargarInterfazImportarDatos, 500);
    }
}

// Ejecutar la carga de la interfaz
setTimeout(cargarInterfazImportarDatos, 500);

function cargarInterfazImportarDatos() {
    document.getElementById("contenido").innerHTML = `
        <div class="importar-datos-container">
            <div class="cajon">
                <h2 class="titulo">Importar Datos</h2>
                <p class="descripcion">
                    Presiona el botón para importar datos desde Google Sheets. Antes de proceder con la exportación de datos, es imprescindible validar la exactitud y consistencia de la información en la hoja de cálculo <strong>"Respuestasformulario"</strong>.
                </p>

                <div class="checkbox-container">
                    <input type="checkbox" id="validacion"> 
                    <label for="validacion">✅ He validado la información</label>
                </div>

                <button id="importarDatos" class="boton-importar" disabled>Importar Datos</button>

                <!-- Área de Notificaciones -->
                <div id="notificaciones" class="notificaciones-container"></div>

                <p class="nota-importante">
                    Debe ejecutar los siguientes scripts en el orden indicado para actualizar los cálculos en los datos importados. Este paso es esencial para continuar con el proceso.
                </p>

                <div class="botones-secundarios-container">
                    <button class="boton-secundario" disabled>Actualizar Filas Pendientes</button>
                    <button class="boton-secundario" disabled>Actualizar Horas Semanales</button>
                    <button class="boton-secundario" disabled>Actualizar Número de Empleado</button>
                </div>
            </div>
        </div>
    `;

    // ✅ Asegurar que el botón se habilita correctamente al marcar el checkbox
    const checkbox = document.getElementById("validacion");
    const botonImportar = document.getElementById("importarDatos");

    if (checkbox && botonImportar) {
        checkbox.addEventListener("change", function() {
            botonImportar.disabled = !this.checked;
        });
    } else {
        console.error("❌ ERROR: No se encontró el checkbox o el botón en el DOM.");
        return;
    }

    // ✅ Cargar `importar-datos.js` dinámicamente y asignar eventos solo cuando haya terminado de cargar
    const script = document.createElement("script");
    script.src = "funciones/importar-datos/importar-datos.js";
    script.onload = () => {
        console.log("✅ Script importar-datos.js cargado correctamente.");
        if (typeof asignarEventoImportar === "function") {
            asignarEventoImportar(); // 🔹 Se asegura que el evento se asigne correctamente
        } else {
            console.error("❌ ERROR: La función asignarEventoImportar no está definida en importar-datos.js.");
        }
    };
    document.body.appendChild(script);
}

// ✅ Función global para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
    const notificaciones = document.getElementById("notificaciones");
    if (!notificaciones) return;

    const div = document.createElement("div");
    div.className = `notificacion ${tipo}`;
    div.innerText = mensaje;
    notificaciones.appendChild(div);

    setTimeout(() => div.remove(), 5000);
    console.log(`🔔 Notificación: ${mensaje} (${tipo})`);
}

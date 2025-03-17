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

    // ✅ Referencias a elementos
    const checkbox = document.getElementById("validacion");
    const botonImportar = document.getElementById("importarDatos");

    if (!checkbox || !botonImportar) {
        console.error("❌ ERROR: No se encontró el checkbox o el botón en el DOM.");
        return;
    }

    // ✅ Habilitar el botón cuando se marque el checkbox
    checkbox.addEventListener("change", function() {
        botonImportar.disabled = !this.checked;
    });

    // ✅ Cargar dinámicamente `importar-datos.js`
    cargarScript("funciones/importar-datos/importar-datos.js", () => {
        console.log("✅ Script importar-datos.js cargado correctamente.");
        if (typeof asignarEventoImportar === "function") {
            asignarEventoImportar(); // 🔹 Se asegura de que la función se ejecute correctamente
        } else {
            console.error("❌ ERROR: La función asignarEventoImportar no está definida en importar-datos.js.");
        }
    });
}

// ✅ Función para cargar scripts dinámicamente y ejecutar una función callback después
function cargarScript(url, callback) {
    const script = document.createElement("script");
    script.src = url;
    script.onload = callback;
    script.onerror = () => console.error(`❌ ERROR: No se pudo cargar el script ${url}`);
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

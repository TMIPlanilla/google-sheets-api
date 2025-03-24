function cargarInterfazImportarDatos() {
    const contenido = document.getElementById("contenido");

    contenido.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 20px; max-width: 800px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #1C1C1E; font-size: 24px; text-align: center; margin-bottom: 20px;">Importar Datos</h2>
            
            <p style="text-align: center; color: #333; font-size: 14px; max-width: 600px; margin: 0 auto 30px;">
                <strong>Antes de proceder con la importación de datos</strong>, es imprescindible validar la exactitud y consistencia de la información en la hoja de cálculo <strong>RespuestasFormulario</strong>.
            </p>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <label style="font-size: 14px;">
                    <input type="checkbox" id="check-verificacion"> He validado la información
                </label>
            </div>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <button id="btn-importar" disabled
                    style="width: 66%; background-color: #D1D1D6; color: white; border: none; padding: 12px 20px; font-size: 14px; border-radius: 12px; cursor: not-allowed;">
                    Importar Datos
                </button>
            </div>

            <div id="log-consola" style="background: #F1F1F1; padding: 10px 15px; border-radius: 10px; font-size: 13px; min-height: 100px; max-height: 200px; overflow-y: auto;">
                Consola de mensajes...
            </div>

            <p style="margin-top: 30px; font-size: 13px; text-align: center; color: #555;">
                Es necesario ejecutar la siguiente secuencia de scripts para la ejecución de cálculos.
            </p>

            <div style="margin-top: 15px; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <button class="btn-secundario" id="btn-secundario-1" disabled>Actualizar cálculo filas</button>
                <button class="btn-secundario" id="btn-secundario-2" disabled>Actualizar horas semana</button>
                <button class="btn-secundario" id="btn-secundario-3" disabled>Actualizar datos empleado</button>
            </div>

            <div id="spinner" style="margin-top: 20px; display: none; text-align: center;">
                <span>Cargando...</span>
            </div>
        </div>
    `;

    // Estilos para los botones secundarios
    document.querySelectorAll(".btn-secundario").forEach(btn => {
        btn.style.width = "33%";
        btn.style.border = "1px solid #007AFF";
        btn.style.backgroundColor = "white";
        btn.style.color = "#007AFF";
        btn.style.padding = "10px";
        btn.style.fontSize = "13px";
        btn.style.borderRadius = "10px";
        btn.style.cursor = "not-allowed";
    });

    // Checkbox y botón azul
    const checkbox = document.getElementById("check-verificacion");
    const btnImportar = document.getElementById("btn-importar");

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            btnImportar.disabled = false;
            btnImportar.style.backgroundColor = "#007AFF";
            btnImportar.style.cursor = "pointer";
        } else {
            btnImportar.disabled = true;
            btnImportar.style.backgroundColor = "#D1D1D6";
            btnImportar.style.cursor = "not-allowed";
        }
    });

    // Al hacer clic en el botón azul
    btnImportar.addEventListener("click", () => {
        btnImportar.disabled = true;
        btnImportar.style.backgroundColor = "#D1D1D6";
        btnImportar.style.cursor = "not-allowed";
        checkbox.checked = false;

        // Aquí se llama a la función principal (a definir en importar-datos.js)
        if (typeof importarDatos === "function") {
            importarDatos();
        } else {
            console.error("❌ ERROR: No se encontró la función importarDatos()");
        }
    });
}

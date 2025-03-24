function cargarInterfazImportarDatos() {
    console.log("🔄 Cargando interfaz de Importar Datos...");

    const contenido = document.getElementById("contenido");
    contenido.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 20px; max-width: 800px; margin: 0 auto;">
            <h2 style="color: #1C1C1E; font-size: 24px; text-align: center; margin-bottom: 20px;">Importar Datos</h2>
            <p style="text-align: center;">Antes de proceder con la importación de datos, valide la hoja <strong>RespuestasFormulario</strong>.</p>

            <div style="text-align: center; margin: 20px 0;">
                <label>
                    <input type="checkbox" id="check-verificacion">
                    He validado la información
                </label>
            </div>

            <div style="text-align: center; margin-bottom: 20px;">
                <button id="btn-importar" disabled
                    style="width: 66%; background-color: #D1D1D6; color: white; border: none; padding: 12px 20px; font-size: 14px; border-radius: 12px; cursor: not-allowed;">
                    Importar Datos
                </button>
            </div>

            <div id="log-consola" style="background: #F1F1F1; padding: 10px; border-radius: 10px;">
                Consola de mensajes...
            </div>
        </div>
    `;

    const checkbox = document.getElementById("check-verificacion");
    const btn = document.getElementById("btn-importar");

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            btn.disabled = false;
            btn.style.backgroundColor = "#007AFF";
            btn.style.cursor = "pointer";
        } else {
            btn.disabled = true;
            btn.style.backgroundColor = "#D1D1D6";
            btn.style.cursor = "not-allowed";
        }
    });

    btn.addEventListener("click", () => {
        checkbox.checked = false;
        btn.disabled = true;
        btn.style.backgroundColor = "#D1D1D6";
        btn.style.cursor = "not-allowed";
        console.log("🟦 Botón presionado (sin acción)");
    });
}

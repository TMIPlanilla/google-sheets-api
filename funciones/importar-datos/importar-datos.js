function cargarInterfazImportarDatos() {
  const contenido = document.getElementById("contenido");

  contenido.innerHTML = `
    <div class="importar-datos-container">
      <h2 class="titulo">Importar Datos</h2>
      <p class="descripcion">
        Antes de proceder con la importación de datos, es imprescindible validar la exactitud y consistencia de la información en la hoja de cálculo <strong>RespuestasFormulario</strong>.
      </p>

      <div class="checkbox-container">
        <input type="checkbox" id="validarInfo">
        <label for="validarInfo">He validado la información</label>
      </div>

      <button id="btnImportarDatos" class="boton-principal" disabled>Importar Datos</button>

      <div id="consola" class="consola"></div>

      <p class="nota-final">Es necesario ejecutar la siguiente secuencia de scripts para la ejecución de cálculos.</p>

      <div class="botones-secundarios">
        <button class="boton-secundario" disabled>Actualizar Cálculo Filas</button>
        <button class="boton-secundario" disabled>Actualizar Horas Semana</button>
        <button class="boton-secundario" disabled>Actualizar Datos Empleado</button>
      </div>
    </div>
  `;

  // Activar botón azul al marcar el checkbox
  const checkbox = document.getElementById("validarInfo");
  const btnImportar = document.getElementById("btnImportarDatos");

  checkbox.addEventListener("change", () => {
    btnImportar.disabled = !checkbox.checked;
    btnImportar.classList.toggle("activo", checkbox.checked);
  });

  btnImportar.addEventListener("click", () => {
    btnImportar.disabled = true;
    checkbox.checked = false;
    const consola = document.getElementById("consola");
    consola.innerHTML = "<p>🔄 Importando datos...</p>";
    console.log("✅ Botón Importar Datos ejecutado.");
  });
}

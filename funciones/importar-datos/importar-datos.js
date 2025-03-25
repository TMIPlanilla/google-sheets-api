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

  const checkbox = document.getElementById("validarInfo");
  const btnImportar = document.getElementById("btnImportarDatos");
  const consola = document.getElementById("consola");

  checkbox.addEventListener("change", () => {
    const activo = checkbox.checked;
    btnImportar.disabled = !activo;
    btnImportar.classList.toggle("activo", activo);
  });

  btnImportar.addEventListener("click", async () => {
    btnImportar.disabled = true;
    checkbox.checked = false;
    btnImportar.classList.remove("activo");

    consola.innerHTML = `<p>⏳ Ejecutando importación de datos...</p>`;

    try {
      const res = await fetch('/importar-datos');
      const data = await res.json();

      if (res.ok) {
        consola.innerHTML = `
          <p>✅ ${data.mensaje}</p>
          <p>• ${data.origen}</p>
          <p>• ${data.destino}</p>
          <p>• ${data.referenciaD9}</p>
        `;
      } else {
        consola.innerHTML = `<p>❌ Error: ${data.mensaje}</p>`;
      }
    } catch (error) {
      consola.innerHTML = `<p>❌ Error inesperado: ${error.message}</p>`;
    }
  });
}

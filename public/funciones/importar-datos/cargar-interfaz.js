function cargarInterfazImportarDatos() {
  const contenedor = document.getElementById('contenedor-principal');
  contenedor.innerHTML = `
    <div class="caja-ios">
      <h2 class="titulo">Importar Datos</h2>
      <p class="descripcion">Valida que la hoja \"RespuestasFormulario\" esté actualizada.</p>
      <div class="checkbox-container">
        <input type="checkbox" id="validar-checkbox">
        <label for="validar-checkbox"> He validado la información</label>
      </div>
      <button id="boton-importar-datos" disabled class="boton-importar">Importar Datos</button>
      <div id="zona-notificacion" class="zona-notificacion"></div>
      <p class="nota">Nota: Ejecuta los scripts en secuencia para completar el proceso.</p>
      <button id="boton-actualizar-filas" disabled class="boton-secundario">Actualizar Filas Pendientes</button>
      <button id="boton-actualizar-horas" disabled class="boton-secundario">Actualizar Horas/Semanas</button>
      <button id="boton-actualizar-numero" disabled class="boton-secundario">Actualizar N° Empleado</button>
    </div>
  `;

  const checkbox = document.getElementById('validar-checkbox');
  const botonImportar = document.getElementById('boton-importar-datos');
  const notificacion = document.getElementById('zona-notificacion');
  const boton1 = document.getElementById('boton-actualizar-filas');
  const boton2 = document.getElementById('boton-actualizar-horas');

  // Activar botón de importar tras validación
  checkbox.addEventListener('change', () => {
    botonImportar.disabled = !checkbox.checked;
    botonImportar.classList.toggle('activo', checkbox.checked);
  });

  // Lógica del botón blanco: definida directamente al cargar
  boton1.addEventListener('click', async () => {
    boton1.disabled = true;
    notificacion.innerHTML += '• Ejecutando actualización de filas pendientes...<br>';

    try {
      const url = 'https://script.google.com/macros/s/AKfycbyj0uqtetlYsoTHN4tBqgZn3Y7hk1qEn2sJZJfxJlbjLlVZau_5WOM9gP_4anTGKTIu3Q/exec?funcion=actualizarFilasPendientes';
      const res = await fetch(url);
      const data = await res.text();

      notificacion.innerHTML += `✅ ${data}<br>`;

      if (data.toLowerCase().includes('completado')) {
        boton2.disabled = false;
      }
    } catch (error) {
      notificacion.innerHTML += `❌ Error al ejecutar el script: ${error.message}<br>`;
    } finally {
      boton1.disabled = false;
    }
  });

  // Lógica del botón azul
  botonImportar.addEventListener('click', async () => {
    notificacion.innerHTML = '• Importando datos...<br>';
    try {
      const respuesta = await fetch('/importar-datos');
      const resultado = await respuesta.text();
      notificacion.innerHTML += `✅ ${resultado}<br>`;

      // ✅ Activar botón blanco una vez importado
      boton1.disabled = false;
    } catch (error) {
      notificacion.innerHTML += `❌ Error: ${error.message}<br>`;
    }
  });
}

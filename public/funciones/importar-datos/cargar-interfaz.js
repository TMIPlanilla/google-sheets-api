function cargarInterfazImportarDatos() {
  const contenedor = document.getElementById('contenedor-principal');
  contenedor.innerHTML = '';

  const caja = document.createElement('div');
  caja.style.background = 'white';
  caja.style.padding = '20px';
  caja.style.borderRadius = '20px';
  caja.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  caja.style.maxWidth = '600px';
  caja.style.margin = '0 auto';

  const titulo = document.createElement('h2');
  titulo.textContent = 'Importar Datos';
  titulo.style.color = '#1C1C1E';
  titulo.style.textAlign = 'center';

  const parrafo = document.createElement('p');
  parrafo.textContent = 'Valida que la hoja "RespuestasFormulario" esté actualizada.';
  parrafo.style.textAlign = 'center';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'validar-checkbox';
  checkbox.style.marginTop = '10px';

  const checkboxLabel = document.createElement('label');
  checkboxLabel.textContent = ' He validado la información';
  checkboxLabel.setAttribute('for', 'validar-checkbox');

  const botonImportar = document.createElement('button');
  botonImportar.textContent = 'Importar Datos';
  botonImportar.disabled = true;
  botonImportar.style.width = '66%';
  botonImportar.style.marginTop = '20px';
  botonImportar.style.backgroundColor = '#D1D1D6';
  botonImportar.style.color = 'white';
  botonImportar.style.padding = '10px';
  botonImportar.style.border = 'none';
  botonImportar.style.borderRadius = '10px';

  checkbox.addEventListener('change', () => {
    botonImportar.disabled = !checkbox.checked;
    botonImportar.style.backgroundColor = checkbox.checked ? '#007AFF' : '#D1D1D6';
  });

  const notificacion = document.createElement('div');
  notificacion.id = 'zona-notificacion';
  notificacion.style.marginTop = '20px';
  notificacion.style.fontFamily = 'monospace';
  notificacion.style.fontSize = '14px';

  const nota = document.createElement('p');
  nota.textContent = 'Nota: Ejecuta los scripts en secuencia para completar el proceso.';
  nota.style.fontSize = '12px';
  nota.style.marginTop = '20px';

  // Botones secundarios
  const boton1 = document.createElement('button');
  boton1.textContent = 'Actualizar Filas Pendientes';
  boton1.id = 'boton-actualizar-filas';
  boton1.disabled = true;
  aplicarEstiloBotonSecundario(boton1);

  const boton2 = document.createElement('button');
  boton2.textContent = 'Actualizar Horas/Semanas';
  boton2.id = 'boton-actualizar-horas';
  boton2.disabled = true;
  aplicarEstiloBotonSecundario(boton2);

  const boton3 = document.createElement('button');
  boton3.textContent = 'Actualizar N° Empleado';
  boton3.id = 'boton-actualizar-numero';
  boton3.disabled = true;
  aplicarEstiloBotonSecundario(boton3);

  botonImportar.addEventListener('click', async () => {
    notificacion.innerHTML = '• Importando datos...<br>';
    try {
      const respuesta = await fetch('/importar-datos');
      const resultado = await respuesta.text();
      notificacion.innerHTML += `✅ ${resultado}<br>`;
      boton1.disabled = false;
    } catch (error) {
      notificacion.innerHTML += `❌ Error: ${error.message}<br>`;
    }
  });

  caja.appendChild(titulo);
  caja.appendChild(parrafo);
  caja.appendChild(checkbox);
  caja.appendChild(checkboxLabel);
  caja.appendChild(botonImportar);
  caja.appendChild(notificacion);
  caja.appendChild(nota);
  caja.appendChild(boton1);
  caja.appendChild(boton2);
  caja.appendChild(boton3);

  contenedor.appendChild(caja);

  // ✅ Esta línea garantiza que se cargue el script adicional al final
  cargarScriptAdicional();
}

function aplicarEstiloBotonSecundario(boton) {
  boton.style.width = '33%';
  boton.style.marginTop = '10px';
  boton.style.backgroundColor = 'white';
  boton.style.color = '#007AFF';
  boton.style.border = '1px solid #007AFF';
  boton.style.borderRadius = '8px';
  boton.style.padding = '8px';
}

// ✅ Script que se carga dinámicamente
function cargarScriptAdicional() {
  const script = document.createElement('script');
  script.src = 'funciones/importar-datos/ejecutar-scripts.js';
  script.onload = () => console.log('✅ ejecutar-scripts.js cargado');
  document.body.appendChild(script);
}

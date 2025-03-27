(function () {
  const btn1 = document.getElementById('boton-actualizar-filas');
  const btn2 = document.getElementById('boton-actualizar-horas');
  const notificaciones = document.getElementById('zona-notificacion');

  if (btn1 && btn2 && notificaciones) {
    btn1.disabled = false;

    btn1.addEventListener('click', async () => {
      btn1.disabled = true;
      notificaciones.innerHTML += '• Ejecutando actualización de filas pendientes...<br>';

      try {
        const url = 'https://script.google.com/macros/s/AKfycbyj0uqtetlYsoTHN4tBqgZn3Y7hk1qEn2sJZJfxJlbjLlVZau_5WOM9gP_4anTGKTIu3Q/exec?funcion=actualizarFilasPendientes';
        const res = await fetch(url);
        const data = await res.text();

        notificaciones.innerHTML += `✅ ${data}<br>`;

        if (data.toLowerCase().includes('completado')) {
          btn2.disabled = false;
        }
      } catch (error) {
        notificaciones.innerHTML += `❌ Error al ejecutar el script: ${error.message}<br>`;
      } finally {
        btn1.disabled = false;
      }
    });
  }
})();

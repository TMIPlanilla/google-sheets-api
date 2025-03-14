// URL exacta de la hoja de Google Sheets
const sheetUrl = "https://docs.google.com/spreadsheets/d/1OjieaBUcl7O181IGUTLlZOLHiH7aV_7Yy7UKr0hnshI/edit?resourcekey=&gid=1207575560#gid=1207575560";

// Insertar el contenido en la página con nuevo diseño
document.getElementById("contenido").innerHTML = `
    <div class="revision-horario-container">
        <h2 class="titulo"> Revisión de Horario</h2>
        <p class="descripcion">
            Antes de proceder con la exportación de datos, es imprescindible validar la exactitud y consistencia de la información en la hoja de cálculo.
        </p>

        <h3 class="subtitulo"> Criterios de Validación</h3>
        <ul class="criterios-lista">
            <li><strong>✅ Columna B - Nombre Completo:</strong> Verifique que los nombres estén escritos correctamente y sin abreviaturas.</li>
            <li>• Estandarización recomendada: Copiar y pegar valores para evitar errores.</li>
            <li><strong>✅ Columna C - Fecha del Reporte:</strong> Confirme que la fecha ingresada sea precisa y corresponda al período de reporte.</li>
            <li>• Formato requerido: <strong>dd/mm/aaaa</strong>.</li>
            <li><strong>✅ Columnas D y E - Horarios Registrados:</strong> Verifique que los horarios sean coherentes con la jornada laboral asignada.</li>
            <li>• Formato requerido: <strong>hh:mm am/pm</strong>.</li>
        </ul>

        <p class="finalizacion"><strong> Finalización del proceso:</strong> Una vez validada toda la información, cierre la hoja de cálculo y continúe con el procedimiento.</p>

        <div class="checkbox-container">
            <input type="checkbox" id="confirmacion"> 
            <label for="confirmacion">✅ Comprendo las indicaciones</label>
        </div>

        <button id="revisarHorario" class="boton-revision" disabled>Revisión de Horario</button>
    </div>
`;

// Habilita el botón cuando el usuario marca la casilla de confirmación
document.getElementById("confirmacion").addEventListener("change", function() {
    document.getElementById("revisarHorario").disabled = !this.checked;
});

// Funcionalidad del botón "Revisión de Horario"
document.getElementById("revisarHorario").addEventListener("click", function() {
    window.open(sheetUrl, '_blank'); // Abre en una nueva pestaña con la hoja exacta
});

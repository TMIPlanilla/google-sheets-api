// **Inicializar eventos de botones secundarios**
document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 Script botones-secundarios.js cargado correctamente.");
    
    const scriptButtons = [
        document.getElementById("botonScript1"),
        document.getElementById("botonScript2"),
        document.getElementById("botonScript3"),
    ];

    scriptButtons.forEach((button, index) => {
        if (button) {
            button.addEventListener("click", function () {
                console.log(`📡 Ejecutando Script ${index + 1}`);
                button.disabled = true;

                // Habilitar el siguiente botón si existe
                if (index + 1 < scriptButtons.length) {
                    scriptButtons[index + 1].disabled = false;
                }
            });
        }
    });
});

// Función para abrir/cerrar el panel de configuración
function toggleConfig() {
    let config = document.getElementById("configbox");
    let chat = document.getElementById("chatbox");
    
    if (config.style.display === "flex") {
        config.style.display = "none";
    } else {
        config.style.display = "flex";
        // Cerrar el chat si está abierto
        chat.style.display = "none";
    }
}

// Función para cambiar el tamaño del texto
function changeFontSize() {
    let fontSizeSlider = document.getElementById("font-size-slider");
    let fontSize = fontSizeSlider.value;
    
    // Aplicar el tamaño de fuente al elemento raíz html usando clamp para evitar desbordamientos
    // Para 100% usamos 16px, para 200% usamos 32px, pero con máximos para evitar desbordamientos
    let fontSizeDecimal = fontSize / 100;
    let computedSize = Math.min(fontSizeDecimal * 16, 24); // Máximo de 24px (150%)
    document.documentElement.style.fontSize = computedSize + "px";
    
    // Actualizar el texto del valor mostrado
    document.getElementById("font-size-value").textContent = fontSize + "%";
    
    // Guardar la preferencia en localStorage
    localStorage.setItem("fontSize", fontSize);
    
    // Disparar evento de resize para que el navegador recalcule los layouts
    window.dispatchEvent(new Event('resize'));
}

// Función para activar/desactivar modo nocturno
function toggleDarkMode() {
    let darkToggle = document.getElementById("darkmode-toggle");
    let body = document.body;
    
    if (darkToggle.checked) {
        body.classList.add("dark-mode");
        // Guardar la preferencia en localStorage
        localStorage.setItem("darkMode", "enabled");
    } else {
        body.classList.remove("dark-mode");
        // Guardar la preferencia en localStorage
        localStorage.setItem("darkMode", "disabled");
    }
}
// Cargar preferencias guardadas al cargar la página
window.addEventListener("DOMContentLoaded", function() {
    let darkModePreference = localStorage.getItem("darkMode");
    let darkToggle = document.getElementById("darkmode-toggle");
    
    if (darkModePreference === "enabled") {
        darkToggle.checked = true;
        document.body.classList.add("dark-mode");
    }

    // Cargar tamaño de texto guardado
    let fontSizePreference = localStorage.getItem("fontSize");
    if (fontSizePreference) {
        let fontSizeDecimal = fontSizePreference / 100;
        let computedSize = Math.min(fontSizeDecimal * 16, 24); // Máximo de 24px (150%)
        document.documentElement.style.fontSize = computedSize + "px";
        document.getElementById("font-size-slider").value = fontSizePreference;
        document.getElementById("font-size-value").textContent = fontSizePreference + "%";
    }
});
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
        // Enfocar en el primer elemento del config después de abrir
        setTimeout(() => {
            let firstControl = config.querySelector('input, button');
            if(firstControl) firstControl.focus();
        }, 100);
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

// Función para activar/desactivar narrador de voz (Text-to-Speech)
function toggleTextToSpeech() {
    let ttsToggle = document.getElementById("tts-toggle");
    
    // Verificar si el navegador soporta Web Speech API
    if (!('speechSynthesis' in window)) {
        alert("Lo siento, tu navegador no soporta narrador de voz. Intenta con Chrome, Edge o Firefox.");
        ttsToggle.checked = false;
        return;
    }
    
    if (ttsToggle.checked) {
        localStorage.setItem("textToSpeechEnabled", "enabled");
        // Anunciar que se ha activado
        speakText("Narrador de voz activado. Ahora leeré los títulos principales de la página.");
    } else {
        localStorage.setItem("textToSpeechEnabled", "disabled");
        // Detener cualquier narración en curso
        window.speechSynthesis.cancel();
    }
}

// Función para obtener todas las voces disponibles en español
function getAllSpanishVoices() {
    if (!window.speechSynthesis) return Promise.resolve([]);
    
    return new Promise((resolve) => {
        let voices = window.speechSynthesis.getVoices();
        
        if (voices.length > 0) {
            resolve(voices);
        } else {
            window.speechSynthesis.onvoiceschanged = () => {
                resolve(window.speechSynthesis.getVoices());
            };
        }
    });
}

// Función para obtener la mejor voz disponible en español
function getSpanishVoice() {
    return getAllSpanishVoices().then((voices) => {
        // Filtrar solo voces en español
        const spanishVoices = voices.filter(v => v.lang.includes('es'));
        
        if (spanishVoices.length === 0) return null;
        
        // Prioridad 1: Voces de Google Cloud Text-to-Speech (la mejor opción)
        let bestVoice = spanishVoices.find(v => 
            v.name.includes('Google') && 
            (v.name.includes('Wavenet') || v.name.includes('Neural') || v.name.includes('Studio'))
        );
        
        // Prioridad 2: Cualquier voz de Google
        if (!bestVoice) {
            bestVoice = spanishVoices.find(v => v.name.includes('Google'));
        }
        
        // Prioridad 3: Voces Microsoft con Neural
        if (!bestVoice) {
            bestVoice = spanishVoices.find(v => 
                v.name.includes('Microsoft') && v.name.includes('Neural')
            );
        }
        
        // Prioridad 4: Cualquier voz Natural o Neural
        if (!bestVoice) {
            bestVoice = spanishVoices.find(v => 
                v.name.includes('Natural') || v.name.includes('Neural')
            );
        }
        
        // Prioridad 5: Usar la primera disponible
        if (!bestVoice) {
            bestVoice = spanishVoices[0];
        }
        
        return bestVoice;
    });
}

// Función para convertir texto a voz (mejorada con voces humanas)
function speakText(text, options = {}) {
    // Verificar si el text-to-speech está habilitado
    if (localStorage.getItem("textToSpeechEnabled") !== "enabled") {
        return;
    }
    
    // Evitar narrar el mismo texto muy rápido (prevenir duplicados)
    if (window.lastSpokenText === text && window.lastSpokenTime && Date.now() - window.lastSpokenTime < 500) {
        return;
    }
    
    // Guardar el último texto narrado
    window.lastSpokenText = text;
    window.lastSpokenTime = Date.now();
    
    // Detener cualquier narración anterior
    window.speechSynthesis.cancel();
    
    // Crear una nueva instancia de SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Obtener la mejor voz disponible
    getSpanishVoice().then((voice) => {
        if (voice) {
            utterance.voice = voice;
        }
        
        // Configurar opciones para sonar muy natural (como una persona real)
        utterance.lang = 'es-ES';              // Español de España
        utterance.rate = options.rate || 0.9;  // Velocidad moderada (90% - más natural)
        utterance.pitch = options.pitch || 1;  // Tono neutro (suena más humano)
        utterance.volume = options.volume || 1; // Volumen al máximo
        
        // Hablar con la voz seleccionada
        window.speechSynthesis.speak(utterance);
    });
}

// Objeto global para controlar el narrador
window.voiceNarrator = {
    enabled: false,
    speak: speakText,
    stop: function() {
        window.speechSynthesis.cancel();
    }
};

// Cargar preferencias guardadas al cargar la página
window.addEventListener("DOMContentLoaded", function() {
    let darkModePreference = localStorage.getItem("darkMode");
    let darkToggle = document.getElementById("darkmode-toggle");
    
    if (darkModePreference === "enabled") {
        darkToggle.checked = true;
        document.body.classList.add("dark-mode");
    }

    // Cargar preferencia de text-to-speech
    let ttsPreference = localStorage.getItem("textToSpeechEnabled");
    let ttsToggle = document.getElementById("tts-toggle");
    if (ttsPreference === "enabled") {
        ttsToggle.checked = true;
        window.voiceNarrator.enabled = true;
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
    
    // Iniciar narración interactiva de botones
    setTimeout(() => {
        setupInteractiveNarration();
    }, 500);
});

// Función para extraer texto narrativo de un elemento
function getElementNarration(element) {
    // Si el elemento tiene un aria-label, usarlo (PRIORIDAD MÁXIMA)
    if (element.getAttribute('aria-label')) {
        let narration = element.getAttribute('aria-label');
        
        // Si es un BOTÓN dentro de una tarjeta de producto
        if (element.tagName === 'BUTTON') {
            // Buscar el contenedor padre más cercano con aria-label (la tarjeta del producto)
            let parent = element.parentElement;
            let depth = 0;
            while (parent && depth < 5) {
                if (parent.getAttribute('aria-label') && parent.getAttribute('aria-label').includes('Precio:')) {
                    // Encontramos la tarjeta del producto, narrar su aria-label completo
                    return parent.getAttribute('aria-label');
                }
                parent = parent.parentElement;
                depth++;
            }
        }
        
        return narration;
    }
    
    // Si el elemento padre tiene aria-label (útil para elementos dentro de contenedores)
    if (element.parentElement && element.parentElement.getAttribute('aria-label')) {
        return element.parentElement.getAttribute('aria-label');
    }
    
    // Si es un botón, obtener su texto
    if (element.tagName === 'BUTTON') {
        let text = element.innerText || element.textContent;
        if (text) return text.trim();
    }
    
    // Si es un link
    if (element.tagName === 'A') {
        let text = element.innerText || element.textContent;
        if (text) return text.trim();
    }
    
    // Si tiene título/title
    if (element.getAttribute('title')) {
        return element.getAttribute('title');
    }
    
    // Si tiene data-narrate
    if (element.getAttribute('data-narrate')) {
        return element.getAttribute('data-narrate');
    }
    
    // Si es un input
    if (element.tagName === 'INPUT') {
        let label = element.getAttribute('aria-label') || element.getAttribute('placeholder');
        if (label) return label;
    }
    
    // Si tiene h1, h2, h3, etc.
    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
        let text = element.innerText || element.textContent;
        if (text) return text.trim();
    }
    
    // Si es una lista (li), obtener su contenido
    if (element.tagName === 'LI') {
        let text = element.innerText || element.textContent;
        if (text) return text.trim();
    }
    
    // Si es un contenedor de producto o tarjeta, buscar aria-label en el elemento
    if (element.classList && (element.classList.contains('glass-dark') || element.classList.contains('product'))) {
        let ariaLabel = element.getAttribute('aria-label');
        if (ariaLabel) return ariaLabel;
    }
    
    return null;
}

// Función para configurar narración interactiva en toda la página
function setupInteractiveNarration() {
    // Selector de todos los elementos interactivos (incluyendo todos los inputs)
    const selectores = 'button, a[href], input, textarea, select, h1, h2, h3, [role="button"], [role="menuitem"], [role="link"]';
    
    const elementos = document.querySelectorAll(selectores);
    
    elementos.forEach(elemento => {
        // Evitar agregar listeners múltiples veces
        if (elemento.hasAttribute('data-narration-set')) {
            return;
        }
        elemento.setAttribute('data-narration-set', 'true');
        
        // Evento de focus (navegación con teclado)
        elemento.addEventListener('focus', function(e) {
            if (localStorage.getItem("textToSpeechEnabled") === "enabled") {
                const narration = getElementNarration(this);
                if (narration) {
                    speakText(narration);
                }
            }
        });
        
        // Evento de mouseover (navegación con mouse)
        elemento.addEventListener('mouseenter', function(e) {
            if (localStorage.getItem("textToSpeechEnabled") === "enabled") {
                const narration = getElementNarration(this);
                if (narration) {
                    speakText(narration);
                }
            }
        });
    });    
}
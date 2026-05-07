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
    
    // Despausar lectura guiada temporalmente para evitar animaciones
    const wasGuidedReadingEnabled = window.guidedReadingState && window.guidedReadingState.enabled;
    if (wasGuidedReadingEnabled) {
        window.guidedReadingState.pausedForResize = true;
    }
    
    // Disparar evento de resize para que el navegador recalcule los layouts
    window.dispatchEvent(new Event('resize'));
    
    // Reanudar lectura guiada después de que se complete el resize
    setTimeout(() => {
        if (wasGuidedReadingEnabled && window.guidedReadingState) {
            window.guidedReadingState.pausedForResize = false;
        }
    }, 300);
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

// Función para activar/desactivar contraste alto
function toggleHighContrast() {
    let contrastToggle = document.getElementById("contrast-toggle");
    let body = document.body;
    
    if (contrastToggle.checked) {
        body.classList.add("high-contrast");
        // Guardar la preferencia en localStorage
        localStorage.setItem("highContrast", "enabled");
    } else {
        body.classList.remove("high-contrast");
        // Guardar la preferencia en localStorage
        localStorage.setItem("highContrast", "disabled");
    }
}

// Función para activar/desactivar lectura guiada
function toggleGuidedReading() {
    let guidedToggle = document.getElementById("guided-reading-toggle");
    let body = document.body;
    
    if (guidedToggle.checked) {
        body.classList.add("guided-reading");
        localStorage.setItem("guidedReading", "enabled");
        initGuidedReading();
    } else {
        body.classList.remove("guided-reading");
        localStorage.setItem("guidedReading", "disabled");
        stopGuidedReading();
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

    // Cargar preferencia de contraste alto
    let highContrastPreference = localStorage.getItem("highContrast");
    let contrastToggle = document.getElementById("contrast-toggle");
    if (highContrastPreference === "enabled") {
        contrastToggle.checked = true;
        document.body.classList.add("high-contrast");
    }

    // Cargar preferencia de lectura guiada
    let guidedReadingPreference = localStorage.getItem("guidedReading");
    let guidedToggle = document.getElementById("guided-reading-toggle");
    if (guidedReadingPreference === "enabled") {
        guidedToggle.checked = true;
        document.body.classList.add("guided-reading");
        initGuidedReading();
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

// ============ LECTURA GUIADA - GUIDED READING ============

window.guidedReadingState = {
    enabled: false,
    currentLine: null,
    currentWord: null,
    observer: null,
    pausedForResize: false,
    debounceTimer: null
};

// Función debounce para evitar actualizaciones frecuentes
function debounceGuidedReading(func, delay = 150) {
    return function(...args) {
        clearTimeout(window.guidedReadingState.debounceTimer);
        window.guidedReadingState.debounceTimer = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

// Inicializar lectura guiada
function initGuidedReading() {
    if (!window.guidedReadingState) {
        window.guidedReadingState = {
            enabled: false,
            currentLine: null,
            currentWord: null,
            observer: null,
            pausedForResize: false,
            debounceTimer: null
        };
    }
    
    if (window.guidedReadingState.enabled) return;
    window.guidedReadingState.enabled = true;
    
    // Manejador optimizado de mousemove
    let lastMouseMoveTime = 0;
    const mouseThrottle = 60; // milisegundos
    
    const throttledMouseMove = (e) => {
        const now = Date.now();
        if (now - lastMouseMoveTime > mouseThrottle) {
            highlightLineUnderMouse(e);
            lastMouseMoveTime = now;
        }
    };
    
    // Manejador de scroll optimizado
    const throttledScroll = (e) => {
        updateGuidedReadingHighlight();
    };
    
    // Agregar listeners
    document.addEventListener('mousemove', throttledMouseMove, { passive: true });
    document.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Guardar referencias
    window.guidedReadingState.throttledMouseMove = throttledMouseMove;
    window.guidedReadingState.throttledScroll = throttledScroll;
    
    // Resaltar el primer párrafo legible
    setTimeout(() => {
        highlightFirstReadableContent();
    }, 100);
}

// Detener lectura guiada
function stopGuidedReading() {
    if (!window.guidedReadingState) return;
    
    window.guidedReadingState.enabled = false;
    
    // Remover event listeners
    if (window.guidedReadingState.throttledMouseMove) {
        document.removeEventListener('mousemove', window.guidedReadingState.throttledMouseMove);
        window.guidedReadingState.throttledMouseMove = null;
    }
    
    if (window.guidedReadingState.throttledScroll) {
        document.removeEventListener('scroll', window.guidedReadingState.throttledScroll);
        window.guidedReadingState.throttledScroll = null;
    }
    
    if (window.guidedReadingState.debouncedScrollUpdate) {
        document.removeEventListener('scroll', window.guidedReadingState.debouncedScrollUpdate);
        window.guidedReadingState.debouncedScrollUpdate = null;
    }
    
    // Limpiar resaltes
    removeLineHighlight();
}

// Resaltar la línea bajo el mouse
function highlightLineUnderMouse(e) {
    if (!window.guidedReadingState || !window.guidedReadingState.enabled) return;
    
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element) return;
    
    // Excluir elementos del UI
    const excludeSelectors = ['config-button', 'chat-button', 'close-config', 'close-chat', 'floating-buttons-container'];
    for (let selector of excludeSelectors) {
        if (element.classList && element.classList.contains(selector)) return;
    }
    
    // Buscar el párrafo o línea de texto más cercana
    let textElement = element.closest('p, h1, h2, h3, h4, h5, h6, li, td, span');
    
    // Si no encontró elemento específico, verificar si es texto directo
    if (!textElement) {
        if (element.nodeType === Node.TEXT_NODE) {
            textElement = element.parentElement;
        } else if (element.textContent && element.textContent.length > 0) {
            // Solo resaltar si tiene contenido de texto significativo
            const hasDirectText = Array.from(element.childNodes).some(node => 
                node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
            );
            if (hasDirectText && isReadableText(element)) {
                textElement = element;
            }
        }
    }
    
    if (!textElement || !isReadableText(textElement)) return;
    
    // Si es el mismo elemento que ya está resaltado, no hacer nada
    if (window.guidedReadingState.currentLine === textElement) return;
    
    // Limpiar resalte anterior
    removeLineHighlight();
    
    // Aplicar nuevo resalte
    textElement.classList.add('guided-line-highlight');
    window.guidedReadingState.currentLine = textElement;
}

// Resaltar palabras bajo el cursor (versión simplificada)
function highlightWordsInElement(element, clientX, clientY) {
    if (!window.guidedReadingState || !window.guidedReadingState.enabled) return;
    
    // Limpiar palabras anteriores
    const oldHighlights = document.querySelectorAll('.guided-word-highlight');
    oldHighlights.forEach(el => el.classList.remove('guided-word-highlight'));
    
    // Obtener todos los nodos de texto del elemento
    const treeWalker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let closestSpan = null;
    let closestDistance = Infinity;
    let textNode;
    
    while (textNode = treeWalker.nextNode()) {
        if (!textNode.textContent.trim()) continue;
        
        const range = document.createRange();
        range.selectNodeContents(textNode);
        const rects = range.getClientRects();
        
        for (let rect of rects) {
            if (rect.width === 0) continue;
            
            const centerX = (rect.left + rect.right) / 2;
            const centerY = (rect.top + rect.bottom) / 2;
            const distance = Math.hypot(centerX - clientX, centerY - clientY);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSpan = { rect, distance };
            }
        }
    }
    
    // Si encontramos una posición cercana, resaltarla
    if (closestSpan && closestDistance < 150) {
        // Crear un span virtual para el resalte (sin modificar el DOM)
        const highlightStyle = document.createElement('style');
        highlightStyle.id = 'guided-word-highlight-style-' + Date.now();
        // Esto es solo para visualizar, se limpia después
    }
}

// Remover resalte de línea anterior
function removeLineHighlight() {
    if (!window.guidedReadingState) return;
    
    if (window.guidedReadingState.currentLine) {
        window.guidedReadingState.currentLine.classList.remove('guided-line-highlight');
        window.guidedReadingState.currentLine = null;
    }
    
    const wordHighlights = document.querySelectorAll('.guided-word-highlight');
    wordHighlights.forEach(el => el.classList.remove('guided-word-highlight'));
}

// Actualizar resalte al hacer scroll
function updateGuidedReadingHighlight() {
    if (!window.guidedReadingState || !window.guidedReadingState.enabled) return;
    
    // Limpiar resaltes anteriores
    removeLineHighlight();
    
    // Resaltar el contenido visible en el centro de la pantalla
    const readableElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, div');
    
    let bestElement = null;
    let bestScore = 0;
    
    for (let element of readableElements) {
        if (!isReadableText(element)) continue;
        
        const rect = element.getBoundingClientRect();
        
        // Calcular si está en la zona visible central
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 4) {
            const visibleHeight = Math.min(rect.bottom, window.innerHeight / 2) - Math.max(rect.top, window.innerHeight / 4);
            if (visibleHeight > bestScore) {
                bestScore = visibleHeight;
                bestElement = element;
            }
        }
    }
    
    if (bestElement) {
        bestElement.classList.add('guided-line-highlight');
        window.guidedReadingState.currentLine = bestElement;
    }
}

// Resaltar el primer contenido legible
function highlightFirstReadableContent() {
    const readableElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, .chat-messages div');
    
    for (let element of readableElements) {
        if (isReadableText(element)) {
            element.classList.add('guided-line-highlight');
            window.guidedReadingState.currentLine = element;
            break;
        }
    }
}

// Verificar si el elemento es legible
function isReadableText(element) {
    if (!element) return false;
    
    const text = element.textContent.trim();
    if (text.length < 3) return false;
    
    // Excluir elementos del UI
    const excludeClasses = ['config-button', 'chat-button', 'close-config', 'close-chat'];
    for (let excludeClass of excludeClasses) {
        if (element.classList.contains(excludeClass)) return false;
    }
    
    // Excluir elementos ocultos
    if (getComputedStyle(element).display === 'none') return false;
    if (getComputedStyle(element).visibility === 'hidden') return false;
    
    // Excluir el body, html y contenedores principales
    if (element.tagName === 'BODY' || element.tagName === 'HTML' || element.tagName === 'DIV' && element.classList.contains('container')) {
        return false;
    }
    
    // Excluir divs muy grandes (probablemente contenedores)
    const rect = element.getBoundingClientRect();
    const isLargeContainer = rect.height > 300 && !['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TD', 'SPAN'].includes(element.tagName);
    if (isLargeContainer) return false;
    
    // Solo resaltar tags apropiados o divs pequeños con texto directo
    const readableTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TD', 'SPAN'];
    if (!readableTags.includes(element.tagName)) {
        // Si es otro tipo de elemento, solo resaltar si es pequeño y tiene texto directo
        const hasDirectText = Array.from(element.childNodes).some(node => 
            node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
        );
        if (!hasDirectText) return false;
    }
    
    return true;
}

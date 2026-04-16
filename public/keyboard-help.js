// keyboard-help.js
// Muestra información de ayuda sobre atajos de teclado en la consola

(function showKeyboardHelp() {
    const helpText = `
╔════════════════════════════════════════════════════════════════╗
║         NAVEGACIÓN POR TECLADO - PARFUM FRAGANCIAS             ║
╚════════════════════════════════════════════════════════════════╝

🎯 ATAJOS GLOBALES:
   • Tab                    → Navegar entre elementos
   • Shift + Tab            → Navegar hacia atrás
   • Enter                  → Activar botones/enviar formularios
   • Escape                 → Cerrar menús y diálogos

⚡ ATAJOS RÁPIDOS:
   • Alt + C                → Abrir/cerrar Chat
   • Alt + S                → Abrir/cerrar Configuración
   • Alt + H                → Ir a la página de Inicio

💬 EN EL CHAT:
   • Enter en el input      → Enviar mensaje
   • Escape                 → Cerrar chat
   • Tab                    → Navegar preguntas rápidas

⚙️ EN CONFIGURACIÓN:
   • Tab                    → Navegar entre opciones
   • Space                  → Activar checkbox
   • Flechas (← →)          → Ajustar slider

📚 Documentación completa: /GUIA_NAVEGACION_TECLADO.md

═════════════════════════════════════════════════════════════════
    `;
    
    // Mostrar en consola con estilos
    if (console && console.log) {
        console.log('%c' + helpText, 'font-family: monospace; color: #d4af37; font-size: 11px;');
        console.log('%cNota: Presiona Alt + C para abrir el chat, o Tab para empezar a navegar', 'color: #f9d423; font-weight: bold;');
    }
})();

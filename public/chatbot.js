function toggleChat(){

let chat=document.getElementById("chatbox");
let config=document.getElementById("configbox");
let messages=document.getElementById("messages");

if(chat.style.display==="flex"){

chat.style.display="none";

/* REINICIAR CHAT */

messages.innerHTML='<div class="bot">Hola 👋 Bienvenido a nuestra perfumería ¿En qué puedo ayudarte?</div>\
<div class="quick-buttons">\
<button onclick="quickQuestion(\'precio\')">Precios</button>\
<button onclick="quickQuestion(\'promociones\')">Promociones</button>\
<button onclick="quickQuestion(\'ubicacion\')">Ubicación</button>\
<button onclick="quickQuestion(\'horario\')">Horario</button>\
</div>';

}else{
chat.style.display="flex";
// Cerrar configuración si está abierta
config.style.display="none";
}

}

function quickQuestion(question){
document.getElementById("input").value=question;
sendMessage();
}

function sendMessage(){

let input=document.getElementById("input");
let text=input.value.toLowerCase();

if(text==="") return;

let messages=document.getElementById("messages");
let typing=document.getElementById("typing");

messages.innerHTML+=`<div class="user">${text}</div>`;

typing.style.display="block";

let response='No entendí tu pregunta 🤔<br><br>¿Qué deseas saber?<br><br>\
<div class="quick-buttons">\
<button onclick="quickQuestion(\'telefono\')">📞 Teléfono</button>\
<button onclick="quickQuestion(\'horario\')">🕒 Horarios</button>\
<button onclick="quickQuestion(\'precio\')">💰 Costos</button>\
<button onclick="quickQuestion(\'redes\')">📱 Redes sociales</button>\
</div>';

if(
text.includes("hola") || text.includes("HOLA") || text.includes("Hola") ||
text.includes("buenas") || text.includes("BUENAS") ||
text.includes("buen dia") || text.includes("BUEN DIA") ||
text.includes("buen día") || text.includes("BUEN DÍA") ||
text.includes("buenos dias") || text.includes("BUENOS DIAS") ||
text.includes("buenos días") || text.includes("BUENOS DÍAS") ||
text.includes("buenas tardes") || text.includes("BUENAS TARDES") ||
text.includes("buenas noches") || text.includes("BUENAS NOCHES")
){
response="Hola 😊 dime qué deseas saber.";
}

else if(
text.includes("precio") || text.includes("PRECIO") ||
text.includes("precios") || text.includes("PRECIOS") ||
text.includes("costo") || text.includes("COSTO") ||
text.includes("costos") || text.includes("COSTOS") ||
text.includes("cuanto cuesta") || text.includes("CUANTO CUESTA") ||
text.includes("cuánto cuesta") || text.includes("CUÁNTO CUESTA") ||
text.includes("valor") || text.includes("VALOR") ||
text.includes("productos") || text.includes("PRODUCTOS") ||
text.includes("producto") || text.includes("PRODUCTO") ||
text.includes("catalogo") || text.includes("CATALOGO") ||
text.includes("catálogo") || text.includes("CATÁLOGO") ||
text.includes("perfume") || text.includes("PERFUME") ||
text.includes("perfumes") || text.includes("PERFUMES")
){
response='Nuestros perfumes van desde $350 hasta $2500.<br>Tenemos diferentes marcas, para hombre, mujer, nicho o diseñador<br><br>🛍️ Puedes ver nuestros perfumes aquí ⬇️<br><a class="catalogo-link" href="#" onclick="setState({currentPage: \'catalog\'})">✨ Ver catálogo</a>';
}

else if(
text.includes("promocion") || text.includes("PROMOCION") ||
text.includes("promoción") || text.includes("PROMOCIÓN") ||
text.includes("promociones") || text.includes("PROMOCIONES") ||
text.includes("oferta") || text.includes("OFERTA") ||
text.includes("ofertas") || text.includes("OFERTAS") ||
text.includes("descuento") || text.includes("DESCUENTO") ||
text.includes("rebaja") || text.includes("REBAJA")
){
response="Actualmente tenemos promociones del 20% en perfumes seleccionados.";
}

else if(
text.includes("ubicacion") || text.includes("UBICACION") ||
text.includes("ubicación") || text.includes("UBICACIÓN") ||
text.includes("direccion") || text.includes("DIRECCION") ||
text.includes("dirección") || text.includes("DIRECCIÓN") ||
text.includes("donde") || text.includes("DONDE") ||
text.includes("dónde") || text.includes("DÓNDE") ||
text.includes("donde estan") || text.includes("DONDE ESTAN") ||
text.includes("dónde están") || text.includes("DÓNDE ESTÁN") ||
text.includes("ubican") || text.includes("UBICAN") ||
text.includes("lugar") || text.includes("LUGAR") ||
text.includes("mapa") || text.includes("MAPA")
){
response='Nuestra tienda está aquí 📍 <br><a class="map-link" href="https://www.google.com/maps?cid=4412960217130629308&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAEYASAB&hl=es&gl=MX&source=embed" target="_blank">Ver en Google Maps</a>';
}

else if(
text.includes("horario") || text.includes("HORARIO") ||
text.includes("horarios") || text.includes("HORARIOS") ||
text.includes("hora") || text.includes("HORA") ||
text.includes("horas") || text.includes("HORAS") ||
text.includes("abren") || text.includes("ABREN") ||
text.includes("cierran") || text.includes("CIERRAN") ||
text.includes("atencion") || text.includes("ATENCION") ||
text.includes("atención") || text.includes("ATENCIÓN") ||
text.includes("abierto") || text.includes("ABIERTO") ||
text.includes("cerrado") || text.includes("CERRADO")
){
response="🕒 Nuestro horario es:<br><br>Lunes a Viernes: 10:00 - 20:00<br>Sábado: 11:00 - 18:00";
}

else if(
text.includes("redes") || text.includes("REDES") ||
text.includes("redes sociales") || text.includes("REDES SOCIALES") ||
text.includes("facebook") || text.includes("FACEBOOK") ||
text.includes("instagram") || text.includes("INSTAGRAM") ||
text.includes("ig") || text.includes("IG") ||
text.includes("pagina") || text.includes("PAGINA") ||
text.includes("página") || text.includes("PÁGINA")
){
response='📱 Síguenos en nuestras redes sociales:<br><br>\
<a class="social-link" href="https://www.facebook.com/frasesdeWinniePooh" target="_blank">📘 Facebook</a><br>\
<a class="social-link" href="https://www.instagram.com/luxury_fragrances7?igsh=MWg1NDQ2N2pxcmVtZA==" target="_blank">📸 Instagram</a>';
}

else if(
text.includes("telefono") || text.includes("TELEFONO") ||
text.includes("teléfono") || text.includes("TELÉFONO") ||
text.includes("numero") || text.includes("NUMERO") ||
text.includes("número") || text.includes("NÚMERO") ||
text.includes("celular") || text.includes("CELULAR") ||
text.includes("llamar") || text.includes("LLAMAR")
){
response='📞 Puedes llamarnos aquí:<br><br><a class="phone-link" href="tel:+525512345678">+52 55 1234 5678<br>Horario:<br>Lunes a Viernes 10:00 - 20:00<br>Sábado 11:00 - 18:00</a>';
}

else if(
text.includes("correo") || text.includes("CORREO") ||
text.includes("correo electronico") || text.includes("CORREO ELECTRONICO") ||
text.includes("correo electrónico") || text.includes("CORREO ELECTRÓNICO") ||
text.includes("email") || text.includes("EMAIL") ||
text.includes("gmail") || text.includes("GMAIL") ||
text.includes("mail") || text.includes("MAIL")
){
response='📧 Puedes escribirnos a nuestro correo:<br><br><a class="mail-link" href="mailto:info@parfum.com">info@parfum.com</a>';
}


else if(
text.includes("menu") || text.includes("MENU") ||
text.includes("menú") || text.includes("MENÚ") ||
text.includes("info") || text.includes("INFO") ||
text.includes("informacion") || text.includes("INFORMACION") ||
text.includes("información") || text.includes("INFORMACIÓN") ||
text.includes("opciones") || text.includes("OPCIONES") ||
text.includes("ayuda") || text.includes("AYUDA")
){
response='🤖 ¿Qué deseas saber?<br><br>\
<div class="quick-buttons">\
<button onclick="quickQuestion(\'telefono\')">📞 Teléfono</button>\
<button onclick="quickQuestion(\'horario\')">🕒 Horarios</button>\
<button onclick="quickQuestion(\'precio\')">💰 Costos</button>\
<button onclick="quickQuestion(\'redes\')">📱 Redes sociales</button>\
</div>';
}


else if(text.includes("contacto") || text.includes("CONTACTO") || text.includes("Contacto") ||
text.includes("contactar") || text.includes("CONTACTAR") ||
text.includes("comunicar") || text.includes("COMUNICAR") ||
text.includes("hablar") || text.includes("HABLAR") ||
text.includes("soporte") || text.includes("SOPORTE") ||
text.includes("atencion al cliente") || text.includes("ATENCION AL CLIENTE") ||
text.includes("atención al cliente") || text.includes("ATENCIÓN AL CLIENTE")){
response='📩 Puedes comunicarte con nosotros de varias formas ⬇️<br><br>\
<div class="quick-buttons">\
<button onclick="quickQuestion(\'telefono\')">📞 Teléfono</button>\
<button onclick="quickQuestion(\'correo\')">📧 Correo</button>\
<button onclick="quickQuestion(\'redes\')">📱 Redes sociales</button>\
<button onclick="quickQuestion(\'ubicacion\')">📍 Visitar tienda</button>\
</div>';
}

else if(text.includes("formas pago") || text.includes("FORMAS PAGO") ||
text.includes("forma pago") || text.includes("FORMA PAGO") ||
text.includes("tarjeta") || text.includes("TARJETA") ||
text.includes("tarjetas") || text.includes("TARJETAS") ||
text.includes("visa") || text.includes("VISA") ||
text.includes("debito") || text.includes("DEBITO") ||
text.includes("débito") || text.includes("DÉBITO") ||
text.includes("credito") || text.includes("CREDITO") ||
text.includes("crédito") || text.includes("CRÉDITO")){
response='💳 Aceptamos los siguientes métodos de pago:<br><br>\
• 💳 Tarjeta de débito<br>\
• 💳 Tarjeta de crédito<br>\
• 💳 Visa';
}

else if(text.includes("pago") || text.includes("PAGO") ||  text.includes("método") || 
text.includes("pagos") || text.includes("PAGOS") ||
text.includes("metodos de pago") || text.includes("METODOS DE PAGO") ||
text.includes("métodos de pago") || text.includes("MÉTODOS DE PAGO") ||
text.includes("metodo de pago") || text.includes("METODO DE PAGO") ||
text.includes("método de pago") || text.includes("MÉTODO DE PAGO") ||
text.includes("metodos") || text.includes("METODOS") ||
text.includes("métodos") || text.includes("MÉTODOS") ||
text.includes("metodo") || text.includes("METODOS") ||
text.includes("método") || text.includes("MÉTODO") ||
text.includes("como pagar") || text.includes("COMO PAGAR") ||
text.includes("cómo pagar") || text.includes("CÓMO PAGAR")){
response='💳 ¿Qué deseas saber sobre los pagos? ⬇️<br><br>\
<div class="quick-buttons">\
<button onclick="quickQuestion(\'formas pago\')">💳 Formas de pago</button>\
<button onclick="quickQuestion(\'devoluciones\')">📦 Devoluciones</button>\
</div>';
}

else if(text.includes("devoluciones") || text.includes("DEVOLUCIONES") ||
text.includes("devolucion") || text.includes("DEVOLUCION") ||
text.includes("devolución") || text.includes("DEVOLUCIÓN") ||
text.includes("cambio") || text.includes("CAMBIO") ||
text.includes("cambios") || text.includes("CAMBIOS") ||
text.includes("reembolso") || text.includes("REEMBOLSO") ||
text.includes("devolver") || text.includes("DEVOLVER")){
response='📦 Política de devoluciones:<br><br>\
Las devoluciones o cambios solo pueden realizarse en nuestra tienda física.<br><br>\
Para más información puedes visitarnos en tienda.';
}


else if(
text.includes("envio") || text.includes("ENVIO") ||
text.includes("envíos") || text.includes("ENVÍOS") ||
text.includes("envio") || text.includes("envíos") ||
text.includes("enviar") || text.includes("ENVIAR") ||
text.includes("envian") || text.includes("ENVIAN") ||
text.includes("envían") || text.includes("ENVÍAN") ||
text.includes("mandar") || text.includes("MANDAR") ||
text.includes("mandan") || text.includes("MANDAN") ||
text.includes("entrega") || text.includes("ENTREGA") ||
text.includes("entregas") || text.includes("ENTREGAS") ||
text.includes("domicilio") || text.includes("DOMICILIO") ||
text.includes("a domicilio") || text.includes("A DOMICILIO") ||
text.includes("delivery") || text.includes("DELIVERY")
){
response='🚚 Por el momento no ofrecemos envíos.<br><br>\
Tu pedido debe recogerse directamente en nuestra tienda física 📍.<br><br>\
Gracias por tu comprensión 💕';
}

else if(
text.includes("gracias") || text.includes("GRACIAS") ||
text.includes("muchas gracias") || text.includes("MUCHAS GRACIAS") ||
text.includes("gracias!") || text.includes("GRACIAS!") ||
text.includes("thank you") || text.includes("THANK YOU") ||
text.includes("bye") || text.includes("BYE") ||
text.includes("adios") || text.includes("ADIOS") ||
text.includes("adiós") || text.includes("ADIÓS") ||
text.includes("hasta luego") || text.includes("HASTA LUEGO") ||
text.includes("nos vemos") || text.includes("NOS VEMOS") ||
text.includes("chao") || text.includes("CHAO")
){
response="🌸 ¡Gracias por visitarnos! Fue un placer ayudarte 😊<br><br>✨ ¡Te esperamos pronto!";
}




setTimeout(()=>{

typing.style.display="none";

messages.innerHTML+=`<div class="bot">${response}</div>`;
messages.scrollTop=messages.scrollHeight;

},900);

input.value="";
}
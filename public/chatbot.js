function toggleChat(){

let chat=document.getElementById("chatbox");
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

if(text.includes("hola")){
response="Hola 😊 dime que deseas saber.";
}



else if(text.includes("precio")   || text.includes("precios")|| text.includes("costos") || text.includes("productos")|| text.includes("producto") || text.includes("catalogo") || text.includes("perfumes")  || text.includes("costo")){
response='Nuestros perfumes van desde $350 hasta $2500.<br>Tenemos diferentes marcas, para hombre, mujer, nicho o diseñador<br><br>🛍️ Puedes ver nuestros perfumes aquí ⬇️<br><a class="catalogo-link" href="#" onclick="setState({currentPage: \'catalog\'})">✨ Ver catálogo</a>';
}

else if(text.includes("promocion")){
response="Actualmente tenemos promociones del 20% en perfumes seleccionados.";
}

else if(text.includes("ubicacion")  || text.includes("direccion")  || text.includes("donde")  || text.includes("ubican")){
response='Nuestra tienda está aquí 📍 <br><a class="map-link" href="https://www.google.com/maps?cid=4412960217130629308&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAEYASAB&hl=es&gl=MX&source=embed" target="_blank">Ver en Google Maps</a>';
}

else if(text.includes("horario") || text.includes("horarios") || text.includes("cierran") || text.includes("abren")   || text.includes("hora")  || text.includes("atencion")){
response="🕒 Nuestro horario es:<br><br>Lunes a Viernes: 10:00 - 20:00<br>Sábado: 11:00 - 18:00";
}

else if(text.includes("gracias")  || text.includes("adios")){
response="¡Fue un gusto! 🌸 Gracias por visitarnos.";
}

else if(text.includes("redes") || text.includes("twitter") || text.includes("facebook") || text.includes("instagram")){
response='📱 Síguenos en nuestras redes sociales:<br><br>\
<a class="social-link" href="https://www.facebook.com/frasesdeWinniePooh" target="_blank">📘 Facebook</a><br>\
<a class="social-link" href="https://www.instagram.com/luxury_fragrances7?igsh=MWg1NDQ2N2pxcmVtZA==" target="_blank">📸 Instagram</a>';
}

else if(text.includes("telefono") || text.includes("teléfonico") || text.includes("numero")){
response='📞 Puedes llamarnos aquí:<br><br><a class="phone-link" href="tel:+52 55 1234 5678">+52 55 1234 5678 <br>  en un horario de:<br>Lunes a Viernes: 10:00 - 20:00<br>Sábado: 11:00 - 18:00</a>';
}

else if(text.includes("correo") || text.includes("email") || text.includes("gmail") || text.includes("mail")){
response='📧 Puedes escribirnos a nuestro correo:<br><br><a class="mail-link" href="mailto:info@parfum.com">info@parfum.com</a>';
}


else if(text.includes("menu") || text.includes("info")  || text.includes("informacion") || text.includes("opciones") || text.includes("ayuda")){
response='🤖 ¿Qué deseas saber?<br><br>\
<div class="quick-buttons">\
<button onclick="quickQuestion(\'telefono\')">📞 Teléfono</button>\
<button onclick="quickQuestion(\'horario\')">🕒 Horarios</button>\
<button onclick="quickQuestion(\'precio\')">💰 Costos</button>\
<button onclick="quickQuestion(\'redes\')">📱 Redes sociales</button>\
</div>';
}

else if(text.includes("contacto")){
response='📩 Puedes comunicarte con nosotros de varias formas ⬇️<br><br>\
<div class="quick-buttons">\
<button onclick="quickQuestion(\'telefono\')">📞 Teléfono</button>\
<button onclick="quickQuestion(\'correo\')">📧 Correo</button>\
<button onclick="quickQuestion(\'redes\')">📱 Redes sociales</button>\
<button onclick="quickQuestion(\'ubicacion\')">📍 Visitar tienda</button>\
</div>';
}

setTimeout(()=>{

typing.style.display="none";

messages.innerHTML+=`<div class="bot">${response}</div>`;
messages.scrollTop=messages.scrollHeight;

},900);

input.value="";
}
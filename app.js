// ==================================================
// VARIABLES GLOBALES
// ==================================================
let arrayAmigos = [];
let listaAmigosSorteados = [];
let longitudNombreMin;
let longitudNombreMax;
let agregaAmigo;
let mostrarAmigos;
let mostrarAmigoSorteado;
let alerta;
let contadorElemento;
let tiempoAlertaMin;
let tiempoAlertaMax;

// ==================================================
// FUNCIONES DE INICIO Y CONFIGURACIÓN
// ==================================================

/**
 * Configura las condiciones iniciales de la aplicación
 * Establece valores por defecto y obtiene referencias a elementos DOM
 */
function condicionesIniciales() {
    longitudNombreMin = 3; // Un nombre debe tener al menos 3 caracteres
    longitudNombreMax = 30; // Un nombre no puede exceder los 30 caracteres
    tiempoAlertaMin = 0.7; // Alertas breves duran 0.7 segundos
    tiempoAlertaMax = 2.5; // Alertas largas duran 2.5 segundos
    agregaAmigo = document.getElementById("amigo");
    mostrarAmigos = document.getElementById("listaAmigos");
    mostrarAmigoSorteado = document.getElementById("resultado");
    document.querySelector(".button-container").classList.add("disabled");
    alerta = document.getElementById('miAlerta');
    contadorElemento = document.getElementById('contador');
    agregaAmigo.focus();
    return;
}

document.addEventListener("DOMContentLoaded", function () {
    condicionesIniciales();
});

// ==================================================
// FUNCIONES DE UTILIDAD (VALIDACIÓN Y FORMATEO)
// ==================================================

/**
 * Normaliza un texto eliminando espacios extras y unificando espacios múltiples
 * @param {string} texto - Texto a normalizar
 * @returns {string} Texto normalizado
 */
function normalizarTexto(texto) {
    return texto.trim().replace(/\s+/g, " ");
}

/**
 * Convierte un texto a formato de nombre propio (capitaliza cada palabra)
 * Ejemplo: "juan perez" → "Juan Perez"
 * @param {string} texto - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
function capitalizarNombreCompuesto(texto) {
    return texto.toLowerCase()
        .split(" ")
        .map(cadena => cadena.charAt(0).toUpperCase() + cadena.slice(1))
        .join(" ");
}

/**
 * 
 * @param {string} texto - Nombre a validar
 * @returns {boolean} True si el nombre es válido
 */
function validarNombre(texto) {
    // Expresión regular que solo permite letras y espacios (incluye caracteres en español)
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    return texto.trim() !== "" && regex.test(texto) && validarLongitud(texto);
}

/**
 * Valida que la longitud del texto esté dentro de los límites establecidos
 * @param {string} texto - Texto a validar
 * @returns {boolean} True si la longitud es válida
 */
function validarLongitud(texto) {
    return texto.length >= longitudNombreMin && texto.length <= longitudNombreMax;
}

/**
 * Verifica si un nombre ya existe en la lista de amigos (evita duplicados)
 * @param {string} texto - Nombre a verificar
 * @returns {boolean} True si el nombre NO está repetido
 */
function validarNombreRepetido(texto) {
    const textoNormalizado = texto.trim().toLowerCase().replace(/\s+/g, " ");
    return !arrayAmigos.some(nombre =>
        nombre.trim().toLowerCase().replace(/\s+/g, " ") === textoNormalizado
    );
}

// ==================================================
// FUNCIONES PRINCIPALES DE LA APLICACIÓN
// ==================================================

/**
 * Función principal para agregar un nuevo amigo a la lista
 * Realiza validaciones y actualiza la interfaz
 */
function agregarAmigo() {
    let nombre = normalizarTexto(agregaAmigo.value);
    if (!validarNombre(nombre)) {
        borrarEntradaTexto();
        mostrarAlerta(`El nombre <strong> ${nombre} </strong> ingresado es inválido, por favor ingrese un nombre correcto.`, tiempoAlertaMax);
    }
    else if (!validarNombreRepetido(nombre)) {
        mostrarAlerta(`Este nombre <strong>${nombre}</strong> se repite, por favor escribe de nuevo.`, tiempoAlertaMax);
        borrarEntradaTexto();
    }
    else {
        const nombreCapitalizado = capitalizarNombreCompuesto(nombre);
        arrayAmigos.push(nombreCapitalizado);
        mostrarListaAmigos(); // Refrescar lista visual
        borrarEntradaTexto(); // Limpiar campo de entrada

        if (arrayAmigos.length >= 1) {
            habilitarBotonSortear();
        }
    }
    return;
}

/**
 * Actualiza la lista visual de amigos en el DOM
 */
function mostrarListaAmigos() {
    mostrarAmigos.innerHTML = "";
    for (let amigo of arrayAmigos) {
        mostrarAmigos.innerHTML += `<li>${amigo}</li>`;
    }
    return;
}

/**
 * Limpia el campo de entrada y el área de resultados
 */
function borrarEntradaTexto() {
    agregaAmigo.value = "";
    document.getElementById("resultado").innerHTML = "";
    document.getElementById("amigo").focus();
    return;
}

/**
 * Realiza el sorteo de un amigo de manera aleatoria
 * Elimina al amigo sorteado de la lista disponible
 */
function sortearAmigo() {
    /*
    if (arrayAmigos.length === 0) {
        mostrarAlerta("No hay amigos para sortear.", 3);
        return;
    }
    */
    const indiceAleatorio = generarIndiceAleatorio(arrayAmigos.length);
    // Saca al amigo del array original - ESTO EVITA REPETICIONES
    const amigoSorteado = arrayAmigos.splice(indiceAleatorio, 1)[0];
    listaAmigosSorteados.push(amigoSorteado);
    mostrarAmigoSorteado.innerHTML = `<li>${amigoSorteado}</li>`;
    if (arrayAmigos.length === 0 && listaAmigosSorteados.length === 1) {
        // Caso: Único amigo sorteado Y solo había uno en la lista
        mostrarAmigoSorteado.innerHTML = `<li>${amigoSorteado} <span class="mensaje-final">¡Eres el único participante!</span></li>`;
        document.querySelector(".button-container").classList.add("disabled");
        agregaAmigo.focus();
    } else if (arrayAmigos.length === 0) {
        if (mostrarAmigoSorteado.lastElementChild) {
            console.log("no entras");
            console.log(mostrarAmigoSorteado.lastElementChild);
            mostrarAmigoSorteado.lastElementChild.innerHTML += `<span class="mensaje-final">, fue el último amigo en ser sorteado, el juego termino.</span>`;
        }
        document.querySelector(".button-container").classList.add("disabled");
        agregaAmigo.focus();
    }
    return;
}

/**
 * Genera un índice aleatorio dentro del rango especificado
 * @param {number} cantidadAmigos - Número total de amigos disponibles
 * @returns {number} Índice aleatorio entre 0 y cantidadAmigos-1, o -1 si no hay amigos
 */
function generarIndiceAleatorio(cantidadAmigos) {
    if (cantidadAmigos === 0) {
        return -1; // Indicador de error o situación especial
    }
    return Math.floor(Math.random() * cantidadAmigos);
}

// ==================================================
// SISTEMA DE ALERTAS PERSONALIZADAS
// ==================================================

/**
 * Muestra una alerta personalizada con temporizador visual
 * @param {string} mensaje - Mensaje a mostrar en la alerta (puede contener HTML)
 * @param {number} duracion - Duración en segundos que se mostrará la alerta
 */
function mostrarAlerta(mensaje, duracion) {
    let tiempo = duracion === tiempoAlertaMax ? tiempoAlertaMax : tiempoAlertaMin;
    const overlay = document.getElementById("miAlerta");
    const mensajeAlerta = document.getElementById("mensajeAlerta");
    const contador = document.getElementById("contador");
    mensajeAlerta.innerHTML = mensaje;
    overlay.style.display = "flex";
    contador.textContent = tiempo;
    let intervalo = setInterval(() => {
        tiempo--;
        contador.textContent = tiempo;
        if (tiempo <= 0) {
            clearInterval(intervalo);
            overlay.style.display = "none";
        }
    }, 1000);
    return;
}

// ==================================================
// CONTROL DE INTERFAZ DE USUARIO
// ==================================================

/**
 * Habilita el botón de sorteo removiendo la clase 'disabled'
 */
function habilitarBotonSortear() {
    const contenedor = document.querySelector(".button-container");
    contenedor.classList.remove("disabled");
    return;
}

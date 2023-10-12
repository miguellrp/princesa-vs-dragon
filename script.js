console.info("%c¡Hola! ¿Hubo algo que te picase la curiosidad? Coge y copia todo lo que quieras. Todo está hecho con HTML, CSS y JS nativo. " +
  "Si quieres echar un vistazo al código fuente: https://github.com/miguellrp/princesa-vs-dragon",
  "background-color: #8bb44c; color: black; padding: 10px; border: 1px solid green;");

/* MODAL INFO (HOME) */
function mostrarInfo () {
  let infoDialog = document.getElementById("dialog-info");
  let closeBtn = document.getElementById("close-btn");

  infoDialog.show();
  closeBtn.addEventListener("click", () => {
    infoDialog.close();
  });
}

/* ELEMENTOS HTML */
let vidaPrincesaHTML, vidaDragonHTML;
let cantidadPocionesHTML;
let notificacionAccionHTML;

/* VARIABLES IN-GAME */
let vidaPrincesa, vidaDragon;
let cantidadPociones = getNumAleatorio(0, 5);
let ataqueMaximoPrincesa = getNumAleatorio(3, 65);
let ataqueMaximoDragon = getNumAleatorio(3, 60);
let curacionMaximaPocion = getNumAleatorio(20, 100);
let danhoAtaque, curacion;

/* TIEMPO DE DELAY ENTRE NOTIFICACIONES */
let delayTimeMS = 2100;

/* ACCIONES IN-GAME */
function turnoDragon () {
  const ataquesDragon = [
    "de un zarpazo.",
    "de un latigazo con su cola.",
    "con un besito.",
    "con su aliento ardiente."
  ]

  actualizarHP("princesa", "ataque").then(() => {
    mostrarNotificacion(`🐉 El dragón te ha quitado ${danhoAtaque} puntos de vida ${ataquesDragon[getNumAleatorio(1, this.length - 1)]}`,
      "orangered", delayTimeMS);

    setTimeout(() => {
      if (vidaPrincesa.puntos <= 0) {
        let princesaAvatar = document.getElementById("princesa");
        princesaAvatar.textContent = "☠️";
        mostrarVentanaFinalPartida("derrota");
      }
    }, delayTimeMS);
  });
}

function atacar () {
  const ataquesPrincesa = [
    "con tu espada.",
    "con tu honda.",
    "con un avión de papel.",
    "con un alfiler."
  ]

  actualizarHP("dragon", "ataque").then(() => {
    mostrarNotificacion(`🤺 Le has quitado ${danhoAtaque} al dragón ${ataquesPrincesa[getNumAleatorio(1, this.length)]}`,
      "var(--primary-color)", delayTimeMS);

    setTimeout(() => {
      if (vidaDragon.puntos <= 0) {
        let dragonAvatar = document.getElementById("dragon");
        dragonAvatar.textContent = "☠️";
        mostrarVentanaFinalPartida("victoria");

      } else {
        turnoDragon();
      }
    }, delayTimeMS);
  });
}

function tomarPocion () {
  if (cantidadPociones != 0) {
    if (vidaPrincesa.puntos == 100) {
      let tomarPocionBtn = document.getElementById("tomar-pocion-btn");

      mostrarNotificacion("💗 ¡Ya estás a tope de vida!", "var(--high-hp-color)");
      setTimeout(() => {
        tomarPocionBtn.disabled = true;
      }, delayTimeMS);
    }
    else {
      actualizarHP("princesa", "curacion");
      cantidadPociones = (cantidadPociones - 1 < 0) ? 0 : cantidadPociones - 1;

      mostrarNotificacion(`💚 Te has curado ${curacion} puntos de vida.`, "var(--primary-color)", delayTimeMS);
      cargarPociones();

      setTimeout(() => {
        turnoDragon();
      }, delayTimeMS);
    }
  }
  else {
    let tomarPocionBtn = document.getElementById("tomar-pocion-btn");
    mostrarNotificacion("🫗 No te quedan pociones, ¡busca alguna!", "yellow");
    setTimeout(() => {
      tomarPocionBtn.disabled = true;
    }, delayTimeMS);
  }
}

function buscarPocion () {
  let buscarBtn = document.getElementById("buscar-btn");
  let pocionEncontrada = (getNumAleatorio(1, 4) == 1) ? true : false;

  if (cantidadPociones >= 5) {
    mostrarNotificacion("🎒 No puedes cargar con más pociones", "var(--high-hp-color)");
    buscarBtn.disabled = true;
  }
  else {
    if (pocionEncontrada) {
      cantidadPociones += 1;
      cargarPociones();
      mostrarNotificacion("⚗️ ¡Encontraste una poción!", "var(--primary-color)", delayTimeMS);
    } else {
      mostrarNotificacion("👎 No encontraste ninguna poción...", "yellow", delayTimeMS);
    }

    setTimeout(() => {
      turnoDragon();
    }, delayTimeMS);
  }

}

/* FUNCIONES COMPLEMENTARIAS */
function getNumAleatorio (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function cargarStats () {
  vidaPrincesa = new VidaPersonaje(getNumAleatorio(5, 100));
  vidaDragon = new VidaPersonaje(getNumAleatorio(5, 100));

  vidaPrincesaHTML = document.getElementById("vida-princesa");
  vidaDragonHTML = document.getElementById("vida-dragon");

  vidaPrincesaHTML.textContent = vidaPrincesa.puntos;
  vidaPrincesaHTML.style.color = vidaPrincesa.getColor();
  vidaPrincesaHTML.style.filter = `drop-shadow(2px 2px 10px ${vidaPrincesa.getColor()})`;

  vidaDragonHTML.textContent = vidaDragon.puntos;
  vidaDragonHTML.style.color = vidaDragon.getColor();
  vidaDragonHTML.style.filter = `drop-shadow(2px 2px 10px ${vidaDragon.getColor()})`;

  cargarPociones();
  mostrarNotificacion("⚔️ ¡Comienza la batalla! ⚔️", "var(--primary-color)");
}

function cargarPociones () {
  cantidadPocionesHTML = document.getElementById("cantidad-pociones");

  if (cantidadPociones == 0) {
    cantidadPocionesHTML.innerHTML = "❌";
  } else {
    cantidadPocionesHTML.innerHTML = "";
    for (let i = 1; i <= cantidadPociones; i++) {
      cantidadPocionesHTML.innerHTML += "⚗️ ";
    }
  }
}

function mostrarNotificacion (mensaje, color, delayTimeBotones = 0) {
  notificacionAccionHTML = document.getElementById("notificacion-accion");

  notificacionAccionHTML.textContent = mensaje;
  notificacionAccionHTML.style.color = color;
  notificacionAccionHTML.style.border = `1px solid ${color}`;
  notificacionAccionHTML.style.visibility = "visible";

  desactivarBotonesTemporal(delayTimeBotones);
}

function desactivarBotonesTemporal (delayTime) {
  let groupBotones = document.getElementsByTagName("input");

  for (let i = 0; i < groupBotones.length; i++) {
    groupBotones[i].disabled = true;
  }

  setTimeout(() => {
    for (let i = 0; i < groupBotones.length; i++) {
      groupBotones[i].disabled = false;
    }
  }, delayTime);
}

function actualizarHP (personaje, accion) {
  return new Promise((resolve) => {
    let vidaPersonaje = (personaje == "dragon") ? vidaDragon : vidaPrincesa;
    let vidaPersonajeNueva;


    if (accion == "ataque") {
      danhoAtaque = (personaje == "dragon")
        ? getNumAleatorio(2, ataqueMaximoDragon)
        : getNumAleatorio(2, ataqueMaximoPrincesa);

      vidaPersonajeNueva = (vidaPersonaje.puntos - danhoAtaque < 0) ? 0 : vidaPersonaje.puntos - danhoAtaque;
      actualizar1HPhasta(vidaPersonajeNueva, personaje);
      resolve();

    } else if (accion == "curacion") {
      curacion = getNumAleatorio(2, curacionMaximaPocion);
      curacion = (vidaPrincesa.puntos + curacion > 100)
        ? 100 - vidaPrincesa.puntos
        : curacion;

      vidaPersonajeNueva = vidaPrincesa.puntos + curacion;
      actualizar1HPhasta(vidaPersonajeNueva, personaje);
      resolve();
    }
  })
}

/* Efecto de animación para actualizar los HP de los personajes */
function actualizar1HPhasta (vidaPersonajeLimite, personaje) {
  let vidaPersonajeHTML = (personaje == "dragon")
    ? document.getElementById("vida-dragon")
    : document.getElementById("vida-princesa");
  let vidaPersonaje = (personaje == "dragon") ? vidaDragon : vidaPrincesa;

  if (vidaPersonajeLimite < vidaPersonaje.puntos) {
    let reducir1HP = setInterval(() => {
      vidaPersonajeHTML.textContent = vidaPersonaje.puntos;
      vidaPersonajeHTML.style.color = vidaPersonaje.getColor();
      vidaPersonajeHTML.style.filter = `drop-shadow(2px 2px 10px ${vidaPersonaje.getColor()})`;

      if (vidaPersonaje.puntos <= vidaPersonajeLimite) {
        clearInterval(reducir1HP);
      } else {
        vidaPersonaje.puntos -= 1;
      }
    }, 10);
  }
  else {
    let sumar1HP = setInterval(() => {
      vidaPersonajeHTML.textContent = vidaPersonaje.puntos;
      vidaPersonajeHTML.style.color = vidaPersonaje.getColor();
      vidaPersonajeHTML.style.filter = `drop-shadow(2px 2px 10px ${vidaPersonaje.getColor()})`;

      if (vidaPersonaje.puntos >= vidaPersonajeLimite) {
        clearInterval(sumar1HP);
      } else {
        vidaPersonaje.puntos += 1;
      }
    }, 10);
  }
}

function mostrarVentanaFinalPartida (resultado) {
  let finalDialog = document.getElementById("dialog-final");
  let notificacionAccionHTML = document.getElementById("notificacion-accion");
  let groupBotones = document.getElementsByTagName("input");

  finalDialog.open = true;
  notificacionAccionHTML.style.visibility = "hidden";
  /* Se desactivan todos los botones (excepto Salir) a modo de final de partida */
  for (let i = 0; i < groupBotones.length; i++) {
    if (groupBotones[i].id == "btn-salir") {
      continue;
    }
    groupBotones[i].disabled = true;
  }

  finalDialog.textContent = (resultado == "victoria")
    ? "¡Enhorabuena! Has conseguido vencer al dragón"
    : "Vaya... parece que ese dragón te ha dejado hecha añicos"
}

function play () {
  location.href = "princesaVSdragonGame.html";
}

function exit () {
  location.href = "index.html";
}

/* CLASE -> VIDA DE PERSONAJES (con método que devuelve un color en función del rango de puntos de vida) */
class VidaPersonaje {
  constructor (puntos) {
    this.puntos = puntos;
  }

  getColor () {
    if (this.puntos >= 80) {
      return "var(--high-hp-color)";
    } else if (this.puntos <= 20) {
      if (this.puntos == 0) {
        return "var(--zero-hp-color)";
      }
      return "var(--low-hp-color)";
    } else {
      return "var(--middle-hp-color)";
    }
  }
}
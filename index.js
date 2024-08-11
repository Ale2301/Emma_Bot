require("dotenv").config();
const { default: axios } = require("axios");
const keep_alive = require("./keep_alive.js");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const client = new Client({
  intents: [
    32767,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});
const fs = require("fs");
const { env } = require("process");
const fsPromise = require("fs").promises;
require("dotenv").config();

//Comandos de Emma
client.on("messageCreate", async (message) => {
  if (message.author.bot === false) {
    if (message.mentions.has(client.user) && message.content.startsWith("<@")) {
      let finalMessage = message.content.slice(22).trim();
      if (
        test &&
        message.author.id !== "368217259094704128" &&
        !message.author.bot
      ) {
        message.reply(
          "¡Hola! Estoy en modo testeo. O los devs se mandaron una cagada"
        );
        return;
      }
      if (stop === false || stopContraseña === false) {
        return message.reply(
          "No se llama a alguien jugando! Puedes usar 'terminar el juego' para que podamos volver a charlar"
        );
      }
      const ordenarEmma = require("./jsEmma/ordenarEmma.js");
      ordenarEmma.comandosEmma(client, finalMessage, message, lastChannel);
      //Ordenar a Emma: Jugar a las preguntas
      if (finalMessage.startsWith("juguemos a las preguntas")) {
        if (lastChannel === undefined) {
          message.reply("Vuelve a intentarlo, no estaba lista!");
          return;
        }
        message.reply(
          "Juguemos! Recuerda mencionarme y decir ' Terminar el juego ' cuando quieras detenerte y para el jueo :V"
        );
        juego();
      }
      //Ordenar a Emma: Jugar a la contraseña
      else if (finalMessage.startsWith("juguemos a la contraseña")) {
        message.reply("Juguemos!");
        juegoContraseña();
      }
    }
  }
});
//Juego de preguntas
let preguntaRandom;
let usuariosPreguntasPuntos = [];
async function juego() {
  fs.readFile("./EmmaJSON/preguntas.JSON", function (err, data) {
    if (err) {
      console.log("err");
    }
    preguntas = JSON.parse(data);
    preguntaRandom = preguntas[RNG(preguntas.length - 1)];
    stop = false;
    console.log(preguntaRandom);
    lastChannel.send(preguntaRandom.pregunta);
  });
}
/*client.on("messageCreate", async (message) => {
  console.log(stop);
  console.log(message.content.toLowerCase());
  console.log(message.author.bot);
  if (message.author.bot) {
    return;
  }
  if (stop === false && message.content.toLowerCase() !== "terminar el juego") {
    try {
      for (let i = -1; i < preguntaRandom.respuesta.length; i++) {
        if (message.content.toLowerCase() === preguntaRandom.respuesta[i]) {
          message.reply(
            "Correctisimo :v! Esa persona tiene mas cultura que el resto"
          );
          let actualUser = message.author.username;
          let userExists = usuariosPreguntasPuntos.filter(
            (e) => e.user === actualUser
          );
          if (userExists.length !== 0) {
            for (let i = 0; i < usuariosPreguntasPuntos.length; i++) {
              if (usuariosPreguntasPuntos[i].user === actualUser) {
                usuariosPreguntasPuntos[i].points++;
              }
            }
          } else {
            usuariosPreguntasPuntos.push({ user: actualUser, points: 1 });
          }
          await juego();
        }
      }
    } catch (e) {
      console.error(e);
    }
  } else if (message.content.toLowerCase() === "terminar el juego") {
    usuariosPreguntasPuntos.sort((a, b) =>
      a.points < b.points ? 1 : a.points > b.points ? -1 : 0
    );
    message.reply(
      "Juego de preguntas terminado! Una lastima :v pero estare al tanto por si quieren volver a jugar :] "
    );
    let embedRespuestas = new EmbedBuilder()
      .setTitle("Resultados juego de preguntas")
      .setColor("#ffc0cb")
      .setDescription(
        "...Y ahora a trasforma sus respuestas en puntos SI!! PUNTOS. Todos han jugado muy bien :D. Pero estos jugadores son los que mejor lo hicieron."
      )
      .setFooter({
        text: "Estaria encantada de que volvieramos a jugar todos juntos otra vez nya",
      })
      .setTimestamp();
    usuariosPreguntasPuntos.forEach(function (a, index) {
      if (index <= 4) {
        embedRespuestas.addFields({
          name: "<@" + a.user + ">",
          value: "Este jugador acertó " + a.points + " respuestas, increíble!",
        });
      }
    });
    message.reply({ embeds: [embedRespuestas] });
    preguntaRandom = undefined;
    stop = true;
    usuariosPreguntasPuntos = [];
  }
});*/

//Juego contraseña
let stopContraseña = true;
let contraseña = undefined;
let intentosContraseña = 0;
function juegoContraseña() {
  stopContraseña = false;
  contraseña = Math.floor(Math.random() * (9999 - 1000) + 1000);
  contraseña = contraseña.toString();
  setTimeout(() => {
    lastChannel.send(
      "hey hey, tengo pensado un número de 4 digitos, intenten adivinarlo! creen que podran? soy muy buena en esto :V"
    );
  }, 400);
}
/*client.on("messageCreate", (message) => {
  return; //CONTRASEÑA
  if (stopContraseña === false) {
    if (/^[0-9]+$/.test(message.content) && message.content.length === 4) {
      intentosContraseña++;
      console.log(contraseña);
      let embedRespuestasPreguntas = new EmbedBuilder()
        .setTitle("Juego de la contraseña")
        .setColor("#ffc0cb")
        .setDescription("Veamos que han descubierto hasta ahora!")
        .setTimestamp();
      if (message.content === contraseña) {
        embedRespuestasPreguntas.addFields({
          name: "<@" + message.author.username + ">",
          value:
            "Ganaste el juego, felicidades! La contraseña era " +
            contraseña +
            " y se tomaron " +
            intentosContraseña +
            " intentos",
        });
        message.reply({ embeds: [embedRespuestasPreguntas] });
        stopContraseña = true;
      } else {
        let corrects = 0;
        console.log("Entrando al else");
        for (let i = 0; i < message.content.length; i++) {
          for (let z = 0; z < contraseña.length; z++) {
            if (message.content[i] == contraseña[z] && i == z) {
              corrects++;
              embedRespuestasPreguntas.addFields({
                name: "Pista:",
                value:
                  "El numero " +
                  message.content[i] +
                  " va en la posición " +
                  (i + 1),
              });
            }
          }
        }
        if (corrects === 0) {
          embedRespuestasPreguntas.addFields({
            name: ":(",
            value:
              "Ese numero no tiene nada que ver con el que estoy pensando!",
          });
        }
        message.reply({ embeds: [embedRespuestasPreguntas] });
      }
    } else if (message.content === "terminar el juego") {
      stopContraseña === true;
      message.reply(
        "Eligieron terminar el juego! Se quedarán con la duda de cuál era la contraseña :)"
      );
    }
  }
});
*/
let secondsCheck = 0;
let lastRememberedId = 0;
let inactiveChatSeconds = 5000;
let stop = true;
fs.readFile("./EmmaJSON/botStateArray.JSON", function (err, data) {
  if (err) {
    console.log("err");
  }
  emmaStates = JSON.parse(data);
});
///funcion de aleatoriedad
function RNG(max) {
  let random = Math.round(Math.random() * max);
  return random;
}

let respuesta;
fs.readFile("./EmmaJSON/respuestas.JSON", function (err, data) {
  if (err) {
    console.log("err");
  }
  respuesta = JSON.parse(data);
});

/*client.on("messageCreate", (message) => {
  lastChannel = message.channel;
  lastAuthor = message.author;
  lastId = message.id;
  if (test && message.author.id !== 368217259094704128 && !message.author.bot) {
    return;
  }
  if (stop) {
    if (message.author.bot === false) {
      const emmaResponde = require("./jsEmma/respuestasAutomaticas.js");
      emmaResponde.respuestasEmma(message, respuesta, lastChannel, client);
    }
  }
});*/
let lastChannel = undefined;
let lastAuthor = undefined;
let lastId = undefined;

client.on("ready", () => {
  checkMessageHour();
});
function toReddit(message, extra) {
  const funcionReddit = require("./jsEmma/mensajesReddit.js");
  funcionReddit.redditMensajes(message, extra);
}

function checkMessageHour() {
  setTimeout(() => {
    const revisarMensajesHora = require("./jsEmma/mensajesAutomaticos.js");
    revisarMensajesHora.emmaMensajesHorarios(
      lastChannel,
      process.env.TRELLO,
      process.env.TRELLO_API,
      process.env.TRELLO_TOKEN
    );
    checkMessageHour();
  }, 60000);
}

function checkTimer() {
  setTimeout(() => {
    if (lastId === undefined) {
    } else if (lastRememberedId === lastId) {
      secondsCheck++;
      if (secondsCheck === inactiveChatSeconds) {
        if (lastAuthor.username !== "Emma-San") {
          datazo(message);
        }
        secondsCheck = 0;
      }
    } else {
      lastRememberedId = lastId;
      secondsCheck = 0;
    }
    checkTimer();
  }, 1000);
}

function datazo(message) {
  const datoEmma = require("./jsEmma/otorgarDatos.js");
  console.log(datoEmma);
  datoEmma.emmaDiceDato(lastChannel, message);
}

var test = process.env.testing;

client.on("ready", () => {
  console.log("El bot se prendio");
  try {
    if (test) {
      throw new Error("No apto para usar");
    }
    test = false;
    console.log("Apto para usar");
  } catch (error) {
    console.log("Emma esta siendo testeada");
  }
  if (process.env.TRELLO) {
    lastChannel = "1269130876415901747";
    lastChannel = client.channels.cache.get(lastChannel);
  }
  if (test) {
    client.user.setActivity("Siendo testeada. Y duele");
    return;
  }
  secondsCheck = 0;
  checkTimer();
  console.log(`Logged in as ${client.user.tag}!`);
  console.log("Emma esta ahora Online!");
  setInterval(() => {
    client.user.setActivity(emmaStates[RNG(emmaStates.length - 1)]);
  }, 60000);
});

module.exports = keep_alive;

// iniciacion de emma
client.login(process.env.DISCORD_AUTHENTICATION_TOKEN);

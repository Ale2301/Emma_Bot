module.exports.respuestasEmma = async function (
  message,
  respuesta,
  lastChannel,
  client,
) {
  //CREAR CLIENTE PARA EMMAAI
  const claveEmma = process.env["EMMA_AI_INSTANCIA"];
  const devKey = process.env["DEV_KEY"];

  async function emmaAi(prompt) {
    prompt = prompt.replace(/[@1234567890><]/g, "");
    console.log("Entrando en función de EmmaAI");
    var XMLHttpRequest = require("xhr2");
    const xpath = require("xpath");
    var xhr = new XMLHttpRequest();
    var url = "https://www.botlibre.com/rest/api/chat";
    console.log(prompt);
    var xml = `
    <chat application="${devKey}" instance="${claveEmma}">
        <message>${prompt}</message>
    </chat>`;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/xml");
    xhr.responseType = "text";
    console.log("Enviando mensaje a EmmaAI...");
    xhr.onload = function () {
      // Si el estado de la petición es 200 (éxito)
      if (xhr.status === 200) {
        var response = xhr.response;
        const DOMParser = require("xmldom").DOMParser;
        const doc = new DOMParser().parseFromString(response);
        const respuesta = doc.getElementsByTagName("message")[0];
        console.log(respuesta.textContent);
        message.reply(respuesta.textContent);
      } else {
        console.log("error " + xhr.status);
      }
    };
    xhr.send(xml);
  }

  //funcion para todo tipo de azar
  function RNG(max) {
    let random = Math.round(Math.random() * max);
    return random;
  }
  //Respuestas a mensajes fijos
  if (message.content.toLowerCase() === "decime mi nivel de puto") {
    message.reply(
      respuesta.respuestasNivelPuto[
        RNG(respuesta.respuestasNivelPuto.length - 1)
      ],
    );
  }
  if (message.content.toLowerCase() === "dame un abrazo") {
    message.reply(
      respuesta.respuestasAbrazo[RNG(respuesta.respuestasAbrazo.length - 1)],
    );
  }
  if (RNG(3) === (0 || 1)) {
    //Respuestas a mensajes con probabilidad
    if (message.content.toLowerCase().includes("hola")) {
      message.reply(
        respuesta.respuestasSaludo[RNG(respuesta.respuestasSaludo.length - 1)],
      );
    }
    if (
      message.content.toLowerCase().includes("adios") ||
      message.content.toLowerCase().includes("nos vemos")
    ) {
      {
        message.reply(
          respuesta.respuestasSaludo[
            RNG(respuesta.respuestasSaludo.length - 1)
          ],
        );
      }
    }
    if (
      message.content.toLowerCase().includes("@") &&
      !message.mentions.has(client.user)
    ) {
      {
        message.reply(
          respuesta.respuestasMenciones[
            RNG(respuesta.respuestasMenciones.length - 1)
          ],
        );
      }
    }
    if (message.content.toLowerCase().includes("basado")) {
      message.reply("exelente argumento pero ... "), message.react("😎");
      message.reply(
        "92.28.211.234 N: 4.818851 Y: -75.7141593,21 Número SS: 6979191519182016 CÓDIGO DE RASTREO: 8P05YX IPv6: fe80::5dcd::ef69::fb22::d9888 UPNP: Habilitado DMZ: 10.112.42.15 MAC: 5A:75:3E:7E:00 ISP: Ucom Unversal DNS: 8.8.8.8 ALT DNS: 1.1.1.8.1 DNS: SUFFIX: Dlink WAN: 100.23.10.15 TIPO WAN: Soldado Nat GATEWAY: 192.168.0.1 MASCARILLA SUBNET: 255.255.0.255 UDP PUERTOS ABIERTOS: 8080 80 TCP PUERTOS ABIERTOS: 443 RUTA DEL VENDEDOR: ERICCSON VENDEDOR DE DISPOSITIVOS: WIN31-X TIPO DE CONEXIÓN: Ethernet ICMP HOPS:{ 192.168.01 192.168.1.1 100.73.43.4 host-132.12.32.167.ucom.com host-66.120.12.111.ucom.com 36.134.67.189 216.239.78.111 sof02s32-in-f14.1e100.net TOTAL HOPS: 8",
      ),
        message.react("😎");
      message.reply(
        "y para la siguiete te va peor, si seguis molestando tu credito bancario va a bajar tanto que no te van a prestar libros en la biblioteca  ",
      ),
        message.react("😎");
    }
    if (message.content.toLowerCase() === "colo") {
      message.reply("Si podes leer esto el colo no hizo bien su trabajo"),
        message.react("⭐");
    }
    if (message.content.toLowerCase() === "te pregunto") {
      message.reply(
        respuesta.respuestasQuienTePregunto[
          RNG(respuesta.respuestasQuienTePregunto.length - 1)
        ],
      );
    }
    if (message.content.toLowerCase().includes("https")) {
      message.reply(
        respuesta.respuestasHipervinculo[
          RNG(respuesta.respuestasHipervinculo.length - 1)
        ],
      );
    }
    if (
      message.content.toLowerCase().includes("?") ||
      message.content.toLowerCase().includes("¿")
    ) {
      message.reply(
        respuesta.respuestasSignoPregunta[
          RNG(respuesta.respuestasSignoPregunta.length - 1)
        ],
      );
    }
    if (
      message.content.toLowerCase().includes("!") ||
      message.content.toLowerCase().includes("¡")
    ) {
      message.reply(
        respuesta.respuestasSignoAdmiracion[
          RNG(respuesta.respuestasSignoAdmiracion.length - 1)
        ],
      );
    }
    if (message.content.toLowerCase().includes("alla")) {
      message.reply(
        respuesta.respuestasAlla[RNG(respuesta.respuestasAlla.length - 1)],
      );
    }
  }
  if (RNG(0) === 0) {
    let input = message.content;
    console.log(input);
    fetch("https://emma.cristianalvara9.repl.co/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: input }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.output);
      })
      .catch((e) => {
        console.error("error en javascript:", e);
      });
    //emmaAi(message.content);
  }
};
const respuestasAnteriores = [];
const inputsAnteriores = [];

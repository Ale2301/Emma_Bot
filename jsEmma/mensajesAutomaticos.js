const { default: axios } = require("axios");

module.exports.emmaMensajesHorarios = async function (
  lastChannel,
  jobMode,
  apiKey,
  tokenKey
) {
  let horaActual;
  let amPm;
  let hora;
  const dias = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ];
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  momentoActual = new Date();
  momentoActual = new Date(momentoActual.getTime() + -3 * 60 * 60 * 1000);
  diaActual = dias[momentoActual.getDay()];
  fechaActual = momentoActual.getDate();
  mesActual = meses[momentoActual.getMonth()];
  horaActual = momentoActual.getHours();
  hora = horaActual;
  amPm = hora >= 12 ? "pm" : "am";
  hora = horaActual % 12 || 12;
  minuto = momentoActual.getMinutes();
  console.log(
    "Este es un día " +
      diaActual +
      " con fecha " +
      fechaActual +
      " del mes " +
      mesActual +
      ". La hora actual es " +
      hora +
      ":" +
      minuto +
      amPm
  );
  console.log(hora, minuto);
  if (lastChannel !== undefined) {
    console.log("Se esta verificando la hora");
    const fs = require("fs");
    let mensajesEmma;
    const api_url =
      "https://api.trello.com/1/boards/rtvZMMhG/cards?key=" +
      apiKey +
      "&token=" +
      tokenKey;

    const team = {
      juan: 0,
      lucho: 0,
      toby: 0,
      eli: 0,
      cris: 0,
      ale: 0,
      fran: 0,
    };
    const teamReview = {
      juan: 0,
      lucho: 0,
      toby: 0,
      eli: 0,
      cris: 0,
      ale: 0,
      fran: 0,
    };
    const users = [
      "492729222276579333",
      "417198683701116940",
      "347833469474439170",
      "551463506344411156",
      "644379308684476426",
      "368217259094704128",
      "907382565499990016",
    ];
    async function fetchData() {
      try {
        const response = await axios.get(api_url);
        const allCards = response.data.filter(
          (c) =>
            c.idList === "6647cc133574da188fb40d8a" ||
            c.idList === "6647cc2cd02082eda341617f" ||
            c.idList === "664acdc3542a3c189db431e3"
        );
        console.log("se detectaron " + allCards.length + "cartas en Trello");
        allCards.forEach((e) => {
          const name = e.name.toLowerCase();
          Object.keys(team).forEach((memberName) => {
            if (name.includes(memberName)) {
              if (e.idList === "664acdc3542a3c189db431e3") {
                teamReview[memberName] += 1;
              } else {
                team[memberName] += 1;
              }
            }
          });
        });
        lastChannel.send(e.introMessage);
        const userNames = Object.keys(team);
        userNames.forEach((userName) => {
          console.log(team[userName]);
          const index = userNames.indexOf(userName);
          const userId = users[index];
          const pendingCards = team[userName.toString()];
          const reviewCards = teamReview[userName.toString()];
          const message = `<@${userId}> Tiene ${pendingCards} tarjetas pendientes y ${reviewCards} tarjetas en revisión.`;
          console.log(message);
          lastChannel.send(message);
        });
        lastChannel.send("¡Las preguntas!");
        lastChannel.send(e.firstQuestion);
        lastChannel.send(e.secondQuestion);
        lastChannel.send(e.thirdQuestion);
        lastChannel.send(e.outroMessage);
      } catch (e) {
        console.log("Error al enviar la DSU:", e);
      }
    }

    //
    if (jobMode) {
      console.log("El modo Trello esta habilitado");
      fs.readFile("./EmmaJSON/managerEmma.JSON", function (err, data) {
        if (err) {
          console.log("err");
        }
        mensajesEmma = JSON.parse(data);
        mensajesEmma.forEach((e) => {
          if (
            (e.fecha === fechaActual || e.fecha === true) &&
            (e.mes === mesActual || e.mes === true) &&
            (e.dia === diaActual || e.dia === true) &&
            (e.hora === hora || e.hora === true) &&
            (e.minuto === minuto || e.minuto === true) &&
            (e.amPm === amPm || e.amPm === true)
          ) {
            console.log("Estamos en horario de mandar el mensaje!");
            fetchData(e);
          }
        });
      });
      return;
    }
    fs.readFile("./EmmaJSON/mensajesAutomaticos.JSON", function (err, data) {
      if (err) {
        console.log("err");
      }
      mensajesEmma = JSON.parse(data);
      mensajesEmma.forEach((e) => {
        if (
          (e.fecha === fechaActual || e.fecha === true) &&
          (e.mes === mesActual || e.mes === true) &&
          (e.dia === diaActual || e.dia === true) &&
          (e.hora === hora || e.hora === true) &&
          (e.minuto === minuto || e.minuto === true) &&
          (e.amPm === amPm || e.amPm === true)
        ) {
          lastChannel.send(e.message);
        }
      });
    });
  }
};

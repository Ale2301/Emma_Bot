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
      "https://api.trello.com/1/boards/61jdu8Th/cards?key=" +
      apiKey +
      "&token=" +
      tokenKey;

    const team = {
      "6647d802a75b4fbdcc4538dc": 0, //Juanse
      "6647ca417e0fc2e77e3c4920": 0, //Lucho
      "646fae139a1c99a39f66e32d": 0, //Toby
      "6647d0437ba1a7f67db50a75": 0, //Eli
      "62f0759b9be20318ddf5f00d": 0, //Cris
      "62e899f9c63ee631931d5798": 0, //Ale
      "66513c35adf44c7b0ec3023c": 0, //Alex
      "6655def75e2e8eb8723a3d5f": 0, //Lucas
    };
    const teamReview = {
      "6647d802a75b4fbdcc4538dc": 0, //Juanse
      "6647ca417e0fc2e77e3c4920": 0, //Lucho
      "646fae139a1c99a39f66e32d": 0, //Toby
      "6647d0437ba1a7f67db50a75": 0, //Eli
      "62f0759b9be20318ddf5f00d": 0, //Cris
      "62e899f9c63ee631931d5798": 0, //Ale
      "66513c35adf44c7b0ec3023c": 0, //Alex
      "6655def75e2e8eb8723a3d5f": 0, //Lucas
    };
    const users = [
      "492729222276579333",
      "417198683701116940",
      "347833469474439170",
      "551463506344411156",
      "644379308684476426",
      "368217259094704128",
      "295023905679212557",
      "705127114759995494",
    ];
    async function fetchData(e) {
      try {
        const response = await axios.get(api_url);
        const allCards = response.data.filter(
          (c) =>
            c.idList === "668ca1efc67c863040f4931a" ||
            c.idList === "668ca20b433a88fbb00dd99b" ||
            c.idList === "668ca21838eff6667fbad084"
        );
        console.log("se detectaron " + allCards.length + "cartas en Trello");
        console.log(lastChannel);
        allCards.forEach((e) => {
          Object.keys(team).forEach((memberName) => {
            if (e.idMembers[0] === memberName) {
              if (e.idList === "668ca21838eff6667fbad084") {
                teamReview[memberName] += 1;
              } else {
                team[memberName] += 1;
              }
            }
          });
        });

        lastChannel.send("<@1260086036894322759> " + e.introMessage);
        const userNames = Object.keys(team);
        userNames.forEach((userName) => {
          console.log(team[userName]);
          const index = userNames.indexOf(userName);
          const userId = users[index];
          const pendingCards = team[userName.toString()];
          const reviewCards = teamReview[userName.toString()];
          if (pendingCards > 0 || reviewCards > 0) {
            const message = `<@${userId}> Tiene ${pendingCards} tarjetas pendientes y ${reviewCards} tarjetas en revisión.`;
            console.log(message);
            lastChannel.send(message);
          }
        });
        const cardsDoneThisWeek = response.data.filter(
          (e) => e.idList === "668ca224a643932c7877f710"
        );
        lastChannel.send(
          `Hicieron ${cardsDoneThisWeek.length} tarjetas esta semana`
        );
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

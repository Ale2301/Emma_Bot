module.exports.emmaMensajesHorarios = async function (lastChannel) {
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
      amPm,
  );
  console.log(hora, minuto);
  if (lastChannel !== undefined) {
    const fs = require("fs");
    let mensajesEmma;
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

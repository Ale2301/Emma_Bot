module.exports.comandosEmma = async function (
  client,
  finalMessage,
  message,
  lastChannel
) {
  const { EmbedBuilder } = require("discord.js");
  const ytdl = require("ytdl-core-discord");
  const yts = require("yt-search");
  const { createWriteStream } = require("fs");
  const ffmpegPath = require("static-ffmpeg").path;
  const ffmpeg = require("fluent-ffmpeg");
  ffmpeg.setFfmpegPath(ffmpegPath);
  const {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
  } = require("@discordjs/voice");
  //ordenar a emma: warframe pricecheck
  const warframeMarket = require("./pruebaApiWarframe.js");
  if (finalMessage.startsWith("price")) {
    let item = finalMessage.slice(6).trim();
    await warframeMarket.warframe("price", item, message);
  } else if (finalMessage.startsWith("reliquia")) {
    let item = finalMessage.slice(9).trim();
    await warframeMarket.warframe("relic", item, message);
  } else if (finalMessage.startsWith("reliquiah")) {
    let item = finalMessage.slice(10).trim();
    await warframeMarket.warframe("relich", item, message);
  }
  //ordenar a emma: reproducir una cancion
  else if (finalMessage.startsWith("reproduce")) {
    finalMessage = finalMessage.slice(9);
    const user = await message.member.fetch();
    let channel = await user.voice.channel;
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    let args = finalMessage;
    const { videos } = await yts(args);
    if (!videos.length) {
      return message.reply("No pude encontrar ninguna canción :(");
    }
    const song = {
      title: videos[0].title,
      url: videos[0].url,
    };
    message.reply("Genial estoy lista. Ahora te cantaré :" + song.url);
    const emmaCanta = createAudioPlayer();
    console.log(song.url);
    try {
      const stream = ytdl(song.url, {
        filter: "audioonly",
        highWaterMark: 1 << 25,
      });
      ffmpeg(stream)
        .outputOptions("-f mp3")
        .on("start", () => {
          console.log("Starting to convert the stream...");
        })
        .on("progress", (progress) => {
          console.log("Conversion progress: ", progress.percent);
        })
        .on("end", () => {
          console.log("Stream conversion finished");
        })
        .on("error", (err) => {
          console.error("An error occurred during stream conversion: ", err);
        })
        .pipe(createWriteStream("song.mp3"), { end: true });

      const resource = createAudioResource("song.mp3");
      console.log(resource);
      emmaCanta.play(resource);
      connection.subscribe(emmaCanta);
      emmaCanta.on("finish", () =>
        console.log("La canción finalizó sin errores")
      );
      emmaCanta.on("error", (error) => console.error(error));
    } catch (e) {
      console.error("error al reproducir la canción ", e);
    }
  }

  //Ordenar a Emma: Dar un Dato
  else if (finalMessage.startsWith("dame un dato")) {
    if (lastChannel === undefined) {
      return message.reply("Vuelve a intentarlo, no estaba lista!");
    }
    const datoEmma = require("../jsEmma/otorgarDatos.js");
    datoEmma.emmaDiceDato(lastChannel, message);
  } else if (finalMessage.startsWith("juguemos a las preguntas")) {
    return;
  }

  //Ordenar a Emma: Menu de ayuda
  else if (finalMessage.startsWith("help")) {
    let embedDatos = new EmbedBuilder()
      .setTitle("Lista de comandos Emma")
      .setColor("#ffc0cb")
      .setDescription(
        "Aún estoy en me estoy desarrollando por que estoy chikita, pero puedes llamarme con <@" +
          client.user +
          "> y estoy para lo que necesites!"
      )
      .setFooter({
        text: "No te olvides de escribir bien los mensajes para que pueda entenderte :)",
      })
      .setTimestamp()
      .addFields({
        name: "help",
        value:
          "Dime esto para que pueda ayudarte a saber todo lo que puedo hacer y pedirme ayuda (Abrir este menu). Siempre megusta extenderte una mano :v",
        inline: true,
      })
      .addFields({
        name: "reproduce + (nombre de cancion)",
        value: "usa este comando para que me una a un chat de voz y cante algo",
      })
      .addFields({
        name: "dame un dato",
        value: "Te contare un dato que seguramente no sabias :3",
      })
      .addFields({
        name: "juguemos a las preguntas/terminar el juego",
        value:
          "Con eso me diras cuando quieras empezar o termianr el juego de preguntas que tengo para ti :)",
      })
      .addFields({
        name: "juguemos a la contraseña/terminar el juego",
        value:
          "Con eso me diras cuando quieras empezar o termianr el juego de la contraseña que tengo para ti :)",
      });
    message.reply({ embeds: [embedDatos] });
  }
  //Ordenar a Emma: Comando no reconocido
  else {
    const emmaResponde = require("./respuestasAutomaticas.js");
    emmaResponde.respuestasEmma(message, true, lastChannel, client);
  }
};

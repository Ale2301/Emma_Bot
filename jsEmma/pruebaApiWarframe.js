module.exports.warframe = async function (petition, item, msg) {
  const { EmbedBuilder, MessageEmbed } = require("discord.js");
  const axios = require("axios");
  const priceCheckWarframe = require("./warframe/priceCheck.js");
  let response;
  if (petition === "price") {
    await priceCheckWarframe.checkPrice(item, msg);
  } else if (petition === "relic" || petition === "relich") {
    const api_url = "https://api.warframestat.us/pc/fissures";
    try {
      response = await axios.get(api_url);
      fissures = response.data;
      message = "";
      // creamos un objeto vacío para almacenar las fisuras por tier
      const fissuresByTier = {};
      // recorremos el array de fisuras
      for (const fissure of fissures) {
        // si la fisura es hard, la ignoramos
        if (petition === "relic" && fissure.isHard) {
          continue;
        }
        if (petition === "relich" && !fissure.isHard) {
          continue;
        }
        // obtenemos el tier de la fisura
        const tier = fissure.tier;
        // si el tier no existe en el objeto, lo creamos como un array vacío
        if (!fissuresByTier[tier]) {
          fissuresByTier[tier] = [];
        }
        // añadimos la fisura al array correspondiente al tier
        fissuresByTier[tier].push(fissure);
      }
      // creamos un array de embeds vacío
      const embeds = [];
      // recorremos las propiedades del objeto (los tiers)
      for (const tier in fissuresByTier) {
        // creamos un nuevo embed con el título del tier
        const embed = new EmbedBuilder()
          .setTitle(`Fisuras de ${tier}`)
          .setColor("#FF5733")
          .setTimestamp();
        // recorremos el array de fisuras del tier
        for (const fissure of fissuresByTier[tier]) {
          // obtenemos los datos de la fisura
          const node = fissure.node;
          const missionType = fissure.missionType;
          const eta = fissure.eta;
          // añadimos un campo al embed con los datos de la fisura
          embed.addFields({
            name: `${missionType}`,
            value: `Nodo: ${node}\nTiempo restante: ${eta}`,
          });
        }
        // añadimos el embed al array de embeds
        embeds.push(embed);
      }
      // enviamos todos los embeds juntos
      msg.reply({ embeds: embeds });
    } catch (e) {
      console.error(e);
      return "Error en las fisuras";
    }
  }
};

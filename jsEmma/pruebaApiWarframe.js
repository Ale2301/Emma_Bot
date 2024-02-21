module.exports.warframe = async function (petition, item, msg) {
  const { EmbedBuilder, MessageEmbed } = require("discord.js");
  const axios = require("axios");
  const lookForParts = [
    "blueprint",
    "chassis_blueprint",
    "neuroptics_blueprint",
    "systems_blueprint",
  ];
  let item_name = item;
  let response;
  if (petition === "price") {
    const api_url =
      "https://api.warframe.market/v1/items/" +
      item_name.toLowerCase().replace(/ /g, "_") +
      "/orders";
    let output = await checkUrl(api_url);
    const embed = new EmbedBuilder()
      .setTitle(`Órdenes de venta de ` + item_name)
      .setColor("#FF5733")
      .setTimestamp();
    const messagesByPrice = new Map();
    for (let i = 0; i < 10; i++) {
      const price = output[i].platinum;
      const message = `/w ${output[i].user.ingame_name} Hi! I want to buy: ${item_name} for ${price} platinum.`;

      if (!messagesByPrice.has(price)) {
        // Si el precio no existe en el mapa, crea una nueva entrada
        messagesByPrice.set(price, [message]);
      } else {
        // Si el precio ya existe, agrega el mensaje al array existente
        messagesByPrice.get(price).push(message);
      }
    }
    messagesByPrice.forEach((messages, price) => {
      const formattedMessages = messages.join("\n");
      embed.addFields({
        name: `Se vende por: ${price}pt`,
        value: formattedMessages,
      });
    });
    msg.reply({ embeds: [embed] });
    if (item_name.includes("set")) {
      const embed = new EmbedBuilder()
        .setTitle(`¿Buscando partes para ${item_name}?`)
        .setColor("#3498db")
        .setTimestamp();

      // Iterar sobre cada parte del conjunto
      for (const part of lookForParts) {
        console.log(item_name);
        let lookingPartNow = item_name
          .toLowerCase()
          .replace(/\bset\b|\s+/g, "_")
          .replace(/_+$/, "");
        console.log(lookingPartNow + "_" + part);
        const newItemVar =
          "https://api.warframe.market/v1/items/" +
          lookingPartNow +
          "_" +
          part +
          "/orders";
        const newResponse = await checkUrl(newItemVar);
        if (newResponse) {
          embed.addFields({
            name: item_name + "_" + part,
            value: "Esta parte vale " + newResponse[0].platinum + " platinos",
          });
        }
      }
      // Enviar el embed al canal
      msg.reply({ embeds: [embed] });
    }
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
  async function checkUrl(url) {
    try {
      let output = await axios.get(url);
      output = output.data.payload.orders;
      output = output.filter(function (order) {
        return order.order_type === "sell";
      });
      output = output.filter(function (isOnline) {
        return isOnline.user.status === "ingame";
      });
      output.sort(function (a, b) {
        return a.platinum - b.platinum;
      });
      if (typeof output[0] === "undefined") {
        return "No encontré órdenes de venta para el objeto " + item_name;
      }
      return output;
    } catch (e) {
      return false;
    }
  }
};

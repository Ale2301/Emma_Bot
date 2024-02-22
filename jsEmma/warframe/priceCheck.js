module.exports.checkPrice = async function (item, msg) {
  const axios = require("axios");
  const { EmbedBuilder } = require("discord.js");
  const lookForParts = [
    "blueprint",
    "chassis_blueprint",
    "neuroptics_blueprint",
    "systems_blueprint",
  ];
  let item_name = item;
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
  async function checkUrl(url) {
    try {
      let output = await axios.get(url);
      output = output.data.payload.orders.filter(function (order) {
        return order.order_type === "sell" && order.user.status === "ingame";
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

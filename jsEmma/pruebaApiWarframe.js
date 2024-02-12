module.exports.warframe = async function(petition,item,msg) {
  const {EmbedBuilder} = require ("discord.js")
  const axios = require("axios")
  let item_name = item
  let response
  if (petition === "price"){
      const api_url = 'https://api.warframe.market/v1/items/' + item_name.toLowerCase().replace(/ /g, '_') + '/orders';
      try{
        response = await axios.get(api_url)
      }catch(e){
        return "Ese objeto no existe en warframe.market"
      }
      let output = response.data.payload.orders
      output = output.filter(function(order){
        return order.order_type === "sell"
      })
      output = output.filter(function(isOnline){
        return isOnline.user.status === "ingame"
      })
      output.sort(function (a, b) {
        return a.platinum - b.platinum;
      });
      if (typeof output[0] === "undefined") {
        return "No encontré órdenes de venta para el objeto " + item_name
      }
      return "El precio mas barato es de " + output[0].platinum + " platinos. Lo vende " + output[0].user.ingame_name + " y puedes contactarlo copiando lo siguiente : /w " + output[0].user.ingame_name + " Hi! I want to buy: " + item_name + " for " + output[0].platinum + " platinum."
  }
    else if ((petition === "relic") || (petition === "relich")){
      const api_url = "https://api.warframestat.us/pc/fissures"
      try{
        response = await axios.get(api_url)
        fissures = response.data
        message = ""
        // creamos un objeto vacío para almacenar las fisuras por tier
        const fissuresByTier = {}
        // recorremos el array de fisuras
        for (const fissure of fissures){
          // si la fisura es hard, la ignoramos
          if ((petition === "relic") && (fissure.isHard)){
            continue
          }
          if ((petition === "relich") && (!fissure.isHard)){
            continue
          }
          // obtenemos el tier de la fisura
          const tier = fissure.tier
          // si el tier no existe en el objeto, lo creamos como un array vacío
          if (!fissuresByTier[tier]){
            fissuresByTier[tier] = []
          }
          // añadimos la fisura al array correspondiente al tier
          fissuresByTier[tier].push(fissure)
        }
        // creamos un array de embeds vacío
        const embeds = []
        // recorremos las propiedades del objeto (los tiers)
        for (const tier in fissuresByTier){
          // creamos un nuevo embed con el título del tier
          const embed = new EmbedBuilder()
          .setTitle(`Fisuras de ${tier}`)
          .setColor("#FF5733")
          .setTimestamp()
          // recorremos el array de fisuras del tier
          for (const fissure of fissuresByTier[tier]){
            // obtenemos los datos de la fisura
            const node = fissure.node
            const missionType = fissure.missionType
            const eta = fissure.eta
            // añadimos un campo al embed con los datos de la fisura
            embed.addFields(
              { name: `${missionType}`, value: `Nodo: ${node}\nTiempo restante: ${eta}` }
            )
          }
          // añadimos el embed al array de embeds
          embeds.push(embed)
        }
        // enviamos todos los embeds juntos
        msg.reply({embeds: embeds})
      }catch(e){
        console.error(e);
        return "Error en las fisuras"
      }
    } 
}
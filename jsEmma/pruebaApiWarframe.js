module.exports.warframe = async function (petition, item, msg) {
  const priceCheckWarframe = require("./warframe/priceCheck.js");
  const relicCheckWarframe = require("./warframe/relicCheck.js");
  if (petition === "price") {
    await priceCheckWarframe.checkPrice(item, msg);
  } else if (petition === "relic" || petition === "relich") {
    await relicCheckWarframe.relicCheck(petition, msg);
  }
};

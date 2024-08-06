const axios = require('axios');

const models = ["jasrel1", "giyu", "gojo", "akhiro"];

module.exports = {
  config: {
    name: "cai",
    aliases: ["characterAI", "char.ai"],
    author: "AkhiroDEV",
    shortDescription: "Interact with available characters by choosing a model and putting your query",
  },
  async onStart({ message, args }) {
    if (args.length < 2) {
      return message.reply(`Please choose a model (${models.join(', ')}) and put your query.`);
    }

    const chosenModel = args[0];
    const query = args.slice(1).join(" ");

    if (!models.includes(chosenModel)) {
      return message.reply(`Invalid model. Please choose from the following: ${models.join(', ')}`);
    }

    try {
      const response = await axios.get(`https://akhiroai.onrender.com/api?model=${encodeURIComponent(chosenModel)}&q=${encodeURIComponent(query)}`);
      message.reply(response.data.message);
    } catch (error) {
      console.error(error);
      message.reply(`ERROR: ${error.message}`);
    }
  }
}
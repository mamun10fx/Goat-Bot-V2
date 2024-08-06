const axios = require("axios");

module.exports = {
  config: {
    name: "paste",
    author: "AkhiroDEV",
    shortDescription: "Get the code through the pastebin",
    category: "Useless",
    countdown: 5,
  },
  async onStart({ message, args }) {
    const apiURL = args.join(" ");
    if (!apiURL) {
      return message.reply("Please put the pastebin raw link to get the code");
    }
    try {
      const { data } = await axios.get(`${apiURL}`);
      message.reply("```\n" + data + "\n```");
    } catch (error) {
      console.log(error);
      message.reply(`ERROR: ${error.message}`);
    }
  }
};
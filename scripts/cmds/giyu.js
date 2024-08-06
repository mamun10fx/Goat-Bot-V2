const axios = require('axios');
const { GoatWrapper } = require('fca-liane-utils');

module.exports = {
    config: {
    name: "giyu",
    aliases: ["gab"],
    author: "AkhiroDEV",
    shortDescription: "Interact with Giyu, a character from Demon Slayer",
  },
   async onStart({ message, args }){
    const query = args.join(" ");
    if (!query) {
     return message.reply("What do you want? ");
    }
    try {
    const AkhiroAIs = await axios.get(`https://akhiroai.onrender.com/api?model=giyu&q=${encodeURIComponent(query)}`);
    const response = AkhiroAIs.data.message;
    message.reply(response);
    } catch (error) {
    console.log(error);
    await message.send(`ERROR: ${error.message}`)
    }
  }
}

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
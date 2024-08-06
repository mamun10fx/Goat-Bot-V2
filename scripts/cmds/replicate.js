const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "replicate",
    aliases: [],
    author: "Vex-Kshitiz",
    version: "1.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "image gen.",
    longDescription: "gen image based on prompt.",
    category: "fun",
    guide: "{p}replicate <prompt>",
  },
  onStart: async function ({ message, args, api, event }) {
    api.setMessageReaction("✨", event.messageID, (err) => {}, true);
    try {
      const prompt = args.join(" ");
      const replicateApiUrl = `https://imagegeneration-kshitiz-odpj.onrender.com/replicate?prompt=${encodeURIComponent(prompt)}`;

      const response = await axios.get(replicateApiUrl);

      
      const imageUrl = response.data.url[0][0];

      const cacheFolderPath = path.join(__dirname, "/cache");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }

      const imagePath = path.join(cacheFolderPath, `image.png`);
      const imageStream = fs.createWriteStream(imagePath);

      const imageResponse = await axios.get(imageUrl, {
        responseType: "stream"
      });

      imageResponse.data.pipe(imageStream);

      imageStream.on("finish", () => {
        message.reply({
          body: "",
          attachment: fs.createReadStream(imagePath)
        });
      });
    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ | An error occurred.");
    }
  }
};

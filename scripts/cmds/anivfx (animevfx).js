const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "anivfx",
    aliases: ["animevfx", "vfxanime"],
    author: "Vex_Kshitiz",
    version: "1.0",
    cooldowns: 10,
    role: 0,
    shortDescription: "",
    longDescription: "get random vfx animations videos of animes",
    category: "anime",
    guide: "{p}anivfx",
  },

  onStart: async function ({ api, event, args, message }) {
    api.setMessageReaction("😈", event.messageID, (err) => {}, true);

    try {
      const response = await axios.get(`https://vfx-animation-fawg.onrender.com/kshitiz`, { responseType: "stream" });

      const tempVideoPath = path.join(__dirname, "cache", `vfx.mp4`);

      const writer = fs.createWriteStream(tempVideoPath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        const stream = fs.createReadStream(tempVideoPath);

        message.reply({
          body: ``,
          attachment: stream,
        });

        api.setMessageReaction("🥶", event.messageID, (err) => {}, true);
      });
    } catch (error) {
      console.error(error);
      message.reply("Sorry, an error occurred.");
    }
  }
};

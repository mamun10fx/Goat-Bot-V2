const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "fortnite",
    aliases: [],
    author: "Vex_Kshitiz",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "",
    longDescription: "Get information about a Fortnite character.",
    category: "fun",
    guide: "{p}fortnite {name}",
  },

  onStart: async function ({ api, event, args, message }) {
    async function checkAuthor(authorName) {
      try {
        const response = await axios.get('https://author-check.vercel.app/name');
        const apiAuthor = response.data.name;
        return apiAuthor === authorName;
      } catch (error) {
        console.error("Error checking author:", error);
        return false;
      }
    }

    const isAuthorValid = await checkAuthor(module.exports.config.author);
    if (!isAuthorValid) {
      await message.reply("Author changer alert! This command belongs to Vex_Kshitiz.");
      return;
    }

    const characterName = args.join(" ");
    if (!characterName) {
      message.reply("Please provide a character name.");
      return;
    }

    const fortniteApiUrl = `https://fortnite-info-iota.vercel.app/kshitiz?character=${encodeURIComponent(characterName)}`;

    try {
      const response = await axios.get(fortniteApiUrl);
      const { title, image, info } = response.data;

      const infoText = Object.entries(info)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");

      const messageBody = `Name: ${title}\n\n${infoText}`;

      const tempImagePath = path.join(__dirname, "cache", `${Date.now()}_${title}.jpg`);

      await new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(tempImagePath);
        writer.on("finish", resolve);
        writer.on("error", reject);
        axios.get(image, { responseType: "stream" }).then(imageResponse => {
          imageResponse.data.pipe(writer);
        }).catch(reject);
      });

      const stream = fs.createReadStream(tempImagePath);
      message.reply({
        body: messageBody,
        attachment: stream,
      }, (err) => {
        if (err) console.error(err);
        fs.unlink(tempImagePath, (err) => {
          if (err) console.error(`Error deleting temp file: ${err}`);
        });
      });

    } catch (error) {
      console.error(error);
      message.reply("Sorry, an error occurred while processing your request.");
    }
  }
};

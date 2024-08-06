const fs = require("fs");
const path = require("path");
const axios = require("axios");
const tinyurl = require('tinyurl');

module.exports = {
  config: {
    name: "4k",
    aliases: [],
    version: "1.0",
    author: "Vex_kshitiz",
    countDown: 20,
    role: 2,
    shortDescription: "upscale image to 4k",
    longDescription: "upscale image to 4k",
    category: "image",
    guide: {
      en: "{p}4k (reply to an image)",
    }
  },

  onStart: async function ({ message, event, api }) {
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);
    const { type: a, messageReply: b } = event;
    const { attachments: c, threadID: d, messageID: e } = b || {};

    if (a === "message_reply" && c) {
      const [f] = c;
      const { url: g, type: h } = f || {};

      if (!f || !["photo", "sticker"].includes(h)) {
        return message.reply("❌ | reply to image by cmdName");
      }

      try {
        const response = await axios.get("http://server.gamehosting.vn:25755/taoanhdep/lamnetanh?url=" + encodeURIComponent(g));
        const imageUrl = response.data.data;

        const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

        const savePath = path.join(__dirname, "cache");
        if (!fs.existsSync(savePath)) {
          fs.mkdirSync(savePath, { recursive: true });
        }

        const imagePath = path.join(savePath, "lado.png");
        fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));

        message.reply({ attachment: fs.createReadStream(imagePath) });
      } catch (error) {
        console.error(error);
        message.reply("❌ | api error");
      }
    } else {
      message.reply("❌ | erro");
    }
  }
};

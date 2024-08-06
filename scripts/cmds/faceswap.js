const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');

module.exports = {
  config: {
    name: "faceswap",
    aliases: ["fs"],
    version: "1.0",
    author: "Vex_Kshitiz",
    shortDescription: "swap faces.",
    longDescription: "swap faces",
    category: "image",
    guide: {
      en: "{p}faceswap\n\nReply to two photos to swap faces between them."
    }
  },
  onStart: async function ({ message, event, api }) {
    try {
      if (event.type !== "message_reply") {
        return message.reply("Please reply to the two photos you want to swap faces between.");
      }

      const attachments = event.messageReply.attachments;

      if (attachments.length !== 2 || !attachments.every(att => att.type === "photo")) {
        return message.reply("Please reply to exactly two photos.");
      }

      const [photo1, photo2] = attachments.map(att => att.url);

      const apiUrl = `https://face-swap-wheat.vercel.app/swap?url1=${encodeURIComponent(photo1)}&url2=${encodeURIComponent(photo2)}`;
      const response = await axios.get(apiUrl);
      const { imageUrl } = response.data;

      
      const resultImageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const cacheFolderPath = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }

      const imagePath = path.join(cacheFolderPath, 'faceswap.png');
      const out = createWriteStream(imagePath);
      out.write(resultImageResponse.data);
      out.end();

      out.on('finish', () => {
        message.reply({
          body: "",
          attachment: fs.createReadStream(imagePath)
        });
      });
    } catch (error) {
      message.reply(`An error occurred: ${error.message}`);
    }
  }
};

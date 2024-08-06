const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');

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

module.exports = {
  config: {
    name: "imagine",
    aliases: ["imagine"],
    version: "1.0",
    author: "Vex_Kshitiz",
    countDown: 50,
    role: 0,
    longDescription: {
      vi: '',
      en: "Imagine"
    },
    category: "ai",
    guide: {
      vi: '',
      en: "{pn} <prompt> - <ratio>"
    }
  },

  onStart: async function ({ api, commandName, event, args }) {
    try {
      api.setMessageReaction("✅", event.messageID, () => {}, true);

      const isAuthorValid = await checkAuthor(module.exports.config.author);
      if (!isAuthorValid) {
        api.sendMessage({ body: "Author changer alert! This cmd belongs to Vex_Kshitiz." }, event.threadID, event.messageID);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return;
      }

      let prompt = args.join(' ');
      let ratio = '1:1';

      if (args.length > 0 && args.includes('-')) {
        const parts = args.join(' ').split('-').map(part => part.trim());
        if (parts.length === 2) {
          prompt = parts[0];
          ratio = parts[1];
        }
      }

      const response = await axios.get(`https://imagine-kshitiz-2u15.onrender.com/kshitiz?prompt=${encodeURIComponent(prompt)}&ratio=${encodeURIComponent(ratio)}`);
      const imageUrls = response.data.imageUrls;

      const imgData = [];
      const numberOfImages = 4;

      for (let i = 0; i < Math.min(numberOfImages, imageUrls.length); i++) {
        const imageUrl = imageUrls[i];
        const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage({ body: '', attachment: imgData }, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error:", error);
      api.sendMessage("error contact kshitiz", event.threadID, event.messageID);
    }
  }
};

const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

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
    name: "botstats",
    aliases: [],
    version: "1.0",
    author: "Vex_Kshitiz",
    shortDescription: "Get bot stats",
    longDescription: "Get a bot stats",
    category: "utility",
    guide: {
      en: "{p}botstats"
    }
  },
  onStart: async function ({ message, event, args, api }) {

    
    // here add your bot uptime url of render or any other  platform👇
    
    const url = 'https://example.onrender.com';//remove the slash / ok from your url if it has at last.

    try {
      const isAuthorValid = await checkAuthor(module.exports.config.author);
      if (!isAuthorValid) {
        await message.reply("Author changer alert! this cmd belongs to Vex_Kshitiz.");
        return;
      }

      const response = await axios.get(`https://screen-shot-pi.vercel.app/ss?url=${url}/stats`, { responseType: 'arraybuffer' });
      const imageData = response.data;

      const cacheFolderPath = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }
      const imagePath = path.join(cacheFolderPath, 'botstats.jpg');
      fs.writeFileSync(imagePath, imageData);

      const crop = {
        top: 55,
        bottom: 60,
        left: 0,
        right: 100
      };

      const image = await loadImage(imagePath);

      const canvas = createCanvas(image.width - crop.left - crop.right, image.height - crop.top - crop.bottom);
      const ctx = canvas.getContext('2d');

      ctx.drawImage(image, crop.left, crop.top, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

      const croppedImagePath = path.join(cacheFolderPath, 'botstats.jpg');
      const out = fs.createWriteStream(croppedImagePath);
      const stream = canvas.createJPEGStream();
      stream.pipe(out);

      out.on('finish', () => {
        message.reply({
          body: "",
          attachment: fs.createReadStream(croppedImagePath)
        });
      });
    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ | An error occurred. please check your url is correct or not");
    }
  }
};

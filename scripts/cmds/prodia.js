const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "prodia",
    aliases: [],
    version: "1.0",
    author: "vex_Kshitiz",
    countDown: 5,
    role: 0,
    shortDescription: "prodia",
    longDescription: "Generate images using Prodia",
    category: "utility",
    guide: {
      en: "{p} prodia [prompt] | [model_id]"
    }
  },
  onStart: async function ({ message, event, args, api }) {
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);
    try {
      const baseUrl = "https://prodia-kshitiz-rxop.onrender.com/gen";

      const apiKey = "add yor api key here"; 

// add apiKey from prodia web 
     

 let prompt = '';
      let model_id = null;

      if (args.length > 0) {
        const argParts = args.join(" ").split("|");
        prompt = argParts[0].trim();
        if (argParts.length > 1) {
          model_id = argParts[1].trim();
        }
      } 

      if (!prompt || !model_id) {
        return message.reply("provide both a prompt and a model. ex:- prodia cat | 56 "); // the last model is 56 ok 
        
      }

      const apiResponse = await axios.get(baseUrl, {
        params: {
          prompt: prompt,
          model: model_id,
          key: apiKey
        }
      });

      if (apiResponse.data.transformedImageUrl) {
        const imageUrl = apiResponse.data.transformedImageUrl;
        const imagePath = path.join(__dirname, "cache", `prodia.png`);
        const imageResponse = await axios.get(imageUrl, { responseType: "stream" });
        const imageStream = imageResponse.data.pipe(fs.createWriteStream(imagePath));
        imageStream.on("finish", () => {
          const stream = fs.createReadStream(imagePath);
          message.reply({
            body: "",
            attachment: stream
          });
        });
      } else {
        throw new Error("image URL not found.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ | An error occurred.");
    }
  }
};
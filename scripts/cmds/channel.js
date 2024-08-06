const axios = require("axios");
const fs = require("fs");
const path = require("path");


const channelLinks = [ // add channel link below from which channel you want to get video
  
  "https://www.youtube.com/@Molob",
  // Add more if you want
];

module.exports = {
  config: {
    name: "channel",// name your cmd
    aliases: ["ch"], // add aliases if needed
    author: "Vex_Kshitiz",// dont change this saar
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "Get a random channel video",
    longDescription: "Get a random youtube channel video.",
    category: "utility",
    guide: "{p}channel",
  },

  onStart: async function ({ api, event, args, message }) {
    api.setMessageReaction("✨", event.messageID, (err) => {}, true);

    try {
    
      const randomChannelLink = channelLinks[Math.floor(Math.random() * channelLinks.length)];

      
      const apiResponse = await axios.get(`https://god-kshitiz.vercel.app/channel?link=${encodeURIComponent(randomChannelLink)}`);

    
      const channelVideoUrl = apiResponse.data.urls[0];

      
      const videoResponse = await axios.get(channelVideoUrl, { responseType: "stream" });

     
      const tempVideoPath = path.join(__dirname, "cache", `channel.mp4`);

      const writer = fs.createWriteStream(tempVideoPath);
      videoResponse.data.pipe(writer);

      writer.on("finish", async () => {
       
        const stream = fs.createReadStream(tempVideoPath);

       
        message.reply({
          body: "",
          attachment: stream,
        });

        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      });
    } catch (error) {
      console.error(error);
      message.reply("Sorry, an error occurred.");
    }
  }
};

const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "uptime",
    version: "1.0",
    aliases: ["upt", "up"],
    author: "kaizenji",
    role: 0,
    cooldown: 5,
    shortDescription: {
      vi: "",
      en: "Sends information about the bot and admin."
    },
    longDescription: {
      vi: "",
      en: "Sends information about the bot and admin."
    },
    category: "system",
    guide: {
      en: "{pn}"
    },
    envConfig: {}
  },

  onStart: async function ({ message, prefix }) {
    
    const now = moment();
    const date = now.format('MMMM Do YYYY');
    
    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

    const additionalText = "";

    // Combine the bot information and additional text in a single message
message.reply(`===[𝗕𝗢𝗧 𝗨𝗣𝗧𝗜𝗠𝗘]===\n\n𝗗𝗮𝘁𝗲: ${date}\n\n𝗨𝗽𝘁𝗶𝗺𝗲: ${uptimeString}
      
      ${additionalText}
    `);
  },

  onChat: async function ({ event, message, getLang, prefix }) {
    if (event.body && event.body.toLowerCase() === "up") {
      this.onStart({ message, prefix });
    }
  }
};
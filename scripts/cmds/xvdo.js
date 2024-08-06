const axios = require("axios");
const { getStreamFromURL, shortenURL, randomString } = global.utils;

module.exports = {
  config: {
    name: "xvdo",
    author: "Vex_Kshitiz",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "Search for corny videos",
    longDescription: "Search for corny videos.",
    category: "18+",
    guide: "{p}xvdo <search_query>",
  },

  onStart: async function ({ api, event, args }) {
    const searchQuery = args.join(" ");
      if (!searchQuery) {
        api.sendMessage({ body: "Please provide a search query." }, event.threadID, event.messageID);
        return;
      }

      try {
        const response = await axios.get(`https://x-vdo.vercel.app/kshitiz?search=${encodeURIComponent(searchQuery)}`);
        const videos = response.data;

        if (!videos || videos.length === 0) {
          api.sendMessage({ body: "No videos found." }, event.threadID, event.messageID);
          return;
        }

        let message = "Here are the top 5videos:\n";
        for (const video of videos) {
          const { description, iframe } = video;
          const shortenedURL = await shortenURL(iframe);

          message += `\nTitle: ${description}\nPlayableUrl: ${shortenedURL}\n`;
        }

        api.sendMessage({ body: message }, event.threadID, event.messageID);
      } catch (error) {
        console.error(error);
        api.sendMessage({ body: "An error occurred." }, event.threadID, event.messageID);
      }
    },
    };
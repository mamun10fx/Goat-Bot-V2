const axios = require("axios");

async function fetchOtakuNews() {
  try {
    const response = await axios.get("https://otaku-news.onrender.com/kshitiz");
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch otaku news");
  }
}

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
    name: "otakunews",
    aliases: ["aninews"],
    author: "Vex_Kshitiz",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "Get the latest otaku news",
    longDescription: "Fetches the latest news about anime, manga, and related topics",
    category: "anime",
    guide: "{p}otakunews",
  },

  onStart: async function ({ api, event }) {
    api.setMessageReaction("🕐", event.messageID, () => {}, true);

    const isAuthorValid = await checkAuthor(module.exports.config.author);
    if (!isAuthorValid) {
      api.sendMessage({ body: "Author changer alert! This cmd belongs to Vex_Kshitiz." }, event.threadID, event.messageID);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return;
    }

    try {
      const newsList = await fetchOtakuNews();

      if (!Array.isArray(newsList) || newsList.length === 0) {
        api.sendMessage({ body: "No news found." }, event.threadID, event.messageID);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return;
      }

      const top20News = newsList.slice(0, 20);
      const newsTitles = top20News.map((news, index) => `${index + 1}. ${news.title}`).join("\n");
      const message = `Top 20 Otaku News:\n\n${newsTitles}`;

      api.sendMessage({ body: message }, event.threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "otakunews",
          messageID: info.messageID,
          author: event.senderID,
          newsList: top20News,
        });
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: "An error occurred. Please try again later." }, event.threadID, event.messageID);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  },

  onReply: async function ({ api, event, Reply, args }) {
    const { author, newsList } = Reply;

    if (event.senderID !== author || !newsList) {
      return;
    }

    const newsIndex = parseInt(args[0], 10);

    if (isNaN(newsIndex) || newsIndex <= 0 || newsIndex > newsList.length) {
      api.sendMessage({ body: "Invalid input. Please provide a valid number." }, event.threadID, event.messageID);
      return;
    }

    const selectedNews = newsList[newsIndex - 1];
    const newsDescription = selectedNews.description;

    api.sendMessage({ body: newsDescription }, event.threadID, event.messageID);

    global.GoatBot.onReply.delete(event.messageID);
  },
};

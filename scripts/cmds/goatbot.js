const axios = require('axios');

module.exports = {
  config: {
    name: 'goatbot',
    version: '1.0',
    author: 'Liane Cagara',
    role: 0,
    category: 'Ai-Chat',
    shortDescription: {
      en: `A bot that generates Goatbot Command module. Note: Not supported all of goatbot features, can make mistakes.`
    },
    longDescription: {
      en: `A bot that generates Goatbot Command module. Note: Not supported all of goatbot features, can make mistakes.`
    },
    guide: {
      en: '{pn}goatbot [query]'
    },
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      const query = args.join(" ") || "hello";
      const { name } = (await usersData.get(event.senderID));

      if (query) {
        api.setMessageReaction("⏳", event.messageID, (err) => console.log(err), true);
        const processingMessage = await api.sendMessage(
          `Asking Goatbot Generator. Please wait a moment...`,
          event.threadID
        );

        const apiUrl = `https://liaspark.chatbotcommunity.ltd/@CodingAI_Liane/api/goatbot?key=j86bwkwo-8hako-12C&userName=${encodeURIComponent(name || "a user")}&query=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.message) {
          const trimmedMessage = response.data.message.trim();
          api.setMessageReaction("✅", event.messageID, (err) => console.log(err), true);
          await api.sendMessage({ body: trimmedMessage }, event.threadID, event.messageID);

          console.log(`Sent Goatbot Generator's response to the user`);
        } else {
          throw new Error(`Invalid or missing response from Goatbot Generator API`);
        }

        await api.unsendMessage(processingMessage.messageID);
      }
    } catch (error) {
      console.error(`❌ | Failed to get Goatbot Generator's response: ${error.message}`);
      const errorMessage = `❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that's causing the problem, and it might resolve on retrying.`;
      api.sendMessage(errorMessage, event.threadID);
    }
  },
};
const axios = require("axios");

module.exports = {
  config: {
    name: "gaymini",
    aliases: [],
    author: "Vex_Kshitiz",
    version: "1.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "gaymini can explain video.",
    longDescription: "gaymini can explain video.",
    category: "ai",
    guide: "{p}gaymini <prompt>",
  },
  onStart: async function ({ message, args, api, event }) {
    api.setMessageReaction("✨", event.messageID, (err) => {}, true);
    try {
      if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
        return message.reply("Please reply to a video.");
      }

      const prompt = args.join(" ");
      const repliedVideoUrl = event.messageReply.attachments[0].url;
      const firstApiUrl = `https://vex-kshitiz-r642.onrender.com/kshitiz?video=${encodeURIComponent(repliedVideoUrl)}`;
      const response1 = await axios.get(firstApiUrl);
      if (!response1.data || !response1.data.videoUrl) {
        throw new Error("Failed to retrieve processed video URL from first API.");
      }
      const processedVideoUrl = response1.data.videoUrl;
      const secondApiUrl = `https://gemini-video.onrender.com/kshitiz?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(processedVideoUrl)}`;
      const response2 = await axios.get(secondApiUrl);
      if (!response2.data || !response2.data.answer) {
        throw new Error("Failed to retrieve answer text from second API.");
      }
      const answerText = response2.data.answer;

      message.reply(answerText);
    } catch (error) {
      console.error("Error:", error);
      message.reply("An error occurred while processing the video. Please try again.");
    }
  }
};

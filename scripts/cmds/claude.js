const axios = require('axios');

async function claude(api, event, args, message) {
  try {
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return message.reply("Please provide a prompt.");
    }

    const response = await getClaudeResponse(prompt);

    if (response && response.answer) {
      message.reply(response.answer, (r, s) => {
        global.GoatBot.onReply.set(s.messageID, {
          commandName: module.exports.config.name,
          uid: event.senderID 
        });
      });
    } else {
      message.reply("No response from Claude.");
    }
  } catch (error) {
    console.error("Error:", error);
    message.reply("An error occurred while processing your request.");
  }
}

async function getClaudeResponse(prompt) {
  try {
    const url = `https://claude-ai.vercel.app/kshitiz?prompt=${encodeURIComponent(prompt)}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error from Claude API:", error.message);
    throw error;
  }
}

module.exports = {
  config: {
    name: "claude",
    version: "1.0",
    author: "Vex_Kshitiz",
    role: 0,
    longDescription: "Anthropic's AI assistant Claude.",
    category: "ai",
    guide: {
      en: "{p}claude [prompt]"
    }
  },

  handleCommand: claude,
  onStart: function ({ api, message, event, args }) {
    return claude(api, event, args, message);
  },
  onReply: function ({ api, message, event, args }) {
    return claude(api, event, args, message);
  }
};

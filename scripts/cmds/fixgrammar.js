const axios = require("axios");

const moduleConfig = {
  name: "fixgrammar", 
  aliases: ["fg"],
  author: "Vex_Kshitiz",
  version: "1.0",
  cooldowns: 5,
  role: 0,
  shortDescription: "bencho eng nahi aati no prblm",
  longDescription: "grammar fix karo fir biswas karo",
  category: "utility",
  guide: "{p}fixgrammar {prompt} or reply to a message with {p}fixgrammar",
};

module.exports = {
  config: moduleConfig,

  onStart: async function ({ api, event, message, args }) {
    const isAuthorValid = await checkAuthor(module.exports.config.author);
    if (!isAuthorValid) {
      await message.reply("Author changer alert! this cmd belongs to Vex_Kshitiz.");
      return;
    }

    let prompt;

    if (event.messageReply) {
      prompt = event.messageReply.body;
    } else {
      prompt = args.join(" ");
    }

    if (!prompt) {
      await message.reply("Please provide a text to fix the grammar.");
      return;
    }

    try {
      const response = await axios.get(`https://personal-ai-phi.vercel.app/kshitiz?prompt=${encodeURIComponent(prompt)}&content=correct%20the%20grammar%20of%20user%20query`);
      const correctedText = response.data.answer;
      await message.reply(correctedText);
    } catch (error) {
      console.error("Error fixing grammar:", error);
      message.reply("There was an error fixing the grammar. Please try again later.");
    }
  }
};

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

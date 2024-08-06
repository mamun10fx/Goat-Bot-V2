module.exports = {
  config: {
    name: 'ai',
    version: '2.7',
    role: 0,
    category: 'AI',
    author: 'UPoL 🌸',
    shortDescription: 'Chat with Chat GPT.',
    longDescription: 'Chat with GPT to anwer the questions.',
  },
  
  onStart: async function ({ message, event, args, api, threadID, messageID }) {

      const upol = args.join(" ");
      if (!upol) {
        return message.reply("Text something baka. 👀");
      };
  
    const encodedPrompt = encodeURIComponent(args.join(" "));
  
    const response = await axios.get(`https://sandipbaruwal.onrender.com/gemini?prompt=${encodedPrompt}`);
   
    await message.reply('⏳ thinking.....!');

 const UPoL = response.data.answer; message.reply(UPoL);
  
  }
};

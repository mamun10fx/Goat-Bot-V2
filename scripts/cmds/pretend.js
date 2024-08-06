const fs = require('fs').promises;
const axios = require('axios');

async function handlePretend(api, event, args, message) {
  try {
    const [prompt, name] = parseArgs(args);

    if (!prompt || !name) {
      return message.reply("use cmd like this:- pretend {prompt} - {name}");
    }

    const userUid = event.senderID;
    await saveCharacterName(userUid, name);

    const response = await fetchPretendResponse(prompt, name);

    if (response && response.ans) {
      message.reply(response.ans, (replyMessage, sentMessage) => {
        global.GoatBot.onReply.set(sentMessage.messageID, {
          commandName: module.exports.config.name,
          userUid: userUid
        });
      });
    } else {
      message.reply("Failed to get response.");
    }
  } catch (error) {
    console.error("Error:", error);
    message.reply("An error occurred.");
  }
}

async function handlePretendReply(api, event, args, message) {
  try {
    const userUid = event.senderID;
    const characterName = await getCharacterName(userUid);

    if (!characterName) {
      return message.reply("get lost🥱.");
    }

    const prompt = args.join(" ");
    const response = await fetchPretendResponse(prompt, characterName);

    if (response && response.ans) {
      message.reply(response.ans, (replyMessage, sentMessage) => {
        global.GoatBot.onReply.set(sentMessage.messageID, {
          commandName: module.exports.config.name,
          userUid: userUid
        });
      });
    } else {
      message.reply("Failed to get response.");
    }
  } catch (error) {
    console.error("Error:", error);
    message.reply("An error occurred.");
  }
}

async function saveCharacterName(userUid, name) {
  try {
    const data = JSON.stringify({ [userUid]: name });
    await fs.writeFile('pretend.json', data, 'utf8');
  } catch (error) {
    console.error("Error saving character name:", error);
    throw error;
  }
}

async function getCharacterName(userUid) {
  try {
    const rawData = await fs.readFile('pretend.json', 'utf8');
    const data = JSON.parse(rawData);
    return data[userUid];
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null; 
    }
    console.error("Error getting character name:", error);
    throw error;
  }
}

async function fetchPretendResponse(prompt, name) {
  try {
    const apiUrl = `https://cai-kshitiz.vercel.app/pretend?prompt=${encodeURIComponent(prompt)}&name=${encodeURIComponent(name)}`;
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Error from API:", error.message);
    throw error;
  }
}

function parseArgs(args) {
  const joinedArgs = args.join(" ");
  const [prompt, name] = joinedArgs.split(/[-—]/).map(arg => arg.trim());
  return [prompt, name];
}

module.exports = {
  config: {
    name: "pretend",
    version: "1.0",
    author: "Vex_Kshitiz",
    role: 0,
    longDescription: "character ai.",
    category: "ai",
    guide: {
      en: "{p}pretend [prompt] - [name]"
    }
  },

  handleCommand: handlePretend,
  onStart: function ({ api, message, event, args }) {
    return handlePretend(api, event, args, message);
  },
  onReply: function ({ api, message, event, args }) {
    return handlePretendReply(api, event, args, message);
  }
};

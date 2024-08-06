const fs = require("fs-extra");

const spamStatesFile = "spam.json";
let spamStates = loadSpamStates();

let messageCounts = {};
const spamThreshold = 10;
const spamInterval = 60000;

function loadSpamStates() {
  try {
    const data = fs.readFileSync(spamStatesFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

function saveSpamStates(states) {
  fs.writeFileSync(spamStatesFile, JSON.stringify(states, null, 2));
}

module.exports = {
  config: {
    name: "spamkick",
    version: "1.0",
    author: "Vex_kshitiz",
    countDown: 5,
    role: 0,
    shortDescription: "",
    longDescription: "kick the spammers",
    category: "box",
    guide: "{pn}",
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;

    if (!spamStates[threadID]) {
      spamStates[threadID] = 'off';
      saveSpamStates(spamStates);
    }

    if (event.body.toLowerCase().includes('spamkick off')) {
      spamStates[threadID] = 'off';
      saveSpamStates(spamStates);
      api.sendMessage("SpamKick is now turned off for this chat.", threadID, event.messageID);
    } else if (event.body.toLowerCase().includes('spamkick on')) {
      spamStates[threadID] = 'on';
      saveSpamStates(spamStates);
      api.sendMessage("SpamKick is now turned on for this chat.", threadID, event.messageID);
    }
  },

  onChat: function ({ api, event }) {
    const { threadID, senderID } = event;

    if (spamStates[threadID] !== 'on') return; 

    if (!messageCounts[threadID]) {
      messageCounts[threadID] = {};
    }

    if (!messageCounts[threadID][senderID]) {
      messageCounts[threadID][senderID] = {
        count: 1,
        timer: setTimeout(() => {
          delete messageCounts[threadID][senderID];
        }, spamInterval),
      };
    } else {
      messageCounts[threadID][senderID].count++;
      if (messageCounts[threadID][senderID].count > spamThreshold) {
        api.removeUserFromGroup(senderID, threadID);
      }
    }
  },
};

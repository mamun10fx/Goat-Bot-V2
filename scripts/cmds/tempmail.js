const axios = require("axios");

async function generateTempMail() {
  try {
    const res = await axios.get(`https://temp-mail-eight.vercel.app/tempmail/gen`);
    return res.data.email;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to generate temporary email");
  }
}

async function fetchTempMailMessages(email) {
  try {
    const res = await axios.get(`https://temp-mail-eight.vercel.app/tempmail/message?email=${encodeURIComponent(email)}`);
    return res.data.messages;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch messages");
  }
}

module.exports = {
  config: {
    name: "tempmail",
    author: "Vex_Kshitiz",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "Generate temporary emails",
    longDescription: "Generate a temporary email address",
    category: "Utilities",
    guide: "{p}tempmail gen\n{p}tempmail {email}",
  },

  onStart: async function ({ api, event, args }) {
    const command = args[0];

    if (command === "gen") {
      try {
        const tempEmail = await generateTempMail();
        api.sendMessage({ body: `${tempEmail}` }, event.threadID, event.messageID);
      } catch (err) {
        api.sendMessage({ body: "Sorry, an error occurred while generating the temporary email." }, event.threadID, event.messageID);
      }
    } else if (command) {
      const email = command;

      try {
        const messages = await fetchTempMailMessages(email);

        if (messages && messages.length > 0) {
          const subjects = messages.map((msg) => `From: ${msg.sender}\nSubject: ${msg.subject}`).join("\n\n");
          api.sendMessage({ body: `Messages for ${email}:\n\n${subjects}` }, event.threadID, event.messageID);
        } else {
          api.sendMessage({ body: `No messages found for the email: ${email}` }, event.threadID, event.messageID);
        }
      } catch (err) {
        api.sendMessage({ body: `Error: ${err.message}` }, event.threadID, event.messageID);
      }
    } else {
      api.sendMessage({ body: "Invalid command. Please use {p}tempmail gen to generate a temporary email or {p}tempmail {email} to fetch messages." }, event.threadID, event.messageID);
    }
  },
};

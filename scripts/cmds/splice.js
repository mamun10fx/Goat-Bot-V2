const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function fetchTracks(query) {
  try {
    const response = await axios.get(`https://splice-samples.vercel.app/kshitiz?query=${encodeURIComponent(query)}`);
    return response.data.trackUrls;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch tracks");
  }
}

async function downloadTrack(trackUrl, fileName) {
  try {
    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const response = await axios.get(trackUrl, { responseType: "stream" });
    const writer = fs.createWriteStream(fileName);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(fileName));
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to download track");
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
    name: "splice",
    aliases: [],
    author: "Vex_Kshitiz",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "Get high quality royalty free samples, multiple genre music loops",
    longDescription: "Get high quality royalty free samples, multiple genre music loops",
    category: "audio",
    guide: "{p}splice {query}",
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(" ");

    const isAuthorValid = await checkAuthor(module.exports.config.author);
    if (!isAuthorValid) {
      api.sendMessage({ body: "Author changer alert! This cmd belongs to Vex_Kshitiz." }, event.threadID, event.messageID);
      return;
    }

    if (!query) {
      api.sendMessage({ body: "Please provide a query to search for tracks." }, event.threadID, event.messageID);
      return;
    }

    api.setMessageReaction("🕐", event.messageID, () => {}, true);

    try {
      const trackUrls = await fetchTracks(query);

      if (!Array.isArray(trackUrls) || trackUrls.length === 0) {
        api.sendMessage({ body: "No tracks found for the given query." }, event.threadID, event.messageID);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return;
      }

      const message = `Reply this message from 1 to ${trackUrls.length} to get the track audio.`;

      api.sendMessage({ body: message }, event.threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "splice",
          messageID: info.messageID,
          author: event.senderID,
          trackUrls,
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
    const { author, trackUrls } = Reply;

    if (event.senderID !== author || !trackUrls) {
      return;
    }

    const trackIndex = parseInt(args[0], 10);

    if (isNaN(trackIndex) || trackIndex <= 0 || trackIndex > trackUrls.length) {
      api.sendMessage({ body: "Invalid input. Please provide a valid number." }, event.threadID, event.messageID);
      return;
    }

    const selectedTrackUrl = trackUrls[trackIndex - 1];
    const trackFileName = path.join(__dirname, 'cache', `splice_track.mp3`);

    try {
      await downloadTrack(selectedTrackUrl, trackFileName);
      const trackStream = fs.createReadStream(trackFileName);

      api.sendMessage({ body: `Here is track ${trackIndex}:`, attachment: trackStream }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: "An error occurred while downloading the track." }, event.threadID, event.messageID);
    } finally {
      global.GoatBot.onReply.delete(event.messageID);
    }
  },
};

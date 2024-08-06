const axios = require("axios");

async function processVideo(api, event, searchQuery) {
    try {
        const searchResponse = await axios.get(`https://corns.vercel.app/kshitiz?q=${encodeURIComponent(searchQuery)}`);
        const videoLinks = searchResponse.data.links;

        if (!videoLinks || videoLinks.length === 0) {
            return api.sendMessage({ body: "No videos found." }, event.threadID, event.messageID);
        }

        const firstVideoLink = videoLinks[0];

        const videoResponse = await axios.get(`https://cornnn.vercel.app/kshitiz?url=${encodeURIComponent(firstVideoLink)}`);
        const xnxxURL = videoResponse.data.xnxxURL;

        if (!xnxxURL) {
            return api.sendMessage({ body: "Failed to retrieve video URL." }, event.threadID, event.messageID);
        }

        const shortenerResponse = await axios.get(`https://shortner-sepia.vercel.app/kshitiz?url=${encodeURIComponent(xnxxURL)}`);
        const shortenedURL = shortenerResponse.data.shortened;

        if (!shortenedURL) {
            return api.sendMessage({ body: "Failed to shorten the URL." }, event.threadID, event.messageID);
        }

        const message = `PlayableUrl: ${shortenedURL}`;
        api.sendMessage({ body: message }, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage({ body: "An error occurred." }, event.threadID, event.messageID);
    }
}
module.exports = {
    config: {
        name: "xtv",
        author: "Vex_Kshitiz",
        version: "1.0",
        cooldowns: 5,
        role: 0,
        shortDescription: "corns",
        longDescription: "corn videoes via url",
        category: "18+",
        guide: "{p}xtv <search_query>",
    },
    onStart: function ({ api, event, args }) {
        const searchQuery = args.join(" ");
        if (!searchQuery) {
            return api.sendMessage({ body: "Please provide a search query." }, event.threadID, event.messageID);
        }
        processVideo(api, event, searchQuery);
    }
};

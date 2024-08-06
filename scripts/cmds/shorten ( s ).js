const axios = require("axios");
const { shortenURL } = global.utils;

async function shortURL(api, event) {
    if (event.type !== "message_reply" || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        return api.sendMessage({ body: "❌ | Please reply to an attachment." }, event.threadID, event.messageID);
    }

    const attachment = event.messageReply.attachments[0];
    const originalUrl = attachment.url;
    const apiUrl = `https://shortner-sepia.vercel.app/kshitiz?url=${encodeURIComponent(originalUrl)}`;

    try {
        const response = await axios.get(apiUrl);
        const shortUrl = response.data.shortened;

        if (shortUrl) {
            api.sendMessage({ body: `${shortUrl}` }, event.threadID, event.messageID);
        } else {
            throw new Error("No short URL returned from API");
        }
    } catch (error) {
        api.sendMessage({ body: "❌ | Error occurred while shortening URL." }, event.threadID, event.messageID);
        console.error(error);
    }
}

module.exports = {
    config: {
        name: "shorten",
        aliases: ["s"],
        version: "1.0",
        author: "Vex_Kshitiz",
        countDown: 10,
        role: 0,
        shortDescription: "Shorten a URL from an attachment",
        longDescription: "Shorten a URL from an attachment using the specified shortening API",
        category: "utility",
        guide: "{p}shorten"
    },
    onStart: function ({ api, event }) {
        return shortURL(api, event);
    }
};

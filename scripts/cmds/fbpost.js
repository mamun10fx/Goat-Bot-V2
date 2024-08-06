const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ACCESS_TOKEN = 'EAAD6V7..os0gcBOZ.......remove these and add your token'; // here add your 6v7 token 

module.exports = {
  config: {
    name: "fbpost",
    aliases: [],
    author: "Vex_kshitiz",
    version: "1.0",
    shortDescription: {
      en: "Fetch Facebook posts",
    },
    longDescription: {
      en: "Fetch  Facebook posts of a user.",
    },
    category: "fun",
    guide: {
      en: "{p}{n} [userId | @mention] or reply to others",
    },
  },
  onStart: async function ({ api, event, args }) {
    const mentionedUserId = event.messageReply ? event.messageReply.senderID : null;
    const userId = args[0] || mentionedUserId;

    if (!userId) {
      api.sendMessage({ body: 'Please provide a user ID or reply to a message.' }, event.threadID);
      return;
    }

    try {
      const response = await axios.get(`https://graph.facebook.com/v20.0/${userId}/posts`, {
        params: {
          access_token: ACCESS_TOKEN,
          include_hidden: false,
          show_expired: false,
          with: ''
        }
      });
      const posts = response.data.data;

      if (!posts || posts.length === 0) {
        api.sendMessage({ body: `No Facebook posts found for the user ID: ${userId}.` }, event.threadID, event.messageID);
        return;
      }

      const postList = posts.map((post, index) => `${index + 1}. ${post.message || post.story || post.id}`).join('\n');
      const message = `Choose a post by replying with its number:\n\n${postList}`;

      const tempFilePath = path.join(__dirname, 'cache', 'fbpost_response.json');
      fs.writeFileSync(tempFilePath, JSON.stringify(posts));

      api.sendMessage({ body: message }, event.threadID, (err, info) => {
        if (err) {
          console.error(err);
          return;
        }
        global.GoatBot.onReply.set(info.messageID, {
          commandName: 'fbpost',
          messageID: info.messageID,
          author: event.senderID,
          tempFilePath,
        });
      });
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: 'Failed to retrieve posts. Please try again later.' }, event.threadID);
    }
  },
  onReply: async function ({ api, event, Reply, args }) {
    const { author, tempFilePath, messageID } = Reply;

    if (event.senderID !== author || !tempFilePath) {
      return;
    }

    const postIndex = parseInt(args[0], 10);

    if (isNaN(postIndex) || postIndex <= 0) {
      api.sendMessage({ body: 'Invalid input.\nPlease provide a valid number.' }, event.threadID, event.messageID);
      return;
    }

    try {
      const posts = JSON.parse(fs.readFileSync(tempFilePath, 'utf-8'));

      if (!posts || posts.length === 0 || postIndex > posts.length) {
        api.sendMessage({ body: 'Invalid post number.\nPlease choose a number within the range.' }, event.threadID, event.messageID);
        return;
      }

      const selectedPost = posts[postIndex - 1];
      const postUrl = `https://www.facebook.com/${selectedPost.id.split('_')[0]}/posts/${selectedPost.id.split('_')[1]}`;

      const videoData = await axios.get(`https://kshitiz-fb.vercel.app/fb?url=${postUrl}`);
      const videoUrl = videoData.data.download.find(quality => quality.quality === '720p (HD)')?.url;

      if (!videoUrl) {
        api.sendMessage({ body: 'Error: HD video not available.' }, event.threadID, event.messageID);
        return;
      }

      const videoStream = await axios.get(videoUrl, { responseType: 'stream' });
      const videoFilePath = path.join(__dirname, 'cache', 'post.mp4');

      const writer = fs.createWriteStream(videoFilePath);
      videoStream.data.pipe(writer);

      writer.on('finish', () => {
        api.sendMessage({
          body: ``,
          attachment: fs.createReadStream(videoFilePath),
        }, event.threadID, event.messageID);

        
        api.unsendMessage(messageID);
      });

      writer.on('error', (err) => {
        console.error(err);
        api.sendMessage({ body: 'An error occurred while saving the video.\nPlease try again later.' }, event.threadID, event.messageID);
      });
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: 'An error occurred while processing the video.\nPlease try again later.' }, event.threadID, event.messageID);
    } finally {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      global.GoatBot.onReply.delete(event.messageID);
    }
  },
};

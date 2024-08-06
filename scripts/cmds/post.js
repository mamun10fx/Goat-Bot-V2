const axios = require("axios");

const groupNames = {
  goatbot: "721823433302618", // Replace with your group ID
};

module.exports = {
  config: {
    name: "post",
    version: "1.0",
    role: 2,
    author: "Kshitiz",
    shortDescription: "See the posts of the goatbotUsers group",
    longDescription: "See the recent posts of the goatbot users group.",
    category: "fb",
    guide: "{p}post goatbot [search_keyword] or post [goatbot] to see 10 recent posts",
    dependencies: {
      axios: "",
    },
  },

  onStart: async function ({ api, event, args }) {
    try {
      if (!args.length || !groupNames[args[0]]) {
        return api.sendMessage(this.config.guide, event.threadID, event.messageID);
      }

      const groupName = args[0].toLowerCase();
      const searchKeyword = args.slice(1).join(" ");

      const groupId = groupNames[groupName];
      const accessToken = "EAAD6V7os0gc... put your own token";// add your 6v7 token here
      const apiVersion = "v18.0";
      let groupUrl = `https://graph.facebook.com/${apiVersion}/${groupId}/feed?access_token=${accessToken}&fields=attachments{url,type},source,from,message,created_time`;

      if (!searchKeyword) {
        groupUrl += "&limit=10";
      }

      const response = await axios.get(groupUrl);
      const posts = response.data.data || [];

      if (posts.length === 0) {
        return api.sendMessage(`No recent posts found in the group ${groupName}.`, event.threadID, event.messageID);
      } else {
        let filteredPosts = posts;

        if (searchKeyword) {
          filteredPosts = posts.filter(post => post.message && post.message.toLowerCase().includes(searchKeyword.toLowerCase()));
        }

        if (filteredPosts.length === 0) {
          return api.sendMessage(`No posts found related to ${searchKeyword}".`, event.threadID, event.messageID);
        }

        let postList = '';
        for (let i = 0; i < filteredPosts.length; i++) {
          const post = filteredPosts[i];
          const userName = post.from && post.from.name ? post.from.name : "Unknown";
          const message = post.message || "(No message)";
          postList += `${i + 1}. ${userName}: ${message}\n\n`;
        }

        api.sendMessage({ body: postList }, event.threadID, async (err, info) => {
          if (err) {
            console.error("Error sending post list:", err);
            await api.sendMessage("An error occurred while sending the posts.", event.threadID, event.messageID);
            return;
          }

          global.GoatBot.onReply.set(info.messageID, {
            commandName: "post",
            messageID: info.messageID,
            author: event.senderID,
            posts: filteredPosts,
          });
        });
      }
    } catch (error) {
      console.error("Error retrieving posts:", error);
      await api.sendMessage("An error occurred while retrieving posts.", event.threadID, event.messageID);
    }
  },

  onReply: async function ({ api, event, Reply, args }) {
    try {
      const { author, posts } = Reply;

      if (event.senderID !== author || !posts) {
        return;
      }

      const postIndex = parseInt(args[0], 10);

      if (isNaN(postIndex) || postIndex <= 0 || postIndex > posts.length) {
        await api.sendMessage({ body: "Invalid input.\nPlease provide a valid number." }, event.threadID);
        return;
      }

      const selectedPost = posts[postIndex - 1];
      const userName = selectedPost.from ? selectedPost.from.name : "Unknown";
      const message = selectedPost.message || "(No message)";

      const postInfo = `Post from ${userName}:\n${message}`;
      await api.sendMessage({ body: postInfo }, event.threadID, event.messageID);

      global.GoatBot.onReply.delete(event.messageID);
    } catch (error) {
      console.error("Error in onReply:", error);
      await api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
  },
};

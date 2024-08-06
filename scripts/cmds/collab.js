const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "collab",
    aliases: [],
    author: "Vex_Kshitiz",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "combine 4 video in one frame",
    longDescription: "combine 4 video in one frame",
    category: "video",
    guide: "{p}collab {url1} {url2} {url3} {url4}",
  },

  onStart: async function ({ api, event, args, message }) {
    if (args.length !== 4) {
      return message.reply("Please provide exactly 4 URLs.");
    }

    const [url1, url2, url3, url4] = args;

    try {
    
      const moviePayload = {
        comment: 'CollaborativeVideo',
        resolution: 'full-hd',
        scenes: [
          {
            elements: [
              { type: 'video', src: url1, x: 0, y: 0, width: 960, height: 540 },
              { type: 'video', src: url2, x: 960, y: 0, width: 960, height: 540 },
              { type: 'video', src: url3, x: 0, y: 540, width: 960, height: 540 },
              { type: 'video', src: url4, x: 960, y: 540, width: 960, height: 540 },
            ],
          },
        ],
      };

  
      const apiKey = 'e3UGrBZF4A81Eci1lb5kVa5AeiEU09Ez7xSEJYwC';
      const createResponse = await axios.post('https://api.json2video.com/v2/movies', moviePayload, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
      });

 
      if (!createResponse.data || !createResponse.data.success || !createResponse.data.project) {
        console.error('Invalid response structure:', createResponse.data);
        return message.reply('Failed to create collaborative video. Please try again later.');
      }

      const { project } = createResponse.data;

     
      const checkStatus = async () => {
        try {
          const statusResponse = await axios.get(`https://api.json2video.com/v2/movies?project=${project}`, {
            headers: {
              'x-api-key': apiKey,
            },
          });

          if (statusResponse.data.success && statusResponse.data.movie && statusResponse.data.movie.status === 'done') {
            const videoUrl = statusResponse.data.movie.url;
            const tempVideoPath = path.join(__dirname, "cache", `collab.mp4`);

            const writer = fs.createWriteStream(tempVideoPath);
            const response = await axios.get(videoUrl, { responseType: "stream" });
            response.data.pipe(writer);

            writer.on("finish", async () => {
              const stream = fs.createReadStream(tempVideoPath);

              message.reply({
                body: ``,
                attachment: stream,
              });
            });
          } else {
           
            setTimeout(checkStatus, 5000);
          }
        } catch (error) {
          console.error('Error checking job status:', error);
          message.reply("Failed to create collaborative video. Please try again later.");
        }
      };

      await checkStatus();

    } catch (error) {
      console.error('error', error);
      message.reply("make sure all video length is less than 1 minute.");
    }
  }
};

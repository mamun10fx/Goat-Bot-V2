const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const cacheFolder = path.join(__dirname, 'cache');

if (!fs.existsSync(cacheFolder)) {
  fs.mkdirSync(cacheFolder);
}

module.exports = {
  config: {
    name: "reverse",
    version: "1.0",
    author: "Vex_Kshitiz",
    shortDescription: "Reverse a video",
    longDescription: "Reverse a video.",
    category: "video",
    guide: {
      en: "!reverse"
    }
  },
  onStart: async function ({ message, event, api, args }) {
     api.setMessageReaction("😈", event.messageID, (err) => {}, true);
    try {
      if (event.type !== "message_reply") {
        return message.reply("❌ || Reply to a video to reverse it.");
      }

      const attachment = event.messageReply.attachments;
      if (!attachment || attachment.length !== 1 || attachment[0].type !== "video") {
        return message.reply("❌ || Please reply to a single video.");
      }

      const videoUrl = attachment[0].url;

      const userVideoPath = path.join(cacheFolder, `video_${Date.now()}.mp4`);
      const reversedVideoPath = path.join(cacheFolder, `reversed_${Date.now()}.mp4`);

      
      const responseVideo = await axios({
        url: videoUrl,
        method: 'GET',
        responseType: 'stream'
      });
      const writerVideo = fs.createWriteStream(userVideoPath);
      responseVideo.data.pipe(writerVideo);

      await new Promise((resolve, reject) => {
        writerVideo.on('finish', resolve);
        writerVideo.on('error', reject);
      });

   
      const ffmpegCommand = [
        '-i', userVideoPath,
        '-vf', 'reverse',
        reversedVideoPath
      ];

      exec(`${ffmpeg} ${ffmpegCommand.join(' ')}`, async (error, stdout, stderr) => {
        if (error) {
          console.error("FFmpeg error:", error);
          message.reply("❌ || An error occurred during reversing.");
          return;
        }
        console.log("FFmpeg output:", stdout);
        console.error("FFmpeg stderr:", stderr);


        message.reply({
          attachment: fs.createReadStream(reversedVideoPath)
        }).then(() => {
        
          fs.unlinkSync(userVideoPath);
          fs.unlinkSync(reversedVideoPath);
        }).catch((sendError) => {
          console.error("Error sending video:", sendError);
          message.reply("❌ || An error occurred.");
        });
      });

    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ || An error occurred.");
    }
  }
};

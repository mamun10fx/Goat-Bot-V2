const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ffmpeg = require('ffmpeg-static');

module.exports = {
  config: {
    name: "trim",
     aliases: ["cut"],
    version: "1.0",
    author: "Vex_Kshitiz",
    shortDescription: "Trim a video",
    longDescription: "Trim a video by specifying start time and end duration in seconds.",
    category: "video",
    guide: {
      en: "{p}trim start_seconds end_seconds"
    }
  },
  onStart: async function ({ message, event, args, api }) {
    try {
      if (event.type !== "message_reply") {
        return message.reply("❌ || Reply to a video to trim it.");
      }

      const attachment = event.messageReply.attachments;
      if (!attachment || attachment.length !== 1 || attachment[0].type !== "video") {
        return message.reply("❌ || Please reply to a single video.");
      }

      const videoUrl = attachment[0].url;

      const userVideoPath  = __dirname + `/cache/trim_${Date.now()}.mp4`;
      const trimmedVideoPath = __dirname + `/cache/trimmed_${Date.now()}.mp4`;

      const response = await axios({
        url: videoUrl,
        method: 'GET',
        responseType: 'stream'
      });
      const writer = fs.createWriteStream(userVideoPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const startSeconds = parseInt(args[0]) || 0;
      const endSeconds = parseInt(args[1]) || 0;
      const duration = endSeconds - startSeconds;

      const ffmpegCommand = [
        '-i', userVideoPath,
        '-ss', startSeconds.toString(),
        '-t', duration.toString(),
        '-c', 'copy',
        trimmedVideoPath
      ];
      await new Promise((resolve, reject) => {
        const childProcess = require('child_process').spawn(ffmpeg, ffmpegCommand);
        childProcess.on('close', resolve);
        childProcess.on('error', reject);
      });

      message.reply({
        attachment: fs.createReadStream(trimmedVideoPath)
      });

    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ || An error occurred.");
    }
  }
};

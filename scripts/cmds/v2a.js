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
    name: "v2a",
    version: "1.0",
    author: "Vex_Kshitiz",
    shortDescription: "Convert a video to audio",
    longDescription: "Convert a video to audio.",
    category: "audio",
    guide: {
      en: "{p}v2a"
    }
  },
  onStart: async function ({ message, event, args, api }) {
    try {
      if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length !== 1 || event.messageReply.attachments[0].type !== "video") {
        return message.reply("❌ || Reply to a video to convert to audio.");
      }

      const videoUrl = event.messageReply.attachments[0].url;

      const inputFileName = `${Date.now()}_input.mp4`;
      const outputFileName = `${Date.now()}_output.mp3`;
      const inputFilePath = path.join(cacheFolder, inputFileName);
      const outputFilePath = path.join(cacheFolder, outputFileName);

      const videoWriter = fs.createWriteStream(inputFilePath);
      const videoResponse = await axios.get(videoUrl, { responseType: 'stream' });
      videoResponse.data.pipe(videoWriter);

      await new Promise((resolve, reject) => {
        videoWriter.on('finish', resolve);
        videoWriter.on('error', reject);
      });

    
      const ffmpegCommand = [
        '-i', inputFilePath,
        '-vn', '-acodec', 'libmp3lame',
        outputFilePath
      ];


      exec(`${ffmpeg} ${ffmpegCommand.join(' ')}`, (error, stdout, stderr) => {
        if (error) {
          console.error("FFmpeg error:", error);
          message.reply("❌ || An error occurred during audio conversion.");
          return;
        }
        console.log("FFmpeg output:", stdout);
        console.error("FFmpeg stderr:", stderr);

        message.reply({
          attachment: fs.createReadStream(outputFilePath)
        });
      });
    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ || An error occurred.");
    }
  }
};

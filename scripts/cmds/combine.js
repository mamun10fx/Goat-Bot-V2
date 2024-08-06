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
    name: "combine",
    version: "1.0",
    author: "Vex_Kshitiz",
    shortDescription: "Combine multiple videos into one",
    longDescription: "Combine multiple videos into one.",
    category: "video",
    guide: {
      en: "!combine <video_url1> <video_url2> <video_url3> ..."
    }
  },
  onStart: async function ({ message, event, args, api }) {
    try {
      const videoUrls = args;

      if (videoUrls.length < 2) {
        return message.reply("❌ || Please provide at least two video URLs to combine.");
      }

      const downloadedVideoPaths = [];

      for (let i = 0; i < videoUrls.length; i++) {
        const videoUrl = videoUrls[i];
        const response = await axios({
          url: videoUrl,
          method: 'GET',
          responseType: 'stream'
        });
        const videoPath = path.join(cacheFolder, `video_${Date.now()}_${i}.mp4`);
        const writer = fs.createWriteStream(videoPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        downloadedVideoPaths.push(videoPath);
      }

      const combinedVideoPath = path.join(cacheFolder, `combined_${Date.now()}.mp4`);

      const ffmpegCommand = [
        '-i', downloadedVideoPaths[0], 
        ...downloadedVideoPaths.slice(1).map(videoPath => ['-i', videoPath]).flat(),
        '-filter_complex', `concat=n=${downloadedVideoPaths.length}:v=1:a=1[outv][outa]`,
        '-map', '[outv]', 
        '-map', '[outa]', 
        '-c:v', 'libx264', 
        '-c:a', 'aac', 
        '-strict', 'experimental', 
        combinedVideoPath 
      ];

      exec(`${ffmpeg} ${ffmpegCommand.join(' ')}`, async (error, stdout, stderr) => {
        if (error) {
          console.error("FFmpeg error:", error);
          message.reply("make sure both video frame is same");
          return;
        }
        console.log("FFmpeg output:", stdout);
        console.error("FFmpeg stderr:", stderr);

        message.reply({
          attachment: fs.createReadStream(combinedVideoPath)
        }).then(() => {
          downloadedVideoPaths.forEach(videoPath => fs.unlinkSync(videoPath));
          fs.unlinkSync(combinedVideoPath);
        }).catch((sendError) => {
          console.error("Error sending video:", sendError);
          message.reply("make sure both video frame is same");
        });
      });

    } catch (error) {
      console.error("Error:", error);
      message.reply("make sure both video frame is same");
    }
  }
};

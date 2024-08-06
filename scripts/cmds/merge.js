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
    name: "merge",
    version: "1.0",
    author: "Vex_Kshitiz",
    shortDescription: "Merge audio into a video",
    longDescription: "Merge audio into a video by providing the audio link.",
    category: "video",
    guide: {
      en: "!merge <audio_link>"
    }
  },
  onStart: async function ({ message, event, args, api }) {
    try {
      if (event.type !== "message_reply") {
        return message.reply("❌ || Reply to a video to merge audio into it.");
      }

      const attachment = event.messageReply.attachments;
      if (!attachment || attachment.length !== 1 || attachment[0].type !== "video") {
        return message.reply("❌ || Please reply to a single video.");
      }

      const videoUrl = attachment[0].url;
      const audioUrl = args[0];

      const userVideoPath = path.join(cacheFolder, `video_${Date.now()}.mp4`);
      const audioPath = path.join(cacheFolder, `audio_${Date.now()}.mp3`);
      const mergedVideoPath = path.join(cacheFolder, `merged_${Date.now()}.mp4`);

     
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

      
      const responseAudio = await axios({
        url: audioUrl,
        method: 'GET',
        responseType: 'stream'
      });
      const writerAudio = fs.createWriteStream(audioPath);
      responseAudio.data.pipe(writerAudio);

      await new Promise((resolve, reject) => {
        writerAudio.on('finish', resolve);
        writerAudio.on('error', reject);
      });

     
      const ffmpegCommand = [
        '-i', userVideoPath,
        '-i', audioPath,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-strict', 'experimental',
        '-shortest',
        '-map', '0:v:0',
        '-map', '1:a:0',
        mergedVideoPath
      ];

      exec(`${ffmpeg} ${ffmpegCommand.join(' ')}`, async (error, stdout, stderr) => {
        if (error) {
          console.error("FFmpeg error:", error);
          message.reply("❌ || An error occurred during merging.");
          return;
        }
        console.log("FFmpeg output:", stdout);
        console.error("FFmpeg stderr:", stderr);

     
        message.reply({
          attachment: fs.createReadStream(mergedVideoPath)
        }).then(() => {
       
          fs.unlinkSync(userVideoPath);
          fs.unlinkSync(audioPath);
          fs.unlinkSync(mergedVideoPath);
        }).catch((sendError) => {
          console.error("Error sending video:", sendError);
          message.reply("❌ || An error occurred while sending the merged video.");
        });
      });

    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ || An error occurred.");
    }
  }
};

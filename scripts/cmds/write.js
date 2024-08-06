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
    name: "write",
    version: "1.0",
    author: "Vex_Kshitiz",
    shortDescription: "Write text inside a video",
    longDescription: "Write text inside a video.",
    category: "video",
    guide: {
      en: "Reply to a video with `!write <text>`"
    }
  },
  onStart: async function ({ message, event, args, api }) {
    try {
      if (!event.type === "message_reply") {
        return message.reply("❌ || Reply to a video to write text inside it.");
      }

      const attachment = event.messageReply.attachments;
      if (!attachment || attachment.length !== 1 || attachment[0].type !== "video") {
        return message.reply("❌ || Please reply to a single video.");
      }

      const videoUrl = attachment[0].url;
      const text = args.join(' ');

      const inputFileName = `${Date.now()}_input.mp4`;
      const outputFileName = `${Date.now()}_output.mp4`;
      const inputFilePath = path.join(cacheFolder, inputFileName);
      const outputFilePath = path.join(cacheFolder, outputFileName);

      const writer = fs.createWriteStream(inputFilePath);
      const response = await axios.get(videoUrl, { responseType: 'stream' });
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const drawTextCommand = `${ffmpeg} -i ${inputFilePath} -vf drawtext="fontfile=/path/to/font.ttf:text='${text}':x=(w-text_w)/2:y=(h-text_h)/2:fontsize=24:fontcolor=white" -codec:a copy ${outputFilePath}`;

      exec(drawTextCommand, async (error, stdout, stderr) => {
        if (error) {
          console.error("FFmpeg error:", error);
          message.reply("❌ || An error occurred during writing text.");
          return;
        }
        console.log("FFmpeg output:", stdout);
        console.error("FFmpeg stderr:", stderr);

        message.reply({
          attachment: fs.createReadStream(outputFilePath)
        }).then(() => {
         
          fs.unlinkSync(inputFilePath);
          fs.unlinkSync(outputFilePath);
        }).catch((sendError) => {
          console.error("Error sending video:", sendError);
          message.reply("❌ || An error occurred while sending the video.");
        });
      });

    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ || An error occurred.");
    }
  }
};

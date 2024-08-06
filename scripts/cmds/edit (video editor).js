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
    name: "edit",
    version: "1.0",
    author: "Vex_Kshitiz",
    shortDescription: "edit the videosy",
    longDescription: "edit the videos.",
    category: "video",
    guide: {
      en: "{p}effect effectName value"
    }
  },
  onStart: async function ({ message, event, args, api }) {
    try {
      if (args.length < 2) {
        return message.reply("❌ || Invalid usage. Use {p}effect effectName value");
      }

      const effect = args[0].toLowerCase();
      const param = parseFloat(args[1]);

      const validEffects = ["brightness", "contrast", "saturation", "blur", "sharpen", "noise", "scale", "crop", "rotate", "flip"];
      if (!validEffects.includes(effect)) {
        return message.reply("❌ || Invalid effect. Available effects: " + validEffects.join(", "));
      }

      if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length !== 1 || event.messageReply.attachments[0].type !== "video") {
        return message.reply("❌ || Reply to a video to apply effects.");
      }

      const videoUrl = event.messageReply.attachments[0].url;

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

      let ffmpegCommand = ['-i', inputFilePath];
      switch (effect) {
        case "brightness":
          ffmpegCommand.push('-vf', `eq=brightness=${param}`);
          break;
        case "contrast":
          ffmpegCommand.push('-vf', `eq=contrast=${param}`);
          break;
        case "saturation":
          ffmpegCommand.push('-vf', `eq=saturation=${param}`);
          break;
        case "blur":
          ffmpegCommand.push('-vf', `boxblur=${param}`);
          break;
        case "sharpen":
          ffmpegCommand.push('-vf', `unsharp=5:5:${param}:5:5:5`);
          break;
        case "noise":
          ffmpegCommand.push('-vf', `hqdn3d=${param}`);
          break;
        case "scale":
          ffmpegCommand.push('-vf', `scale=${param}`);
          break;
        case "crop":
          ffmpegCommand.push('-vf', `crop=${param}`);
          break;
        case "rotate":
          ffmpegCommand.push('-vf', `rotate=${param}`);
          break;
        case "flip":
          ffmpegCommand.push('-vf', `hflip,vflip`);
          break;
        default:
          break;
      }
      ffmpegCommand.push(outputFilePath);

      exec(`${ffmpeg} ${ffmpegCommand.join(' ')}`, (error, stdout, stderr) => {
        if (error) {
          console.error("FFmpeg error:", error);
          message.reply("❌ || An error occurred during video editing.");
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

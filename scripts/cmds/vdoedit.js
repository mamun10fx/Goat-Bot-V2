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
    name: "vdoedit",
    version: "1.0",
    author: "Vex_Kshitiz",
    shortDescription: "Edit video audio with volume, pitch, and echo effects",
    longDescription: "Edit video audio with effects such as volume adjustment, pitch shift, and echo.",
    category: "video",
    guide: {
      en: "{p}vdoedit effect params"
    }
  },
  onStart: async function ({ message, event, args, api }) {
    try {
      if (args.length < 2) {
        return message.reply("❌ || Invalid usage. Use {p}vdoedit effect params");
      }

      const effect = args[0].toLowerCase();
      const param = parseFloat(args[1]);

      const validEffects = ["volume", "pitch", "echo"];
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
        case "volume":
          ffmpegCommand.push('-af', `volume=${param}`);
          break;
        case "pitch":
          ffmpegCommand.push('-af', `asetrate=44100*${param},atempo=${1/param}`);
          break;
        case "echo":
          ffmpegCommand.push('-af', `aecho=${param}:${param}:${param}:0.5`);
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

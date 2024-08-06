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
    name: "i2v",
    version: "1.0",
    author: "Vex_Kshitiz",
    shortDescription: "image to video",
    longDescription: "image to video.",
    category: "video",
    guide: {
      en: "{p}i2v audioUrl"
    }
  },
  onStart: async function ({ message, event, args, api }) {
    try {
      const attachment = event.messageReply.attachments[0];
      if (!attachment || !["photo", "sticker"].includes(attachment.type)) {
        return message.reply("❌ || Reply to an image.");
      }

      if (args.length < 1) {
        return message.reply("❌ || Invalid usage. Use {p}i2v audioUrl");
      }

      const audioUrl = args[0];

      const imageUrl = attachment.url;

      const inputFileName = `${Date.now()}_input.png`;
      const outputFileName = `${Date.now()}_output.mp4`;
      const audioFileName = `${Date.now()}_audio.mp3`;
      const inputFilePath = path.join(cacheFolder, inputFileName);
      const outputFilePath = path.join(cacheFolder, outputFileName);
      const audioFilePath = path.join(cacheFolder, audioFileName);

      const imageWriter = fs.createWriteStream(inputFilePath);
      const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
      imageResponse.data.pipe(imageWriter);

      await new Promise((resolve, reject) => {
        imageWriter.on('finish', resolve);
        imageWriter.on('error', reject);
      });

      const audioWriter = fs.createWriteStream(audioFilePath);
      const audioResponse = await axios.get(audioUrl, { responseType: 'stream' });
      audioResponse.data.pipe(audioWriter);

      await new Promise((resolve, reject) => {
        audioWriter.on('finish', resolve);
        audioWriter.on('error', reject);
      });

     
      const audioDuration = await getAudioDuration(audioFilePath);

      const ffmpegCommand = [
        '-loop', '1', '-i', inputFilePath,
        '-i', audioFilePath,
        '-c:v', 'libx264', '-tune', 'stillimage', '-c:a', 'aac', '-b:a', '192k', '-pix_fmt', 'yuv420p',
        '-t', audioDuration, 
        outputFilePath
      ];

      exec(`${ffmpeg} ${ffmpegCommand.join(' ')}`, (error, stdout, stderr) => {
        if (error) {
          console.error("FFmpeg error:", error);
          message.reply("❌ || An error occurred during video creation.");
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

async function getAudioDuration(audioFilePath) {
  return new Promise((resolve, reject) => {
    exec(`${ffmpeg} -i "${audioFilePath}" -f null -`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      const durationMatch = stderr.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
      if (durationMatch && durationMatch.length === 4) {
        const hours = parseInt(durationMatch[1]);
        const minutes = parseInt(durationMatch[2]);
        const seconds = parseFloat(durationMatch[3]);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        resolve(totalSeconds.toFixed(2));
      } else {
        reject(new Error("Failed to parse audio duration."));
      }
    });
  });
}

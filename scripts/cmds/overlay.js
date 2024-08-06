const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const { createCanvas, loadImage } = require('canvas');
const { v4: uuidv4 } = require('uuid');

const cacheFolder = path.join(__dirname, 'cache');
const templates = {
  1: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720460590331-106.mp4',
    imagePosition: { x: 434, y: 120, width: 495, height: 495, curvature: 30 }
  },
  2: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720544714048-1.mp4',
    imagePosition: { x: 35, y: 492, width: 500, height: 650, curvature: 30 }
  },
  3: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720546638190-417.mp4',
    curvedImagePosition: { x: 45, y: 370, width: 630, height: 830, curvature: 30 },
    circularImagePosition: { x: 355, y: 18, size: 350 }
  },
  4: {
      videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720550953048-168.mp4',
      imagePosition: { x: 480, y: 15, width: 450, height: 700, curvature: 25 }
  },
  5: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720552135256-431.mp4',
    imagePosition: { x: 550, y: 120, width: 380, height: 490, curvature: 30 }
  },
  6: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720605734019-176.mp4',
    imagePosition: { x: 35, y: 760, width: 290, height: 400, curvature: 10 }
  },
  7: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720606729322-430.mp4',
    imagePosition: { x: 50, y: 200, width: 350, height: 350, curvature: 40 }
  },
  8: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720607303782-196.mp4',
    imagePosition: { x: 320, y: 465, width: 350, height: 350, curvature: 40 }
  },
  9: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720609537400-282.mp4',
    imagePosition: { x: 95, y: 95, width: 520, height: 580, curvature: 10 }
  },
  10: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720610455191-118.mp4',
    imagePosition: { x: 57, y: 735, width: 610, height: 480, curvature: 10 }
  },
  11: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720611205416-924.mp4',
    imagePosition: { x: 36, y: 150, width: 500, height: 680, curvature: 10 }
  },
  12: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720612689939-910.mp4',
    imagePosition: { x: 55, y: 395, width: 620, height: 765, curvature: 10 }
  },
  13: {
      videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720614082736-314.mp4',
     curvedImagePosition: { x: 90, y: 480, width: 550, height: 700, curvature: 80 },
       circularImagePosition: { x: 355, y: 18, size: 300 }
  },
  14: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720614943351-759.mp4',
    imagePosition: { x: 79, y: 110, width: 560, height: 700, curvature: 10 }
  },
  15: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720615837449-553.mp4',
    imagePosition: { x: 100, y: 200, width: 500, height: 500, curvature: 40 }
  },
  16: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720616152042-883.mp4',
    imagePosition: { x: 85, y: 200, width: 550, height: 730, curvature: 10 }
  },
  17: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720617043224-284.mp4',
    imagePosition: { x: 0, y: 195, width: 730, height: 740, curvature: 10 }
  },
  18: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720617677923-981.mp4',
    imagePosition: { x: 200, y: 125, width: 500, height: 650, curvature: 50 }
  },
  19: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720618736417-945.mp4',
    imagePosition: { x: 0, y: 385, width: 390, height: 520, curvature: 10 }
  },
  20: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720619640056-719.mp4',
    imagePosition: { x: 43, y: 65, width: 445, height: 590, curvature: 10 }
  },
  21: {
    videoUrl: 'https://raw.githubusercontent.com/zoro-77/video-hosting/main/cache/video-1720620191172-593.mp4',
    imagePosition: { x: 180, y: 0, width: 510, height: 570, curvature: 10 }
  },
};

if (!fs.existsSync(cacheFolder)) {
  fs.mkdirSync(cacheFolder);
}

module.exports = {
  config: {
    name: "overlay",
    version: "1.0",
    author: "Vex_Kshitiz",
    shortDescription: "Overlay images onto a template video.",
    longDescription: "Overlay images onto a template video..",
    category: "video",
    guide: {
      en: "{p}overlay templateNumber"
    }
  },
  onStart: async function ({ message, event, args, api }) {
      try {
          const templateNumber = parseInt(args[0]);
          if (isNaN(templateNumber) || !(templateNumber in templates)) {
              return message.reply("❌ Invalid template number.");
          }

          const template = templates[templateNumber];

          if (templateNumber === 3 || templateNumber === 13) {
              if (!event.messageReply || event.messageReply.attachments.length !== 2 || event.messageReply.attachments[0].type !== "photo" || event.messageReply.attachments[1].type !== "photo") {
                  return message.reply("❌ Please reply to two photos.");
              }

              const repliedImage1 = event.messageReply.attachments[0].url;
              const repliedImage2 = event.messageReply.attachments[1].url;

            
              const templateVideoPath = path.join(cacheFolder, `${uuidv4()}_template.mp4`);
              await downloadFile(template.videoUrl, templateVideoPath);

             
              const repliedImagePath1 = path.join(cacheFolder, `${uuidv4()}_replied_image1.png`);
              const repliedImagePath2 = path.join(cacheFolder, `${uuidv4()}_replied_image2.png`);
              await downloadFile(repliedImage1, repliedImagePath1);
              await downloadFile(repliedImage2, repliedImagePath2);

             
              const roundedImagePath = path.join(cacheFolder, `${uuidv4()}_rounded_image.png`);
              const circularImagePath = path.join(cacheFolder, `${uuidv4()}_circular_image.png`);
              await createRoundedImage(repliedImagePath1, roundedImagePath, template.curvedImagePosition);
              await createCircularImage(repliedImagePath2, circularImagePath, template.circularImagePosition);

            
              const outputFilePath = path.join(cacheFolder, `${uuidv4()}_overlayed_video.mp4`);

             
              const videoDuration = await getVideoDuration(templateVideoPath);

           
              const overlayCommand = [
                  '-i', templateVideoPath,
                  '-i', roundedImagePath,
                  '-i', circularImagePath,
                  '-filter_complex', `"[1:v]scale=${template.curvedImagePosition.width}:${template.curvedImagePosition.height}[overlay1];[0:v][overlay1]overlay=${template.curvedImagePosition.x}:${template.curvedImagePosition.y}:enable='between(t,0,${videoDuration})'[tmp];[2:v]scale=${template.circularImagePosition.size}:${template.circularImagePosition.size}[overlay2];[tmp][overlay2]overlay=${template.circularImagePosition.x}:${template.circularImagePosition.y}:enable='between(t,0,${videoDuration})'"`,
                  '-pix_fmt', 'yuv420p',
                  outputFilePath
              ];

              exec(`${ffmpeg} ${overlayCommand.join(' ')}`, (error, stdout, stderr) => {
                  if (error) {
                      console.error("FFmpeg error:", error);
                      message.reply("❌ An error occurred during the overlay process.");
                      return;
                  }

                  console.log("FFmpeg output:", stdout);
                  console.error("FFmpeg stderr:", stderr);

                  message.reply({
                      attachment: fs.createReadStream(outputFilePath)
                  });
              });

          } else {
              if (!event.messageReply || event.messageReply.attachments.length !== 1 || event.messageReply.attachments[0].type !== "photo") {
                  return message.reply("❌ Please reply to one photo.");
              }

              const repliedImage = event.messageReply.attachments[0].url;

             
              const templateVideoPath = path.join(cacheFolder, `${uuidv4()}_template.mp4`);
              await downloadFile(template.videoUrl, templateVideoPath);

             
              const repliedImagePath = path.join(cacheFolder, `${uuidv4()}_replied_image.png`);
              await downloadFile(repliedImage, repliedImagePath);

           
              const roundedImagePath = path.join(cacheFolder, `${uuidv4()}_rounded_image.png`);
              await createRoundedImage(repliedImagePath, roundedImagePath, template.imagePosition);

              const outputFilePath = path.join(cacheFolder, `${uuidv4()}_overlayed_video.mp4`);

           
              const videoDuration = await getVideoDuration(templateVideoPath);

             
              const overlayCommand = [
                  '-i', templateVideoPath,
                  '-i', roundedImagePath,
                  '-filter_complex', `"[1:v]scale=${template.imagePosition.width}:${template.imagePosition.height}[overlay];[0:v][overlay]overlay=${template.imagePosition.x}:${template.imagePosition.y}:enable='between(t,0,${videoDuration})'"`,
                  '-pix_fmt', 'yuv420p',
                  outputFilePath
              ];

              exec(`${ffmpeg} ${overlayCommand.join(' ')}`, (error, stdout, stderr) => {
                  if (error) {
                      console.error("FFmpeg error:", error);
                      message.reply("❌ An error occurred during the overlay process.");
                      return;
                  }

                  console.log("FFmpeg output:", stdout);
                  console.error("FFmpeg stderr:", stderr);

                  message.reply({
                      attachment: fs.createReadStream(outputFilePath)
                  });
              });
          }

      } catch (error) {
          console.error("Error:", error);
          message.reply("❌ An error occurred.");
      }
  }
};

async function downloadFile(url, filePath) {
  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function getVideoDuration(videoPath) {
  const { stdout, stderr } = await execPromise(`${ffmpeg} -i ${videoPath} 2>&1 | grep Duration`);
  const durationMatches = stdout.trim().match(/Duration: (\d{2}):(\d{2}):(\d{2})/);
  if (durationMatches) {
    const hours = parseInt(durationMatches[1], 10);
    const minutes = parseInt(durationMatches[2], 10);
    const seconds = parseInt(durationMatches[3], 10);
    return hours * 3600 + minutes * 60 + seconds;
  }
  throw new Error("Failed to get video duration.");
}

async function createRoundedImage(inputPath, outputPath, position) {
  const { width, height, curvature } = position;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const image = await loadImage(inputPath);

  const x = 0;
  const y = 0;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + curvature, y);
  ctx.lineTo(x + width - curvature, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + curvature);
  ctx.lineTo(x + width, y + height - curvature);
  ctx.quadraticCurveTo(x + width, y + height, x + width - curvature, y + height);
  ctx.lineTo(x + curvature, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - curvature);
  ctx.lineTo(x, y + curvature);
  ctx.quadraticCurveTo(x, y, x + curvature, y);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(image, x, y, width, height);
  ctx.restore();

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

async function createCircularImage(inputPath, outputPath, position) {
  const { size } = position;

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const image = await loadImage(inputPath);

  const x = 0;
  const y = 0;
  const radius = size / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(radius, radius, radius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(image, x, y, size, size);
  ctx.restore();

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

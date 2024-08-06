const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const cacheDir = path.join(__dirname, 'cache');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

let originalParts = [];

module.exports = {
  config: {
    name: "puzzle",
    version: "1.0",
    author: "Vex_Kshitiz",
    role: 0,
    shortDescription: "image puzzle game",
    longDescription: "solve the puzzle by swapping pieces to match the original image",
    category: "game",
    guide: {
      en: "{p}puzzle (reply to an image)"
    }
  },

  onStart: async function ({ api, message, event, usersData }) {
    const { threadID, messageID, senderID, messageReply } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return message.reply("Please reply to an image to start the puzzle game.");
    }

    try {
      const imageUrl = messageReply.attachments[0].url;
      const image = await loadImage(imageUrl);
      const { shuffledParts } = await cropAndShuffleImage(image);
      const initialImageBuffer = await createNumberedImage(shuffledParts, image.width, image.height);

      const initialImagePath = await saveImageToCache(initialImageBuffer);
      const sentMessage = await message.reply({ attachment: fs.createReadStream(initialImagePath) });

      global.GoatBot.onReply.set(sentMessage.messageID, {
        commandName: "puzzle",
        uid: senderID,
        shuffledParts: shuffledParts
      });
    } catch (error) {
      console.error("Error in onStart:", error);
      return message.reply("An error occurred while starting the puzzle game. Please try again.");
    }
  },

  onReply: async function ({ api, message, event, args, usersData }) {
    const replyData = global.GoatBot.onReply.get(event.messageReply.messageID);

    if (!replyData || replyData.uid !== event.senderID) return;

    const { commandName, uid, shuffledParts } = replyData;
    if (commandName !== "puzzle") return;

    if (args.length !== 2 || isNaN(parseInt(args[0])) || isNaN(parseInt(args[1]))) {
      return message.reply("Please provide two valid numbers to swap.");
    }

    try {
      const part1 = parseInt(args[0]) - 1;
      const part2 = parseInt(args[1]) - 1;

      if (part1 < 0 || part1 >= shuffledParts.length || part2 < 0 || part2 >= shuffledParts.length) {
        return message.reply("Invalid part numbers. Please provide numbers between 1 and 8.");
      }

  
      [shuffledParts[part1], shuffledParts[part2]] = [shuffledParts[part2], shuffledParts[part1]];

      const swappedImageBuffer = await createNumberedImage(shuffledParts, originalParts[0].canvas.width * 4, originalParts[0].canvas.height * 2);
      const swappedImagePath = await saveImageToCache(swappedImageBuffer);

      const sentMessage = await message.reply({ attachment: fs.createReadStream(swappedImagePath) });

      if (isPuzzleSolved(shuffledParts)) {
        await usersData.set(uid, { money: (await usersData.get(uid)).money + 10000 });
        global.GoatBot.onReply.delete(event.messageReply.messageID);
        return message.reply("Congratulations! You solved the puzzle and earned 10,000 coins.");
      }

      global.GoatBot.onReply.set(sentMessage.messageID, {
        commandName: "puzzle",
        uid: uid,
        shuffledParts: shuffledParts
      });
    } catch (error) {
      console.error("Error in onReply:", error);
      return message.reply("An error occurred while processing your request. Please try again.");
    }
  }
};

async function cropAndShuffleImage(image) {
  const parts = [];
  const partWidth = image.width / 4;
  const partHeight = image.height / 2;

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 4; j++) {
      const canvas = createCanvas(partWidth, partHeight);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, j * partWidth, i * partHeight, partWidth, partHeight, 0, 0, partWidth, partHeight);
      parts.push({ canvas });
    }
  }

  originalParts = [...parts];

  return { shuffledParts: shuffle(parts) };
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

async function createNumberedImage(parts, width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const partWidth = width / 4;
  const partHeight = height / 2;

  parts.forEach((part, index) => {
    ctx.drawImage(part.canvas, (index % 4) * partWidth, Math.floor(index / 4) * partHeight, partWidth, partHeight);

    ctx.fillStyle = 'red';
    ctx.font = 'bold 30px Arial';
    ctx.fillText(index + 1, (index % 4) * partWidth + 10, Math.floor(index / 4) * partHeight + 30);
  });

  return canvas.toBuffer();
}

function isPuzzleSolved(shuffledParts) {
  for (let i = 0; i < shuffledParts.length; i++) {
    if (shuffledParts[i].canvas !== originalParts[i].canvas) {
      return false;
    }
  }
  return true;
}

async function saveImageToCache(imageBuffer) {
  const imagePath = path.join(cacheDir, `puzzle_${Date.now()}.png`);
  await fs.promises.writeFile(imagePath, imageBuffer);
  return imagePath;
}

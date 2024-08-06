const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const cacheDir = path.join(__dirname, 'cache');
const workerDataFile = path.join(__dirname, 'worker.json');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}


// here you can set your own workers images and their earning values and their names.
const workerSets = [
  {
    names: ['zoro', 'luffy', 'sanji', 'ussop', 'chopper'],
    prices: [5000, 4000, 3000, 2000, 1000],
    earnings: [5, 5, 4, 3, 2],
    maxEarnings: [10000, 4000, 3000, 2000, 1000],
    images: [
      'https://i.ibb.co/7pCN4j8/roronoa-zoro-wallpapers-hd-wallpaper-4k-i-Phone-Android-i-Pad.jpg',
      'https://i.ibb.co/3F8ZfKC/Monkey-D-Luffy.jpg',
      'https://i.ibb.co/Wf3QkfH/image.jpg',
      'https://i.ibb.co/BNypTg1/image.jpg',
      'https://i.ibb.co/Zcrg7sp/Chopper-One-Piece-Icons.jpg'
    ]
  },
  {
    names: ['aizen', 'ichigo', 'naruto', 'sasuke', 'sakura'],
    prices: [10000, 10000, 5000, 4000, 50],
    earnings: [5, 5, 4, 3, 1],
    maxEarnings: [5000, 4000, 3000, 2000, 1000],
    images: [
      'https://i.ibb.co/4NdTcWR/Aizen-sosuke-pfp-wallpaper-icon.jpg',
      'https://i.ibb.co/TByRpqX/Kurosaki-Ichigo-Bleach-TYBW-Icon-edit-by-seu-v-on-IG.jpg',
      'https://i.ibb.co/JtR0cJT/Video-Anime-guys-Anime-drawings-Anime.jpg',
      'https://i.ibb.co/82wD0TT/download-16.jpg',
      'https://i.ibb.co/DgHB3LY/image.jpg'
    ]
  }
];

let workerData = {};
if (fs.existsSync(workerDataFile)) {
  workerData = JSON.parse(fs.readFileSync(workerDataFile, 'utf8'));
}

function startEarning(usersData) {
  setInterval(() => {
    for (const userID in workerData) {
      const user = workerData[userID];
      let totalEarnings = 0;
      user.workers.forEach((worker, index) => {
        totalEarnings += workerSets[worker.set].earnings[worker.rank - 1];
        worker.earned += workerSets[worker.set].earnings[worker.rank - 1];
        if (worker.earned >= workerSets[worker.set].maxEarnings[worker.rank - 1]) {
          user.workers.splice(index, 1); 
        }
      });
      if (totalEarnings > 0) {
        usersData.get(userID).then(userData => {
          userData.money += totalEarnings;
          usersData.set(userID, userData);
        }).catch(console.error);
      }
    }
    fs.writeFileSync(workerDataFile, JSON.stringify(workerData, null, 2)); 
  }, 60000); 
}

module.exports = {
  config: {
    name: "worker",
    version: "1.0",
    author: "Vex_Kshitiz",
    role: 0,
    shortDescription: "lado lado",
    longDescription: "majdor kharido guys paisa kamana hei toh",
    category: "game",
    guide: {
      en: "{p}worker - View workers\n{p}worker buy {rankNumber} - Buy a worker\n{p}worker list - View your purchased workers and their earnings"
    }
  },

  onStart: async function ({ api, args, message, event, usersData }) {
    try {
      startEarning(usersData);

      if (args.length === 0) {
        const initialImage = await createWorkerPage(0);
        const imagePath = await saveImageToCache(initialImage);
        const sentMessage = await message.reply({ attachment: fs.createReadStream(imagePath) });

        global.GoatBot.onReply.set(sentMessage.messageID, {
          commandName: "worker",
          uid: event.senderID,
          page: 0
        });

      } else if (args[0] === 'list') {
        const senderID = event.senderID;
        const userData = workerData[senderID] || { workers: [] };
        const workerListImage = await createWorkerListImage(userData.workers);
        const imagePath = await saveImageToCache(workerListImage);
        await message.reply({ attachment: fs.createReadStream(imagePath) });

      } else {
        message.reply("Use '{p}worker' to view workers, '{p}worker buy {rankNumber}' to buy a worker, or '{p}worker list' to view your purchased workers.");
      }

    } catch (error) {
      console.error("Error in command:", error);
      message.reply("An error occurred. Please try again.");
    }
  },

  onReply: async function ({ api, message, event, args, usersData }) {
    const replyData = global.GoatBot.onReply.get(event.messageReply.messageID);

    if (!replyData || replyData.uid !== event.senderID) return;

    const { commandName, uid, page } = replyData;
    if (commandName !== "worker") return;

    if (args[0] === 'buy') {
      if (args.length !== 2 || isNaN(parseInt(args[1]))) {
        return message.reply("Please provide a valid rank number.");
      }

      const rankNumber = parseInt(args[1]);
      if (rankNumber < 1 || rankNumber > 5) {
        return message.reply("Please provide a rank number between 1 and 5.");
      }

      const workerIndex = (page * 5) + (rankNumber - 1);
      const set = Math.floor(workerIndex / 5);
      const workerSet = workerSets[set];
      const workerPrice = workerSet.prices[rankNumber - 1];
      const userData = await usersData.get(uid);

      if (workerPrice > userData.money) {
        return message.reply("You don't have enough money to buy this worker.");
      }

      const workerName = workerSet.names[rankNumber - 1];
      const newWorker = { name: workerName, rank: rankNumber, price: workerPrice, master: uid, set: set, earned: 0 };
      userData.money -= workerPrice;
      userData.workers = userData.workers || [];

     
      const alreadyOwns = userData.workers.some(w => w.name === workerName);
      if (alreadyOwns) {
        return message.reply(`You already own ${workerName}.`);
      }

      userData.workers.push(newWorker);

      if (!workerData[uid]) {
        workerData[uid] = { workers: [] };
      }
      workerData[uid].workers.push(newWorker);
      fs.writeFileSync(workerDataFile, JSON.stringify(workerData, null, 2));

      await usersData.set(uid, userData);
      return message.reply(`Congratulations! You bought ${workerName} for ${workerPrice} coins.`);

    } else if (args[0] === 'next') {
      const newPage = page + 1;
      if (newPage >= workerSets.length) {
        return message.reply("You are already on the last page.");
      }
      const newWorkerPageImage = await createWorkerPage(newPage);
      const imagePath = await saveImageToCache(newWorkerPageImage);
      const sentMessage = await message.reply({ attachment: fs.createReadStream(imagePath) });

      global.GoatBot.onReply.set(sentMessage.messageID, {
        commandName: "worker",
        uid: uid,
        page: newPage
      });

    } else if (args[0] === 'prev') {
      if (page === 0) {
        return message.reply("You are already on the first page.");
      }

      const newPage = page - 1;
      const newWorkerPageImage = await createWorkerPage(newPage);
      const imagePath = await saveImageToCache(newWorkerPageImage);
      const sentMessage = await message.reply({ attachment: fs.createReadStream(imagePath) });

      global.GoatBot.onReply.set(sentMessage.messageID, {
        commandName: "worker",
        uid: uid,
        page: newPage
      });

    } else {
      message.reply("Use 'buy {rankNumber}' to buy a worker, 'next' to view the next page, or 'prev' to view the previous page.");
    }
  }
};

async function createWorkerPage(page) {
  const canvas = createCanvas(600, 800);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const workersPerPage = 5;
  const startIndex = page * workersPerPage;
  let yOffset = 20;

  const currentSet = workerSets[page]; 

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 20px Arial';
  ctx.fillText(`Set ${page + 1}`, 20, yOffset);

  for (let j = 0; j < currentSet.names.length; j++) {
    const name = currentSet.names[j];
    const price = currentSet.prices[j];
    const earnings = currentSet.earnings[j];
    const imageURL = currentSet.images[j];
    

    const x = 20;
    const y = yOffset + 20 + j * 150;

    ctx.fillText(`${j + 1}. ${name}`, x, y + 20);
    ctx.fillText(`Price: ${price}`, x, y + 50);
    ctx.fillText(`Earnings: ${earnings}/min`, x, y + 80);

    

    const image = await loadImage(imageURL);
    ctx.drawImage(image, x + 400, y, 120, 120);
  }

  return canvas;
}

async function createWorkerListImage(workers) {
  const canvas = createCanvas(600, 800);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < workers.length; i++) {
    const worker = workers[i];
    const set = worker.set;
    const imageURL = workerSets[set].images[worker.rank - 1];

    const y = 20 + i * 150;
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`${i + 1}. ${worker.name}`, 20, y + 20);
    ctx.fillText(`Earnings: ${worker.earned}/${workerSets[set].maxEarnings[worker.rank - 1]}`, 20, y + 50);

    const image = await loadImage(imageURL);
    ctx.drawImage(image, 400, y, 120, 120);
  }

  return canvas;
}

async function saveImageToCache(image) {
  const buffer = image.toBuffer();
  const filePath = path.join(cacheDir, `worker_${Date.now()}.png`);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

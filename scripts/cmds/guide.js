const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
config: {
  name: "guide",
  aliases: [],
  version: "1.0",
  author: "Vex_Kshitiz",
  countDown: 20,
  role: 0,
  shortDescription: "help cmd alternative",
  longDescription: "see the cmd list and its info in image",
  category: "tool",
  guide: {
    en: "{p}guide / guide {cmdname}",
  }
},


  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {

      createAndSendImage(message, "https://i.ibb.co/qDSzt04/resize-1714986762455685820download1.jpg", await generateHelpList(prefix)); // resize image ok if you are planning to change background image link 
      // use this webiste to resize :-https://www.countingcharacters.com/image-resizer-online
      // width 736 and height 1800
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";
        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `  ╭── NAME ────⭓
  │ ${configCommand.name}
  ├── INFO
  │ Description: ${longDescription}
  │ Other names: ${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"}
  │ Other names in your group: Do not have
  │ Version: ${configCommand.version || "1.0"}
  │ Role: ${roleText}
  │ Time per command: ${configCommand.countDown || 1}s
  │ Author: ${author}
  ├── Usage
  │ ${usage}
  ├── Notes
  │ The content inside <XXXXX> can be changed
  │ The content inside [a|b|c] is a or b or c
  ╰━━━━━━━❖`;


        createAndSendCommandInfoImage(message, "https://i.ibb.co/JrN2573/Download-premium-image-of-Paper-texture-mobile-wallpaper-simple-background-by-mook-about-instagram-s.jpg", response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
}

async function createAndSendImage(message, backgroundImageURL, text) {
  try {
    const canvas = createCanvas();
    const ctx = canvas.getContext("2d");


    const backgroundImage = await loadImage(backgroundImageURL);
    canvas.width = backgroundImage.width;
    canvas.height = backgroundImage.height;


    ctx.drawImage(backgroundImage, 0, 0);


    ctx.fillStyle = "#000000";
    ctx.font = "16px Arial";
    wrapInfoText(ctx, text, 130, 15, canvas.width - 230, 20);




    const buffer = canvas.toBuffer("image/png");


    const cacheFolderPath = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheFolderPath)) {
      fs.mkdirSync(cacheFolderPath);
    }
    const cachedImagePath = path.join(cacheFolderPath, "image.png");
    fs.writeFileSync(cachedImagePath, buffer);


    message.reply({
      body: "",
      attachment: fs.createReadStream(cachedImagePath),
    });
  } catch (error) {
    console.error("Error creating and sending image:", error);
  }
}

async function generateHelpList(prefix) {
  let msg = "";
  const categories = {};

  msg += `╔═══════════╗\n 𝗩𝗘𝗫 𝗞𝗦𝗛𝗜𝗧𝗜𝗭 \n╚═══════════╝`;

  for (const [name, value] of commands) {
    const category = value.config.category || "Uncategorized";
    categories[category] = categories[category] || { commands: [] };
    categories[category].commands.push(name);
  }

  Object.keys(categories).forEach(category => {
    if (category !== "info") {
      msg += `\n╭─╮\n│⁕ ${category.toUpperCase()} ⁕ `;

      const names = categories[category].commands.sort();
      for (let i = 0; i < names.length; i += 3) {
        const cmds = names.slice(i, i + 3).map(item => `✰${item}`);
        msg += `\n│${cmds.join(" ".repeat(Math.max(1, 10 - cmds.join("").length)))}`;
      }

      msg += `\n╰────────────`;
    }
  });

  const totalCommands = commands.size;
  msg += ``;
  msg += ``;
  msg += ``;

  return msg;
}

async function createAndSendCommandInfoImage(message, backgroundImageURL, text) {
  try {
    const canvas = createCanvas();
    const ctx = canvas.getContext("2d");


    const backgroundImage = await loadImage(backgroundImageURL);
    canvas.width = backgroundImage.width;
    canvas.height = backgroundImage.height;


    ctx.drawImage(backgroundImage, 0, 0);


    ctx.fillStyle = "#000000";
    ctx.font = "25px Arial";
    wrapCommandInfoText(ctx, text, 40, 60, canvas.width - 80, 20);


    const buffer = canvas.toBuffer("image/png");


    const cacheFolderPath = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheFolderPath)) {
      fs.mkdirSync(cacheFolderPath);
    }
    const cachedImagePath = path.join(cacheFolderPath, "guide.png");
    fs.writeFileSync(cachedImagePath, buffer);


    message.reply({
      body: "",
      attachment: fs.createReadStream(cachedImagePath),
    });
  } catch (error) {
    console.error("Error creating and sending command info image:", error);
  }
}

function wrapInfoText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

function wrapCommandInfoText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

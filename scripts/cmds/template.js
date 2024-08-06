const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const templateImages = {
  1: "https://i.postimg.cc/tTrHHZTd/pixelcut-export-4.png",
  2: "https://i.ibb.co/FqkwM6P/image.jpg",
  3: "https://i.ibb.co/KNVxy3V/The-12-Best-Free-Internet-Phone-Calls-Apps-of-2024.jpg",
  4: "https://i.ibb.co/wwqmZCg/photo-editing.jpg",
  5: "https://i.ibb.co/fGhJ3bs/download-3.jpg",
  6: "https://i.ibb.co/TTHypc5/Brown-creative-birthday-story-idia-for-intragram.jpg",
  7: "https://i.ibb.co/ssBsLbH/Black-creative-birthday-story-idia-for-intragram.jpg",
  8: "https://i.ibb.co/86S319c/overlay.jpg",
  9: "https://i.ibb.co/G3F93fY/4-4.jpg",
  10: "https://i.ibb.co/VgLdttW/download-6.jpg",
  11: "https://i.ibb.co/j360Ddp/layout-1.jpg",
  12: "https://i.ibb.co/tQmVWVc/download-7.jpg",
  13: "https://i.ibb.co/cxzZShg/instagramtemplate-ig-storytemplate.jpg",
  14: "https://i.ibb.co/j6Hcjt1/Template-Qris-Anime.jpg",
  15: "https://i.ibb.co/6Wj206D/Qu-500-follows-Y-u-t-t-c-c-c-c-u.jpg",
  16: "https://i.ibb.co/wp3HQCd/download-8.jpg",
  17: "https://i.ibb.co/BnPStDv/L-y-nh-follow.jpg",
  18: "https://i.ibb.co/pP54cfq/download-9.jpg",
  19: "https://i.ibb.co/KmD8VQK/download-10.jpg",
  20: "https://i.ibb.co/Kwg8hVs/Fram.jpg",
  21: "https://i.ibb.co/hRcdfRX/download-11.jpg",
  22: "https://i.ibb.co/W688hNB/E-T.jpg"
  
  
};


module.exports = {
  config: {
    name: "template",
    aliases: ["tmpl"],
    version: "1.0",
    author: "Vex_kshitiz",
    shortDescription: "Overlay  images on templates",
    longDescription: "ad your images on templates.",
    category: "image",
    guide: {
      en: "{p}template <1|2|3>\n\nTemplate 1."
    }
  },
  onStart: async function ({ message, event, args, api }) {
    try {
      if (event.type !== "message_reply") {
        return message.reply("Please reply to the image you want to overlay on the template.");
      }

      const attachment = event.messageReply.attachments;
      const templateNumber = parseInt(args[0]);

      if (isNaN(templateNumber) || ![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18, 19, 20, 21, 22].includes(templateNumber)) {
        return message.reply("Invalid template number. Please choose from 1 - 22");
      }

      if (templateNumber === 1) {
        if (!attachment || attachment.length !== 1 || attachment[0].type !== "photo") {
          return message.reply("Please reply to one photo.");
        }

        const imageUrl = attachment[0].url;
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const userImage = await loadImage(response.data);
        const templateImage = await loadImage(templateImages[1]);

        const canvas = createCanvas(templateImage.width, templateImage.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0);

        const circleSize = 130; 
        const circleX = 335;
        const circleY = 300; 

        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX + circleSize / 2, circleY + circleSize / 2, circleSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(userImage, circleX, circleY, circleSize, circleSize);
        ctx.restore();

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template1.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      } else if (templateNumber === 2) {
        if (!attachment || attachment.length !== 2 || attachment.some(att => att.type !== "photo")) {
          return message.reply("Please reply to two photo.");
        }

        const responses = await Promise.all(attachment.map(att => axios.get(att.url, { responseType: 'arraybuffer' })));
        const userImages = await Promise.all(responses.map(res => loadImage(res.data)));
        const templateImage = await loadImage(templateImages[2]);

        const canvas = createCanvas(templateImage.width, templateImage.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0);

        const circleSize1 = 309; 
        const circleX1 = 255;
        const circleY1 = 378; 

        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX1 + circleSize1 / 2, circleY1 + circleSize1 / 2, circleSize1 / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(userImages[0], circleX1, circleY1, circleSize1, circleSize1);
        ctx.restore();

        const circleSize2 = 207; 
        const circleX2 = 54; 
        const circleY2 = 34;

        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX2 + circleSize2 / 2, circleY2 + circleSize2 / 2, circleSize2 / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(userImages[1], circleX2, circleY2, circleSize2, circleSize2);
        ctx.restore();

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template2.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      } else if (templateNumber === 3) {
        if (!attachment || attachment.length !== 1 || attachment[0].type !== "photo") {
          return message.reply("Please reply to one photo.");
        }

        const imageUrl = attachment[0].url;
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const userImage = await loadImage(response.data);
        const templateImage = await loadImage(templateImages[3]);

        const canvas = createCanvas(templateImage.width, templateImage.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0);

        const circleSize = 275;
        const circleX = 230; 
        const circleY = 285; 

        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX + circleSize / 2, circleY + circleSize / 2, circleSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(userImage, circleX, circleY, circleSize, circleSize);
        ctx.restore();

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template3.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 4) {
        if (!attachment || attachment.length !== 4 || attachment.some(att => att.type !== "photo")) {
          return message.reply("Please reply to four photo.");
        }

        const responses = await Promise.all(attachment.map(att => axios.get(att.url, { responseType: 'arraybuffer' })));
        const userImages = await Promise.all(responses.map(res => loadImage(res.data)));
        const templateImage = await loadImage(templateImages[4]);

        const canvas = createCanvas(templateImage.width, templateImage.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0);

       
        const squareSize = 145; 
        const squarePositions = [
          { x: 100, y: 375 },   
          { x: 296, y: 375 },  
          { x: 490, y: 375 }   
        ];
        const circleSize = 170;
        const circlePosition = { x: 60, y: 42 }; 

     
        for (let i = 0; i < 3; i++) {
          const { x, y } = squarePositions[i];
          ctx.drawImage(userImages[i], x, y, squareSize, squareSize);
        }

       
        ctx.save();
        ctx.beginPath();
        ctx.arc(circlePosition.x + circleSize / 2, circlePosition.y + circleSize / 2, circleSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(userImages[3], circlePosition.x, circlePosition.y, circleSize, circleSize);
        ctx.restore();

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template4.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 5) {
        if (!attachment || attachment.length !== 1 || attachment[0].type !== "photo") {
          return message.reply("Please reply to one photo.");
        }

        const imageUrl = attachment[0].url;
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const userImage = await loadImage(response.data);
        const templateImage = await loadImage(templateImages[5]);

        const canvas = createCanvas(templateImage.width, templateImage.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0);

        const imageWidth = 460; 
        const imageHeight = 460; 
        const imageX = 135; 
        const imageY = 320; 

        ctx.drawImage(userImage, imageX, imageY, imageWidth, imageHeight);

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template5.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 6) {
        if (!attachment || attachment.length !== 1 || attachment[0].type !== "photo") {
          return message.reply("Please reply to one photo.");
        }

        const imageUrl = attachment[0].url;
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const userImage = await loadImage(response.data);
        const templateImage = await loadImage(templateImages[6]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

        const imageWidth = 400;
        const imageHeight = 510; 
        const imageX = 167; 
        const imageY = 420; 

        ctx.drawImage(userImage, imageX, imageY, imageWidth, imageHeight);

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template6.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 7) {
        if (!attachment || attachment.length !== 1 || attachment[0].type !== "photo") {
          return message.reply("Please reply to one photo.");
        }

        const imageUrl = attachment[0].url;
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const userImage = await loadImage(response.data);
        const templateImage = await loadImage(templateImages[7]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

        const circleSize = 390; 
        const circleX = 173; 
        const circleY = 460;

        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX + circleSize / 2, circleY + circleSize / 2, circleSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(userImage, circleX, circleY, circleSize, circleSize);
        ctx.restore();

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template7.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 8) {
        if (!attachment || attachment.length !== 5 || attachment.some(att => att.type !== "photo")) {
          return message.reply("Please reply to five photos.");
        }

        const responses = await Promise.all(attachment.map(att => axios.get(att.url, { responseType: 'arraybuffer' })));
        const userImages = await Promise.all(responses.map(res => loadImage(res.data)));
        const templateImage = await loadImage(templateImages[8]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

      
        const rect1Width = 150; 
        const rect1Height = 150; 
        const rect1X = 455; 
        const rect1Y = 520; 
        ctx.drawImage(userImages[0], rect1X, rect1Y, rect1Width, rect1Height);

     
        const rect2Width = 150; 
        const rect2Height = 150; 
        const rect2X = 285;
        const rect2Y = 520; 
        ctx.drawImage(userImages[1], rect2X, rect2Y, rect2Width, rect2Height);

      
        const rect3Width = 150; 
        const rect3Height = 150; 
        const rect3X = 112; 
        const rect3Y = 520; 
        ctx.drawImage(userImages[2], rect3X, rect3Y, rect3Width, rect3Height);

   
        const rect4Width = 300; 
        const rect4Height = 310;
        const rect4X = 53; 
        const rect4Y = 92; 
        ctx.drawImage(userImages[3], rect4X, rect4Y, rect4Width, rect4Height);

       
        const circleSize = 230; 
        const circleX = 428; 
        const circleY = 95; 

        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX + circleSize / 2, circleY + circleSize / 2, circleSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(userImages[4], circleX, circleY, circleSize, circleSize);
        ctx.restore();

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template8.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 9) {
        if (!attachment || attachment.length !== 4 || attachment.some(att => att.type !== "photo")) {
          return message.reply("Please reply to four photo.");
        }

        const responses = await Promise.all(attachment.map(att => axios.get(att.url, { responseType: 'arraybuffer' })));
        const userImages = await Promise.all(responses.map(res => loadImage(res.data)));
        const templateImage = await loadImage(templateImages[9]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

        
        const circleSize1 = 182; 
        const circleX1 = 27; 
        const circleY1 = 9; 

        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX1 + circleSize1 / 2, circleY1 + circleSize1 / 2, circleSize1 / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(userImages[0], circleX1, circleY1, circleSize1, circleSize1);
        ctx.restore();

       
        const circleSize2 = 150; 
        const circleX2 = 45; 
        const circleY2 = 540;

        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX2 + circleSize2 / 2, circleY2 + circleSize2 / 2, circleSize2 / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(userImages[1], circleX2, circleY2, circleSize2, circleSize2);
        ctx.restore();

       
        const circleSize3 = 150;
        const circleX3 =  202; 
        const circleY3 = 540; 

        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX3 + circleSize3 / 2, circleY3 + circleSize3 / 2, circleSize3 / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(userImages[2], circleX3, circleY3, circleSize3, circleSize3);
        ctx.restore();

       
        const circleSize4 = 150; 
        const circleX4 = 373;
        const circleY4 = 539; 

        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX4 + circleSize4 / 2, circleY4 + circleSize4 / 2, circleSize4 / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(userImages[3], circleX4, circleY4, circleSize4, circleSize4);
        ctx.restore();

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template9.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }

      else if (templateNumber === 10) {
        if (!attachment || attachment.length !== 2 || attachment.some(att => att.type !== "photo")) {
          return message.reply("Please reply to two photo.");
        }

        const responses = await Promise.all(attachment.map(att => axios.get(att.url, { responseType: 'arraybuffer' })));
        const userImages = await Promise.all(responses.map(res => loadImage(res.data)));
        const templateImage = await loadImage(templateImages[10]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

       
        const rectWidth1 = 300; 
        const rectHeight1 = 295; 
        const rectX1 = 351;
        const rectY1 = 140; 
        const tilt1 = 0.25;

        ctx.save();
        ctx.translate(rectX1 + rectWidth1 / 2, rectY1 + rectHeight1 / 2);
        ctx.rotate(tilt1);
        ctx.drawImage(userImages[0], -rectWidth1 / 2, -rectHeight1 / 2, rectWidth1, rectHeight1);
        ctx.restore();

       
        const rectWidth2 = 300; 
        const rectHeight2 = 295; 
        const rectX2 = 62;
        const rectY2 = 682; 
        const tilt2 = -0.35; 

        ctx.save();
        ctx.translate(rectX2 + rectWidth2 / 2, rectY2 + rectHeight2 / 2);
        ctx.rotate(tilt2);
        ctx.drawImage(userImages[1], -rectWidth2 / 2, -rectHeight2 / 2, rectWidth2, rectHeight2);
        ctx.restore();

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template10.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 11) {
        if (!attachment || attachment.length !== 2 || attachment.some(att => att.type !== "photo")) {
          return message.reply("Please reply to two photo.");
        }

        const responses = await Promise.all(attachment.map(att => axios.get(att.url, { responseType: 'arraybuffer' })));
        const userImages = await Promise.all(responses.map(res => loadImage(res.data)));
        const templateImage = await loadImage(templateImages[11]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

       
        const rectWidth1 = 350; 
        const rectHeight1 = 500; 
        const rectX1 = 45; 
        const rectY1 = 215;

        ctx.drawImage(userImages[0], rectX1, rectY1, rectWidth1, rectHeight1);

       
        const rectWidth2 = 280; 
        const rectHeight2 = 407; 
        const rectX2 = 405;
        const rectY2 = 485;

        ctx.drawImage(userImages[1], rectX2, rectY2, rectWidth2, rectHeight2);

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template11.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 12) {
        if (!attachment || attachment.length !== 1 || attachment[0].type !== "photo") {
          return message.reply("Please reply to one photo.");
        }

        const response = await axios.get(attachment[0].url, { responseType: 'arraybuffer' });
        const userImage = await loadImage(response.data);
        const templateImage = await loadImage(templateImages[12]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

       
        const rectWidth = 480; 
        const rectHeight = 870; 
        const rectX = 123;
        const rectY = 208; 
        const borderRadius = 20; 

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(rectX + borderRadius, rectY);
        ctx.lineTo(rectX + rectWidth - borderRadius, rectY);
        ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + borderRadius);
        ctx.lineTo(rectX + rectWidth, rectY + rectHeight - borderRadius);
        ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - borderRadius, rectY + rectHeight);
        ctx.lineTo(rectX + borderRadius, rectY + rectHeight);
        ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - borderRadius);
        ctx.lineTo(rectX, rectY + borderRadius);
        ctx.quadraticCurveTo(rectX, rectY, rectX + borderRadius, rectY);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(userImage, rectX, rectY, rectWidth, rectHeight);
        ctx.restore();

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template12.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 13) {
        if (!attachment || attachment.length !== 1 || attachment[0].type !== "photo") {
          return message.reply("Please reply to one photo.");
        }

        const response = await axios.get(attachment[0].url, { responseType: 'arraybuffer' });
        const userImage = await loadImage(response.data);
        const templateImage = await loadImage(templateImages[13]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

        
        const squareWidth = 485; 
        const squareHeight = 550; 
        const squareX = 125; 
        const squareY = 365; 

        ctx.drawImage(userImage, squareX, squareY, squareWidth, squareHeight);

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template13.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 14) {
        if (!attachment || attachment.length !== 1 || attachment[0].type !== "photo") {
          return message.reply("Please reply to one photo");
        }

        const response = await axios.get(attachment[0].url, { responseType: 'arraybuffer' });
        const userImage = await loadImage(response.data);
        const templateImage = await loadImage(templateImages[14]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

       
        const squareWidth = 340; 
        const squareHeight = 340; 
        const squareX = 63; 
        const squareY = 208; 

        ctx.drawImage(userImage, squareX, squareY, squareWidth, squareHeight);

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template14.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 15) {
        if (!attachment || attachment.length !== 1 || attachment[0].type !== "photo") {
          return message.reply("Please reply to one photo.");
        }

        const response = await axios.get(attachment[0].url, { responseType: 'arraybuffer' });
        const userImage = await loadImage(response.data);
        const templateImage = await loadImage(templateImages[15]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

      
        const squareWidth = 400; 
        const squareHeight = 400; 
        const squareX = 20; 
        const squareY = 295; 
        const cornerRadius = 20; 

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(squareX + cornerRadius, squareY);
        ctx.lineTo(squareX + squareWidth - cornerRadius, squareY);
        ctx.quadraticCurveTo(squareX + squareWidth, squareY, squareX + squareWidth, squareY + cornerRadius);
        ctx.lineTo(squareX + squareWidth, squareY + squareHeight - cornerRadius);
        ctx.quadraticCurveTo(squareX + squareWidth, squareY + squareHeight, squareX + squareWidth - cornerRadius, squareY + squareHeight);
        ctx.lineTo(squareX + cornerRadius, squareY + squareHeight);
        ctx.quadraticCurveTo(squareX, squareY + squareHeight, squareX, squareY + squareHeight - cornerRadius);
        ctx.lineTo(squareX, squareY + cornerRadius);
        ctx.quadraticCurveTo(squareX, squareY, squareX + cornerRadius, squareY);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(userImage, squareX, squareY, squareWidth, squareHeight);
        ctx.restore();

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template15.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 16) {
        if (!attachment || attachment.length !== 1 || attachment[0].type !== "photo") {
          return message.reply("Please reply to one photo.");
        }

        const response = await axios.get(attachment[0].url, { responseType: 'arraybuffer' });
        const userImage = await loadImage(response.data);
        const templateImage = await loadImage(templateImages[16]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

        
        const squareWidth = 270; 
        const squareHeight = 310; 
        const squareX = 432; 
        const squareY = 190; 
        const cornerRadius = 20; 

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(squareX + cornerRadius, squareY);
        ctx.lineTo(squareX + squareWidth - cornerRadius, squareY);
        ctx.quadraticCurveTo(squareX + squareWidth, squareY, squareX + squareWidth, squareY + cornerRadius);
        ctx.lineTo(squareX + squareWidth, squareY + squareHeight - cornerRadius);
        ctx.quadraticCurveTo(squareX + squareWidth, squareY + squareHeight, squareX + squareWidth - cornerRadius, squareY + squareHeight);
        ctx.lineTo(squareX + cornerRadius, squareY + squareHeight);
        ctx.quadraticCurveTo(squareX, squareY + squareHeight, squareX, squareY + squareHeight - cornerRadius);
        ctx.lineTo(squareX, squareY + cornerRadius);
        ctx.quadraticCurveTo(squareX, squareY, squareX + cornerRadius, squareY);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(userImage, squareX, squareY, squareWidth, squareHeight);
        ctx.restore();

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template16.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 17) {
        if (!attachment || attachment.length !== 1 || attachment[0].type !== "photo") {
          return message.reply("Please reply to one photo.");
        }

        const response = await axios.get(attachment[0].url, { responseType: 'arraybuffer' });
        const userImage = await loadImage(response.data);
        const templateImage = await loadImage(templateImages[17]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

     
        const rectWidth = 268;
        const rectHeight = 290; 
        const rectX = 419; 
        const rectY = 128; 

        ctx.drawImage(userImage, rectX, rectY, rectWidth, rectHeight);

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template17.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 18) {
        if (!attachment || attachment.length !== 1 || attachment[0].type !== "photo") {
          return message.reply("Please reply to one photo.");
        }

        const response = await axios.get(attachment[0].url, { responseType: 'arraybuffer' });
        const userImage = await loadImage(response.data);
        const templateImage = await loadImage(templateImages[18]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

      
        const squareSize = 480; 
        const squareX = 128; 
        const squareY = 128; 

        ctx.drawImage(userImage, squareX, squareY, squareSize, squareSize);

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template18.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 19) {
        if (!attachment || attachment.length !== 1 || attachment[0].type !== "photo") {
          return message.reply("Please reply to one photo.");
        }

        const response = await axios.get(attachment[0].url, { responseType: 'arraybuffer' });
        const userImage = await loadImage(response.data);
        const templateImage = await loadImage(templateImages[19]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

        
        const rectWidth = 397; 
        const rectHeight = 355; 
        const rectX = 46; 
        const rectY = 92; 

        ctx.drawImage(userImage, rectX, rectY, rectWidth, rectHeight);

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template19.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 20) {
        if (!attachment || attachment.length !== 1 || attachment[0].type !== "photo") {
          return message.reply("Please reply to one photo");
        }

        const response = await axios.get(attachment[0].url, { responseType: 'arraybuffer' });
        const userImage = await loadImage(response.data);
        const templateImage = await loadImage(templateImages[20]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

       
        const rectWidth = 350; 
        const rectHeight = 400;
        const rectX = 85;
        const rectY = 155; 

        ctx.drawImage(userImage, rectX, rectY, rectWidth, rectHeight);

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template20.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 21) {
        if (!attachment || attachment.length !== 1 || attachment[0].type !== "photo") {
          return message.reply("Please reply to one photo");
        }

        const response = await axios.get(attachment[0].url, { responseType: 'arraybuffer' });
        const userImage = await loadImage(response.data);
        const templateImage = await loadImage(templateImages[21]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

       
        const rectWidth = 445;
        const rectHeight = 445;
        const rectX = 28; 
        const rectY = 163;

        ctx.drawImage(userImage, rectX, rectY, rectWidth, rectHeight);

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template21.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }
      else if (templateNumber === 22) {
        if (!attachment || attachment.length !== 2 || attachment.some(att => att.type !== "photo")) {
          return message.reply("please reply to two photos.");
        }

        const responses = await Promise.all(attachment.map(att => axios.get(att.url, { responseType: 'arraybuffer' })));
        const userImages = await Promise.all(responses.map(res => loadImage(res.data)));
        const templateImage = await loadImage(templateImages[22]);

        const canvasWidth = templateImage.width;
        const canvasHeight = templateImage.height;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(templateImage, 0, 0, canvasWidth, canvasHeight);

       
        const rectWidth1 = 310;
        const rectHeight1 = 400;
        const rectX1 = 43;
        const rectY1 = 110; 

        ctx.drawImage(userImages[0], rectX1, rectY1, rectWidth1, rectHeight1);

        
        const rectWidth2 = 310; 
        const rectHeight2 = 400; 
        const rectX2 = 385; 
        const rectY2 = 110; 

        ctx.drawImage(userImages[1], rectX2, rectY2, rectWidth2, rectHeight2);

        const cacheFolderPath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolderPath)) {
          fs.mkdirSync(cacheFolderPath);
        }

        const imagePath = path.join(cacheFolderPath, `template22.png`);
        const out = fs.createWriteStream(imagePath);
        canvas.createPNGStream().pipe(out);
        out.on('finish', () => {
          message.reply({
            body: "",
            attachment: fs.createReadStream(imagePath)
          });
        });
      }

    } catch (error) {
      console.error("Error:", error);
      message.reply("An error occurred while processing your request. Please try again later.");
    }
  }
};

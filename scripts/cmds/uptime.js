module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "upt"],
    version: "1.0",
    author: "kshitiz",
    role: 0,
    shortDescription: {
      en: "Displays the bot's uptime."
    },
    longDescription: {
      en: "Find out how long the bot has been tirelessly serving you."
    },
    category: "?????????",
    guide: {
      en: "Use {p}uptime to reveal the bot's operational duration."
    }
  },
  onStart: async function ({ api, event, args }) {

    const imageLinks = [
      "http://tinyurl.com/2bq2cm8v",
      "http://tinyurl.com/2akqp8ym",
      "http://tinyurl.com/2bgqfxtf",
      "http://tinyurl.com/24k52arc",
      "http://tinyurl.com/2ardsmcw",

    ];


    const randomImageIndex = Math.floor(Math.random() * imageLinks.length);
    const imageUrl = imageLinks[randomImageIndex];


    const greetings = [
      "Ahoy, Captain! ?‍☠️",
      "Greetings, Master ?",
      "Hello, Commander ?",
      "Salutations, Overlord ?",
      "Welcome back, Sensei ?",
      "Rise and shine, Boss! ☀️",
      "Hola, Amigo! ?",
      "At your service, Your Majesty! ?",
      "Hey there, Chief! ?",
      "Good day, Sir/Madam! ?"
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];


    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));

    let uptimeString = `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
    if (days === 0) {
      uptimeString = `${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
      if (hours === 0) {
        uptimeString = `${minutes} minutes, and ${seconds} seconds`;
        if (minutes === 0) {
          uptimeString = `${seconds} seconds`;
        }
      }
    }

    const message = `${randomGreeting}\n\nGreetings! Your loyal bot has been operational for: ${uptimeString}`;

    
    const imageStream = await global.utils.getStreamFromURL(imageUrl);

    api.sendMessage({
      body: message,
      attachment: imageStream
    }, event.threadID, event.messageID);
  }
};

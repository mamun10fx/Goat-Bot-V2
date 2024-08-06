const axios = require("axios");

module.exports = {
  config: {
    name: 'geeta',
    version: '1.0',
    author: 'Vex_Kshitiz',
    role: 0,
    shortDescription: 'Get information from the Bhagavad Gita',
    longDescription: 'Fetch chapters and verses from the Bhagavad Gita',
    category: 'utility',
    guide: {
      en: 'To view chapters: {p}geeta chapters\nTo view a verse: {p}geeta {chapter} {verse}\nTo get chapter summary: {p}geeta summary {chapter}'
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      if (args.length === 1 && args[0].toLowerCase() === 'chapters') {
        const response = await axios.get("https://bhagavadgitaapi.in/chapters/");
        const chapters = response.data;

        let replyMessage = "Chapters of the Bhagavad Gita:\n";
        chapters.forEach(chapter => {
          replyMessage += `${chapter.chapter_number}. ${chapter.name}\n`;
        });

        message.reply(replyMessage, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "geeta",
            messageID: info.messageID,
            author: event.senderID,
            chapters,
          });
        });

      } else if (args.length === 2 && args[0].toLowerCase() === 'summary') {
        const chapterNumber = parseInt(args[1]);

        if (isNaN(chapterNumber)) {
          message.reply("Please provide a valid chapter number.");
          return;
        }

        const response = await axios.get("https://bhagavadgitaapi.in/chapters/");
        const chapters = response.data;
        const selectedChapter = chapters.find(chapter => chapter.chapter_number === chapterNumber);

        if (!selectedChapter) {
          message.reply("Invalid chapter number.");
          return;
        }

        let replyMessage = `
        Chapter ${selectedChapter.chapter_number}: ${selectedChapter.name}
        Summary: ${selectedChapter.summary.hi}
        `;

        message.reply(replyMessage);

      } else if (args.length === 2 && !isNaN(args[0]) && !isNaN(args[1])) {
        const chapterNumber = parseInt(args[0]);
        const verseNumber = parseInt(args[1]);

        const response = await axios.get(`https://bhagavadgitaapi.in/slok/${chapterNumber}/${verseNumber}`);
        const verseData = response.data;

        if (!verseData) {
          message.reply("Invalid chapter or verse number.");
          return;
        }

        let replyMessage = `
        Chapter ${verseData.chapter}, Verse ${verseData.verse}:
        ${verseData.slok}
        Translation by Swami Sivananda: ${verseData.siva.et}
        `;

        message.reply(replyMessage);

      } else {
        message.reply("Invalid command. Use {p}geeta chapters, {p}geeta summary {chapter}, or {p}geeta {chapter} {verse}.");
      }

    } catch (error) {
      console.error(error);
      message.reply("An error occurred while fetching data.");
    }
  },

  onReply: async function ({ api, event, Reply, args, message }) {
    const { author, commandName, chapters } = Reply;

    if (event.senderID !== author || !chapters) {
      return;
    }

    const chapterNumber = parseInt(args[0], 10);

    if (isNaN(chapterNumber) || !chapters.some(chapter => chapter.chapter_number === chapterNumber)) {
      message.reply("Invalid input.\nPlease provide a valid chapter number.");
      return;
    }

    const selectedChapter = chapters.find(chapter => chapter.chapter_number === chapterNumber);

    let replyMessage = `
    Chapter ${selectedChapter.chapter_number}: ${selectedChapter.name}
    Summary: ${selectedChapter.summary.hi}
    `;

    message.reply(replyMessage);
    global.GoatBot.onReply.delete(event.messageID);
  },
};

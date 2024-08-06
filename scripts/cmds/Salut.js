module.exports = {
    config: {
        name: "salut",
        version: "1.0",
        author: "ཋྀɞHaïtanįɞ く命ཋྀ༅ ✨",
        countDown: 5,
        role: 0,
        shortDescription: "sarcasm",
        longDescription: "sarcasm",
        category: "reply",
    },
onStart: async function(){}, 
onChat: async function({
    event,
    message,
    getLang
}) {
    if (event.body && event.body.toLowerCase() == "salut") return message.reply("Salut mon pote ☺️ moi c'est 💀☄️GHOST👻 si t'as un problème n'hésite pas à me voir 😸 ta satisfaction est ma priorité absolue ✨💜☄️");
}
};

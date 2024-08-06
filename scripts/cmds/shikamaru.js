 module.exports = {
    config: {
        name: "shikamaru",
        version: "1.0",
        author: "Ronald ",
        countDown: 5,
        role: 0,
        shortDescription: "sarcasm",
        longDescription: "sarcasm",
        category: "reply",
    },
onStart: async function(){},
onChat: async function({ event,
    message,
    getLang
}) {
    if (event.body && event.body.toLowerCase() == "shikamaru") return message.reply("🥏 𝗦𝗵𝗶𝗸𝗮𝗺𝗮𝗿𝘂 est en effet connu pour être extrêmement intelligent dans l'univers de Naruto. Il est un stratège hors pair, capable d'analyser rapidement les situations, de trouver des solutions ingénieuses et de prévoir les mouvements de ses adversaires. Son intelligence lui permet souvent de sortir de situations difficiles et de contribuer de manière significative aux missions de l'équipe. 🪶");
}
};

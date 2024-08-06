  module.exports = {
  config: {
    name: "durée",
    aliases: ["t", "dr"],
    version: "1.0",
    author: "Ronald",
    role: 2,
    shortDescription: {
      fr: "le temps après le researt"
    },
    longDescription: {
      fr: "utiliser ce cmd pour voir juste le temps par jour où plutôt le moment du dernier restart."
    },
    category: "System",
    guide: {
      fr: "conçu pour voir le temps. "
    }
  },
  onStart: async function ({ api, event, args }) {
    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString =`[⏱️] = ${hours} : ${minutes} : ${seconds} `;
    api.sendMessage(`${uptimeString} `, event.threadID);
  }
};

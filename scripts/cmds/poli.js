const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "poli",
    credits: "Loid Butter",
    category: "ai"
  },

  onStart: async function({ api, event, args }) {
    let { threadID, messageID } = event;
    let query = args.join(" ");
    if (!query) return api.sendMessage("put text/query", threadID, messageID);

    let path = __dirname + `/cache/poli.png`;

    const poli = (await axios.get(`https://image.pollinations.ai/prompt/${query}`, {
      responseType: "arraybuffer",
    })).data;

    fs.writeFileSync(path, Buffer.from(poli, "utf-8"));

    api.sendMessage({
      body: "Here's Your Request Master✅️",
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);
  }
};
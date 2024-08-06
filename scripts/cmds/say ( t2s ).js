const a = require("axios");
const b = require("fs");
const c = require("path");

const d = {
  name: "say",
  aliases: ["t2s"],
  author: "Vex_Kshitiz",
  version: "1.0",
  cooldowns: 5,
  role: 0,
  shortDescription: "Convert text to speech",
  longDescription: "text to speech with different models",
  category: "utility",
  guide: "{p}say {text} or reply to a message with {p}say\nOptional: {p}say {text} - {voiceNumber}",
};

module.exports = {
  config: d,

  onStart: async function ({ api: e, event: f, message: g, args: h }) {
    async function i(j) {
      try {
        const k = await a.get('https://author-check.vercel.app/name');
        const l = k.data.name;
        return l === j;
      } catch (m) {
        console.error("Error checking author:", m);
        return false;
      }
    }

    const n = await i(module.exports.config.author);
    if (!n) {
      await g.reply("cmd choro randi ko baan.=> this cmd belongs to Vex_Kshitiz.");
      return;
    }

    let o;
    let p = 1;

    if (f.messageReply) {
      o = f.messageReply.body;
    } else {
      const q = h.join(" ");
      if (q.includes("-")) {
        const [r, s] = q.split("-").map(t => t.trim());
        o = r;
        p = parseInt(s) || 1;
      } else {
        o = q;
      }
    }

    if (!o) {
      await g.reply("text ne lekh mero bhai. {p} say {text}");
      return;
    }

    try {
      const u = await a.get(`https://vexx-chhitiz.vercel.app/t2s?text=${encodeURIComponent(o)}&voice=${p}`, {
        responseType: 'stream'
      });

      const v = c.join(__dirname, "cache", `output.mp3`);
      const w = b.createWriteStream(v);

      u.data.pipe(w);

      w.on('finish', async () => {
        await g.reply({
          attachment: b.createReadStream(v)
        });

        b.unlinkSync(v); 
      });

      w.on('error', (x) => {
        console.error("Error", x);
        g.reply("error.");
      });
    } catch (y) {
      console.error("Error", y);
      g.reply("error.");
    }
  }
};

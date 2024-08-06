 module.exports = {  config: {
    name: "respect",
    aliases: [],
    version: "1.0",
    author: "AceGun x Samir Œ",
    countDown: 0,
    role: 0,
    shortDescription: "Give admin and show respect",
    longDescription: "Gives admin privileges in the thread and shows a respectful message.",
    category: "owner",
    guide: "{pn} respect",
  },
 
  onStart: async function ({ message, args, api, event }) {
    try {
      console.log('Sender ID:', event.senderID);
 
      const permission = ["100084606198768"];
      if (!permission.includes(event.senderID)) {
        return api.sendMessage(
          "𝑱𝒆 𝒗𝒐𝒖𝒔 𝒑𝒓𝒆𝒔𝒆𝒏𝒕𝒆 𝒎𝒆𝒔 𝒆𝒙𝒄𝒖𝒔𝒆𝒔 𝒔𝒆𝒖𝒍 🌹 Ronald 🌹 𝒑𝒆𝒖𝒙 𝒖𝒕𝒊𝒍𝒊𝒔𝒆𝒓 𝒄𝒆𝒕𝒕𝒆 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒆 🙂 ",
          event.threadID,
          event.messageID
        );
      }
 
      const threadID = event.threadID;
      const adminID = event.senderID;
 
      // Change the user to an admin
      await api.changeAdminStatus(threadID, adminID, true);
 
      api.sendMessage(
        `À partir d'aujourd'hui vous êtes administrateur du groupe  !`,
        threadID
      );
    } catch (error) {
      console.error("🏵Maître je suis pas parmi les admin 👥 pour vous y intégrer toute mes excuses 😭 🛐:", error);
      api.sendMessage(" 😫 Désolé Ronald veillez réessayer", event.threadID);
    }
  },
};

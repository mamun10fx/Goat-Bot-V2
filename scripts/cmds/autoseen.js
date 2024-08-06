module.exports = {
  config: {
    name: "autoseen",
    version: "1.0",
    author: "Samir Œ",
    countDown: 0,
    role: 0,
    shortDescription: "autoseen",
    longDescription: "seen all message",
    category: "system",
  },
  onStart: async function(){}, 
  onChat: async function({
      api,
      event,
      message,
      getLang,
      args,
  }) {
      if (!this.lastSeenTime || Date.now() - this.lastSeenTime >= 2) {
          api.markAsReadAll(() => {});
          this.lastSeenTime = Date.now();
      }
  },
};
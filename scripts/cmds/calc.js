const math = require('mathjs');

module.exports = {
  config: {
    name: "calc",
    aliases: ["calculator"],
    author: "Kshitiz",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "perform simple and scientific calculation ",
    longDescription: "calculator",
    category: "tools",
    guide: "{p}calc 20*20",
  },


  onStart: async function ({ event, message }) {
    try {
      const input = event.body;
      const data = input.split(" ");

      if (data.length < 2) {
        return message.reply("Please provide a valid expression.");
      }

      data.shift();
      const expression = data.join(" ");

      const result = evaluateExpression(expression);

      const replyMessage = {
        body: `Result of ${expression} is: ${result}`,
      };

      await message.reply(replyMessage);
    } catch (error) {
      console.error('[ERROR]', error);
      message.reply("An error occurred while processing the request.");
    }
  },
};

function evaluateExpression(expression) {
  try {
    const result = math.evaluate(expression);
    return result;
  } catch (error) {
    console.error('[ERROR]', error);
    return "Error: Invalid expression.";
  }
}

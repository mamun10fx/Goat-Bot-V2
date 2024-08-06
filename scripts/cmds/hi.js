module.exports = {
	config: {
			name: "hi",
			version: "1.0",
			author: "Kaizenji",//olol
			countDown: 1,
			role: 0,
			shortDescription: "hi",
			longDescription: "response with hi",
			category: "box chat",
	},
onStart: async function(){}, 
onChat: async function({
	event,
	message,
	getLang
}) {
	if (event.body && event.body.toLowerCase() == "hi") return message.reply("ʜᴇʟʟᴏ sᴇɴᴘᴀɪ, ʜᴏᴡ ᴄᴀɴ ɪ ʜᴇʟᴘ ʏᴏᴜ?");
  if (event.body && event.body.toLowerCase() == "henlo") return message.reply("ʜᴇʟʟᴏ sᴇɴᴘᴀɪ, ʜᴏᴡ ᴄᴀɴ ɪ ʜᴇʟᴘ ʏᴏᴜ?");
  if (event.body && event.body.toLowerCase() == "hii") return message.reply("ʜᴇʟʟᴏ sᴇɴᴘᴀɪ, ʜᴏᴡ ᴄᴀɴ ɪ ʜᴇʟᴘ ʏᴏᴜ?");
  if (event.body && event.body.toLowerCase() == "hello") return message.reply("ʜᴇʟʟᴏ sᴇɴᴘᴀɪ, ʜᴏᴡ ᴄᴀɴ ɪ ʜᴇʟᴘ ʏᴏᴜ?");
  if (event.body && event.body.toLowerCase() == "zup") return message.reply("ʜᴇʟʟᴏ sᴇɴᴘᴀɪ, ʜᴏᴡ ᴄᴀɴ ɪ ʜᴇʟᴘ ʏᴏᴜ?");
  if (event.body && event.body.toLowerCase() == "hey") return message.reply("ʜᴇʟʟᴏ sᴇɴᴘᴀɪ, ʜᴏᴡ ᴄᴀɴ ɪ ʜᴇʟᴘ ʏᴏᴜ?");
  if (event.body && event.body.toLowerCase() == "yo") return message.reply("ʜᴇʟʟᴏ sᴇɴᴘᴀɪ, ʜᴏᴡ ᴄᴀɴ ɪ ʜᴇʟᴘ ʏᴏᴜ?");
}
};
const { GoatWrapper } = require('fca-liane-utils');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
	config: {
		name: "owner",
		author: "Tokodori",
		role: 0,
		shortDescription: " ",
		longDescription: "",
		category: "admin",
		guide: "{pn}"
	},

	onStart: async function ({ api, event }) {
		try {
			const ownerInfo = {
				name: '𝗚𝗔𝗕 𝗬𝗨',
				gender: '𝗠𝗔𝗟𝗘',
				hobby: '𝗠𝗔𝗞𝗜𝗡𝗚 𝗕𝗢𝗧𝗦',
				Fb: 'https://facebook.com/61562362827346',
				Relationship: '𝘄𝗶𝘁𝗵 𝘁𝗿𝗶𝘅𝗶𝗲',
				bio: '𝗕𝗮𝗹𝗶𝗸 𝗻𝘆𝗼 𝗺𝗮𝗶𝗻 𝗮𝗰𝗰𝗼𝘂𝗻𝘁 𝗸𝗼! '
			};

			const bold = 'https://i.imgur.com/Kyo3frH.mp4';
			const tmpFolderPath = path.join(__dirname, 'tmp');

			if (!fs.existsSync(tmpFolderPath)) {
				fs.mkdirSync(tmpFolderPath);
			}

			const videoResponse = await axios.get(bold, { responseType: 'arraybuffer' });
			const videoPath = path.join(tmpFolderPath, 'owner_video.mp4');

			fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

			const response = `
◈ 𝖮𝖶𝖭𝖤𝖱 𝖨𝖭𝖥𝖮𝖱𝖬𝖠𝖳𝖨𝖮𝖭:\n

Name: ${ownerInfo.name}

Gender: ${ownerInfo.gender}

Relationship: ${ownerInfo.Relationship}

Hobby: ${ownerInfo.hobby}

Fb: ${ownerInfo.Fb}

Bio: ${ownerInfo.bio}
			`;

			await api.sendMessage({
				body: response,
				attachment: fs.createReadStream(videoPath)
			}, event.threadID, event.messageID);

			fs.unlinkSync(videoPath);

			api.setMessageReaction('🌊', event.messageID, (err) => {}, true);
		} catch (error) {
			console.error('Error in ownerinfo command:', error);
			return api.sendMessage('An error occurred while processing the command.', event.threadID);
		}
	}
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
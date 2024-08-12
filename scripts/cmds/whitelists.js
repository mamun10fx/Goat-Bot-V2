const { config } = global.GoatBot;

const { writeFileSync } = require("fs-extra");



module.exports = {

	config: {

		name: "whitelists",

		aliases: ["wl"],

		version: "1.5",

		author: "NTKhang",

		countDown: 5,

		role: 2,

		shortDescription: {

			vi: "Thêm, xóa, sửa quyền whiteListIds",

			en: "Add, remove, edit whiteListIds role"

		},

		longDescription: {

			vi: "Thêm, xóa, sửa quyền whiteListIds",

			en: "Add, remove, edit whiteListIds role"

		},

		category: "owner",

		guide: {

			vi: '   {pn} [add | -a] <uid | @tag>: Thêm quyền whiteListIds cho người dùng'

				+ '\n	  {pn} [remove | -r] <uid | @tag>: Xóa quyền whiteListIds của người dùng'

				+ '\n	  {pn} [list | -l]: Liệt kê danh sách whiteListIds',

			en: '   {pn} [add | -a] <uid | @tag>: Add whiteListIds role for user'

				+ '\n	  {pn} [remove | -r] <uid | @tag>: Remove whiteListIds role of user'

				+ '\n	  {pn} [list | -l]: List all whiteListIds'

		}

	},



	langs: {

		vi: {

			added: "✅ | Đã thêm quyền whiteListIds cho %1 người dùng:\n%2",

			alreadyAdmin: "\n⚠ | %1 người dùng đã có quyền whiteListIds từ trước rồi:\n%2",

			missingIdAdd: "⚠ | Vui lòng nhập ID hoặc tag người dùng muốn thêm quyền whiteListIds",

			removed: "✅ | Đã xóa quyền whiteListIds của %1 người dùng:\n%2",

			notAdmin: "⚠ | %1 người dùng không có quyền whiteListIds:\n%2",

			missingIdRemove: "⚠ | Vui lòng nhập ID hoặc tag người dùng muốn xóa quyền whiteListIds",

			listAdmin: "👑 | Danh sách whiteListIds:\n%1"

		},

		en: {

			added: "✅ | Added whiteListIds role for %1 users:\n%2",

			alreadyAdmin: "\n⚠ | %1 users already have whiteListIds role:\n%2",

			missingIdAdd: "⚠ | Please enter ID or tag user to add whiteListIds role",

			removed: "✅ | Removed whiteListIds role of %1 users:\n%2",

			notAdmin: "⚠ | %1 users don't have whiteListIds role:\n%2",

			missingIdRemove: "⚠ | Please enter ID or tag user to remove whiteListIds role",

			listAdmin: "👑 | List of whiteListIds:\n%1"

		}

	},



	onStart: async function ({ message, args, usersData, event, getLang, api }) {
    const permission = [];
  if (permission.includes(event.senderID)) {
    api.sendMessage("Only Gab Yu can use this command!", event.threadID, event.messageID);
    return;
  }
    


		switch (args[0]) {

			case "add":

			case "-a":

            case "+": {

				if (args[1]) {

					let uids = [];

					if (Object.keys(event.mentions).length > 0)

						uids = Object.keys(event.mentions);

					else if (event.messageReply)

						uids.push(event.messageReply.senderID);

					else

						uids = args.filter(arg => !isNaN(arg));

					const notAdminIds = [];

					const authorIds = [];

					for (const uid of uids) {

						if (config.whiteListMode.whiteListIds.includes(uid))

							authorIds.push(uid);

						else

							notAdminIds.push(uid);

					}



					config.whiteListMode.whiteListIds.push(...notAdminIds);

					const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));

					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

					return message.reply(

						(notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")

						+ (authorIds.length > 0 ? getLang("alreadyAdmin", authorIds.length, authorIds.map(uid => `• ${uid}`).join("\n")) : "")

					);

				}

				else

					return message.reply(getLang("missingIdAdd"));

			}

			case "remove":

			case "-r":

            case "-": {

				if (args[1]) {

					let uids = [];

					if (Object.keys(event.mentions).length > 0)

						uids = Object.keys(event.mentions)[0];

					else

						uids = args.filter(arg => !isNaN(arg));

					const notAdminIds = [];

					const authorIds = [];

					for (const uid of uids) {

						if (config.whiteListMode.whiteListIds.includes(uid))

							authorIds.push(uid);

						else

							notAdminIds.push(uid);

					}

					for (const uid of authorIds)

						config.whiteListMode.whiteListIds.splice(config.whiteListMode.whiteListIds.indexOf(uid), 1);

					const getNames = await Promise.all(authorIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));

					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

					return message.reply(

						(authorIds.length > 0 ? getLang("removed", authorIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")

						+ (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")

					);

				}

				else

					return message.reply(getLang("missingIdRemove"));

			}

			case "list":

			case "-l": {

				const getNames = await Promise.all(config.whiteListMode.whiteListIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));

				return message.reply(getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));

			}

			default:

				return message.SyntaxError();

		}

	}

};
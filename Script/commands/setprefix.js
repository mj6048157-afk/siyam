module.exports.config = {
	name: "setprefix",
	version: "1.0.2",
	hasPermssion: 2,
	credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
	description: "Reset group prefix",
	commandCategory: "Group",
	usages: `
───────────────
» 📌 𝗦𝗘𝗧𝗣𝗥𝗘𝗙𝗜𝗫 
» এই কমান্ড দিয়ে শুধু যে গ্রুপে ব্যবহার করবেন, সেই গ্রুপের 𝗣𝗿𝗲𝗳𝗶𝗫 পরিবর্তন হবে।
» 📖 ব্যবহার করার নিয়ম:
» ✅ নতুন 𝗣𝗿𝗲𝗳𝗶𝗫 সেট করতে: {𝗽}𝘀𝗲𝘁𝗽𝗿𝗲𝗳𝗶𝗫 !
» উদাহরণ: ?𝘀𝗲𝘁𝗽𝗿𝗲𝗳𝗶𝗫 !
» তারপর বট যে মেসেজ দিবে, সেই মেসেজে যেকোনো 𝗥𝗲𝗮𝗰𝘁𝗶𝗼𝗻 (👍❤️😆) দিন। এরপর 𝗣𝗿𝗲𝗳𝗶𝗫 পরিবর্তন হয়ে যাবে।
» 🔹 𝗣𝗿𝗲𝗳𝗶𝗫 আবার আগের (𝗗𝗲𝗳𝗮𝘂𝗹𝘁) অবস্থায় আনতে: {𝗽}𝘀𝗲𝘁𝗽𝗿𝗲𝗳𝗶𝗫 𝗿𝗲𝘀𝗲𝘁
» উদাহরণ: !𝘀𝗲𝘁𝗽𝗿𝗲𝗳𝗶𝗫 𝗿𝗲𝘀𝗲𝘁
» এতে 𝗰𝗼𝗻𝗳𝗶𝗴.𝗷𝘀𝗼𝗻 এর 𝗗𝗲𝗳𝗮𝘂𝗹𝘁 𝗣𝗿𝗲𝗳𝗶𝗫 আবার সেট হয়ে যাবে।
» ⚠️ নোট:
» • শুধু 𝗕𝗼𝘁 𝗔𝗱𝗺𝗶𝗻 ব্যবহার করতে পারবে।
» • 𝗣𝗿𝗲𝗳𝗶𝗫 পরিবর্তনের আগে 𝗥𝗲𝗮𝗰𝘁𝗶𝗼𝗻 দিয়ে 𝗖𝗼𝗻𝗳𝗶𝗿𝗺 করতে হবে।
» • 𝗣𝗿𝗲𝗳𝗶𝗫 শুধু বর্তমান গ্রুপে পরিবর্তন হবে।
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
`,
	cooldowns: 5
};

module.exports.languages = {
	"en": {
		"successChange": "───────────────\n\n» 𝖢𝗁𝖺𝗇𝗀𝖾𝖽 𝗉ref𝗂𝗫 𝗂𝗇𝗍𝗈: %1\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
		"missingInput": "───────────────\n\n» ⚠️ 𝖯𝗋𝖾𝖿𝗂𝗫 𝗁𝖺𝗏𝖾 𝗇𝗈𝗍 𝗍𝗈 𝖻𝖾 𝖻𝗅𝖺𝗇𝗄\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
		"resetPrefix": "───────────────\n\n» 𝖱𝖾𝗌𝖾𝗍 𝗉𝗋𝖾𝖿𝗂𝗫 𝗍𝗈: %1\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
		"confirmChange": "───────────────\n\n» 💬 𝖠𝗋𝖾 𝗒𝗈𝗎 𝗌𝗎𝗋𝖾 𝗍𝗁𝖺𝗍 𝗒𝗈𝗎 𝗐𝖺𝗇𝗍 𝗍𝗈 𝖼𝗁𝖺𝗇𝗀𝖾 𝗉𝗋𝖾𝖿𝗂𝗫 𝗂𝗇𝗍𝗈: %1\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"
	}
}

module.exports.handleReaction = async function({ api, event, Threads, handleReaction, getText }) {
	try {
		if (event.userID != handleReaction.author) return;
		const { threadID, messageID } = event;
		var data = (await Threads.getData(String(threadID))).data || {};
		data["PREFIX"] = handleReaction.PREFIX;
		await Threads.setData(threadID, { data });
		await global.data.threadData.set(String(threadID), data);
		api.unsendMessage(handleReaction.messageID);
		return api.sendMessage(getText("successChange", handleReaction.PREFIX), threadID, messageID);
	} catch (e) { return console.log(e) }
}

module.exports.run = async ({ api, event, args, Threads , getText }) => {
	if (typeof args[0] == "undefined") return api.sendMessage(getText("missingInput"), event.threadID, event.messageID);
	let prefix = args[0].trim();
	if (!prefix) return api.sendMessage(getText("missingInput"), event.threadID, event.messageID);

	if (prefix == "reset") {
		var data = (await Threads.getData(event.threadID)).data || {};
		data["PREFIX"] = global.config.PREFIX;
		await Threads.setData(event.threadID, { data });
		await global.data.threadData.set(String(event.threadID), data);
		return api.sendMessage(getText("resetPrefix", global.config.PREFIX), event.threadID, event.messageID);
	}

	return api.sendMessage(getText("confirmChange", prefix), event.threadID, (error, info) => {
		global.client.handleReaction.push({
			name: "setprefix",
			messageID: info.messageID,
			author: event.senderID,
			PREFIX: prefix
		})
	})
}

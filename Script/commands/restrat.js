module.exports.config = {
	name: "restart",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
	description: "Restart Bot",
	commandCategory: "system",
	usages: "",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const { threadID, messageID } = event;
	return api.sendMessage(`${global.config.BOTNAME} 𝗕𝗼𝘁 𝗮𝗿𝗲 𝗻𝗼𝘄 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴...`, threadID, () => process.exit(1));
}

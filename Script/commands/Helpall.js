const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
    name: "helpall",
    version: "1.6.0",
    hasPermssion: 0,
    credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    description: "Displays all available commands in one page",
    commandCategory: "system",
    usages: "[No args]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;

    const allCommands = [];

    for (let [name] of commands) {
        if (name && name.trim() !== "") {
            allCommands.push(name.trim());
        }
    }

    allCommands.sort();
    const cmdList = allCommands.map(cmd => `» ➔ ${cmd}`).join("\n");

    const finalText = `───────────────\n\n» 🌟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧\n\n${cmdList}\n\n───────────────\n\n» 🤖 𝗕𝗼𝘁: ${global.config.BOTNAME || "𝗕𝗼𝘁"}\n» 👑 𝗢𝘄𝗻𝗲𝗿: 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍\n» 📦 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${allCommands.length}\n\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍\n\───────────────`;

    const backgrounds = [
        "https://tmpfiles.org/dl/wgw4jPCttNaV/catbox_1783094248390.jpg",
        "https://tmpfiles.org/dl/wcwSjiCqXHgY/catbox_1783094263273.mp4"
    ];

    const selectedBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const extension = selectedBg.split('.').pop().split(/\#|\?/)[0] || "jpg";
    const mediaPath = path.join(__dirname, "cache", `helpall_media_${Date.now()}.${extension}`);

    const callback = () => {
        if (fs.existsSync(mediaPath)) {
            api.sendMessage(
                { body: finalText, attachment: fs.createReadStream(mediaPath) }, 
                threadID, 
                () => fs.unlinkSync(mediaPath), 
                messageID
            );
        }
    };

    request(encodeURI(selectedBg))
        .pipe(fs.createWriteStream(mediaPath))
        .on("close", () => callback())
        .on("error", () => callback());
};

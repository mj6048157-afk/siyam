module.exports.config = {
    name: "dog",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    description: "Xem Boss",
    commandCategory: "Picture",
    usages: "dog [Text]",
    cooldowns: 1
};

module.exports.run = async ({ api, event }) => {
    const axios = require('axios');
    const request = require('request');
    const fs = require("fs");

    try {
        axios.get('https://nekos.life/api/v2/img/woof').then(res => {
            let ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
            let path = __dirname + `/cache/dog.${ext}`;

            let callback = function () {
                api.sendMessage({
                    body: `───────────────\n\n» 🐶 𝗛𝗲𝗿𝗲 𝗶𝘀 𝘆𝗼𝘂𝗿 𝗱𝗼𝗴 𝗽𝗶𝗰𝘁𝘂𝗿𝗲!\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
                    attachment: fs.createReadStream(path)
                }, event.threadID, () => fs.unlinkSync(path), event.messageID);
            };

            request(res.data.url).pipe(fs.createWriteStream(path)).on("close", callback);
        }).catch(err => {
            return api.sendMessage(
                `───────────────\n\n» ❌ 𝗔𝗣𝗜 𝗘𝗿𝗿𝗼𝗿 𝗖𝗮𝗹𝗹 𝗦𝗶𝘆𝗮𝗺. ${err.message}\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
                event.threadID,
                event.messageID
            );
        });
    } catch (err) {
        return api.sendMessage(
            `───────────────\n\n» ❌ 𝗔𝗣𝗜 𝗘𝗿𝗿𝗼𝗿 𝗖𝗮𝗹𝗹 𝗦𝗶𝘆𝐚𝗺. ${err.message}\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
            event.threadID,
            event.messageID
        );
    }
};

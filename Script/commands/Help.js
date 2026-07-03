const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
    name: "help",
    version: "2.5.0",
    hasPermssion: 0,
    credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    description: "Shows all commands with details",
    commandCategory: "system",
    usages: "[command name/page number]",
    cooldowns: 5,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 20
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": "───────────────\n\n» ℹ️ 𝗠𝗢𝗗𝗨𝗟𝗘 𝗜𝗡𝗙𝗢\n\n» 🔖 𝗡𝗮𝗺𝗲: %1\n» 📄 𝗨𝘀𝗮𝗴𝗲: %2\n» 📜 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: %3\n» 🔑 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: %4\n» 👨‍💻 𝗖𝗿𝗲𝗱𝗶𝘁: %5\n» 📂 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: %6\n» ⏳ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: %7s\n\n───────────────\n\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
        "user": "𝗨𝘀𝗲𝗿",
        "adminGroup": "𝗔𝗱𝗺𝗶𝗻 𝗚𝗿𝗼𝘂𝗽",
        "adminBot": "𝗔𝗱𝗺𝗶𝗻 𝗕𝗼𝘁"
    }
};

// 🔹 আপনার দেওয়া ইমেজ এবং ভিডিওর ডিরেক্ট লিংক এখানে যুক্ত করা হয়েছে (র্যান্ডমলি আসবে)
const helpMedia = [
    "https://tmpfiles.org/dl/whwojASUUQzM/catbox_1783091760928.jpg",
    "https://tmpfiles.org/dl/wuwIjjSrUCJU/catbox_1783091746799.mp4"
];

function downloadMedia(callback) {
    // Math.random ব্যবহার করে লিস্ট থেকে সম্পূর্ণ র্যান্ডমলি একটি লিংক নেওয়া হচ্ছে
    const randomUrl = helpMedia[Math.floor(Math.random() * helpMedia.length)];
    const extension = randomUrl.split('.').pop().split(/\#|\?/)[0] || "jpg";
    const filePath = path.join(__dirname, "cache", `help_media.${extension}`);

    request(randomUrl)
        .pipe(fs.createWriteStream(filePath))
        .on("close", () => callback([filePath]));
}

module.exports.handleEvent = function ({ api, event, getText }) {
    const { commands } = global.client;
    const { threadID, messageID, body } = event;

    if (!body || typeof body === "undefined" || body.indexOf("help") != 0) return;  
    const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);  
    if (splitBody.length < 2 || !commands.has(splitBody[1].toLowerCase())) return;  

    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};  
    const command = commands.get(splitBody[1].toLowerCase());  
    const prefix = threadSetting.PREFIX || global.config.PREFIX;  
    
    let perm = "𝗨𝘀𝗲𝗿";
    if (command.config.hasPermssion == 1) perm = "𝗔𝗱𝗺𝗶𝗻 𝗚𝗿𝗼𝘂𝗽";
    if (command.config.hasPermssion == 2) perm = "Anm𝗶𝗻 𝗕𝗼𝘁";

    const detail = getText("moduleInfo",  
        command.config.name,  
        command.config.usages || "𝗡𝗼𝘁 𝗣𝗿𝗼𝘃𝗶𝗱𝗲𝗱",  
        command.config.description || "𝗡𝗼𝘁 𝗣𝗿𝗼𝘃𝗶𝗱𝗲𝗱",  
        perm,  
        command.config.credits || "𝗨𝗻𝗸𝗻𝗼𝘄𝗻",  
        command.config.commandCategory || "𝗨𝗻𝗸𝗻𝗼𝘄𝗻",  
        command.config.cooldowns || 0
    );  

    downloadMedia(files => {  
        const attachments = files.map(f => fs.createReadStream(f));  
        api.sendMessage({ body: detail, attachment: attachments }, threadID, () => {  
            files.forEach(f => fs.unlinkSync(f));  
        }, messageID);  
    });
};

module.exports.run = function ({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;

    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};  
    const prefix = threadSetting.PREFIX || global.config.PREFIX;  

    if (args[0] && commands.has(args[0].toLowerCase())) {  
        const command = commands.get(args[0].toLowerCase());  

        let perm = "𝗨𝘀𝗲𝗿";
        if (command.config.hasPermssion == 1) perm = "𝗔𝗱𝗺𝗶𝗻 𝗚𝗿𝗼𝘂𝗽";
        if (command.config.hasPermssion == 2) perm = "𝗔𝗱𝗺𝗶𝗻 𝗕𝗼𝘁";

        const detailText = getText("moduleInfo",  
            command.config.name,  
            command.config.usages || "𝗡𝗼𝘁 𝗣𝗿𝗼𝘃𝗶𝗱𝗲𝗱",  
            command.config.description || "𝗡𝗼𝘁 𝗣𝗿𝗼𝘃𝗶𝗱𝗲𝗱",  
            perm,  
            command.config.credits || "𝗨𝗻𝗸𝗻𝗼𝘄𝗻",  
            command.config.commandCategory || "𝗨𝗻𝗸𝗻𝗼𝘄𝗻",  
            command.config.cooldowns || 0
        );  

        downloadMedia(files => {  
            const attachments = files.map(f => fs.createReadStream(f));  
            api.sendMessage({ body: detailText, attachment: attachments }, threadID, () => {  
                files.forEach(f => fs.unlinkSync(f));  
            }, messageID);  
        });  
        return;  
    }  

    const arrayInfo = Array.from(commands.keys())
        .filter(cmdName => cmdName && cmdName.trim() !== "")
        .sort();  

    const page = Math.max(parseInt(args[0]) || 1, 1);  
    const numberOfOnePage = 20;  
    const totalPages = Math.ceil(arrayInfo.length / numberOfOnePage);  
    const start = numberOfOnePage * (page - 1);  
    const helpView = arrayInfo.slice(start, start + numberOfOnePage);  

    let msg = helpView.map(cmdName => `» ✪ ${cmdName}`).join("\n");

    const text = `───────────────\n\n» 📜 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧\n\n» 📄 𝗣𝗮𝗴𝗲: ${page}/${totalPages}\n» 🧮 𝗧𝗼𝘁𝗮𝗹: ${arrayInfo.length}\n\n───────────────\n\n${msg}\n\n───────────────\n\n» ⚙️ 𝗣𝗿𝗲𝗳𝗶𝘅: ${prefix}\n» 🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: ${global.config.BOTNAME || "𝗕𝗼𝘁"}\n\n───────────────\n\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

    downloadMedia(files => {  
        const attachments = files.map(f => fs.createReadStream(f));  
        api.sendMessage({ body: text, attachment: attachments }, threadID, () => {  
            files.forEach(f => fs.unlinkSync(f));  
        }, messageID);  
    });  
};

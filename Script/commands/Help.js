const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "help",
    version: "2.5.0",
    hasPermssion: 0,
    credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    description: "𝗦𝗵𝗼𝘄𝘀 𝗮𝗹𝗹 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝘄𝗶𝘁𝗵 𝗱𝗲𝘁𝗮𝗶𝗹𝘀",
    commandCategory: "𝘀𝘆𝘀𝘁𝗲𝗺",
    usages: "[𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗻𝗮𝗺𝗲/𝗽𝗮𝗴𝗲 𝗻𝘂𝗺𝗯𝗲𝗿]",
    cooldowns: 5,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 20
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": "───────────────\n\n» ✨ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 ✨\n\n» 🔖 𝗡𝗮𝗺𝗲: %1\n» 📄 𝗨𝘀𝗮𝗴𝗲: %2\n» 📜 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: %3\n» 🔑 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: %4\n» 👨‍💻 𝗖𝗿𝗲𝗱𝗶𝘁: %5\n» 📂 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: %6\n» ⏳ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: %7𝘀\n\n───────────────\n\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
        "helpList": "[ 𝗧𝗵𝗲𝗿𝗲 𝗮𝗿𝗲 %1 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀. 𝗨𝘀𝗲: \"%2𝗵𝗲𝗹𝗽 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝗡𝗮𝗺𝗲\" 𝘁𝗼 𝘃𝗶𝗲𝘄 𝗺𝗼𝗿𝗲. ]",
        "user": "𝗨𝘀𝗲𝗿",
        "adminGroup": "𝗔𝗱𝗺𝗶𝗻 𝗚𝗿𝗼𝘂𝗽",
        "adminBot": "𝗔𝗱𝗺𝗶𝗻 𝗕𝗼𝘁"
    }
};

// 🔹 আপনার দেওয়া ছবি এবং ভিডিওর ডিরেক্ট লিংক এখানে যুক্ত করা হয়েছে ✅
const helpMedia = [
    "https://tmpfiles.org/dl/wPwQjwrBTQH8/catbox_1783095956591.jpg",
    "https://tmpfiles.org/dl/wuwIjkrnHbSM/catbox_1783095935633.mp4"
];

async function handleMediaSending({ api, event, bodyText }) {
    const { threadID, messageID } = event;
    const randomUrl = helpMedia[Math.floor(Math.random() * helpMedia.length)];
    const ext = path.extname(randomUrl).split('?')[0] || (randomUrl.includes('.mp4') ? '.mp4' : '.jpg');
    const filePath = path.join(__dirname, "cache", `help_media_${Date.now()}${ext}`);

    // প্রথমে একটি সিম্পল ও ক্লিন লোডিং মেসেজ পাঠানো হচ্ছে
    const loadingMsg = "───────────────\n\n» ⏳ 𝗣𝗹𝗲𝗮𝘀𝗲 ";
    
    api.sendMessage(loadingMsg, threadID, async (err, info) => {
        try {
            const response = await axios({
                method: "get",
                url: randomUrl,
                responseType: "stream"
            });

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            writer.on("finish", () => {
                // লোডিং মেসেজটি ডিলিট করে মূল ফাইল পাঠানো হচ্ছে যাতে আটকে না থাকে
                if (info && info.messageID) api.unsendMessage(info.messageID);
                
                api.sendMessage({
                    body: bodyText,
                    attachment: fs.createReadStream(filePath)
                }, threadID, () => {
                    try { fs.unlinkSync(filePath); } catch(e) {}
                }, messageID);
            });

            writer.on("error", () => {
                // কোনো কারণে মিডিয়া ফেইল হলে শুধু টেক্সট চলে যাবে বোট ক্রাশ করবে না
                api.sendMessage(bodyText, threadID, messageID);
            });
        } catch (e) {
            api.sendMessage(bodyText, threadID, messageID);
        }
    });
}

module.exports.handleEvent = async function ({ api, event, getText }) {
    const { commands } = global.client;
    const { threadID, messageID, body } = event;

    if (!body || typeof body === "undefined" || body.indexOf("help") != 0) return;  
    const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);  
    if (splitBody.length < 2 || !commands.has(splitBody[1].toLowerCase())) return;  

    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};  
    const command = commands.get(splitBody[1].toLowerCase());  
    const prefix = threadSetting.PREFIX || global.config.PREFIX;  

    const detail = getText("moduleInfo",  
        command.config.name,  
        command.config.usages || "𝗡𝗼𝘁 𝗣𝗿𝗼𝘃𝗶𝗱𝗲𝗱",  
        command.config.description || "𝗡𝗼𝘁 𝗣𝗿𝗼𝘃𝗶𝗱𝗲𝗱",  
        command.config.hasPermssion,  
        command.config.credits || "𝗨𝗻𝗸𝗻𝗼𝘄𝗻",  
        command.config.commandCategory || "𝗨𝗻𝗸𝗻𝗼𝘄𝗻",  
        command.config.cooldowns || 0
    );  

    await handleMediaSending({ api, event, bodyText: detail });
};

module.exports.run = async function ({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;

    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};  
    const prefix = threadSetting.PREFIX || global.config.PREFIX;  

    if (args[0] && commands.has(args[0].toLowerCase())) {  
        const command = commands.get(args[0].toLowerCase());  

        const detailText = getText("moduleInfo",  
            command.config.name,  
            command.config.usages || "𝗡𝗼𝘁 𝗣𝗿𝗼𝘃𝗶𝗱𝗲𝗱",  
            command.config.description || "𝗡𝗼𝘁 𝗣𝗿𝗼𝘃𝗶𝗱𝗲𝗱",  
            command.config.hasPermssion,  
            command.config.credits || "𝗨𝗻𝗸𝗻𝗼𝘄𝗻",  
            command.config.commandCategory || "𝗨𝗻𝗸𝗻𝗼𝘄𝗻",  
            command.config.cooldowns || 0
        );  

        await handleMediaSending({ api, event, bodyText: detailText });  
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

    const text = `───────────────\n\n» 📜 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧 📜\n\n» 📄 𝗣𝗮𝗴𝗲: ${page}/${totalPages}\n» 🧮 𝗧𝗼𝘁𝗮𝗹: ${arrayInfo.length}\n\n───────────────\n\n${msg}\n\n»👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍\n\n───────────────`;

    await handleMediaSending({ api, event, bodyText: text });  
};

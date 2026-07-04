const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "arrest",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    description: "অ্যারেস্ট মিম জেনারেট করুন।",
    commandCategory: "fun",
    usePrefix: true,
    usages: "[@mention | reply]",
    cooldowns: 5
};

module.exports.run = async function ({ event, api }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;

    let targetID = null;

    // টার্গেট আইডি সিলেক্ট করার লজিক (মেনশন অথবা রিপ্লাই)
    if (mentions && Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
    } else if (messageReply && messageReply.senderID) {
        targetID = messageReply.senderID;
    }

    // যদি কাউকে মেনশন বা রিপ্লাই না করা হয়
    if (!targetID) {
        return api.sendMessage(
            `───────────────\n` +
            `» ⚠️ 𝗨𝗦𝗔𝗚𝗘 𝗔𝗟𝗘𝗥𝗧\n` +
            `» অনুগ্রহ করে কাউকে মেনশন করুন অথবা কারও মেসেজে রিপ্লাই দিন।\n` +
            `───────────────\n` +
            `» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
            threadID,
            messageID
        );
    }

    try {
        // API কল করে লিংক আনা
        const apiList = await axios.get(
            "https://raw.githubusercontent.com/sahu-uhas/SAHU-API/refs/heads/main/API.json"
        );
        const AVATAR_CANVAS_API = apiList.data.AvatarCanvas;

        // মিম তৈরি করার জন্য POST রিকোয়েস্ট
        const res = await axios.post(
            `${AVATAR_CANVAS_API}/api`,
            {
                cmd: "chor",
                senderID,
                targetID
            },
            {
                responseType: "arraybuffer",
                timeout: 30000
            }
        );

        const imgPath = path.join(
            __dirname,
            "cache",
            `chor_${senderID}_${targetID}.png`
        );

        // ইমেজটি ক্যাশে সেভ করা
        fs.writeFileSync(imgPath, res.data);

        // মেসেজ এবং ছবি একসাথে পাঠানো
        return api.sendMessage(
            {
                body: `───────────────\n` +
                      `» 😹 𝗔𝗥𝗥𝗘𝗦𝗧 𝗦𝗨𝗖𝗖𝗘𝗦𝗦\n` +
                      `» হালা মুরগী চোর তোরে আজকে হাতে নাতে ধরছি পালাবি কই 🕵️‍♂️\n` +
                      `» 🤖 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗯𝘆: ─꯭─⃝‌‌𝗦𝗶𝘆𝗮𝗺 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁\n` +
                      `───────────────\n` +
                      `» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
                attachment: fs.createReadStream(imgPath)
            },
            threadID,
            () => {
                // ফাইল সেন্ড হওয়ার পর নিরাপদে রিমুভ করা
                if (fs.existsSync(imgPath)) {
                    fs.unlinkSync(imgPath);
                }
            },
            messageID
        );

    } catch (e) {
        // এরর হ্যান্ডলিং
        return api.sendMessage(
            `───────────────\n` +
            `» ❌ 𝗔𝗣𝗜 𝗘𝗥𝗥𝗢𝗥\n` +
            `» 🌝 এপিআই (API) রেসপন্স দিচ্ছে না।❎ call 🧚সিয়াম ভাই 🛸 +8801789138157\n` +
            `───────────────\n` +
            `» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
            threadID,
            messageID
        );
    }
};

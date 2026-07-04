module.exports.config = {
    name: "autoreact",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    description: "মেসেজে অটো রিঅ্যাক্ট অন বা অফ করুন।",
    commandCategory: "No Prefix",
    cooldowns: 0
};

module.exports.handleEvent = async ({ api, event }) => {
    if (!event || !event.threadID || !event.messageID || event.type !== "message") return;

    const threadData = global.data.threadData.get(parseInt(event.threadID)) || {};
    if (!threadData["autoreact"] || threadData["autoreact"] === false) return;

    const emojis = ["🥰", "😗", "🍂", "💜", "☺️", "🖤", "🤗", "😇", "🌺", "🥹", "😻", "😘", "🫣", "😽", "😺", "👀", "❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🤍", "💫", "💦", "🫶", "🫦", "👄", "🗣️", "💏", "😵", "🥵", "🥶", "🤨", "🤐", "🫡", "🤔"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    api.setMessageReaction(randomEmoji, event.messageID, (err) => {
        if (err) console.error("Error sending reaction:", err);
    }, true);
};

module.exports.run = async ({ api, event, Threads }) => {
    const { threadID, messageID } = event;

    try {
        const threadData = (await Threads.getData(threadID)).data || {};

        if (typeof threadData["autoreact"] === "undefined") {
            threadData["autoreact"] = false;
        }

        const nextStatus = !threadData["autoreact"];

        threadData["autoreact"] = nextStatus;
        await Threads.setData(threadID, { data: threadData });
        global.data.threadData.set(parseInt(threadID), threadData);

        if (threadData["autoreact"] === true) {
            return api.sendMessage(
                `───────────────\n` +
                `» 👋 𝗔𝗨𝗧𝗢-𝗥𝗘𝗔𝗖𝗧 𝗢𝗡\n` +
                `» আসসালামু আলাইকুম! এখন থেকে সমস্ত মেসেজে অটো রিঅ্যাক্ট যাবে। অফ করতে লিখুন: /autoreact off\n` +
                `» 🤖 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗯𝘆: ─꯭─⃝‌‌𝗦𝗶𝘆𝗮𝗺 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁\n` +
                `───────────────\n` +
                `» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
                threadID,
                messageID
            );
        } else {
            return api.sendMessage(
                `───────────────\n` +
                `» 🛑 𝗔𝗨𝗧𝗢-𝗥𝗘𝗔𝗖𝗧 𝗢𝗙𝗙\n` +
                `» অটো রিঅ্যাক্ট সফলভাবে বন্ধ করা হয়েছে।\n` +
                `───────────────\n` +
                `» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
                threadID,
                messageID
            );
        }

    } catch (error) {
        return api.sendMessage(
            `───────────────\n` +
            `» ❌ 𝗘𝗥𝗥𝗢𝗥 𝗔style𝗟𝗘𝗥𝗧\n` +
            `» ❎ একটি সমস্যা হয়েছে। call 😃সিয়াম ভাই👑 +8801789138157/\n` +
            `───────────────\n` +
            `» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
            threadID,
            messageID
        );
    }
};

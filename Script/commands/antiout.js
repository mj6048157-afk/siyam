module.exports.config = {
    name: "antiout",
    version: "1.0.0",
    credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    hasPermssion: 1,
    description: "গ্রুপ থেকে মেম্বারদের লিভ নেওয়া বন্ধ বা চালু করুন।",
    usages: "antiout",
    commandCategory: "system",
    cooldowns: 0
};

module.exports.run = async ({ api, event, Threads }) => {
    try {
        let data = (await Threads.getData(event.threadID)).data || {};
        
        // অ্যান্টি-আউট স্ট্যাটাস পরিবর্তন
        if (typeof data["antiout"] == "undefined" || data["antiout"] == false) {
            data["antiout"] = true;
        } else {
            data["antiout"] = false;
        }
        
        await Threads.setData(event.threadID, { data });
        global.data.threadData.set(parseInt(event.threadID), data);
        
        const status = data["antiout"] ? "𝗢𝗡" : "𝗢𝗙𝗙";
        
        return api.sendMessage(
            `───────────────\n` +
            `» 🛡️ 𝗔𝗡𝗧𝗜-𝗢𝗨𝗧 𝗦𝗧𝗔𝗧𝗨𝗦\n` +
            `» অ্যান্টি-আউট সফলভাবে ${status} করা হয়েছে।\n` +
            `───────────────\n` +
            `» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, 
            event.threadID, event.messageID
        );

    } catch (error) {
        return api.sendMessage(
            `───────────────\n` +
            `» ❌ 𝗘style𝗥𝗥𝗢𝗥 𝗔𝗟𝗘𝗥𝗧\n` +
            `» 🛸 একটি সমস্যা হয়েছে।❎ প্লিজ কল 😊সিয়াম ভাই🧚 +8801789138157\n` +
            `───────────────\n` +
            `» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, 
            event.threadID, event.messageID
        );
    }
};

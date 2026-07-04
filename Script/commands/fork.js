module.exports.config = {
    name: "fork",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    description: "Send YouTube channel and GitHub fork link with intro text",
    commandCategory: "other",
    usages: "fork",
    cooldowns: 0,
};

module.exports.run = async function({ api, event }) {
    const message = 
        `───────────────\n\n` +
        `» 🌟 𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂 𝗔𝗹𝗮𝗶𝗸𝘂𝗺 🌟\n` +
        `সম্মানিত বট ইউজার, আপনি যদি নিজের জন্য প্রফেশনাল বট তৈরি করতে চান, তবে আজই আমাদের সাথে যোগাযোগ করুন।\n\n` +
        `» 👤 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: https://www.facebook.com/profile.php?id=61591371186179\n` +
        `» 💬 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: +𝟴𝟴𝟬𝟭𝟳𝟴𝟵𝟭𝟯𝟴𝟭𝟱𝟳\n\n` +
        `» 🚀 𝗙𝗲𝗮𝘁𝘂𝗿𝗲𝘀:\n` +
        `আপনি চাইলে আমাদের 𝗚𝗼𝗱 𝗕𝗼𝘁 𝘃𝟮, 𝘃𝟯 এবং  wilderness 𝘃𝟱 ভার্সন ব্যবহার করতে পারেন, যাতে রয়েছে 𝟲𝟬𝟬+ এরও বেশি প্রিমিয়াম কম্যান্ড সাপোর্ট।\n\n` +
        `» 🔗 𝗚𝗶𝘁𝗛𝘂𝗯 𝗙𝗼𝗿𝗸 𝗟𝗶𝗻𝗸:\n` +
        `https://github.com/shahadat-sahu/SHAHADAT-CHAT-BOT\n\n` +
        `───────────────\n` +
        `» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

    return api.sendMessage(message, event.threadID, event.messageID);
};

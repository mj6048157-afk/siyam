const path = require("path");

module.exports.config = {
    name: "adminmention",
    version: "4.0.0",
    hasPermssion: 0,
    credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    description: "Bot replies when admin names are detected anywhere inside a message text with 3m cooldown for users",
    commandCategory: "Other",
    usages: "[Triggers / Mentions]",
    cooldowns: 1
};


if (!global.adminMentionCooldown) {
    global.adminMentionCooldown = {};
}

module.exports.handleEvent = function({ api, event }) {
    const { senderID, threadID, messageID, body, mentions } = event;
    
    
    const adminIDs = (global.config.ADMINBOT || []).map(String);
    
    
    if (adminIDs.includes(String(senderID))) return;


    const mentionedIDs = mentions ? Object.keys(mentions).map(String) : [];
    let isTriggered = adminIDs.some(adminID => mentionedIDs.includes(adminID));

 
    if (!isTriggered && body && typeof body !== "undefined") {
        
        const lowerBody = body.toLowerCase();
        
        const textTriggers = [
            "সিয়াম",
            "সিয়াম ভাই",
            "হৃদয়",
            "হৃদয় ভাই",
            "@পি্ঁচ্চি্ঁ রি্ঁদ্ঁয়্ঁ ত্যা্ঁহ্ঁ", 
            "@rj siyam",
            "siyam"
        ];
        
        
        isTriggered = textTriggers.some(trigger => lowerBody.includes(trigger));
    }

    
    if (isTriggered) {
        const currentTime = Date.now();
        const cooldownTime = 3 * 60 * 1000; // ৩ মিনিট মিলিসেকেন্ডে
        const userKey = `${senderID}_${threadID}`;

  
        if (global.adminMentionCooldown[userKey]) {
            const timePassed = currentTime - global.adminMentionCooldown[userKey];
            if (timePassed < cooldownTime) {
                return; 
            }
        }

        
        global.adminMentionCooldown[userKey] = currentTime;

        
        const replies = [
            "ডাকাডাকি করিস না বস 𝗥𝗝 𝘀𝗶𝘆𝗮𝗺 ব্যস্ত আছে 😒😌",
            "বস 𝗥𝗝 𝘀𝗶𝘆𝗮𝗺 এর কাছে এক আবালে মেনশন দিছে 😑😃",
            "যেভাবে মেনশন দিতাচত মনে হয় তোর গার্লফ্রেন্ডটারে, আমার বস 𝗥𝗝 𝘀𝗶𝘆𝗮𝗺 কে দিয়া দিবি 🫥😒",
            "বস 𝗥𝗝 𝘀𝗶𝘆𝗮𝗺 এক পাগল ছাগল আপনাকে ডাকতেছে 🐸🫵",
            "বস 𝗥𝗝 𝘀𝗶𝘆𝗮𝗺 এক হালায় আপনার নাম ধরছে, আপনি শুধু একবার আদেশ করুন, আজকে হালার নানিরে চমলক্ক করে দিমু 😑🥴",
            "মেনশন না দিয়া 𝗕𝗼𝘀𝘀 𝗥𝗝 𝘀𝗶𝘆𝗮𝗺 কে একটা 𝗴𝗶𝗿𝗹𝗳𝗿𝗶𝗲𝗻𝗱 খুজে দে 🙃😮💨",
            "মাইয়া হলে বস 𝗥𝗝 𝘀𝗶𝘆𝗮𝗺 এর ইনবক্স এ যাও 😗😁",
            "𝗕𝗼𝘀𝘀 𝗥𝗝 𝘀𝗶𝘆𝗮𝗺 এখন ব্যস্ত আছে, কিছু বলতে হলে ইনবক্স এ গিয়া বল",
            "বস 𝗥𝗝 𝘀𝗶𝘆𝗮𝗺 এখন আমার সাথে মিটিং এ আছে, মেনশন দিস না 🙂",
            "𝗕𝗼𝘀𝘀 𝗥𝗝 𝘀𝗶𝘆𝗮𝗺 এখন ব্যস্ত আছে, কি বলবি আমাকে বল",
            "মেনশন না দিয়া বস 𝗥𝗝 𝘀𝗶𝘆𝗮𝗺 বল বস 🥵💋",
            "কিরে তোর এতো সাহস আমার বস 𝗥𝗝 𝘀𝗶𝘆𝗮𝗺 এর নাম ধরিস 😾🫵",
            "এতো মেনশন না দিয়া তোর গার্লফ্রেন্ডটারে বস 𝗥𝗝 𝘀𝗶𝘆𝗮𝗺 কে দিয়া দে 😹🐸",
            "এইভাবে 𝗕𝗼𝘀𝘀 𝗥𝗝 𝘀𝗶𝘆𝗮𝗺 কে মেনশন করতাস, না জানি তুই প্রেমে পড়ছোস কিনা 😼❤️"
        ];

        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        
        const finalMessage = `───────────────\n\n» 🐸 ${randomReply}\n\n───────────────\n\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

        return api.sendMessage(finalMessage, threadID, messageID);
    }
};

module.exports.run = async function() {};

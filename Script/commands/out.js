module.exports.config = {
  name: "out",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Leave group with dynamic stats",
  commandCategory: "Admin",
  usages: "out [id]",
  cooldowns: 10,
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const config = global.config || {};
  const botAdmins = config.ADMINBOT || [];
  if (!botAdmins.includes(senderID)) {
    return api.sendMessage(
`───────────────
» 👑 ❌ 𝗢𝗻𝗹𝘆 𝗕𝗼𝘁 𝗔𝗱𝗺𝗶𝗻𝘀 
» 😂 𝗰𝗮𝗻 𝘂𝘀𝗲 𝘁𝗵𝗶𝘀 𝗰𝗼𝗺𝗺𝗮𝗻𝗱.
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }

  const targetThreadID = args[0] && !isNaN(args[0]) ? args[0] : threadID;

  try {
    const threadInfo = await api.getThreadInfo(targetThreadID);
    
    // প্রতিটি গ্রুপের রিয়েল ডেটা লাইভ কাউন্ট করা হচ্ছে
    const memberCount = threadInfo.participantIDs ? threadInfo.participantIDs.length : 0;
    const adminCount = threadInfo.adminIDs ? threadInfo.adminIDs.length : 0;
    const messageCount = threadInfo.messageCount || 0;

    const leaveMessage = 
`───────────────
» 👑 𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂 𝗔𝗹𝗮𝗶𝗸𝘂𝗺
» 😊 আমি 
» 🧚 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧 🧚 
» 👑 আমাকে বেবহার করার জন্য 
» 🫶 ধন্যবাদ গ্রুপ থেকে বাহির 
» 🥺 হচ্ছি আলবিদা...😔👋
» 🪄 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${memberCount}
» 🛸 𝗔𝗱𝗺𝗶𝗻𝘀: ${adminCount}
» 🎥 𝗠𝗲𝘀𝘀𝗮𝗴𝗲𝘀: ${messageCount}
» 👋 𝗚𝗼𝗼𝗱𝗯𝘆𝗲!🫶👋
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

    await api.sendMessage(leaveMessage, targetThreadID);
    return api.removeUserFromGroup(api.getCurrentUserID(), targetThreadID);

  } catch (err) {
    return api.sendMessage(
`───────────────
» 👑 ❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝗼𝗿 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗧𝗵𝗿𝗲𝗮𝗱 𝗜𝗗.
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }
};

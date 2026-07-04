const chalk = require('chalk');

module.exports.config = {
  name: "join",
  version: "2.1.0",
  hasPermssion: 2,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Join one or all bot groups using number or 'add all'",
  commandCategory: "system",
  usages: "",
  cooldowns: 5
};

module.exports.onLoad = () => {
  console.log(chalk.bold.hex("#00c300")(" 𝗝𝗢𝗜𝗡 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗢𝗔𝗗𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬✅"));
};

module.exports.handleReply = async function({ api, event, handleReply, Threads }) {
  const { threadID, messageID, senderID, body } = event;
  const { ID } = handleReply;

  // চেক করা হচ্ছে ব্যবহারকারী মেইন অ্যাডমিন কি না (config.json থেকে পারমিশন)
  const config = global.config || {};
  const adminIDs = config.ADMINBOT || [];
  if (!adminIDs.includes(senderID)) {
    return api.sendMessage(
`───────────────
» ❌ 𝗬𝗼𝘂 𝗱𝗼 𝗻𝗼𝘁 𝗵𝗮𝘃𝗲 𝗽𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻 𝘁𝗼 𝘂𝘀𝗲 𝘁𝗵𝗶𝘀 𝗿𝗲𝗽𝗹𝘆.
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }

  if (!body) {
    return api.sendMessage(
`───────────────
» ❗ 𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗻𝘂𝗺𝗯𝗲𝗿𝘀 (𝗲.𝗴. 𝟭 𝟮 𝟯) 𝗼𝗿 "𝗮𝗱𝗱 𝗮𝗹𝗹" 𝘁𝗼 𝗷𝗼𝗶𝗻 𝗮𝗹𝗹.
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }

  const input = body.trim().toLowerCase();
  let selectedIndexes = [];

  if (input === "add all") {
    selectedIndexes = ID.map((_, index) => index);
  } else {
    selectedIndexes = body.split(/\s+/).map(x => parseInt(x.trim()) - 1).filter(i => !isNaN(i) && i >= 0 && i < ID.length);
    if (selectedIndexes.length === 0) {
      return api.sendMessage(
`───────────────
» ⭕ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗶𝗻𝗽𝘂𝘁. 𝗨𝘀𝗲 𝗻𝘂𝗺𝗯𝗲𝗿𝘀 (𝟭 𝟮 𝟯) 𝗼𝗿 '𝗮𝗱𝗱 𝗮𝗹𝗹'.
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
    }
  }

  let added = 0, skipped = 0, failed = 0;

  for (const i of selectedIndexes) {
    try {
      const threadIDToJoin = ID[i];
      let threadInfo;
      try {
        threadInfo = await Threads.getInfo(threadIDToJoin);
      } catch (e) {
        threadInfo = await api.getThreadInfo(threadIDToJoin);
      }
      
      const participantIDs = threadInfo.participantIDs || [];
      const approvalMode = threadInfo.approvalMode || false;
      const threadAdminIDs = threadInfo.adminIDs || [];

      if (participantIDs.includes(senderID)) {
        skipped++;
        continue;
      }

      await api.addUserToGroup(senderID, threadIDToJoin);

      const threadName = threadInfo.threadName || `𝗚𝗿𝗼𝘂𝗽 ${i + 1}`;
      if (approvalMode && !threadAdminIDs.some(ad => ad.id == api.getCurrentUserID())) {
        api.sendMessage(
`───────────────
» 📨 𝗣𝗲𝗻𝗱𝗶𝗻𝗴 𝗮𝗽𝗽𝗿𝗼𝘃𝗮𝗹 𝗶𝗻 "${threadName}".
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID);
      } else {
        api.sendMessage(
`───────────────
» ✅ 𝗔𝗱𝗱𝗲𝗱 𝘁𝗼 "${threadName}".
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID);
      }

      added++;
    } catch (err) {
      failed++;
      api.sendMessage(
`───────────────
» ❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗮𝗱𝗱 𝘁𝗼 #${i + 1}: ${err.message}
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID);
    }
  }

  return api.sendMessage(
`───────────────
» 📊 𝗝𝗼𝗶𝗻 𝗥𝗲𝗽𝗼𝗿𝘁:
✅ 𝗔𝗱𝗱𝗲𝗱: ${added}
⏩ 𝗔𝗹𝗿𝗲𝗮𝗱𝘆 𝗶𝗻 𝗴𝗿𝗼𝘂𝗽: ${skipped}
❌ 𝗙𝗮𝗶𝗹𝗲𝗱: ${failed}
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID);
};

module.exports.run = async function({ api, event, Threads }) {
  const { threadID, messageID, senderID } = event;
  
  // মেইন অ্যাডমিন পারমিশন চেক (config.json থেকে)
  const config = global.config || {};
  const adminIDs = config.ADMINBOT || [];
  if (!adminIDs.includes(senderID)) {
    return api.sendMessage(
`───────────────
» ❌ 𝗢𝗻𝗹𝘆 𝗕𝗼𝘁 𝗔𝗱𝗺𝗶𝗻 𝗰𝗮𝗻 𝘂𝘀𝗲 𝘁𝗵𝗶𝘀 𝗰𝗼𝗺𝗺𝗮𝗻𝗱.
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }

  const allThreads = await Threads.getAll();
  let msg = `───────────────\n» 🔰 𝗝𝗢𝗜𝗡 𝗕𝗢𝗫 𝗟𝗜𝗦𝗧 🔰\n\n`;
  const ID = [];

  allThreads.forEach((t, i) => {
    const name = t.threadInfo ? t.threadInfo.threadName : "𝗨𝗻𝗸𝗻𝗼𝘄𝗻 𝗚𝗿𝗼𝘂𝗽";
    msg += `${i + 1}. ${name}\n`;
    ID.push(t.threadID);
  });

  msg += `\n✏️ 𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗺𝘂𝗹𝘁𝗶𝗽𝗹𝗲 𝗻𝘂𝗺𝗯𝗲𝗿𝘀 (𝗲.𝗴. 𝟭 𝟯 𝟱) 𝗼𝗿 𝘁𝘆𝗽𝗲 '𝗮𝗱𝗱 𝗮𝗹𝗹' 𝘁𝗼 𝗷𝗼𝗶𝗻 𝗮𝗹𝗹 𝗴𝗿𝗼𝘂𝗽𝘀.\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

  return api.sendMessage(msg, threadID, (err, info) => {
    if (!err) {
      global.client.handleReply.push({
        name: module.exports.config.name,
        author: senderID,
        messageID: info.messageID,
        ID
      });
    }
  }, messageID);
};

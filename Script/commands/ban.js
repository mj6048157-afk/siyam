module.exports.config = {
  name: "ban",
  version: "2.4.0",
  hasPermssion: 2,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Ban or unban a user directly, works on reply too",
  commandCategory: "group",
  usages: "[ban/unban] [UID/@tag/reply]",
  cooldowns: 5
};

module.exports.run = async ({ event, api, args, Users }) => {
  const { threadID, messageID, messageReply } = event;

  // 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗙𝗼𝗿𝗺𝗮𝘁𝘁𝗶𝗻𝗴 𝗛𝗲𝗹𝗽𝗲𝗿
  const formatMsg = (text) => {
    return `───────────────\n\n» ${text}\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;
  };

  const command = event.body.split(" ")[0].slice(global.config.PREFIX.length).toLowerCase();
  let targetID;

  if (messageReply) {
    targetID = messageReply.senderID;
  } else if (Object.keys(event.mentions).length > 0) {
    targetID = Object.keys(event.mentions)[0];
  } else {
    targetID = args[0];
  }

  if (!targetID) {
    const usageMsg = `⚠️ 𝗨𝘀𝗮𝗴𝗲:\n» ${global.config.PREFIX}𝗯𝗮𝗻 <𝗨𝗜𝗗/@𝘁𝗮𝗴/𝗿𝗲𝗽𝗹𝘆>\n» ${global.config.PREFIX}𝘂𝗻𝗯𝗮𝗻 <𝗨𝗜𝗗/@𝘁𝗮𝗴/𝗿𝗲𝗽𝗹𝘆>`;
    return api.sendMessage(formatMsg(usageMsg), threadID, messageID);
  }

  if (isNaN(targetID)) {
    return api.sendMessage(formatMsg("❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗨𝗜𝗗!"), threadID, messageID);
  }

  if (!global.data.allUserID.includes(targetID)) {
    return api.sendMessage(formatMsg("🔍 𝗨𝘀𝗲𝗿 𝗜𝗗 𝘆𝗼𝘂 𝗶𝗺𝗽𝗼𝗿𝘁 𝗱𝗼𝗲𝘀𝗻'𝘁 𝗲𝘅𝗶𝘀𝘁 𝗶𝗻 𝗱𝗮𝘁𝗮𝗯𝗮𝘀𝗲"), threadID, messageID);
  }

  const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);

  // 𝗕𝗮𝗻 𝗟𝗼𝗴𝗶𝗰
  if (command === "ban") {
    try {
      let data = (await Users.getData(targetID)).data || {};
      data.banned = true;
      await Users.setData(targetID, { data });
      global.data.userBanned.set(targetID, { reason: null, dateAdded: new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" }) });
      
      const successBan = `🚫 [ 𝗕𝗮𝗻 𝗨𝘀𝗲𝗿 ] 𝗕𝗮𝗻𝗻𝗲𝗱 𝘂𝘀𝗲𝗿: ${targetID} - ${nameTarget}`;
      return api.sendMessage(formatMsg(successBan), threadID, messageID);
    } catch {
      return api.sendMessage(formatMsg("❌ [ 𝗕𝗮𝗻 𝗨𝘀𝗲𝗿 ] 𝗖𝗮𝗻'𝘁 𝗱𝗼 𝘄𝗵𝗮𝘁 𝘆𝗼𝘂 𝗿𝗲𝗾𝘂𝗲𝘀𝘁"), threadID, messageID);
    }
  }

  // 𝗨𝗻𝗯𝗮𝗻 𝗟𝗼𝗴𝗶𝗰
  if (command === "unban") {
    try {
      let data = (await Users.getData(targetID)).data || {};
      if (!data.banned) {
        const notBannedMsg = `ℹ️ [ 𝗨𝗻𝗯𝗮𝗻 𝗨𝘀𝗲𝗿 ] 𝗨𝘀𝗲𝗿 ${targetID} - ${nameTarget} 𝗶𝘀 𝗻𝗼𝘁 𝗯𝗮𝗻𝗻𝗲𝗱.`;
        return api.sendMessage(formatMsg(notBannedMsg), threadID, messageID);
      }

      data.banned = false;
      await Users.setData(targetID, { data });
      global.data.userBanned.delete(targetID);

      const successUnban = `✅ [ 𝗨𝗻𝗯𝗮𝗻 𝗨𝘀𝗲𝗿 ] 𝗨𝗻𝗯𝗮𝗻𝗻𝗲𝗱 𝘂𝘀𝗲𝗿: ${targetID} - ${nameTarget}`;
      return api.sendMessage(formatMsg(successUnban), threadID, messageID);
    } catch {
      return api.sendMessage(formatMsg("❌ [ 𝗨𝗻𝗯𝗮𝗻 𝗨𝘀𝗲𝗿 ] 𝗖𝗮𝗻'𝘁 𝗱𝗼 𝘄𝗵𝗮𝘁 𝘆𝗼𝘂 𝗿𝗲𝗾𝘂𝗲𝘀𝘁"), threadID, messageID);
    }
  }

  // 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗙𝗮𝗹𝗹𝗯𝗮𝗰𝗸
  const invalidCmd = `⚠️ 𝗪𝗿𝗼𝗻𝗴 𝗶𝗻𝗽𝘂𝘁!\n» 𝗨𝘀𝗲 ${global.config.PREFIX}𝗯𝗮𝗻 𝗼𝗿 ${global.config.PREFIX}𝘂𝗻𝗯𝗮𝗻`;
  return api.sendMessage(formatMsg(invalidCmd), threadID, messageID);
};

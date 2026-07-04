module.exports.config = {
  name: 'allbox',
  version: '1.0.0',
  credits: '𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍',
  hasPermssion: 2,
  description: '[Ban/Unban/Del/Remove] List[Data] thread The bot has joined in.',
  commandCategory: 'Admin',
  usages: '[page number/all]',
  cooldowns: 5
};

module.exports.handleReply = async function ({ api, event, args, Threads, handleReply }) {
  const { threadID, messageID } = event;
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dhaka").format("HH:mm:ss L");
  var arg = event.body.split(" ");
  var idgr = handleReply.groupid[arg[1] - 1];
  var groupName = handleReply.groupName[arg[1] - 1];

  if (!idgr) {
    return api.sendMessage(`───────────────\n» ⚠️ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝘀𝗲𝗿𝗶𝗮𝗹 𝗻𝘂𝗺𝗯𝗲𝗿! 𝗣𝗹𝗲𝗮𝘀𝗲 𝗰𝗵𝗼𝗼𝘀𝗲 𝗰𝗼𝗿𝗿𝗲𝗰𝘁𝗹𝘆.\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }

  switch (handleReply.type) {
    case "reply":
      {
        if (arg[0].toLowerCase() == "ban") {
          const data = (await Threads.getData(idgr)).data || {};
          data.banned = 1;
          data.dateAdded = time;
          await Threads.setData(idgr, { data });
          global.data.threadBanned.set(idgr, { dateAdded: data.dateAdded });
          
          api.sendMessage(`───────────────\n» ⚠️ 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻\n» This group has been banned from using the bot.\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, idgr);
          return api.sendMessage(`───────────────\n» 👑 𝗕𝗮𝗻 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹\n» 🔷 𝗚𝗿𝗼𝘂𝗽: ${groupName}\n» 🔰 𝗧𝗜𝗗: ${idgr}\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, () => api.unsendMessage(handleReply.messageID));
        }

        if (arg[0].toLowerCase() == "unban" || arg[0].toLowerCase() == "ub") {
          const data = (await Threads.getData(idgr)).data || {};
          data.banned = 0;
          data.dateAdded = null;
          await Threads.setData(idgr, { data });
          global.data.threadBanned.delete(idgr);
          
          api.sendMessage(`───────────────\n» 🔊 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻\n» Ban lifted! Everyone can use the bot now.\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, idgr);
          return api.sendMessage(`───────────────\n» ✨ 𝗨𝗻𝗯𝗮𝗻 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹\n» 🔷 𝗚𝗿𝗼𝘂𝗽: ${groupName}\n» 🔰 𝗧𝗜𝗗: ${idgr}\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, () => api.unsendMessage(handleReply.messageID));
        }

        if (arg[0].toLowerCase() == "del") {
          const data = (await Threads.getData(idgr)).data || {};
          await Threads.delData(idgr, { data });
          return api.sendMessage(`───────────────\n» 🗑️ 𝗗𝗲𝗹 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹\n» 🔷 𝗚𝗿𝗼𝘂𝗽: ${groupName}\n» 🔰 𝗧𝗜𝗗: ${idgr}\n» Data deleted successfully!\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, () => api.unsendMessage(handleReply.messageID));
        }

        if (arg[0].toLowerCase() == "out") {
          api.sendMessage(`───────────────\n» 🏃‍♂️ 𝗕𝗼𝘁 𝗶𝘀 𝗹𝗲𝗮𝘃𝗶𝗻𝗴 𝘁𝗵𝗶𝘀 𝗴𝗿𝗼𝘂𝗽...\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, idgr, () => {
            api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr, () => {
              return api.sendMessage(`───────────────\n» 🚪 𝗢𝘂𝘁 𝗦𝘂𝗰𝗰𝗲𝘀𝘀\n» 🔷 𝗚𝗿𝗼𝘂𝗽: ${groupName}\n» 🔰 𝗧𝗜𝗗: ${idgr}\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, () => api.unsendMessage(handleReply.messageID));
            });
          });
        }
      }
      break;
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  var threadList = [];
  var data;

  try {
    data = await api.getThreadList(100, null, ["INBOX"]) || [];
  } catch (e) {
    console.log(e);
    return api.sendMessage("───────────────\n» ❌ 𝗘𝗿𝗿𝗼𝗿 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝘁𝗵𝗿𝗲𝗮𝗱 𝗹𝗶𝘀𝘁.\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍", threadID, messageID);
  }

  for (const thread of data) {
    if (thread.isGroup == true) {
      threadList.push({ threadName: thread.name || "No Name Group", threadID: thread.threadID, messageCount: thread.messageCount });
    }
  }

  threadList.sort((a, b) => b.messageCount - a.messageCount);

  var groupid = [];
  var groupName = [];
  var page = parseInt(args[0]) || 1;
  if (page < 1) page = 1;
  var limit = (args[0] == "all") ? threadList.length : 10;
  var numPage = Math.ceil(threadList.length / 10);

  var msg = "───────────────\n» 🎭 𝗕𝗢𝗧 𝗚𝗥𝗢𝗨𝗣 𝗟𝗜𝗦𝗧 🎭\n───────────────\n";

  let start = (args[0] == "all") ? 0 : 10 * (page - 1);
  let end = (args[0] == "all") ? threadList.length : start + limit;

  for (var i = start; i < end; i++) {
    if (i >= threadList.length) break;
    let group = threadList[i];
    msg += `» ${i + 1}. ${group.threadName}\n» 🔰 𝗧𝗜𝗗: ${group.threadID}\n» 💌 𝗠𝘀𝗴: ${group.messageCount}\n\n`;
    groupid.push(group.threadID);
    groupName.push(group.threadName);
  }

  msg += `───────────────\n» 📄 𝗣𝗮𝗴𝗲: ${args[0] == "all" ? "1/1" : page + "/" + numPage}\n» ℹ️ 𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵: [𝗢𝘂𝘁 / 𝗕𝗮𝗻 / 𝗨𝗻𝗯𝗮𝗻 / 𝗗𝗲𝗹] + 𝘀𝗲𝗿𝗶𝗮𝗹\n» 🤖 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗯𝘆: ─꯭─⃝‌‌𝗦𝗶𝘆𝗮𝗺 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

  if (threadList.length == 0) {
    return api.sendMessage("───────────────\n» 🚫 𝗧𝗵𝗲𝗿𝗲 𝗶𝘀 𝗰𝘂𝗿𝗿𝗲𝗻𝘁𝗹𝘆 𝗻𝗼 𝗴𝗿𝗼𝘂𝗽!\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍", threadID, messageID);
  }

  api.sendMessage(msg, threadID, (e, info) => {
    if (!e) {
      global.client.handleReply.push({
        name: this.config.name,
        author: event.senderID,
        messageID: info.messageID,
        groupid,
        groupName,
        type: 'reply'
      });
    }
  }, messageID);
};

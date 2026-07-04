module.exports.config = {
  name: "bn",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  usePrefix: false,
  description: "Translate text to Bengali",
  commandCategory: "media",
  usages: "[Text] or reply to a message",
  cooldowns: 5,
  dependencies: {
    "request": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const request = global.nodemodule["request"];
  const { threadID, messageID, type, messageReply } = event;
  
  let translateThis = args.join(" ").trim();

  if (type === "message_reply") {
    translateThis = messageReply.body;
  }

  if (!translateThis) {
    return api.sendMessage(
      `───────────────\n» ⚠️ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘀𝗼𝗺𝗲 𝘁𝗲𝗅𝘁!\n» 𝗨𝘀𝗮𝗴𝗲: /𝗯𝗻 [𝘁𝗲𝘅𝘁] 𝗼𝗿 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮 𝗺𝗲𝘀𝘀𝗮𝗴𝗲.\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
      threadID,
      messageID
    );
  }

  const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=bn&dt=t&q=${encodeURIComponent(translateThis)}`;

  return request(apiUrl, (err, response, body) => {
    if (err) {
      return api.sendMessage(
        `───────────────\n» ❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗵𝗮𝘀 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝗱𝘂𝗿𝗶𝗻𝗴 𝘁𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗶𝗼𝗻.\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        threadID,
        messageID
      );
    }

    try {
      const retrieve = JSON.parse(body);
      let text = '';
      retrieve[0].forEach(item => {
        if (item[0]) text += item[0];
      });

      const fromLang = retrieve[2] ? retrieve[2].toUpperCase() : "𝗔𝗨𝗧𝗢";

      const formattedMsg = `───────────────\n» 🌐 𝗧𝗥𝗔𝗡𝗦𝗟𝗔𝗧𝗜𝗢𝗡 𝗦𝗨𝗖𝗖𝗘𝗦𝗦\n» 📥 𝗙𝗿𝗼𝗺: ${fromLang} ➜ 🇧🇩 𝗕𝗡\n» 📝 𝗥𝗲𝘀𝘂𝗹𝘁: ${text}\n» 🤖 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗯𝘆: ─꯭─⃝‌‌𝗦𝗶𝘆𝗮𝗺 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

      api.sendMessage(formattedMsg, threadID, messageID);
    } catch (e) {
      api.sendMessage(
        `───────────────\n» ❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗽𝗮𝗿𝘀𝗲 𝘁𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗶𝗼𝗻 𝗱𝗮𝘁𝗮.\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        threadID,
        messageID
      );
    }
  });
};

module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "1.0.2",
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Welcome message with optional image/video",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const paths = [
    join(__dirname, "cache", "joinGif"),
    join(__dirname, "cache", "randomgif")
  ];
  for (const path of paths) {
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
  }
};

module.exports.run = async function({ api, event }) {
  const fs = require("fs");
  const path = require("path");
  const { threadID } = event;
  
  const botPrefix = global.config.PREFIX || "/";
  const botName = global.config.BOTNAME || "চ্ঁলে্ঁ এ্ঁসে্ঁছি্ঁ ─꯭─⃝‌‌🧚𝗦𝗶𝘆𝗮𝗺 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁─⃝‌‌🧚 এঁখঁনঁ তোঁমাঁদেঁরঁ সাঁথেঁ আঁড্ডাঁ দিঁবঁ..!"";

  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    await api.changeNickname(`[ ${botPrefix} ] • ${botName}`, threadID, api.getCurrentUserID());

    const randomGifPath = path.join(__dirname, "cache", "randomgif");
    const allFiles = fs.readdirSync(randomGifPath).filter(file =>
      [".mp4", ".jpg", ".png", ".jpeg", ".gif", ".mp3"].some(ext => file.endsWith(ext))
    );

    const selected = allFiles.length > 0 
      ? fs.createReadStream(path.join(randomGifPath, allFiles[Math.floor(Math.random() * allFiles.length)])) 
      : null;

    const messageBody = `───────────────\n\n» 👋 আসসালামু আলাইকুম\n\n» 𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡 𝐟𝐨𝐫 𝐚𝐝𝐝𝐢𝐧𝐠 𝐦𝐞 𝐭𝐨 𝐲𝐨𝐮𝐫 𝐠𝐫𝐨𝐮𝐩! ❤️\n\n» 𝐓𝐨 𝐯𝐢𝐞𝐰 𝐚𝐧𝐲 𝐜𝐨𝐦𝐦𝐚𝐧𝐝:\n» ${botPrefix}𝐇𝐞𝐥𝐩\n» ${botPrefix}𝐈𝐧𝐟𝐨\n» ${botPrefix}𝐀𝐝𝐦𝐢𝐧\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

    if (selected) {
      api.sendMessage({ body: messageBody, attachment: selected }, threadID);
    } else {
      api.sendMessage(messageBody, threadID);
    }
    return;
  }

  try {
    const { createReadStream, readdirSync } = global.nodemodule["fs-extra"];
    let { threadName, participantIDs } = await api.getThreadInfo(threadID);
    const threadData = global.data.threadData.get(parseInt(threadID)) || {};
    let mentions = [], nameArray = [], memLength = [], i = 0;

    for (let id in event.logMessageData.addedParticipants) {
      const userName = event.logMessageData.addedParticipants[id].fullName;
      nameArray.push(userName);
      mentions.push({ tag: userName, id });
      memLength.push(participantIDs.length - i++);
    }
    memLength.sort((a, b) => a - b);

    let msg = (typeof threadData.customJoin === "undefined") 
      ? `───────────────\n\n» 👋 আসসালামু আলাইকুম\n\n» হাসি, মজা, ঠাট্টায় গড়ে উঠুক চিরস্থায়ী বন্ধুত্বের বন্ধন। 🥰\n» আশা করি আপনি এখানে সবার সাথে মিলেমিশে আড্ডা দেবেন। 😍\n» গ্রুপ এডমিনের কথা শুনবেন ও রুলস মেনে চলবেন। ✅\n\n» প্রিয় {name},\n» আপনি এই গ্রুপের {soThanhVien} নম্বর মেম্বার!\n\n» গ্রুপ: {threadName}\n\n» 💌 🌺 𝐖 𝐄 𝐋 𝐂 𝐎 𝐌 𝐄 🌺 💌\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍` 
      : threadData.customJoin;

    msg = msg
      .replace(/\{name}/g, nameArray.join(', '))
      .replace(/\{soThanhVien}/g, memLength.join(', '))
      .replace(/\{threadName}/g, threadName);

    const joinGifPath = path.join(__dirname, "cache", "joinGif");
    const files = readdirSync(joinGifPath).filter(file =>
      [".mp4", ".jpg", ".png", ".jpeg", ".gif", ".mp3"].some(ext => file.endsWith(ext))
    );
    const randomFile = files.length > 0 
      ? createReadStream(path.join(joinGifPath, files[Math.floor(Math.random() * files.length)])) 
      : null;

    return api.sendMessage(
      randomFile ? { body: msg, attachment: randomFile, mentions } : { body: msg, mentions },
      threadID
    );
  } catch (e) {
    console.error(e);
  }
};

module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Thông báo bot hoặc người rời khỏi nhóm",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.run = async function({ api, event, Users, Threads }) {
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const { threadID } = event;

  const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);

  const type = (event.author == event.logMessageData.leftParticipantFbId)
    ? "তোর সাহস কম না গ্রুপের এডমিনের পারমিশন ছাড়া তুই লিভ নিস 🤬"
    : "তোমার এই গ্রুপে থাকার কোনো যোগ্যতা নেই ছাগল 😡 তাই তোমাকে লাথি মেরে গ্রুপ থেকে বের করে দেওয়া হলো 🤪 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗥𝗘𝗠𝗢𝗩𝗘 🤧";

  const path = join(__dirname, "Shahadat", "leaveGif");
  const gifPath = join(path, `leave1.gif`);

  if (!existsSync(path)) mkdirSync(path, { recursive: true });

  let mainText = "";
  if (event.author == event.logMessageData.leftParticipantFbId) {
    mainText = `ইস ${name}, ${type}`;
  } else {
    mainText = `${name}, ${type}`;
  }


  const formattedMsg = `───────────────\n\n» 🏃‍♂️ ${mainText}\n\n───────────────\n» ─꯭─⃝‌‌🧚𝗦𝗶𝘆𝗮𝗺 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁─⃝‌‌🧚`;

  const formPush = existsSync(gifPath)
    ? { body: formattedMsg, attachment: createReadStream(gifPath) }
    : { body: formattedMsg };

  return api.sendMessage(formPush, threadID);
};

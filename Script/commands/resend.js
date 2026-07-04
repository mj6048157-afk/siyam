const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "resend",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Auto resend removed messages",
  commandCategory: "general",
  cooldowns: 0,
  hide: true
};

module.exports.handleEvent = async function ({ event, api, Users }) {
  const { threadID, messageID, senderID, body, attachments, type } = event;

  if (!global.logMessage) global.logMessage = new Map();
  if (!global.data.botID) global.data.botID = api.getCurrentUserID();

  const data = global.data.threadData.get(threadID) || {};
  const prefix = global.config.PREFIX;

  if ((data.resend === undefined || data.resend !== false) && senderID !== global.data.botID) {

    if (type !== "message_unsend") {
      global.logMessage.set(messageID, { msgBody: body, attachment: attachments });
    }

    if (type === "message_unsend") {
      const msg = global.logMessage.get(messageID);
      if (!msg) return;
      const userName = await Users.getNameUser(senderID);

      if (!msg.attachment || msg.attachment.length === 0) {
        return api.sendMessage(
          `───────────────\n\n» ⚠️ সবাই দেখে নাও\n${userName} রিমুভ করেছে:\n${msg.msgBody || ""}\n\n🛑 এটি বন্ধ করতে লিখুন: ${prefix}resend off\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
          threadID
        );
      }

      let attachmentsList = [];
      let count = 0;

      for (const file of msg.attachment) {
        count++;
        const ext = file.url.split(".").pop();
        const filePath = __dirname + `/cache/resend_${count}.${ext}`;
        const fileData = (await axios.get(file.url, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(filePath, Buffer.from(fileData, "utf-8"));
        attachmentsList.push(fs.createReadStream(filePath));
      }

      return api.sendMessage(
        {
          body: `───────────────\n\n» ⚠️ সবাই দেখে নাও\n${userName} রিমুভ করেছে:\n${msg.msgBody || ""}\n\n🛑 এটি বন্ধ করতে লিখুন: ${prefix}resend off\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
          attachment: attachmentsList
        },
        threadID
      );
    }
  }
};

module.exports.run = async function ({ api, event, Threads }) {
  const { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data || {};
  data.resend = !data.resend;
  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);

  return api.sendMessage(
    `───────────────\n\n» 🔄 𝗥𝗲𝘀𝗲𝗻𝗱 𝗠𝗼𝗱𝗲: ${data.resend ? "𝗢𝗡" : "𝗢𝗙𝗙"}\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
    threadID,
    messageID
  );
};

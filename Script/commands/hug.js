const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "hug",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Generate hug frame using Avatar Canvas API",
  commandCategory: "banner",
  usePrefix: true,
  usages: "[@mention | reply]",
  cooldowns: 5,
  dependencies: { "axios": "", "fs-extra": "", "path": "" }
};

module.exports.run = async function ({ event, api }) {
  const { threadID, messageID, senderID, mentions, messageReply } = event;

  let targetID = null;
  if (mentions && Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  } else if (messageReply && messageReply.senderID) {
    targetID = messageReply.senderID;
  }

  if (!targetID) {
    return api.sendMessage(
      `───────────────\n\n» ❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝗼𝗿 𝗺𝗲𝗻𝘁𝗶𝗼𝗻 𝘀𝗼𝗺𝗲𝗼𝗻𝗲...\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, 
      threadID, 
      messageID
    );
  }

  try {
    const apiList = await axios.get(
      "https://raw.githubusercontent.com/shahadat-sahu/SAHU-API/refs/heads/main/SAHU-API.json"
    );

    const AVATAR_CANVAS_API = apiList.data.AvatarCanvas;

    const res = await axios.post(
      `${AVATAR_CANVAS_API}/api`,
      { cmd: "hug", senderID, targetID },
      { responseType: "arraybuffer", timeout: 30000 }
    );

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgPath = path.join(cacheDir, `hug_${senderID}_${targetID}.png`);
    fs.writeFileSync(imgPath, res.data);

    const captions = [
      "❝ যদি কখনো অনুভূতি হয়, তাহলে তোমার প্রতি আমার অনুভূতি পৃথিবীর সেরা অনুভূতি!🌻",
      "❝ তুমি আমার জীবনের সেরা অধ্যায়, যেই অধ্যায় বারবার পড়তে ইচ্ছে করে!💝",
      "❝ তোমার ভালোবাসার মূল্য আমি কিভাবে দেবো তা জানি না— শুধু জানি তোমাকে হারাতে চাই না!❤️",
      "❝ আমি প্রেমে পড়ার আগে তোমার মায়ায় জড়িয়ে গেছি, যে মায়া নেশার মতো!💘",
      "❝ তুমি আমার ভালোবাসা, আমার শান্তি, আমার সবকিছু!💞",
      "❝ তোমাকে ভালোবাসা আমার জীবনের সবচেয়ে সুন্দর অনুভূতি!❤️‍🔥",
      "❝ তুমি আমার জীবনের সেই গল্প, যা প্রতিবার পড়লে নতুন প্রেম জাগে!💚",
      "❝ তোমাকে অনেক অনেক ভালোবাসি আমার রাজকন্যা।❤️‍🩹",
      "❝ 𝗬𝗼𝘂 𝗰𝗼𝗺𝗽𝗹𝗲𝘁𝗲 𝗺𝗲. 𝗔 𝘄𝗮𝗿𝗺 𝗵𝘂𝗴 𝗷𝘂𝘀𝘁 𝗳𝗼𝗿 𝘆𝗼𝘂!🌺"
    ];

    const caption = captions[Math.floor(Math.random() * captions.length)];

    return api.sendMessage(
      { 
        body: `───────────────\n\n» 🤗 ${caption}\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, 
        attachment: fs.createReadStream(imgPath) 
      },
      threadID,
      () => fs.unlinkSync(imgPath),
      messageID
    );

  } catch (err) {
    return api.sendMessage(
      `───────────────\n\n» ❌ 𝗔𝗣𝗜 𝗘𝗿𝗿𝗼𝗿 𝗖𝗮𝗹𝗹 𝗦𝗶𝘆𝗮𝗺. ${err.message || ""}\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, 
      threadID, 
      messageID
    );
  }
};

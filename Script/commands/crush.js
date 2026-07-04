const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "crush",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Generate a couple banner image using sender and target Facebook UID via Avatar Canvas API",
  commandCategory: "banner",
  usePrefix: true,
  usages: "[@mention | reply]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": ""
  }
};

const crushCaptions = [
  "প্রেমে যদি অপূর্ণতাই সুন্দর হয়, তবে পূর্ণতার সৌন্দর্য কোথায়?❤️",
  "যদি বৃষ্টি হতাম… তোমার দৃষ্টি ছুঁয়ে দিতাম! চোখে জমা বিষাদটুকু এক নিমেষে ধুয়ে দিতাম🤗",
  "তোমার ভালোবাসার প্রতিচ্ছবি দেখেছি বারে বার💖",
  "তোমার সাথে একটি দিন হতে পারে ভালো, কিন্তু তোমার সাথে সবগুলি দিন হতে পারে ভালোবাসা🌸",
  "এক বছর নয়, কয়েক জন্ম শুধু তোমার প্রেমে পরতে পরতে ই চলে যাবে😍",
  "কেমন করে এই মনটা দেব তোমাকে… বেসেছি যাকে ভালো আমি, মন দিয়েছি তাকে🫶",
  "পিছু পিছু ঘুরলে কি আর প্রেম হয়ে যায়… কাছে এসে বাসলে ভালো, মন পাওয়া যায়❤️‍🩹",
  "তুমি থাকলে নিজেকে এমন সুখী মনে হয়, যেনো আমার জীবনে কোনো দুঃখই নেই😊",
  "তোমার হাতটা ধরতে পারলে মনে হয় পুরো পৃথিবীটা ধরে আছি🥰",
  "তোমার প্রতি ভালো লাগা যেনো প্রতিনিয়ত বেড়েই চলছে😘"
];

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
      "───────────────\n\n» ⚠️ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝗼𝗿 𝗺𝗲𝗻𝘁𝗶𝗼𝗻 𝘀𝗼𝗺𝗲𝗼𝗻𝗲.\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
      threadID,
      messageID
    );
  }

  try {
    const apiList = await axios.get(
      "https://raw.githubusercontent.com/sahu-uhas/SAHU-API/refs/heads/main/API.json"
    );

    const AVATAR_CANVAS_API = apiList.data.AvatarCanvas;

    const res = await axios.post(
      `${AVATAR_CANVAS_API}/api`,
      {
        cmd: "crush",
        senderID,
        targetID
      },
      { responseType: "arraybuffer", timeout: 30000 }
    );

    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);

    const imgPath = path.join(cacheDir, `crush_${senderID}_${targetID}.png`);
    fs.writeFileSync(imgPath, res.data);

    const caption = crushCaptions[Math.floor(Math.random() * crushCaptions.length)];
    
    const msg = `───────────────\n\n» 😍 𝗖𝗿𝘂𝘀𝗵 | ${caption}\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

    return api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => {
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      },
      messageID
    );

  } catch (e) {
    return api.sendMessage(
      "───────────────\n\n» ❌ 𝗔𝗣𝗶 𝗘𝗿𝗿𝗼𝗿 𝗖𝗮𝗹𝗹 𝗔𝗱𝗺𝗶𝗻 𝗦𝗶𝘆𝗮𝗺.\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
      threadID,
      messageID
    );
  }
};

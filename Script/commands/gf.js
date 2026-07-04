module.exports.config = {
  name: "gf",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "couple banner",
  commandCategory: "banner",
  usages: "[@mention | reply]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": ""
  }
};

module.exports.run = async function ({ event, api }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const path = require("path");

  const { threadID, messageID, senderID, mentions, messageReply } = event;

  let targetID = messageReply?.senderID || (mentions && Object.keys(mentions)[0]);

  if (!targetID) {
    return api.sendMessage(
      `───────────────\n\n» ❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝗼𝗿 𝗺𝗲𝗻𝘁𝗶𝗼𝗻 𝘀𝗼𝗺𝗲𝗼𝗻𝗲...\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
      threadID,
      messageID
    );
  }

  try {
    const apiList = await axios.get(
      "https://raw.githubusercontent.com/shahadat-sahu/SAHU-API/main/SAHU-API.json"
    );

    const AVATAR_CANVAS_API = apiList.data.AvatarCanvas;
    if (!AVATAR_CANVAS_API) throw new Error("𝗔𝗩𝗔𝗧𝗔𝗥_𝗖𝗔𝗡𝗩𝗔𝗦_走𝗣𝗜 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱");

    const res = await axios.post(
      `${AVATAR_CANVAS_API}/api`,
      { cmd: "gf", senderID, targetID },
      { responseType: "arraybuffer", timeout: 30000 }
    );

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgPath = path.join(cacheDir, `gf_${senderID}_${targetID}.png`);
    fs.writeFileSync(imgPath, res.data);

    return api.sendMessage(
      {
        body: `───────────────\n\n» 😍 এই নে তোর গার্লফ্রেন্ড অন্য মেয়ের দিকে নজর দিস না 😸\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => fs.unlinkSync(imgPath),
      messageID
    );

  } catch (e) {
    return api.sendMessage(
      `───────────────\n\n» ❌ 𝗔𝗣𝗜 𝗘𝗿𝗿𝗼𝗿 𝗖𝗮𝗹𝗹 𝗦𝗶𝘆𝗮𝗺. ${e.message}\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
      threadID,
      messageID
    );
  }
};

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "anemi",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Random Anime Videos From API",
  commandCategory: "video",
  usages: "anemi",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  const API_LIST_URL = "https://raw.githubusercontent.com/sahu-uhas/SAHU-API/refs/heads/main/API.json";
  
  try {
    const listRes = await axios.get(API_LIST_URL);
    const apis = listRes.data;
    const API = apis.anime_video;

    if (!API) {
      return api.sendMessage(
        `───────────────\n» ⚠️ 𝗔𝗣𝗜 𝗣𝗿𝗼𝗯𝗹𝗲𝗺! 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        threadID,
        messageID
      );
    }

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const filePath = path.join(cacheDir, `anemi_${Date.now()}.mp4`);

    const response = await axios({
      url: API,
      method: "GET",
      responseType: "stream",
      timeout: 120000
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      const formattedMsg = `───────────────\n» 🎬 𝗔𝗡𝗜𝗠𝗘 𝗥𝗔𝗡𝗗𝗢𝗠 𝗩𝗜𝗗𝗘𝗢\n» 🤖 𝗕𝗼𝘁: ─꯭─⃝‌‌𝗦𝗶𝘆𝗮𝗺 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;
      
      api.sendMessage(
        {
          body: formattedMsg,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        },
        messageID
      );
    });

    writer.on("error", () => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      api.sendMessage(
        `───────────────\n» ❌ 𝗙𝗶𝗹𝗲 𝗪𝗿𝗶𝘁𝗶𝗻𝗴 𝗘𝗿𝗿𝗼𝗿!\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        threadID,
        messageID
      );
    });

  } catch (err) {
    console.log("ANEMI ERROR:", err?.response?.data || err.message);
    api.sendMessage(
      `───────────────\n» ❌ 𝗔𝗣𝗜 𝗣𝗿𝗼𝗯𝗹𝗲𝗺! 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
      threadID,
      messageID
    );
  }
};

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "video",
  version: "2.2.3",
  hasPermssion: 0,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Search & download YouTube videos with or without prefix",
  commandCategory: "media",
  usages: "video <video name>",
  cooldowns: 5
};

// 🎯 MULTI API SEARCH FUNCTION
async function searchVideo(query) {
  const apis = [
    `https://betadash-search-download.vercel.app/yt?search=${encodeURIComponent(query)}`,
    `https://yt-api-imran.vercel.app/api/search?query=${encodeURIComponent(query)}`,
    `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(query)}`
  ];

  for (let url of apis) {
    try {
      const res = await axios.get(url);
      let video = null;

      // API-1 format
      if (res.data?.[0]) video = res.data[0];
      // API-2 format
      else if (res.data?.results?.[0]) video = res.data.results[0];
      // API-3 fallback format
      else if (res.data?.items?.[0]) {
        const item = res.data.items[0];
        video = {
          title: item.snippet?.title,
          url: `https://www.youtube.com/watch?v=${item.id?.videoId}`
        };
      }

      if (video?.url) return video;
    } catch (e) {
      continue;
    }
  }
  return null;
}

// প্রিফিক্স ছাড়া (No Prefix) হ্যান্ডেলার
module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID, senderID } = event;
  if (!body) return;

  const botID = api.getCurrentUserID();
  if (String(senderID) === String(botID)) return;

  const msg = body.trim();
  if (msg.toLowerCase().startsWith("video ")) {
    const args = msg.split(" ");
    args.shift(); // 'video' শব্দটা বাদ দেওয়া হলো
    return module.exports.handleDownload({ api, event, args });
  }
};

// প্রিফিক্স সহ হ্যান্ডেলার
module.exports.run = async function ({ api, event, args }) {
  return module.exports.handleDownload({ api, event, args });
};

// মেইন ডাউনলোডার কোর ইঞ্জিন
module.exports.handleDownload = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const creatorName = "Farhan Khan";
  let query = args.join(" ").trim();

  if (!query || query.toLowerCase() === "video") {
    return api.sendMessage(
`───────────────
» 👑 ❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝘀𝗼𝗻𝗴 𝗻𝗮𝗺𝗲.
» 📌 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: 𝘃𝗶𝗱𝗲𝗼 𝗟𝗲𝘁 𝗠𝗲 𝗟𝗼𝘃𝗲 𝗬𝗼𝘂
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }

  let tempMsgID = null;

  try {
    const searching = await api.sendMessage(
`───────────────
» 👑 🔍 𝗦𝗘𝗔𝗥𝗖𝗛𝗜𝗡𝗚 𝗦𝗬𝗦𝗧𝗘𝗠...
» 📌 𝗤𝘂𝗲𝗿𝘆: ${query}
» ⏳ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID);
    tempMsgID = searching.messageID;

    const video = await searchVideo(query);
    if (!video || !video.url) throw new Error("No results found from all APIs.");

    await api.unsendMessage(tempMsgID).catch(() => {});

    const downloading = await api.sendMessage(
`───────────────
» 👑 🎬 𝗩𝗜𝗗𝗘𝗢 𝗙𝗢𝗨𝗡𝗗!
» 📖 𝗧𝗶𝘁𝗹𝗲: ${video.title}
» ⬇️ 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗶𝗻𝗴...
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID);
    tempMsgID = downloading.messageID;

    const dlRes = await axios.get(`https://yt-api-imran.vercel.app/api?url=${video.url}`);
    const downloadUrl = dlRes.data?.downloadUrl;
    if (!downloadUrl) throw new Error("Download link not available.");

    const buffer = (await axios.get(downloadUrl, { responseType: "arraybuffer" })).data;

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    const filePath = path.join(cacheDir, `video_${Date.now()}.mp4`);
    await fs.writeFile(filePath, buffer);

    const finalMessage = {
      body: 
`───────────────
» 👑 🎬 𝗩𝗜𝗗𝗘𝗢 𝗥𝗘𝗔𝗗𝗬
───────────────
» 📖 𝗧𝗶𝘁𝗹𝗲: ${video.title}
» ⏱ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${video.time || "N/A"}
» 🖌️ 𝗣𝗼𝘄𝗲𝗿 𝗯𝘆: ${creatorName}
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
      attachment: fs.createReadStream(filePath)
    };

    await api.sendMessage(finalMessage, threadID, async () => {
      if (fs.existsSync(filePath)) await fs.unlink(filePath);
    }, messageID);

    if (tempMsgID) await api.unsendMessage(tempMsgID).catch(() => {});

  } catch (err) {
    if (tempMsgID) await api.unsendMessage(tempMsgID).catch(() => {});
    return api.sendMessage(
`───────────────
» 👑 ❌ 𝗙𝗮𝗶𝗹𝗲𝗱
» ━━━━━━━━━━━━━━━
» ⚠️ ${err.message || "An unexpected error occurred."}
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }
};

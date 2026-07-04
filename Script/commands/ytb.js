const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = async () => {
  try {
    const res = await axios.get(
      "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
    );
    return res.data.mahmud;
  } catch (e) {
    return "https://default-api.example.com";
  }
};

const apiList = async () => {
  const base = await baseApiUrl();
  return [
    base,
    "https://mahmudx7-api.vercel.app",
    "https://backup-api.example.com"
  ];
};

async function fetchWithFallback(urlBuilder) {
  const apis = await apiList();

  for (let base of apis) {
    try {
      const url = urlBuilder(base);
      const res = await axios.get(url, { timeout: 15000 });
      if (res?.data) return res.data;
    } catch (e) {}
  }

  throw new Error("All APIs failed");
}

module.exports.config = {
  name: "ytb",
  version: "2.3",
  hasPermssion: 0,
  credits: "Siyam Hasan",
  description: "YouTube ভিডিও সার্চ ও ডাউনলোড (ytb থাম্বনেইল সহ, ytb2 থাম্বনেইল ছাড়া)",
  commandCategory: "media",
  usages: "ytb song name অথবা ytb2 song name",
  cooldowns: 6
};

// প্রিফিক্স সহ এবং ছাড়া দুইভাবেই যাতে কাজ করে (ytb এবং ytb2)
module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID, senderID } = event;
  if (!body) return;

  const botID = api.getCurrentUserID();
  if (String(senderID) === String(botID)) return;

  const msg = body.trim().toLowerCase();
  if (msg.startsWith("ytb ") || msg.startsWith("ytb2 ")) {
    const args = body.trim().split(/\s+/);
    args.shift(); // কমান্ড নেম রিমুভ
    return module.exports.handleSearch({ api, event, args });
  }
};

module.exports.run = async function ({ api, event, args }) {
  return module.exports.handleSearch({ api, event, args });
};

// মূল সার্চ কোর ফাংশন
module.exports.handleSearch = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const input = args.join(" ").trim();

  if (!input) {
    return api.sendMessage(
`───────────────
» 👉 ব্যবহার: ytb song name অথবা ytb2 song name
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }

  const usedCommand = event.body.split(" ")[0].toLowerCase();
  const isYtb2 = usedCommand.includes("ytb2");

  try {
    api.setMessageReaction("🔎", messageID, () => {}, true);

    const data = await fetchWithFallback((base) =>
      `${base}/api/ytb/search?q=${encodeURIComponent(input)}`
    );

    const results = data?.results?.slice(0, 6);

    if (!results?.length) {
      return api.sendMessage(
`───────────────
» ⭕ কিছু পাওয়া যায়নি: ${input}
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
    }

    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);

    let msg = "";
    let attachments = [];

    if (!isYtb2) {
      const thumbs = await Promise.all(
        results.map(async (r, i) => {
          try {
            const thumbPath = path.join(
              cacheDir,
              `thumb_${senderID}_${Date.now()}_${i}.jpg`
            );

            const res = await axios.get(r.thumbnail, {
              responseType: "arraybuffer",
              timeout: 10000
            });

            fs.writeFileSync(thumbPath, Buffer.from(res.data));
            return fs.createReadStream(thumbPath);
          } catch {
            return null;
          }
        })
      );
      attachments = thumbs.filter(Boolean);
    }

    results.forEach((r, i) => {
      msg += `${i + 1}. ${r.title}\n⏱ ${r.time}\n\n`;
    });

    return api.sendMessage(
      {
        body:
`───────────────
» 📌 নাম্বার দিয়ে রিপ্লাই করো:

${msg}───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        attachment: attachments.length ? attachments : undefined
      },
      threadID,
      (err, info) => {
        if (err) return;
        // আপনার বটের রিপ্লাই সিস্টেম হ্যান্ডেলার ডেটা স্টোরেজ
        if (!global.client.handleReply) global.client.handleReply = [];
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: senderID,
          results,
          menuMsgID: info.messageID
        });
      },
      messageID
    );

  } catch (e) {
    return api.sendMessage(`❌ API সমস্যা: ${e.message}`, threadID, messageID);
  }
};

// রিপ্লাই হ্যান্ডেলার ফাংশন
module.exports.handleReply = async function ({ event, api, handleReply }) {
  const { results, author, menuMsgID } = handleReply;
  const { threadID, messageID, senderID, body } = event;

  if (String(senderID) !== String(author)) return;

  const choice = parseInt(body);
  if (!choice || choice < 1 || choice > results.length) return;

  const videoID = results[choice - 1].id;

  try {
    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      if (menuMsgID) api.unsendMessage(menuMsgID);
    } catch {}

    const data = await fetchWithFallback((base) =>
      `${base}/api/ytb/get?id=${videoID}&type=video`
    );

    const downloadLink = data?.data?.downloadLink;
    const title = data?.data?.title;

    if (!downloadLink) throw new Error("Download link not found");

    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);
    const filePath = path.join(cacheDir, `yt_${Date.now()}.mp4`);

    const response = await axios({
      url: downloadLink,
      method: "GET",
      responseType: "stream",
      timeout: 30000
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        {
          body: 
`───────────────
» 👑 𝗢𝗪𝗡𝗘𝗥 🪄 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
» ━━━━━━━━━━━━━━━
» 🎵 ${title}
───────────────`,
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
      api.sendMessage("❌ ডাউনলোড ব্যর্থ হয়েছে", threadID, messageID);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

  } catch (e) {
    api.sendMessage(`❌ সমস্যা: ${e.message}`, threadID, messageID);
  }
};

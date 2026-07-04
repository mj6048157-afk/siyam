const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const _x1 = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const _x2 = "MR_FARHAN";

const __lock = (() => {
  const a = ["𝆠", "፝", "𝐒", "𝐈", "𝐘", "𝐀", "𝐌"];
  return a.join("");
})();

if (!global.SiyamVoiceCooldowns) global.SiyamVoiceCooldowns = {};
const cacheDir = path.join(__dirname, "cache", "voices");

// ব্যাকগ্রাউন্ড ফাইল অটো-ক্লিনআপ সিস্টেম
setInterval(() => {
  try {
    const now = Date.now();
    for (const userId in global.SiyamVoiceCooldowns) {
      for (const trigger in global.SiyamVoiceCooldowns[userId]) {
        if (now - global.SiyamVoiceCooldowns[userId][trigger] > 3 * 60 * 1000) {
          delete global.SiyamVoiceCooldowns[userId][trigger];
        }
      }
      if (Object.keys(global.SiyamVoiceCooldowns[userId]).length === 0) {
        delete global.SiyamVoiceCooldowns[userId];
      }
    }
    
    if (fs.existsSync(cacheDir)) {
      const files = fs.readdirSync(cacheDir);
      let totalSize = 0;
      const fileStats = files.map(file => {
        const filePath = path.join(cacheDir, file);
        const stat = fs.statSync(filePath);
        totalSize += stat.size;
        return { path: filePath, mtime: stat.mtimeMs };
      });

      if (totalSize > 50 * 1024 * 1024) {
        fileStats.sort((a, b) => a.mtime - b.mtime);
        while (totalSize > 30 * 1024 * 1024 && fileStats.length > 0) {
          const oldest = fileStats.shift();
          try {
            const size = fs.statSync(oldest.path).size;
            fs.unlinkSync(oldest.path);
            totalSize -= size;
          } catch(e) {}
        }
      }
    }
  } catch (err) {
    console.error("[text_voice] Background cleanup error:", err.message);
  }
}, 60 * 60 * 1000);

module.exports.config = {
  name: "text_voice",
  version: "4.0.0",
  hasPermssion: 0,
  credits: _x2,
  description: "Ultra Fast Voice Reply with Advanced Filter",
  commandCategory: "system",
  usages: "",
  cooldowns: 1
};

module.exports.run = async function ({ api, event, args }) {
  // প্রিফিক্স সহ কমান্ড খালি রান প্রতিরোধের সুরক্ষা
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!_x1.includes(__lock)) {  
    throw new Error("SYSTEM LOCKED");  
  }  
  if (module.exports.config.credits !== String.fromCharCode(77, 82, 95, 70, 65, 82, 72, 65, 78)) {  
    throw new Error("AUTHOR CHANGE DETECTED");  
  }  

  if (!event.body) return;  

  const { threadID, messageID, senderID } = event;
  const botID = String(api.getCurrentUserID()); 
  if (String(senderID) === botID || String(senderID) === "0") return;

  const input = event.body.toLowerCase().replace(/\s+/g, " ").trim();  
  const bossID = "61590360434650"; 

  const badWordsMap = {
    "ভুদা": "https://files.catbox.moe/gnyx0p.mp3",  
    "আসো হাত মারি": "https://files.catbox.moe/8ioph1.mp3",  
    "🖕": "https://files.catbox.moe/n4kdj7.mp3"
  };

  const exactMatchMap = {  
    "good night": "https://files.catbox.moe/i29m4q.mp3",  
    "গুড নাইট": "https://files.catbox.moe/i29m4q.mp3",  
    "good morning": "https://files.catbox.moe/8gzqx5.mp3",  
    "গুড মর্নিং": "https://files.catbox.moe/8gzqx5.mp3",  
    "siyam": "https://files.catbox.moe/9w6moo.mp3",  
    "সিয়াম ভাই": "https://files.catbox.moe/9w6moo.mp3",  
    "সিয়াম": "https://files.catbox.moe/9w6moo.mp3",  
    "@পি্ঁচ্চি্ঁ রি্ঁদ্ঁয়্ঁ ত্যা্ঁহ্ঁ": "https://files.catbox.moe/lkysl2.mp4",  
    "@everyone": "https://files.catbox.moe/stcply.mp3",  
    "নিঝুম": "https://files.catbox.moe/3u6shs.mp3",  
    ",sex": "https://files.catbox.moe/uy7mrv.mp3",  
    ",hot": "https://files.catbox.moe/m5djca.mp3",  
    "s+n": "https://files.catbox.moe/841gpc.mp4",  
    "টুকি": "https://files.catbox.moe/e8ebel.mp3",  
    "আমি মাদিহা": "https://files.catbox.moe/9gyjwp.mp3",  
    "নুনু": "https://files.catbox.moe/r5uz42.mp3",  
    "👍": "https://files.catbox.moe/ahux2o.mp4",  
    "✡️": "https://files.catbox.moe/5rdtc6.mp3",  
    "মিম তুমারে চুদি": "https://files.catbox.moe/plex4g.mp4",  
    "কпи বট": "https://files.catbox.moe/4vmyke.mp4"
  };  

  const multiVoiceMap = {
    "bot": "https://files.catbox.moe/gzq54t.mp3",
    "জান": "https://files.catbox.moe/78r669.mp4",
    "baby": "https://files.catbox.moe/gzq54t.mp3",
    "bby": "https://files.catbox.moe/x8ina4.mp3",
    "বেবি": "https://files.catbox.moe/3u6shs.mp3"
  };  

  if (input === "voicehelp") {  
    const config = global.config || {};
    const admins = (config.ADMINBOT || []).map(id => String(id));  
    
    if (String(senderID) !== bossID && !admins.includes(String(senderID))) {  
      return api.sendMessage(" | 🤬এ মাদারচোদ বট তোর বাপের।🙄   🥵তোর আম্মুর বোদা ফাক কর🖕 👉এইটা শুধু আমার বস সিয়াম এর জন্য😻!", threadID, messageID);  
    }  

    const badWordsList = Object.keys(badWordsMap);
    const exactMatchList = Object.keys(exactMatchMap);
    const multiVoiceList = Object.keys(multiVoiceMap);
    const totalVoices = badWordsList.length + exactMatchList.length + multiVoiceList.length + 1;

    let serial = 1;
    let msg = `🛡️ ［ 𝗩𝗢𝗜𝗖𝗘 𝗛𝗘𝗟𝗣 🛡️\n\n🔋────🛡️────🪫\n\n`;
    
    msg += `┌── 🚫 [ GALI / INCLUDES ]\n`;
    badWordsList.forEach(trigger => msg += `├── ${serial++}. ${trigger}\n`);
    msg += `├── ${serial++}. চুদি/চৌদি/খানকি/মাগির পোলা (স্মার্ট ফিল্টার)\n`;

    msg += `├── 🎵 [ EXACT MATCH ]\n`;
    exactMatchList.forEach(trigger => msg += `├── ${serial++}. ${trigger}\n`);

    msg += `├── 💖 [ MULTI-VOICE ]\n`;
    multiVoiceList.forEach(trigger => msg += `├── ${serial++}. ${trigger}\n`);
    
    msg += `└──────────────🐲\n`;
    msg += `🤖 𝗕𝗢𝗧: 𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧\n`;
    msg += `👑 𝗢𝗪𝗡𝗘𝗥: 𝗦𝗜𝗬𝗔𝗠 𝗛𝗔𝗦𝗔𝗡\n`;
    msg += `📊 𝗧𝗢𝗧𝗔𝗟 𝗩𝗢𝗜𝗖𝗘𝗦: ${totalVoices}\n\n`;
    msg += `📱 Contact: +8801789138157`;

    return api.sendMessage(msg, threadID, messageID);  
  }  

  let targetAudioUrl = null;
  let matchedTrigger = null;

  const targetAbuseRegex = /(চুদি|চৌদি|চুদা|চোদ|খানকি|মাগির পোলা|মাদারচোদ|chudi|choda|khanki)/i;
  
  if (targetAbuseRegex.test(input)) {
      targetAudioUrl = "https://files.catbox.moe/0ykb7f.mp3";
      matchedTrigger = "chudi_global_filter";
  }

  if (!targetAudioUrl) {
    for (const key in badWordsMap) {
      if (input.includes(key)) {
        targetAudioUrl = badWordsMap[key];
        matchedTrigger = key;
        break;
      }
    }
  }

  if (!targetAudioUrl && exactMatchMap[input]) {
    targetAudioUrl = exactMatchMap[input];
    matchedTrigger = input;
  }

  if (!targetAudioUrl && multiVoiceMap[input]) {
    targetAudioUrl = multiVoiceMap[input];
    matchedTrigger = input;
  }

  if (targetAudioUrl) {
    const currentTime = Date.now();
    const cooldownTime = 3 * 60 * 1000; 

    if (String(senderID) !== bossID) {
      if (!global.SiyamVoiceCooldowns[senderID]) global.SiyamVoiceCooldowns[senderID] = {};

      if (global.SiyamVoiceCooldowns[senderID][matchedTrigger]) {
        const expirationTime = global.SiyamVoiceCooldowns[senderID][matchedTrigger] + cooldownTime;
        if (currentTime < expirationTime) return; 
      }
    }

    fs.ensureDirSync(cacheDir);  
    
    const ext = targetAudioUrl.endsWith(".mp4") ? ".mp4" : ".mp3";  
    const safeFileName = Buffer.from(matchedTrigger).toString("hex") + ext;  
    const filePath = path.join(cacheDir, safeFileName);  

    try {  
      if (String(senderID) !== bossID) {
        global.SiyamVoiceCooldowns[senderID][matchedTrigger] = currentTime;
      }

      if (fs.existsSync(filePath)) {  
        return await api.sendMessage({  
          attachment: fs.createReadStream(filePath)  
        }, threadID, messageID);  
      }  

      let response = null;
      let retries = 2;

      while (retries > 0) {
        try {
          response = await axios.get(targetAudioUrl, {  
            responseType: "arraybuffer",
            timeout: 5000 
          });
          if (response && response.data && response.data.byteLength > 100) break; 
        } catch (downloadErr) {
          retries--;
          if (retries === 0) throw downloadErr;
        }
      }

      if (!response || !response.data) throw new Error("Invalid stream payload");

      fs.writeFileSync(filePath, Buffer.from(response.data));

      await api.sendMessage({  
        attachment: fs.createReadStream(filePath)  
      }, threadID, messageID);  

    } catch (e) {  
      console.error(`[text_voice] Processing Failed:`, e.message);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch(err) {}
      }
    }  
  }
};

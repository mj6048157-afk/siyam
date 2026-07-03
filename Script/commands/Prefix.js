const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "prefix",
  version: "1.0.0", 
  hasPermssion: 0,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Display the bot's prefix and owner info with a random image",
  commandCategory: "Information",
  usages: "",
  cooldowns: 5
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  var { threadID, messageID, body } = event;
  if (!body) return;

  var dataThread = await Threads.getData(threadID);
  var data = dataThread.data || {};
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  const groupName = dataThread.threadInfo?.threadName || "Unnamed Group";

  const triggerWords = [
    "prefix", "mprefix", "mpre", "bot prefix", "what is the prefix", "bot name",
    "how to use bot", "bot not working", "bot is offline", "prefx", "prfix",
    "perfix", "bot not talking", "where is bot", "bot dead", "bots dead",
    "dấu lệnh", "daulenh", "what prefix", "freefix", "what is bot", "what prefix bot",
    "how use bot", "where are the bots", "where prefix"
  ];

  let lowerBody = body.toLowerCase();
  if (triggerWords.includes(lowerBody)) {
    
    // আপনার দেওয়া ইমেজ লিংকের র্যান্ডম লিস্ট
    const images = [
      "https://i.imgur.com/j2LwYFl.jpeg",
      "https://i.imgur.com/8pZQNWY.jpeg"
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const pathImg = __dirname + `/cache/prefix_${threadID}.jpeg`;

    try {
      const response = await axios.get(randomImage, { responseType: "arraybuffer" });
      fs.writeFileSync(pathImg, Buffer.from(response.data, "utf-8"));

      return api.sendMessage({
        body: `───────────────\n\n» 👑 𝗣𝗥𝗘𝗙𝗜𝗫 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡\n\n   » 𝗕𝗼𝘁 𝗽𝗿𝗲𝗳𝗶𝘅 : [ ${prefix} ]\n   » 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲 :─꯭─⃝‌‌𝗦𝗶𝘆𝗮𝗺 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁\n   » 𝗕𝗼𝘁 𝗔𝗱𝗺𝗶𝗻 : 𝗦𝗜𝗬𝗔𝗠-𝗛𝗔𝗦𝗔𝗡\n\n» 📦 𝗕𝗢𝗫 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡\n\n   » 𝗕𝗼𝘅 𝗣𝗿𝗲𝗳𝗶𝘅 : ${prefix}\n   » 𝗕𝗼𝘅 𝗡𝗮𝗺𝗲 : ${groupName}\n   » 𝗕𝗼𝘅 𝗧𝗜𝗗 : ${threadID}\n\n───────────────\n\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        attachment: fs.createReadStream(pathImg)
      }, threadID, () => fs.unlinkSync(pathImg), messageID);

    } catch (error) {
      // ইমেজ ডাউনলোড ফেইল হলে শুধু টেক্সট মেসেজ যাবে যেন বট ক্র্যাশ না করে
      return api.sendMessage(
`───────────────

» 🧚 𝗣𝗥𝗘𝗙𝗜𝗫 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡

   » 𝗕𝗼𝘁 𝗽𝗿𝗲𝗳𝗶𝘅 : [ ${prefix} ]
   » 𝗕𝗼𝘁 : ─꯭─⃝‌‌𝗦𝗶𝘆𝗮𝗺 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁
   » 𝗕𝗼𝘁 𝗔𝗱𝗺𝗶𝗻 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍

» 📦 𝗕𝗢𝗫 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡

   » 𝗕𝗼𝘅 𝗣𝗿𝗲𝗳𝗶𝘅 : ${prefix}
   » 𝗕𝗼𝘅 𝗡𝗮𝗺𝗲 : ${groupName}
   » 𝗕𝗼𝘅 𝗧𝗜𝗗 : ${threadID}

───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
    }
  }
};

module.exports.run = async ({ event, api }) => {
  return api.sendMessage(
`───────────────

» ℹ️ 𝗧𝘆𝗽𝗲 '𝗽𝗿𝗲𝗳𝗶𝘅' 𝗼𝗿 𝘀𝗶𝗺𝗶𝗹𝗮𝗿 𝘁𝗼 𝗴𝗲𝘁 𝘁𝗵𝗲 𝗯𝗼𝘁 𝗶𝗻𝗳𝗼.

───────────────

» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, 
    event.threadID, 
    event.messageID
  );
};

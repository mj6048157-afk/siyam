module.exports.config = {
  name: "bday",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Admin birthday countdown and wishes",
  usePrefix: false,
  commandCategory: "bday",
  cooldowns: 5
};

// আপনার দেওয়া জন্মতারিখ (দিন/মাস) এখানে সেট করা হয়েছে
const BIRTHDAY = "05/05"; 

module.exports.run = async ({ api, event, Users }) => {
  const axios = require("axios");
  const fs = require("fs-extra");
  const path = __dirname + "/cache/bday.png";
  const { threadID, messageID } = event;

  // 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗙𝗼𝗿𝗺𝗮𝘁𝘁𝗶𝗻𝗴 𝗛𝗲𝗹𝗽𝗲𝗿
  const formatMsg = (text) => {
    return `───────────────\n\n» ${text}\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;
  };

  // মেইন এডমিনের আইডি এবং নাম ডায়নামিকালি নেওয়া হচ্ছে
  const adminID = global.config.ADMINBOT[0] || event.senderID;
  const adminName = global.data.userName.get(adminID) || await Users.getNameUser(adminID);

  const now = new Date();
  const [day, month] = BIRTHDAY.split("/").map(Number);

  let year = now.getFullYear();
  let targetDate = new Date(year, month - 1, day, 0, 0, 0);

  if (now > targetDate) {
    targetDate.setFullYear(year + 1);
  }

  const diffMs = targetDate - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const diffSeconds = Math.floor((diffMs / 1000) % 60);

  // ১ দিন বাকি থাকলে মেসেজ
  if (diffDays === 1) {
    const tomorrowMessage = `🎉 ${adminName} 𝗲𝗿 𝗷𝗼𝗻𝗺𝗼𝗱𝗶𝗻 𝗮𝗴𝗮𝗺𝗶𝗸𝗮𝗹!\n» 𝗢𝗯𝗵𝗼𝘀𝗲𝘀𝗵𝗲 𝗮𝗱𝗺𝗶𝗻 𝗲𝗿 𝗯𝗶𝗿𝘁𝗵𝗱𝗮𝘆 𝗳𝗮𝘀𝗵 𝗵𝗼𝘆𝗲 𝗴𝗲𝗹𝗼 😜\n» 𝗪𝗶𝘀𝗵 𝗸𝗼𝗿𝘁𝗲 𝗯𝗵𝘂𝗹𝗯𝗲 𝗻𝗮 𝗸𝗶𝗻𝘁𝘂... 🥰`;
    return api.sendMessage(formatMsg(tomorrowMessage), threadID, messageID);
  }

  // জন্মদিনের দিন মেসেজ
  if (diffDays === 0) {
    const happyBirthdayMessage = `🎂 𝗛𝗔𝗣𝗣𝗬 𝗕𝗜𝗥𝗧𝗛𝗗𝗔𝗬 🎂\n\n» 𝗢𝗨𝗥 𝗕𝗢𝗦𝗦 - ${adminName} 💖\n» 𝗔𝗷 𝗮𝗺𝗮𝗱𝗲𝗿 𝗕𝗼𝘀𝘀 𝗲𝗿 𝗷𝗼𝗻𝗺𝗼𝗱𝗶𝗻!\n» 𝗦𝗼𝗯𝗮𝗶 𝗺𝗼𝗻 𝘁𝗵𝗲𝗸𝗲 𝘄𝗶𝘀𝗵 𝗸𝗼𝗿𝗼 🎉\n» 𝗗𝗼𝗮 𝗼 𝗯𝗵𝗮𝗹𝗼𝗯𝗮𝘀𝗵𝗮 𝗷𝗮𝗻𝗮𝗼 🥰\n\n» 🌐 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: https://facebook.com/${adminID}`;
    return api.sendMessage(formatMsg(happyBirthdayMessage), threadID, messageID);
  }

  // কাউন্টডাউন মেসেজ
  const countdownMessage = `⏳ 𝗕𝗜𝗥𝗧𝗛𝗗𝗔𝗬 𝗖𝗢𝗨𝗡𝗧𝗗𝗢𝗪𝗡\n\n» 𝗔𝗱𝗺𝗶𝗻: ${adminName}\n» 𝗗𝗮𝘆𝘀: ${diffDays}\n» 𝗛𝗼𝘂𝗿𝘀: ${diffHours}\n» 𝗠𝗶𝗻𝘂𝘁𝗲𝘀: ${diffMinutes}\n» 𝗦𝗲𝗰𝗼𝗻𝗱𝘀: ${diffSeconds}`;

  const url = `https://graph.facebook.com/${adminID}/picture?height=720&width=720`;

  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream"
    });

    const writer = fs.createWriteStream(path);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        {
          body: formatMsg(countdownMessage),
          attachment: fs.createReadStream(path)
        },
        threadID,
        () => {
          if (fs.existsSync(path)) fs.unlinkSync(path);
        },
        messageID
      );
    });

    writer.on("error", () => {
      api.sendMessage(formatMsg(countdownMessage), threadID, messageID);
    });

  } catch (err) {
    api.sendMessage(formatMsg(countdownMessage), threadID, messageID);
  }
};

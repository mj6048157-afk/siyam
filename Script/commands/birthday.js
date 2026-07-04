module.exports.config = {
  name: "birthday",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "মেনশন করলে শুভেচ্ছা জানাবে",
  commandCategory: "group",
  usages: "[@মেনশন]",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, mentions } = event;

  // 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗙𝗼𝗿𝗺𝗮𝘁𝘁𝗶𝗻𝗴 𝗛𝗲𝗹𝗽𝗲𝗿
  const formatMsg = (text) => {
    return `───────────────\n\n» ${text}\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;
  };

  try {
    if (Object.keys(mentions).length === 0) {
      return api.sendMessage(formatMsg("আপনি কাকে শুভেচ্ছা জানাতে চান এমন একজন কে মেনশন করুন!😘"), threadID, messageID);
    }

    const mentionID = Object.keys(mentions)[0];
    const name = mentions[mentionID].replace("@", "");
    const arraytag = [{ id: mentionID, tag: name }];

    const sendMessage = (msg) => {
      api.sendMessage({ body: formatMsg(msg), mentions: arraytag }, threadID);
    };

    sendMessage(`বস 𝗥𝗝 𝘀𝗶𝘆𝗮𝗺 'এর পক্ষ থেকে তোমাকে জন্মদিনের শুভেচ্ছা, @${name}!\n🎉 𝗛𝗔𝗣𝗣𝗬 𝗕𝗜𝗥𝗧𝗛𝗗𝗔𝗬 🎉`);
    
    const messages = [
      { delay: 3000, msg: `আরো একটি বছর করলে তুমি পার। সুস্থ থাকো, ভালো থাকো এই কামনাই করি বার বার!\n🥰 শুভ জন্মদিন 🥰 @${name}` },
      { delay: 6000, msg: ` can't do what you request আনন্দ উল্লাসে কাটে যেন তোমার প্রতিটি দিন, শুভেচ্ছা জানাই আজ তোমায়!\n🥰 শুভ জন্মদিন 😍 @${name}` },
      { delay: 10000, msg: `জন্মদিনে শুভেচ্ছা নিও প্রিও~\nযদিও বিলম্বিত, বার্থডে ট্রিট পেলে বৎস হবো বড় প্রীত!\n🌼 শুভ জন্মদিন 🌼 @${name}` },
      { delay: 14000, msg: `আজ জন্মদিনে আনন্দ ও সুন্দর মুহুর্তে ভরে উঠুক এই কামনাই করি ...শুভ জন্মদিন @${name}` },
      { delay: 18000, msg: `ফুলে হাঁসিতে প্রাণের খুশিতে, অলিরা গানে গানে ফুলের কানে কানে, বলছে আজ সেই শুভ দিন।\n❦~শুভ জন্মদিন~❦ @${name}` },
      { delay: 22000, msg: `কামনা করি তুমি যেন পৃথিবীর সব সুখ আস্বাদন করতে পারো।\nশুভ জন্মদিন @${name}` },
      { delay: 26000, msg: `শুভ হোক তোমার আগামী দিন।💖\nতোমার এই মুখের হাসি যেন সারাজীবন এমনি থাকুক, হ্যাপি বার্থডে ☺️ @${name}` },
      { delay: 30000, msg: `জন্মদিনের শুভেচ্ছা নিও প্রিয় @${name}!🎂\nতোমার পথ চলা হোক আনন্দের, ভালোবাসার ও সাফল্যের।` },
      { delay: 34000, msg: `𝗺𝗮𝗻𝘆 𝗺𝗮𝗻𝘆 𝗵𝗮𝗽𝗽𝘆 𝗿𝗲𝘁𝘂𝗿𝗻𝘀 𝗼𝗳 𝘁𝗵𝗲 𝗱𝗮𝘆 🥰😘\n 𝗛𝗮𝗽𝗽𝘆 𝗕𝗶𝗿𝘁𝗵𝗱𝗮𝘆 🎂 @${name}` },
      { delay: 38000, msg: `মন থেকে দোয়া করি‌ সব‌ সময় suhe থাকো ভালো থাকো 🥰 \nশুভ জন্মদিন @${name}!` },
      { delay: 42000, msg: `সবশেষে একটাই প্রত্যাশা সবসময় পাশে আছি ইনশাল্লাহ পাশে পাব 🥰😘 @${name}` }
    ];

    messages.forEach(({ delay, msg }) => {
      setTimeout(() => sendMessage(msg), delay);
    });

  } catch (error) {
    console.error(error);
    api.sendMessage(formatMsg("বার্তা পাঠাতে সমস্যা হয়েছে!\nদয়া করে আবার চেষ্টা করুন!"), threadID, messageID);
  }
};

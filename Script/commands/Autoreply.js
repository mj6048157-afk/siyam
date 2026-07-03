const axios = require("axios");

const apiList = "https://raw.githubusercontent.com/shahadat-sahu/SAHU-API/refs/heads/main/SAHU-API.json";

const getMainAPI = async () => {
  try {
    const res = await axios.get(apiList);
    return res.data.simsimi;
  } catch {
    return "https://api.simsimi.net/v2"; // Fallback URL
  }
};

module.exports.config = {
  name: "autoreplybot",
  version: "2.6.0",
  hasPermssion: 0,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  usePrefix: true, // প্রিফিক্স ট্রিগারের জন্য true করা হলো
  commandCategory: "Chat",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID } = event;
  if (!body) return;

  const msg = body.toLowerCase().trim();
  const prefix = global.config.PREFIX || "/"; // বটের মেইন প্রিফিক্স রিড করবে

  // ১. গালি ডিটেকশন লিস্ট (এখানে আরো গালি চাইলে কমা দিয়ে যোগ করতে পারবেন)
  const slangs = ["বাল", "bal", "খানকি", "khanki", "মাগি", "magi", "মাদারচোদ", "madarchod", "চোদ", "chod"];
  
  // গালির র‍্যান্ডম রিপ্লাই লিস্ট
  const slangReplies = [
    "বাহ্ ভাই বাহ্..! এইটাই কি তোমার বংশের পরিচয়? 🤮😹",
    "মুখটা ধুয়ে আসো ভাই, নর্দমার গন্ধ আসতেছে! 💩😷",
    "এত সুন্দর মুখে এত নোংরা ভাষা! ভালো হয়ে যাও মামা। 🤫🫵"
  ];

  // গালি চেক করা
  const hasSlang = slangs.some(slang => msg.includes(slang));
  if (hasSlang) {
    const randomSlangReply = slangReplies[Math.floor(Math.random() * slangReplies.length)];
    const formattedSlang = `───────────────\n» 🤬 ${randomSlangReply}\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;
    return api.sendMessage(formattedSlang, threadID, messageID);
  }

  // ২. লাইক ইমোজি চেক করা
  if (msg === "👍" || msg === "👍🏻" || msg === "👍🏼" || msg === "👍🏽" || msg === "👍🏾" || msg === "👍🏿") {
    const likeMsg = `───────────────\n» 😹 হাত মেরে কিবোর্ড দুর্বল করো না, ধন্যবাদ..! 🤙🔥\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;
    return api.sendMessage(likeMsg, threadID, messageID);
  }

  // ৩. প্রিফিক্স + hot/sex চেক করা
  if (msg === `${prefix}hot` || msg === `${prefix}sex`) {
    const hotMsg = `───────────────\n» 🫣 ছিঃহ্ ভালো হয়ে যাও মামা! এখনো সময় আছে, হাত মেরে কিবোর্ড দুর্বল করে ফেলতেছ কেন? 🥵🔨\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;
    return api.sendMessage(hotMsg, threadID, messageID);
  }

  // ৪. সাধারণ রেসপন্স অবজেক্ট (প্রিফিক্স ছাড়া)
  const responses = {
    "মিস ইউ": "অরেক বেডারে 𝗠𝗶𝘀𝘀 না করে xan মেয়ে হলে বস সিয়াম রে হাঙ্গা করো😶👻😘",
    "miss you": "অরেক বেডারে 𝗠𝗶𝘀𝘀 না করে xan মেয়ে হলে বস সিয়াম রে হাঙ্গা করো😶👻😘",
    "miss u": "অরেক বেডারে 𝗠𝗶𝘀𝘀 না করে xan মেয়ে হলে বস সিয়াম রে হাঙ্গা করো😶👻😘",
    "@rj siyam": "😑আমার বস সিয়াম কে তুমি ডাকো কেন🙄, 🥺তুই কি তাবিজ করছোস😾🥺",
    "পি্ঁচ্চি্ঁ রি্ঁদ্ঁয়্ঁ ত্যা্ঁহ্ঁ": "😑আমার বস সিয়াম কে তুমি ডাকো কেন🙄, 🥺তুই কি তাবিজ করছোস😾🥺",
    "কিস দে": "কিস দিস না তোর মুখে দূর গন্ধ কয়দিন ধরে দাঁত ব্রাশ করিস নাই🤬",
    "kiss de": "কিস দিস না তোর মুখে দূর গন্ধ কয়দিন ধরে দাঁত ব্রাশ করিস নাই🤬",
    "😘": "𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿.𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍, (ডাকনাম), সিয়াম (বাসা) কিশোরগঞ্জ/(বয়স) 16+/(যোগাযোগ)https://www.facebook.com/share/17dZVy6hhU//(𝗐𝗁𝖺𝗍𝗌𝖺𝗉𝗉)01789138157/চাইলে আপনিও এরকম একটা বট বানিয়ে নিতে পারবেন/..!🐸🤣👍⛏️",
    "hi": "এত হাই-হ্যালো কর ক্যান প্রিও..!😜🫵",
    "hello": "এত হাই-হ্যালো কর ক্যান প্রিও..!😜🫵",
    "🧚": "😾গ্রুপের সব সুন্দরী মাইয়া রা 🫰 আমার বস 🌝 সিয়ামের 🙈 বউ 🫵 বাকিগুলা 👉আমার বিয়াইন 🤏🥱",
    "ভার্চুয়াল কিং": "🫵তোদের সবার বাপ 🫵(বস) 🎀সিয়াম 🎀👉 আব্বু ডাক আব্বু 😾 মাদারচোদ😂",
    "virtual king": "🫵তোদের সবার বাপ 🫵(বস) 🎀সিয়াম 🎀👉 আব্বু ডাক আব্বু 😾 মাদারচোদ😂",
    "good morning": "𝗚𝗢𝗢𝗗 𝗠𝗢𝗥𝗡𝗜𝗡𝗚 দাত ব্রাশ করে খেয়ে নেও😚",
    "gm": "𝗚𝗢𝗢𝗗 𝗠𝗢𝗥𝗡𝗜𝗡𝗚 দাত ব্রাশ করে খেয়ে নেও😚",
    "good night": "𝗦𝘄𝗲𝗲𝘁 𝗗𝗿𝗲𝗮𝗺 babu… তবে আগে সিয়াম বস কে 𝗚𝗡 বলে নিও 😏💤",
    "gn": "𝗦𝘄𝗲𝗲𝘁 𝗗𝗿𝗲𝗮𝗺 babu… তবে আগে সিয়াম বস কে 𝗚𝗡 বলে নিও 😏💤",
    "সিয়াম": "উনি এখন কাজে বিজি আছে কি বলবেন আমাকে বলতে পারেন..!😘",
    "owner": "🫵খানকির পোলা তুই চিনস না😾) 👉শালা আবাল👈‎[𝐎𝐖𝐍𝐄𝐑:☞ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 ☜ https://www.facebook.com/share/17dZVy6hhU/\n𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: +8801789138157",
    "ওনার": "🫵খানকির পোলা তুই চিনস না😾) 👉শালা আবাল👈‎[𝐎𝐖𝐍𝐄𝐑:☞ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 ☜ https://www.facebook.com/share/17dZVy6hhU/\n𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: +8801789138157",
    "admin": "He is 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 তাকে সবাই 𝗔𝗱𝗺𝗶𝗻 𝗦𝗶𝘆𝗮𝗺-𝗛𝗮𝘀𝗮𝗻 হিসেবে চিনে😘☺️ 👉🫰মাদারচোদ তুই চিনিস না কেন 🫵😾🤒 🎀সরি প্রিয় মেম্বার 🎀",
    "এডমিন": "He is 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 তাকে সবাই 𝗔𝗱𝗺𝗶𝗻 𝗦𝗶𝘆𝗮𝗺-𝗛𝗮𝘀𝗮𝗻 হিসেবে চিনে😘☺️ 👉🫰মাদারচোদ তুই চিনিস না কেন 🫵😾🤒 🎀সরি প্রিয় মেম্বার 🎀",
    "babi": "এ তো হাছিনা হে মেরে দিলকি দারকান হে মেরি জান হে😍.",
    "babe": "এ তো হাছিনা হে মেরে দিলকি দারকান হে মেরি জান হে😍.",
    "রিলেশন": "🤬খ**** মাগির মেয়ে🐐 মাদিহা, 👉অর মায়রে চ*** শালী বারো ভাতারি 👈) 🎀(বস সিয়াম এর) জীবন পোড়াই শেষ কইরা থুইয়া গেছে 🥺)(অরে যে কোন গ্রুপে পাইলে পোদ মারবা) (ফেসবুক লিংক)/https://www.facebook.com/share/17dZVy6hhU/) পুদ মারো আর জিতে নাও 2 কোটি টাকা",
    "relation": "🤬খ**** মাগির মেয়ে🐐 মাদিহা, 👉অর মায়রে চ*** শালী বারো ভাতারি 👈) 🎀(বস সিয়াম এর) জীবন পোড়াই শেষ কইরা থুইয়া গেছে 🥺)(অরে যে কোন গ্রুপে পাইলে পোদ মারবা) (ফেসবুক লিংক)/https://www.facebook.com/share/17dZVy6hhU/) পুদ মারো আর জিতে নাও 2 কোটি টাকা",
    "assalamualaikum": "𝗪𝗮𝗹𝗮𝗶𝗸𝘂𝗺𝗮𝘀𝘀𝗮𝗹𝗮𝗺❤️‍🩹",
    "আসসালামু আলাইকুম": "𝗪𝗮𝗹𝗮𝗶𝗸𝘂𝗺𝗮𝘀𝘀𝗮𝗹𝗮𝗺❤️‍🩹",
    "fork": "(প্রিয় মেম্বার) 👉ইনবক্সে নক করো 👈 👉https://www.facebook.com/share/17dZVy6hhU/",
    "kiss me": "তুমি পঁচা তোমাকে কিস দিবো না 🤭",
    "কিস মি": "তুমি পঁচা তোমাকে কিস দিবো না 🤭",
    "thanks": "এতো ধন্যবাদ না দিয়ে আমার বস সিয়াম রে তোর গার্লফ্রেন্ড টা দিয়ে দে..!🐸🥵",
    "ধন্যবাদ": "এতো ধন্যবাদ না দিয়ে আমার বস সিয়াম রে তোর গার্লফ্রেন্ড টা দিয়ে দে..!🐸🥵",
    "아이 러ভ 유": "মেয়ে হলে আমার বস সিয়াম এর ইনবক্সে এখুনি গুঁতা দিন🫢😻👉https://www.facebook.com/share/17dZVy6hhU/",
    "i love you": "মেয়ে হলে আমার বস সিয়াম এর ইনবক্সে এখুনি গুঁতা দিন🫢😻👉https://www.facebook.com/share/17dZVy6hhU/",
    "ily": "মেয়ে হলে আমার বস সিয়াম এর ইনবক্সে এখুনি গুঁতা দিন🫢😻👉https://www.facebook.com/share/17dZVy6hhU/",
    "লাভ ইউ": "ভালোবাসা নামক আবলামী করতে চাইলে 𝗕𝗼𝘀𝘀 সিয়াম এর ইনবক্সে গুতা দিন 😘👉https://www.facebook.com/share/17dZVy6hhU/",
    "love you": "ভালোবাসা নামক আবলামী করতে চাইলে 𝗕𝗼𝘀𝘀 সিয়াম এর ইনবক্সে গুতা দিন 😘👉https://www.facebook.com/share/17dZVy6hhU/",
    "by": "কিরে তুই কই যাস কোন মেয়ের সাথে চিপায় যাবি)👉বস সিয়াম রে নিয়ে জা..!🌚🌶️",
    "bye": "কিরে তুই কই যাস কোন মেয়ের সাথে চিপায় যাবি)👉বস সিয়াম রে নিয়ে জা..!🌚🌶️",
    "আমি সিয়াম": "হ্যা বস কেমন আছেন ) কোন প্রবলেম হয়েছে) 👉নাম বলেন ওর মায়রে চোদবো 🫵😾..?☺️",
    "i am siyam": "হ্যা বস কেমন আছেন ) কোন প্রবলেম হয়েছে) 👉নাম বলেন ওর মায়রে চোদবো 🫵😾..?☺️",
    "বট ও মিঙ্গেল": "সিয়াম বস এর বাচ্চা তো তোমার গার্লফ্রেন্ডের পেটে..!!🌚⛏️",
    "তোমার নাম কি": "𝗠𝗬 𝗡𝗔𝗠𝗘 𝗜𝗦 ─꯭─⃝‌‌siyam chat Bot💖(বস)👉𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👈🎀👉https://www.facebook.com/share/17dZVy6hhU/",
    "your name": "𝗠𝗬 𝗡𝗔𝗠Ｅ 𝗜𝗦 ─꯭─⃝‌‌siyam chat Bot💖(বস)👉𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👈🎀👉https://www.facebook.com/share/17dZVy6hhU/",
    "পিক দে": "এন থেকে সর দুরে গিয়া মর😒",
    "pic de": "এন থেকে সর দুরে গিয়া মর😒",
    "cudi": "এত চোদা চুদি করস কেনো..!🥱🌝🌚",
    "নিশী": "🫵😤ঐ হালার পুত সাবধান 😤, নিশী,😘 তৃষা,😘 মাদিহা,😘 🫵😾ওইগুла আমার বস সিয়ামের 🤺তোরা কেউ নজর দিবি না 🤬, বিশেষ করে নিশি🥰 জামাই বল নিশি 🙈বস সিয়াম কে🌚🤤",
    "nishi": "🫵😤ঐ হালার পুত সাবধান 😤, নিশী,😘 তৃষা,😘 মাদিহা,😘 🫵😾ওইগুла আমার বস সিয়ামের 🤺তোরা কেউ নজর দিবি না 🤬, বিশেষ করে নিশি🥰 জামাই বল নিশি 🙈বস সিয়াম কে🌚🤤",
    "boda": "ভাই তুই এত হাসিস না..!🌚🤣",
    "kire ki koros": "তোমার কথা ভাবতে ছি জানু 😚",
    "কি করো": "বস সিয়াম এর সাথে প্রেমে ব্যস্ত আছি 😏💘",
    "ki koro": "বস সিয়াম এর সাথে প্রেমে ব্যস্ত আছি 😏💘",
    "কইরে বট": "হ্যাঁ সব কেমন আছেন আপনার ওই খানে উম্মাহ 😘😽🙈",
    "koire bot": "হ্যাঁ সব কেমন আছেন আপনার ওই খানে উম্মাহ 😘😽🙈",
    "valo aso": "হ্যাঁ রে প্রিও, বস সিয়াম এর দোয়ায় ভালো আছি 😌💞",
    "ভালো আছো": "হ্যাঁ রে প্রিও, বস সিয়াম এর দোয়ায় ভালো আছি 😌💞",
    "pagol": "হুম পাগল, কিন্তু তোমারই পাগল 😏😂",
    "পাগল": "হুম পাগল, কিন্তু তোমারই পাগল 😏😂",
    "ব্রেকআপ": "চিন্তা করিস না… সিয়াম বস তো আছেই তোকে নতুন জন দিয়া দিবে 😎🔥",
    "breakup": "চিন্তা করিস না… সিয়াম বস তো আছেই তোকে নতুন জন দিয়া দিবে 😎🔥",
    "তুমি কে": "আমি তোর বস সিয়াম এর 𝗖𝗵𝗮𝘁𝗕𝗼𝘁 😏",
    "tumi ke": "আমি তোর বস সিয়াম এর 𝗖𝗵𝗮𝘁𝗕𝗼𝘁 😏",
    "who are you": "আমি তোর বস সিয়াম এর 𝗖𝗵𝗮𝘁𝗕𝗼𝘁 😏",
    "umm": "এতো 𝗨𝗺𝗺 কেনো জানু… কিছু বলবা? 😉",
    "hmm": "𝗛𝗺𝗺 কিসের হুমম জানু 🥵",
    "love": "𝗟𝗼𝘃𝗲 করলে সরাসরি সিয়াম বস কে বল জানু 😻🔥"
  };

  if (!responses[msg]) return;

  if (!global.client.handleReply) global.client.handleReply = [];

  const formattedMsg = `───────────────\n» 💬 ${responses[msg]}\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

  return api.sendMessage(
    formattedMsg,
    threadID,
    (err, info) => {
      if (!err && info) {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "sahu"
        });
      }
    },
    messageID
  );
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (event.senderID !== handleReply.author) return;

  try {
    const text = event.body.trim();
    const base = await getMainAPI();
    const link = `${base}/simsimi?text=${encodeURIComponent(text)}`;
    const res = await axios.get(link);

    let reply = Array.isArray(res.data.response)
      ? res.data.response[0]
      : res.data.response;
      
    if (!reply) reply = "𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝘂𝗻𝗱𝗲𝗿𝘀𝘁𝗮𝗻𝗱 𝘁𝗵𝗮𝘁.";

    const formattedReply = `───────────────\n» 🤖 ${reply}\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

    return api.sendMessage(
      formattedReply,
      event.threadID,
      (err, info) => {
        if (!err && info) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "sahu"
          });
        }
      },
      event.messageID
    );

  } catch {
    const errorMsg = `───────────────\n» ❌ 𝗦𝗼𝗿𝗿𝘆, 𝗔𝗣𝗜 𝗲𝗿𝗿𝗼𝗿! 𝗘𝗻𝘁𝗲𝗿 𝗮𝗴𝗮𝗶ն 𝗹𝗮𝘁𝗲𝗿.\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;
    return api.sendMessage(errorMsg, event.threadID, event.messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  return module.exports.handleEvent({ api, event });
};

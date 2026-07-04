module.exports.config = {
  name: "money",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Lightweight economy system",
  commandCategory: "economy",
  usages: "",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args, Currencies }) {
  const { threadID, senderID, messageID, mentions } = event;
  
  const config = global.config || {};
  const botAdmins = config.ADMINBOT || [];

  if (!args[0]) {
    return api.sendMessage(
`───────────────
» 👑 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀:

» 𝗺𝗼𝗻𝗲𝘆 𝗰𝗸 @𝘁𝗮𝗴 — অন্যের ব্যালেন্স চেক করার জন্য।
» 𝗺𝗼𝗻𝗲𝘆 𝗺𝗲 <𝗮𝗺𝗼𝘂𝗻𝘁> — নিজের অ্যাকাউন্টে টাকা যুক্ত করার জন্য (𝗢𝗻𝗹𝘆 𝗔𝗱𝗺𝗶𝗻)।
» 𝗺𝗼𝗻𝗲𝘆 𝘀𝗲𝗻𝗱 @𝘁𝗮𝗴 <𝗮𝗺𝗼𝘂𝗻𝘁> — কাউকে টাকা পাঠানোর জন্য।
» 𝗺𝗼𝗻𝗲𝘆 𝗴𝗶𝗳𝘁 @𝘁𝗮𝗴 <𝗮𝗺𝗼𝘂𝗻𝘁> — কাউকে টাকা উপহার দেওয়ার জন্য (𝗢𝗻𝗹𝘆 𝗔𝗱𝗺𝗶𝗻)।
» 𝗺𝗼𝗻𝗲𝘆 𝗿𝗲𝘀𝘁𝗮𝗿𝘁 — নিজের ব্যালেন্স রিসেট করে শূন্য করার জন্য।
» 𝗺𝗼𝗻𝗲𝘆 𝗯𝗼𝗮𝗿𝗱 — সবচেয়ে ধনী ৫ জনের তালিকা দেখার জন্য।
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }

  const type = args[0].toLowerCase();

  if (type === "ck") {
    if (Object.keys(mentions).length !== 1) {
      return api.sendMessage(
`───────────────
» ⚠️ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗮𝗴 𝟭 𝘂𝘀𝗲𝗿!
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
    }

    const uid = Object.keys(mentions)[0];
    const money = (await Currencies.getData(uid)).money || 0;

    return api.sendMessage(
      {
        body: `───────────────\n» 👑 ${mentions[uid]}'𝘀 𝗯𝗮𝗹𝗮𝗻𝗰𝗲: ${money}$\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        mentions: [{ tag: mentions[uid], id: uid }]
      },
      threadID,
      messageID
    );
  }

  if (type === "me") {
    if (!botAdmins.includes(senderID)) {
      return api.sendMessage(
`───────────────
» ❌ 𝗢𝗻𝗹𝘆 𝗕𝗼𝘁 𝗔𝗱𝗺𝗶𝗻𝘀 𝗰𝗮𝗻 𝗮𝗱𝗱 𝗺𝗼𝗻𝗲𝘆 𝘁𝗼 𝘁𝗵𝗲𝗺𝘀𝗲𝗹𝘃𝗲𝘀!
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
    }

    if (!args[1] || isNaN(args[1])) {
      return api.sendMessage(
`───────────────
» ⚠️ 𝗨𝘀𝗮𝗴𝗲: 𝗺𝗼𝗻𝗲𝘆 𝗺𝗲 <𝗮𝗺𝗼𝘂𝗻𝘁>
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
    }

    const amount = parseInt(args[1]);
    await Currencies.increaseMoney(senderID, amount);

    return api.sendMessage(
`───────────────
» 💵 𝗔𝗱𝗱𝗲𝗱 ${amount}$ 𝘁𝗼 𝘆𝗼𝘂𝗿 𝗯𝗮𝗹𝗮𝗻𝗰𝗲!
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }

  if (type === "send") {
    if (Object.keys(mentions).length !== 1) {
      return api.sendMessage(
`───────────────
» ⚠️ 𝗨𝘀𝗮𝗴𝗲: 𝗺𝗼𝗻𝗲𝘆 𝘀𝗲𝗻𝗱 @𝘁𝗮𝗴 <𝗮𝗺𝗼𝘂𝗻𝘁>
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
    }

    const uid = Object.keys(mentions)[0];
    const amount = parseInt(args[args.length - 1]);

    if (isNaN(amount) || amount <= 0) {
      return api.sendMessage(
`───────────────
» ⚠️ 𝗨𝘀𝗮𝗴𝗲: 𝗺𝗼𝗻𝗲𝘆 𝘀𝗲𝗻𝗱 @𝘁𝗮𝗴 <𝗮𝗺𝗼𝘂𝗻𝘁>
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
    }

    const senderData = await Currencies.getData(senderID);
    const currentMoney = senderData.money || 0;
    if (currentMoney < amount) {
      return api.sendMessage(
`───────────────
» ❌ 𝗬𝗼𝘂 𝗱𝗼𝗻'𝘁 𝗵𝗮𝘃𝗲 𝗲𝗻𝗼𝘂𝗴𝗵 𝗺𝗼𝗻𝗲𝘆!
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
    }

    await Currencies.decreaseMoney(senderID, amount);
    await Currencies.increaseMoney(uid, amount);

    return api.sendMessage(
      {
        body: `───────────────\n» 👑 ✅ 𝗦𝗲𝗻𝘁 ${amount}$ 𝘁𝗼 ${mentions[uid]}\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        mentions: [{ tag: mentions[uid], id: uid }]
      },
      threadID,
      messageID
    );
  }

  if (type === "gift") {
    if (!botAdmins.includes(senderID)) {
      return api.sendMessage(
`───────────────
» ❌ 𝗢𝗻𝗹𝘆 𝗕𝗼𝘁 𝗔𝗱𝗺𝗶𝗻𝘀 𝗰𝗮𝗻 𝗴𝗶𝗳𝘁 𝗺𝗼𝗻𝗲𝘆!
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
    }

    if (Object.keys(mentions).length !== 1) {
      return api.sendMessage(
`───────────────
» ⚠️ 𝗨𝘀𝗮𝗴𝗲: 𝗺𝗼𝗻𝗲𝘆 𝗴𝗶𝗳𝘁 @𝘁𝗮𝗴 <𝗮𝗺𝗼𝘂𝗻𝘁>
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
    }

    const uid = Object.keys(mentions)[0];
    const amount = parseInt(args[args.length - 1]);

    if (isNaN(amount) || amount <= 0) {
      return api.sendMessage(
`───────────────
» ⚠️ 𝗨𝘀𝗮𝗴𝗲: 𝗺𝗼𝗻𝗲𝘆 𝗴𝗶𝗳𝘁 @𝘁𝗮𝗴 <𝗮𝗺𝗼𝘂𝗻𝘁>
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
    }

    await Currencies.increaseMoney(uid, amount);

    return api.sendMessage(
      {
        body: `───────────────\n» 🎁 𝗚𝗶𝗳𝘁𝗲𝗱 ${amount}$ 𝘁𝗼 ${mentions[uid]}\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        mentions: [{ tag: mentions[uid], id: uid }]
      },
      threadID,
      messageID
    );
  }

  if (type === "restart") {
    await Currencies.setData(senderID, { money: 0 });
    return api.sendMessage(
`───────────────
» ♻️ 𝗬𝗼𝘂𝗿 𝗺𝗼𝗻𝗲𝘆 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗿𝗲𝘀𝗲𝘁.
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }

  if (type === "board") {
    const allUsers = await Currencies.getAll(["money"]);

    const filtered = allUsers.map(u => ({
      userID: u.userID,
      money: u.money || u.data?.money || 0
    }));

    filtered.sort((a, b) => b.money - a.money);
    const top = filtered.slice(0, 5);

    let msg = `───────────────\n» 👑 𝗧𝗼𝗽 𝗥𝗶𝗰𝗵𝗲𝘀𝘁 𝗨𝘀𝗲𝗿𝘀:\n\n`;
    let index = 1;

    for (const user of top) {
      let name = global.data.userName.get(user.userID);

      if (!name) {
        try {
          const info = await api.getUserInfo(user.userID);
          name = info[user.userID]?.name || "𝗨𝗻𝗸𝗻𝗼𝘄𝗻 𝗨𝘀𝗲𝗿";
          global.data.userName.set(user.userID, name);
        } catch {
          name = "𝗨𝗻𝗸𝗻𝗼𝘄𝗻 𝗨𝘀𝗲𝗿";
        }
      }

      msg += `${index++}. ${name} — ${user.money}$\n`;
    }
    
    msg += `───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

    return api.sendMessage(msg, threadID, messageID);
  }

  return api.sendMessage(
`───────────────
» 👑 ⚠️ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗰𝗼𝗺𝗺𝗮𝗻𝗱.
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
};

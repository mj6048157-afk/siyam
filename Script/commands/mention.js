module.exports.config = {
  name: "mention",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Mention someone repeatedly with notification",
  commandCategory: "group",
  usages: "[@mention] [count / off]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const { mentions, threadID, messageID, senderID } = event;

  if (!global.mentionStatus) {
    global.mentionStatus = {};
  }

  const input = args.join(" ").toLowerCase();

  if (input.includes("off")) {
    global.mentionStatus[threadID] = false;
    return api.sendMessage(
`───────────────
» 👑 𝗠𝗲𝗻𝘁𝗶𝗼𝗻 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝘁𝘂𝗿𝗻𝗲𝗱 𝗼𝗳𝗳!
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }

  if (Object.keys(mentions).length === 0) {
    return api.sendMessage(
`───────────────
» 👑 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗮𝗴 𝘀𝗼𝗺𝗲𝗼𝗻𝗲 𝘁𝗼 𝗺𝗲𝗻𝘁𝗶𝗼𝗻!
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }

  const mentionID = Object.keys(mentions)[0];
  const mentionName = mentions[mentionID];

  let count = parseInt(args[args.length - 1]);
  if (isNaN(count)) count = 1;
  const repeatCount = Math.min(count, 500);

  global.mentionStatus[threadID] = true;

  const messages = [
    (name) => `👑 ${name} 🌝চিপা থেকে বাহির হও 🫣 সিয়াম বস ডাকতেছে😠`,
    (name) => `👑 ${name} 🙆চিপা থেকে বাহির হও😠🌝`
  ];

  for (let i = 0; i < repeatCount; i++) {
    if (!global.mentionStatus[threadID]) break;

    try {
      const selectedMessage = messages[i % messages.length](mentionName);

      await api.sendMessage({
        body: `───────────────\n» ${selectedMessage}\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        mentions: [{ tag: mentionName, id: mentionID }]
      }, threadID);

      if (i < repeatCount - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error(error);
      break;
    }
  }
};

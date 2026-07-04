const { writeFileSync, existsSync } = require("fs-extra");
const { resolve } = require("path");

module.exports.config = {
  name: "0admin",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Admin Management System",
  commandCategory: "Admin",
  usages: "[list | add | remove | only | boxonly] [uid | @mention | reply]",
  cooldowns: 0,
  usePrefix: true,
  dependencies: { "fs-extra": "" }
};

module.exports.languages = {
  en: {
    listAdmin: "───────────────\n\n» 👑 𝗔𝗱𝗺𝗶𝗻 𝗟𝗶𝘀𝘁:\n\n%1\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    noPermission: "───────────────\n\n» ❎ 𝗬𝗼𝘂 𝗱𝗼𝗻'𝘁 𝗵𝗮𝘃𝗲 𝗽𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻 𝘁𝗼 𝘂𝘀𝗲 \"%1\"\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀逆",
    addedAdmin: "───────────────\n\n» ✅ 𝗔𝗱𝗱𝗲𝗱 %1 𝗮𝗱𝗺𝗶𝗻(𝘀):\n\n%2\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    removedAdmin: "───────────────\n\n» ✅ <b>𝗥𝗲𝗺𝗼𝘃𝗲𝗱 %1 𝗮𝗱𝗺𝗶𝗻(𝘀):</b>\n\n%2\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    adminOnlyOn: "───────────────\n\n» 🔓 𝗔𝗱𝗺𝗶𝗻-𝗼𝗻𝗹𝘆 𝗺𝗼𝗱𝗲 𝗲𝗻𝗮𝗯𝗹𝗲𝗱\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    adminOnlyOff: "───────────────\n\n» ✅ <b>𝗔𝗱𝗺𝗶𝗻-𝗼𝗻𝗹𝘆 <b>𝗺𝗼𝗱𝗲 𝗱𝗶𝘀𝗮𝗯𝗹𝗲𝗱</b>\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    boxOnlyOn: "───────────────\n\n» 🔓 𝗚𝗿𝗼𝘂𝗽 𝗮𝗱𝗺𝗶𝗻-𝗼𝗻𝗹𝘆 𝗺𝗼𝗱𝗲 𝗲𝗻𝗮𝗯𝗹𝗲𝗱\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    boxOnlyOff: "───────────────\n\n» ✅ 𝗚𝗿𝗼𝘂𝗽 𝗮𝗱𝗺𝗶𝗻-𝗼𝗻𝗹𝘆 𝗺𝗼𝗱𝗲 𝗱𝗶𝘀𝗮𝗯𝗹𝗲𝗱\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"
  }
};

module.exports.onLoad = () => {
  const path = resolve(__dirname, "cache", "data.json");
  if (!existsSync(path)) writeFileSync(path, JSON.stringify({ adminbox: {} }, null, 4));
};

module.exports.run = async function ({ api, event, args, Users, permssion, getText }) {
  const { threadID, messageID, mentions } = event;
  const content = args.slice(1);
  const mentionIDs = Object.keys(mentions);
  const { configPath } = global.client;

  delete require.cache[require.resolve(configPath)];
  const config = require(configPath);

  const ADMINBOT = global.config.ADMINBOT || config.ADMINBOT || [];

  const getUIDs = () => {
    if (event.type === "message_reply") return [event.messageReply.senderID];
    if (mentionIDs.length) return mentionIDs;
    if (!isNaN(content[0])) return [content[0]];
    return [];
  };

  switch (args[0]) {
    case "list":
    case "all": {
      const msg = [];
      for (const id of ADMINBOT) {
        const name = (await Users.getData(id)).name;
        msg.push(`• ${name}\nhttps://facebook.com/${id}`);
      }
      return api.sendMessage(getText("listAdmin", msg.join("\n\n")), threadID, messageID);
    }

    case "add": {
      if (permssion != 3) return api.sendMessage(getText("noPermission", "𝗮𝗱𝗱"), threadID, messageID);
      const ids = getUIDs();
      const added = [];

      for (const id of ids) {
        if (!ADMINBOT.includes(id)) {
          ADMINBOT.push(id);
          config.ADMINBOT.push(id);
          const name = (await Users.getData(id)).name;
          added.push(`• ${name} (${id})`);
        }
      }

      writeFileSync(configPath, JSON.stringify(config, null, 4));
      return api.sendMessage(getText("addedAdmin", added.length, added.join("\n")), threadID, messageID);
    }

    case "remove":
    case "rm": {
      if (permssion != 3) return api.sendMessage(getText("noPermission", "𝗿𝗲𝗺𝗼𝘃𝗲"), threadID, messageID);
      const ids = getUIDs();
      const removed = [];

      for (const id of ids) {
        const index = ADMINBOT.indexOf(id);
        if (index !== -1) {
          ADMINBOT.splice(index, 1);
          config.ADMINBOT.splice(index, 1);
          const name = (await Users.getData(id)).name;
          removed.push(`• ${name} (${id})`);
        }
      }

      writeFileSync(configPath, JSON.stringify(config, null, 4));
      return api.sendMessage(getText("removedAdmin", removed.length, removed.join("\n")), threadID, messageID);
    }

    case "only": {
      if (permssion != 3) return api.sendMessage(getText("noPermission", "𝗼𝗻𝗹𝘆"), threadID, messageID);
      config.adminOnly = !config.adminOnly;
      writeFileSync(configPath, JSON.stringify(config, null, 4));
      return api.sendMessage(config.adminOnly ? getText("adminOnlyOn") : getText("adminOnlyOff"), threadID, messageID);
    }

    case "boxonly": {
      if (permssion != 3) return api.sendMessage(getText("noPermission", "𝗯𝗼𝘅𝗼𝗻𝗹𝘆"), threadID, messageID);
      const path = resolve(__dirname, "cache", "data.json");
      delete require.cache[require.resolve(path)];
      const database = require(path);

      database.adminbox[threadID] = !database.adminbox[threadID];
      writeFileSync(path, JSON.stringify(database, null, 4));

      return api.sendMessage(
        database.adminbox[threadID] ? getText("boxOnlyOn") : getText("boxOnlyOff"),
        threadID,
        messageID
      );
    }

    default:
      return;
  }
};

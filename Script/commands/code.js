const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "code",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Simple file reader",
  commandCategory: "System",
  usages: "[list/list all/fileName]",
  cooldowns: 0,
  usePrefix: true
};

function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".git") {
        results = results.concat(getAllFiles(filePath));
      }
    } else if (file.endsWith(".js")) {
      results.push(filePath);
    }
  });

  return results;
}

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  if (!args[0]) {
    return api.sendMessage(
      "───────────────\n\n» ⚠️ 𝗘𝗻𝘁𝗲𝗿 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗻𝗮𝗺𝗲 𝗼𝗿 '𝗹𝗶𝘀𝘁'.\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
      threadID,
      messageID
    );
  }

  if (args[0] === "list") {
    if (args[1] === "all") {
      const allFiles = getAllFiles(__dirname);
      let msg = "───────────────\n\n» 📂 𝗙𝘂𝗹𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁:\n\n";
      allFiles.forEach((f, i) => {
        msg += `» ${i + 1}. [📄] ${path.relative(__dirname, f)}\n`;
      });
      msg += "\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
      return api.sendMessage(msg, threadID, messageID);
    }

    const files = fs.readdirSync(__dirname).filter(f => f.endsWith(".js"));
    let msg = "───────────────\n\n» 📂 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁:\n\n";
    files.forEach((f, i) => {
      msg += `» ${i + 1}. [📄] ${f}\n`;
    });
    msg += "\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
    return api.sendMessage(msg, threadID, messageID);
  }

  const safeName = args[0].replace(/[^a-zA-Z0-9_-]/g, "") + ".js";
  const filePath = path.join(__dirname, safeName);

  if (!fs.existsSync(filePath)) {
    return api.sendMessage(
      "───────────────\n\n» ❌ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗳𝗶𝗹𝗲 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱.\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
      threadID,
      messageID
    );
  }

  const code = fs.readFileSync(filePath, "utf8");

  if (code.length <= 12000) {
    return api.sendMessage(
      `───────────────\n\n📝 𝗖𝗼𝗱𝗲 𝗩𝗶𝗲𝘄:\n\n${code}\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
      threadID,
      messageID
    );
  }

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const temp = path.join(cacheDir, safeName.replace(".js", ".txt"));
  fs.writeFileSync(temp, code);

  return api.sendMessage(
    {
      body: "───────────────\n\n» 📄 𝗖𝗼𝗱𝗲 𝗳𝗶𝗹𝗲 𝗶𝘀 𝘁𝗼𝗼 𝗹𝗮𝗿𝗴𝗲. 𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𝗮𝘀 𝗮 𝗳𝗶𝗹𝗲.\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
      attachment: fs.createReadStream(temp)
    },
    threadID,
    () => {
      if (fs.existsSync(temp)) fs.unlinkSync(temp);
    },
    messageID
  );
};

const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "onlyadmin",
  version: "2.0",
  hasPermssion: 2,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Admin only mode toggle",
  commandCategory: "Admin",
  usages: "onlyadmin",
  cooldowns: 5
};

module.exports.onLoad = () => {
  const file = path.resolve(__dirname, "cache", "data.json");
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({ adminbox: {} }));
  } else {
    const data = JSON.parse(fs.readFileSync(file));
    if (!data.adminbox) data.adminbox = {};
    fs.writeFileSync(file, JSON.stringify(data));
  }
};

module.exports.run = async ({ api, event }) => {
  const file = path.resolve(__dirname, "cache", "data.json");
  delete require.cache[require.resolve(file)];
  const data = require(file);

  const id = event.threadID;
  if (!data.adminbox) data.adminbox = {};

  data.adminbox[id] = !data.adminbox[id];
  fs.writeFileSync(file, JSON.stringify(data));

  const msg = data.adminbox[id]
    ? "───────────────\n» 👑 𝗔𝗱𝗺𝗶𝗻 𝗢𝗻𝗹𝘆 𝗠𝗼𝗱𝗲: 𝗘𝗻𝗮𝗯𝗹𝗲𝗱 🔒\n» 🧚এখন শুধু আমার বস 👑-𝐒𝐈𝐘𝐀𝐌-👑 বট ব্যবহার করতে পারবে✅।\n───────────────\n»👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"
    : "───────────────\n» 🌐 𝗔𝗱𝗺𝗶𝗻 𝗢𝗻𝗹𝘆 𝗠𝗼𝗱𝗲: 𝗗𝗶𝘀𝗮𝗯𝗹𝗲𝗱 🔓\n» 🫶এখন সবাই বট ব্যবহার করতে পারবে।✅\n───────────────\n»👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

  api.sendMessage(msg, id, event.messageID);
};

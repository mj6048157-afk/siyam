const request = require("request");
const fs = require("fs-extra");

module.exports.config = {
  name: "owner",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Show Owner Info with styled box & random photo",
  commandCategory: "Information",
  usages: "owner",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {
  const info = `───────────────
» 👑 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢
───────────────
» 👤 𝗡𝗮𝗺𝗲 : 𝗦𝗶𝘆𝗮𝗺 𝗛𝗮𝘀𝗮𝗻
» 🧸 𝗡𝗶𝗰𝗸 𝗡𝗮𝗺𝗲 : 𝗦𝗶𝘆𝗮𝗺 
» 🎂 𝗔𝗴𝗲 : 𝟭𝟳+
» 💘 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻 : 𝗦𝗶𝗻𝗴𝗹𝗲
» 🎓 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻 : 𝗦𝘁𝘂𝗱𝗲𝗻𝘁
» 📚 𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻 : 𝟭𝟬
» 🏡 𝗔𝗱𝗱𝗿𝗲𝘀𝘀 : 𝗞𝗶𝘀𝗵𝗼𝗿𝗲𝗴𝗮𝗻𝗷
───────────────
» 🔗 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗟𝗜𝗡𝗞𝗦
───────────────
» 📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 : fb.com/61591371186179
» 📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 : wa.me/01789138157
» ✈️ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 : +8801789138157
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

  const images = [
    "https://i.imgur.com/jM3nKe6.jpeg",
    "https://i.imgur.com/gQzQ6wK.jpeg"
  ];

  const randomImg = images[Math.floor(Math.random() * images.length)];

  const callback = () => api.sendMessage(
    {
      body: info,
      attachment: fs.createReadStream(__dirname + "/cache/owner.jpg")
    },
    event.threadID,
    () => fs.unlinkSync(__dirname + "/cache/owner.jpg")
  );

  return request(encodeURI(randomImg))
    .pipe(fs.createWriteStream(__dirname + "/cache/owner.jpg"))
    .on("close", () => callback());
};

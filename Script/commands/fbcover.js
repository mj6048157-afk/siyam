const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports.config = {
  name: "fbcover",
  version: "6.9",
  hasPermssion: 0,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Facebook cover",
  usePrefix: true,
  prefix: true,
  commandCategory: "Cover",
  category: " cover",
  usages: "name - title - address - email - phone - color (default = white)",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Users }) {
  const dipto = args.join(" ");
  let id;
  if (event.type === "message_reply") {
    id = event.messageReply.senderID;
  } else {
    id = Object.keys(event.mentions)[0] || event.senderID;
  }
  var nam = await Users.getNameUser(id);

  if (!dipto) {
    return api.sendMessage(
      `───────────────\n\n» ❌ 𝗪𝗿𝗼𝗻𝗴 𝗙𝗼𝗿𝗺𝗮𝘁! 𝗧𝗿𝘆: \nfbcover v1/v2/v3 - 𝗡𝗮𝗺𝗲 - 𝗧𝗶𝘁𝗹𝗲 - 𝗔𝗱𝗱𝗿𝗲𝘀𝘀 - 𝗘𝗺𝗮𝗶𝗹 - 𝗣𝗵𝗼𝗻𝗲 - 𝗖𝗼𝗹𝗼𝗿 (𝗗𝗲𝗳𝗮𝘂𝗹𝘁 = 𝗪𝗵𝗶𝘁𝗲)\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
      event.threadID,
      event.messageID,
    );
  } else {
    const msg = dipto.split("-");
    const v = (msg[0] || "v1").trim();
    const name = (msg[1] || " ").trim();
    const subname = (msg[2] || " ").trim();
    const address = (msg[3] || " ").trim();
    const email = (msg[4] || " ").trim();
    const phone = (msg[5] || " ").trim();
    const color = (msg[6] || "white").trim();

    api.sendMessage(
      `───────────────\n\n» ⏳ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗰𝗼𝘃𝗲𝗿, 𝗪𝗮𝗶𝘁 𝗸𝗼𝗿𝗼 𝗯𝗮𝗯𝘆 😘\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
      event.threadID,
      (err, info) => {
        if (!err) {
          setTimeout(() => {
            api.unsendMessage(info.messageID);
          }, 4000);
        }
      }
    );

    try {
      const apiUrl = await baseApiUrl();
      const img = `${apiUrl}/cover/${v}?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(subname)}&number=${encodeURIComponent(phone)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&colour=${encodeURIComponent(color)}&uid=${id}`;
      
      const response = await axios.get(img, { responseType: "stream" });
      const attachment = response.data;

      return api.sendMessage(
        {
          body: `───────────────\n\n» 🔵 𝗙𝗜𝗥𝗦𝗧 𝗡𝗔𝗠𝗘: ${name}\n» ⚫ 𝗦𝗘𝗖𝗢𝗡𝗗 𝗡𝗔𝗠𝗘: ${subname}\n» ⚪ 𝗔𝗗𝗗𝗥𝗘𝗦𝗦: ${address}\n» 📫 𝗠𝗔𝗜𝗟: ${email}\n» ☎️ 𝗣𝗛𝗢𝗡𝗘 𝗡𝗢.: ${phone}\n» ☢️ 𝗖𝗢𝗟𝗢𝗥: ${color}\n» 💁 𝗨𝗦𝗘𝗥 𝗡𝗔𝗠𝗘: ${nam}\n» ✅ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${v}\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
          attachment,
        },
        event.threadID,
        event.messageID,
      );
    } catch (error) {
      console.error(error);
      return api.sendMessage(
        `───────────────\n\n» ❌ 𝗔𝗣𝗜 𝗘𝗿𝗿𝗼𝗿 𝗖𝗮𝗹𝗹 𝗦𝗶𝘆𝗮𝗺. ${error.message}\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        event.threadID,
        event.messageID
      );
    }
  }
};

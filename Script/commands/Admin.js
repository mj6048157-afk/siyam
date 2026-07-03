const axios = require("axios");
const fs = require("fs-extra");
const moment = require("moment-timezone");
const path = require("path");

module.exports.config = {
 name: "admin",
 version: "1.1.0",
 hasPermssion: 0,
 credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
 description: "Show Owner Info with Dynamic Media",
 commandCategory: "info",
 usages: "admin",
 cooldowns: 2
};

module.exports.run = async function({ api, event }) {
 const time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");
 const cacheDir = path.join(__dirname, "cache");
 
 if (!fs.existsSync(cacheDir)) {
   fs.ensureDirSync(cacheDir);
 }

 // এখানে আপনার পিকচার বা ভিডিওর লিংকগুলো বসাবেন (ভবিষ্যতে পরিবর্তন করতে পারবেন)
 const mediaLinks = [
   "https://tmpfiles.org/dl/wxwqjRu5EG5Q/catbox_1783073117809.jpg",
   "https://tmpfiles.org/dl/wTwAjhuKEKeC/catbox_1783073109399.jpg"
 ];

 const randomLink = mediaLinks[Math.floor(Math.random() * mediaLinks.length)];
 const fileExtension = randomLink.split('.').pop().split('?')[0] || "jpg";
 const filePath = path.join(cacheDir, `owner_media.${fileExtension}`);

 try {
   const response = await axios({
     method: "get",
     url: randomLink,
     responseType: "stream"
   });

   const writer = fs.createWriteStream(filePath);
   response.data.pipe(writer);

   writer.on("finish", () => {
     return api.sendMessage({
       body: `
┌───────────────⭓
│ 𝗢𝗪𝗡𝗘𝗥 𝗗𝗘𝗧𝗔𝗜𝗟𝗦
├───────────────
│ 👤 𝐍𝐚𝐦𝐞 : 𝗦𝗜𝗬𝗔𝗠 𝗛𝗔𝗦𝗔𝗡
│ 🚹 𝐆𝐞𝐧𝐝𝐞𝐫 : 𝗠𝗮𝗹𝗲
│ ❤️ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨 n : 𝗦𝗶𝗻𝗴𝗹𝗲
│ 🎂 𝐀𝐠𝐞 : 𝟭𝟳+
│ 🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧 : 𝗜𝘀𝗹𝗮𝗺
│ 🎓 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 : 𝗖𝗹𝗮𝘀𝘀 𝟭𝟬
│ 🏡 𝐀𝐝𝐝𝐫𝐞𝐬𝐬 : 𝗞𝗶𝘀𝗵𝗼𝗿𝗲𝗴𝗮𝗻𝗷
└───────────────⭓

┌───────────────⭓
│ 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗟𝗜𝗡𝗞𝗦
├───────────────
│ 📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸:
│ https://fb.com/100001039692046
│ 💬 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽:
│ https://wa.me/01789138157
└───────────────⭓

┌───────────────⭓
│ 🕒 𝗨𝗽𝗱𝗮𝘁𝗲𝗱 𝗧𝗶𝗺𝗲
├───────────────
│ ${time}
└───────────────⭓
 `,
       attachment: fs.createReadStream(filePath)
     }, event.threadID, () => {
       if (fs.existsSync(filePath)) {
         fs.unlinkSync(filePath);
       }
     });
   });

   writer.on("error", () => {
     return api.sendMessage("───────────────\n» ❎ 𝗠𝗲𝗱𝗶𝗮 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗙𝗮𝗶𝗹𝗲𝗱\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍", event.threadID);
   });

 } catch (error) {
   return api.sendMessage("───────────────\n» ❎ 𝗔𝗣𝗜 𝗘𝗿𝗿𝗼𝗿\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍", event.threadID);
 }
};

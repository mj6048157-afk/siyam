const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "notice",
  version: "1.0.0",
  hasPermssion: 2, 
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "সকল গ্রুপে নোটিশ পাঠান (টেক্সট, ইমেজ, ভিডিও, অডিও, ফাইল সহ)",
  commandCategory: "Admin",
  usages: "/notice <টেক্সট> বা রিপ্লাই দিয়ে মেসেজ দিন",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args, Users }) => {
  const { threadID, messageID, senderID } = event;
  
  // মেইন বোট অ্যাডমিন চেক (config.json থেকে পারমিশন)
  const config = global.config || {};
  const botAdmins = config.ADMINBOT || [];
  if (!botAdmins.includes(senderID)) {
    return api.sendMessage(
`───────────────
» ❌ 𝗢𝗻𝗹𝘆 𝗕𝗼𝘁 𝗔𝗱𝗺𝗶𝗻𝘀 𝗰𝗮𝗻 𝘂𝘀𝗲 𝘁𝗵𝗶𝘀 𝗰𝗼𝗺𝗺𝗮𝗻𝗱.
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }

  try {
    const allThreads = global.data.allThreadID || [];
    const senderName = await Users.getNameUser(senderID);
    let successCount = 0;
    let failedCount = 0;

    // ক্যাশ ফোল্ডার না থাকলে তৈরি করার সুরক্ষা
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    if (event.type === "message_reply") {
      const replyMsg = event.messageReply;
      const attachments = replyMsg.attachments || [];

      if (attachments.length === 0) {
        // যদি শুধু টেক্সট মেসেজ রিপ্লাই দেওয়া হয়
        const noticeText = replyMsg.body || args.join(" ");
        if (!noticeText) {
          return api.sendMessage(
`───────────────
» ⚠️ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝘆𝗽𝗲 𝗮 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗼𝗿 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝘀𝗼𝗺𝗲𝘁𝗵𝗶𝗻𝗴!
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
        }

        for (const id of allThreads) {
          if (id != threadID) {
            try {
              await api.sendMessage(`───────────────\n» 📢 𝗡𝗼𝘁𝗶𝗰𝗲 𝗙𝗿𝗼𝗺 𝗔𝗱𝗺𝗶𝗻 (${senderName}):\n\n${noticeText}\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, id);
              successCount++;
            } catch (err) {
              failedCount++;
            }
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }
      } else {
        // যদি ইমেজ/ভিডিও/ফাইল রিপ্লাই দেওয়া হয়
        for (let i = 0; i < attachments.length; i++) {
          const attachment = attachments[i];
          const fileUrl = attachment.url;
          
          // ফাইলের সঠিক এক্সটেনশন নির্ধারণ করা
          let ext = "bin";
          if (attachment.type === "photo") ext = "jpg";
          else if (attachment.type === "video") ext = "mp4";
          else if (attachment.type === "audio") ext = "mp3";
          else if (attachment.type === "animated_image") ext = "gif";

          const filePath = path.join(cacheDir, `notice_file_${Date.now()}_${i}.${ext}`);

          try {
            const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
            await fs.writeFile(filePath, Buffer.from(response.data, "binary"));

            for (const id of allThreads) {
              if (id != threadID) {
                try {
                  await api.sendMessage(
                    {
                      body: `───────────────\n» 📢 𝗡𝗼𝘁𝗶𝗰𝗲 𝗙𝗿𝗼𝗺 𝗔𝗱𝗺𝗶𝗻 (${senderName}):\n\n${replyMsg.body || args.join(" ")}\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
                      attachment: fs.createReadStream(filePath),
                    },
                    id
                  );
                  successCount++;
                } catch (error) {
                  failedCount++;
                }
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }
            }
            if (fs.existsSync(filePath)) {
              await fs.unlink(filePath);
            }
          } catch (error) {
            console.error("File download/send error:", error);
          }
        }
      }
    } 
    else if (args.length > 0) {
      // যদি সরাসরি লিখে নোটিশ দেওয়া হয়
      const noticeText = args.join(" ");

      for (const id of allThreads) {
        if (id != threadID) {
          try {
            await api.sendMessage(`───────────────\n» 📢 𝗡𝗼𝘁𝗶𝗰𝗲 𝗙𝗿𝗼𝗺 𝗔𝗱𝗺𝗶𝗻 (${senderName}):\n\n${noticeText}\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, id);
            successCount++;
          } catch (error) {
            failedCount++;
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    } else {
      return api.sendMessage(
`───────────────
» 👑 𝗨𝘀𝗮𝗴𝗲 / 𝗕𝗮𝗻𝗴𝗹𝗮 𝗚𝘂𝗶𝗱𝗲𝗹𝗶𝗻𝗲:
» ১. সরাসরি টেক্সট নোটিশ দিতে লিখুন:
• /𝗻𝗼𝘁𝗶𝗰𝗲 আপনার নোটিশ টেক্সট
» ২. যেকোনো ছবি, ভিডিও, অডিও বা ফাইল সহ নোটিশ দিতে:
• ছবি বা ফাইলের উপর রিপ্লাই দিয়ে লিখুন: /𝗻𝗼𝘁𝗶𝗰𝗲 আপনার নোটিশ টেক্সট
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
    }

    return api.sendMessage(
`───────────────
» 👑 𝗡𝗼𝘁𝗶𝗰𝗲 𝗥𝗲𝗽𝗼𝗿𝘁:
» ✅ 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝘀𝗲𝗻𝘁 𝘁𝗼 ${successCount} 𝗴𝗿𝗼𝘂𝗽𝘀!
» ❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝘀𝗲𝗻𝘁 𝘁𝗼 ${failedCount} 𝗴𝗿𝗼𝘂𝗽𝘀.
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);

  } catch (error) {
    console.error("Global error:", error);
    return api.sendMessage(
`───────────────
» ❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝘀𝗲𝗻𝗱𝗶𝗻𝗴 𝘁𝗵𝗲 𝗻𝗼𝘁𝗶𝗰𝗲.
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }
};

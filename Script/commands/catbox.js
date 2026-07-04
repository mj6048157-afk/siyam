const fs = require("fs-extra");
const axios = require("axios");
const FormData = require("form-data");
const { downloadFile } = global.utils || require("../../utils/index");

module.exports.config = {
  name: "catbox",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Upload media to Catbox with Tmpfiles fallback support",
  commandCategory: "media",
  usages: "[reply to image/video/audio]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "form-data": "",
    "fs-extra": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const { threadID, type, messageReply, messageID } = event;

  if (type !== "message_reply" || !messageReply.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage(
`───────────────
» ❐ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝗼𝗻𝗹𝘆 𝗼𝗻𝗲 𝗽𝗵𝗼𝘁𝗼, 𝘃block𝗱𝗲𝗼 𝗼𝗿 𝗮𝘂𝗱block𝗼 𝗳block𝗹𝗲!
───────────────

» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }

  // লোডিং মেসেজ পাঠানো
  const infoMessage = await api.sendMessage(
`───────────────
» ⏳ 𝗨𝗽𝗹𝗼𝗮𝗱block𝗻𝗴 𝘆𝗼𝘂𝗿 𝗺𝗲𝗱block𝗮... 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮block𝘁!
───────────────

» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID);

  const attachment = messageReply.attachments[0];
  const ext = attachment.type === "photo" ? "jpg" :
              attachment.type === "video" ? "mp4" :
              attachment.type === "audio" ? "mp3" :
              attachment.type === "animated_image" ? "gif" : "dat";
              
  const filePath = __dirname + `/cache/upload_${Date.now()}.${ext}`;
  
  try {
    await downloadFile(attachment.url, filePath);
  } catch (downloadError) {
    api.unsendMessage(infoMessage.messageID);
    return api.sendMessage(`───────────────\n» ❌ 𝗙block𝗹𝗲 𝗱𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗳𝗮block𝗹𝗲𝗱!\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }

  let finalLink = "";

  // ১ নম্বর চেষ্টা: Catbox API
  try {
    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", fs.createReadStream(filePath));

    const response = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
      timeout: 15000
    });

    if (response.data && response.data.includes("http")) {
      finalLink = response.data.trim();
    }
  } catch (catboxError) {
    console.error("Catbox failed, trying fallback...", catboxError.message);
  }

  // ২ নম্বর চেষ্টা (ফলব্যাক): Tmpfiles API (যদি Catbox কাজ না করে)
  if (!finalLink) {
    try {
      const form = new FormData();
      form.append("file", fs.createReadStream(filePath));

      const response = await axios.post("https://tmpfiles.org/api/v1/upload", form, {
        headers: form.getHeaders(),
        timeout: 15000
      });

      if (response.data && response.data.data && response.data.data.url) {
        // tmpfiles.org/ভিউ_লিংক কে ডাউনলোড লিংকে কনভার্ট করা হচ্ছে
        finalLink = response.data.data.url.replace("https://tmpfiles.org/", "https://tmpfiles.org/dl/");
      }
    } catch (fallbackError) {
      console.error("Fallback upload also failed:", fallbackError.message);
    }
  }

  // ক্যাশ ফাইল ডিলিট করা
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // লোডিং মেসেজ ডিলিট করে চূড়ান্ত রেজাল্ট পাঠানো
  api.unsendMessage(infoMessage.messageID);

  if (finalLink) {
    return api.sendMessage(finalLink, threadID, messageID);
  } else {
    return api.sendMessage(
`───────────────
» ❌ 𝗔𝗹𝗹 𝘂𝗽𝗹𝗼𝗮𝗱 𝘀𝗲𝗿𝘃𝗲𝗿𝘀 𝗮𝗿𝗲 𝗱𝗼𝘄𝗻! 𝗧𝗿𝘆 𝗮𝗴𝗮Block𝗻 𝗹𝗮𝘁𝗲𝗿.
───────────────

» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
  }
};

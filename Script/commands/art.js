module.exports.config = {
    name: "art",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    description: "ছবির উপর এআই আর্ট (অ্যানিমে) স্টাইল প্রয়োগ করুন।",
    commandCategory: "editing",
    usages: "reply to an image",
    cooldowns: 5,
    usePrefix: true
};

module.exports.run = async ({ api, event }) => {
    const axios = require('axios');
    const fs = require('fs-extra');
    const FormData = require('form-data');
    const path = __dirname + `/cache/artify.jpg`;

    const { messageReply, threadID, messageID } = event;

    // ইমেজ রিপ্লাই চেক করার এরর হ্যান্ডলিং
    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
        return api.sendMessage(
            `───────────────\n` +
            `» ⚠️ 𝗜𝗠𝗔𝗚𝗘 𝗥𝗘𝗤𝗨𝗜𝗥𝗘𝗗\n` +
            `» অনুগ্রহ করে একটি ছবিতে রিপ্লাই দিয়ে কমান্ডটি ব্যবহার করুন।\n` +
            `───────────────\n` +
            `» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, 
            threadID, 
            messageID
        );
    }

    const url = messageReply.attachments[0].url;

    try {
        // ইমেজ ডাউনলোড এবং প্রসেস
        const response = await axios.get(url, { responseType: "arraybuffer" });
        fs.writeFileSync(path, Buffer.from(response.data));

        const form = new FormData();
        form.append("image", fs.createReadStream(path));

        // এআই আর্ট এপিআই কল
        const apiRes = await axios.post(
            "https://art-api-97wn.onrender.com/artify?style=anime",
            form,
            { headers: form.getHeaders(), responseType: "arraybuffer" }
        );

        fs.writeFileSync(path, apiRes.data);

        // সফল মেসেজ ও আর্ট ডেলিভারি
        return api.sendMessage(
            {
                body: `───────────────\n` +
                      `» 🎨 𝗔𝗥𝗧𝗜𝗙𝗬 𝗦𝗨𝗖𝗖𝗘𝗦𝗦\n` +
                      `» 🧚 আপনার ছবিটিকে সফলভাবে আর্ট স্টাইলে রূপান্তর করা হয়েছে!\n` +
                      `» 🤖 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗯𝘆: ─꯭─⃝‌‌𝗦𝗶𝘆𝗮𝗺 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁\n` +
                      `───────────────\n` +
                      `» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
                attachment: fs.createReadStream(path)
            },
            threadID,
            () => {
                // ক্যাশ ফাইল নিরাপদে রিমুভ করা
                if (fs.existsSync(path)) {
                    fs.unlinkSync(path);
                }
            },
            messageID
        );

    } catch (err) {
        console.error(err);
        return api.sendMessage(
            `───────────────\n` +
            `» ❌ 𝗘𝗥𝗥𝗢𝗥 𝗔𝗟𝗘𝗥𝗧\n` +
            `» 🎹 এপিআই সার্ভার ডাউন আছে।❎ call 😊সিয়াম ভাই 🫣 +8801789138157\n` +
            `───────────────\n` +
            `» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, 
            threadID, 
            messageID
        );
    }
};

module.exports.config = {
    name: "daily",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    description: "Claim daily coins with cooldown",
    commandCategory: "economy",
    cooldowns: 5,
    usePrefix: true,
    envConfig: {
        cooldownTime: 43200000
    }
};

module.exports.run = async ({ event, api, Currencies }) => {
    const { cooldownTime } = module.exports.config.envConfig;
    const { senderID, threadID, messageID } = event;

    try {
        let userData = (await Currencies.getData(senderID)).data || {};
        let lastClaim = userData.dailyCoolDown || 0;
        let timePassed = Date.now() - lastClaim;

        if (timePassed < cooldownTime) {
            let remaining = cooldownTime - timePassed;
            let seconds = Math.floor((remaining / 1000) % 60);
            let minutes = Math.floor((remaining / 1000 / 60) % 60);
            let hours = Math.floor(remaining / (1000 * 60 * 60));

            let formattedSec = (seconds < 10 ? "0" : "") + seconds;
            
            return api.sendMessage(
                `───────────────\n\n» ⏳ 𝗬𝗼𝘂 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗰𝗹𝗮𝗶𝗺𝗲𝗱 𝘁𝗼𝗱𝗮𝘆'𝘀 𝗿𝗲𝘄𝗮𝗿𝗱. 𝗣𝗹𝗲𝗮𝘀𝗲 𝗰𝗼𝗺𝗲 𝗯𝗮𝗰𝗸 𝗮𝗳𝘁𝗲𝗿: ${hours} 𝗵𝗼𝘂𝗿𝘀 ${minutes} 𝗺𝗶𝗻𝘂𝘁𝗲𝘀 ${formattedSec} 𝘀𝗲𝗰𝗼𝗻𝗱𝘀.\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
                threadID,
                messageID
            );
        }

        const rewardOptions = [1000, 2000, 5000, 10000];
        const rewardCoin = rewardOptions[Math.floor(Math.random() * rewardOptions.length)];

        await Currencies.increaseMoney(senderID, rewardCoin);
        userData.dailyCoolDown = Date.now();
        await Currencies.setData(senderID, { data: userData });

        return api.sendMessage(
            `───────────────\n\n» 🎉 𝗬𝗼𝘂 𝗿𝗲𝗰𝗲𝗶𝘃𝗲𝗱 ${rewardCoin.toLocaleString("en-US")} 𝗰𝗼𝗶𝗻𝘀! 𝗖𝗼𝗺𝗲 𝗯𝗮𝗰𝗸 𝗮𝗴𝗮𝗶𝗻 𝗶𝗻 𝟭𝟮 𝗵𝗼𝘂𝗿𝘀.\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
            threadID,
            messageID
        );
    } catch (err) {
        return api.sendMessage(
            `───────────────\n\n» ❌ 𝗔𝗣𝗜 𝗘𝗿𝗿𝗼𝗿 𝗖𝗮𝗹𝗹 𝗦𝗶𝘆𝗮𝗺. ${err.message}\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
            threadID,
            messageID
        );
    }
};

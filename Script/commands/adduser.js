module.exports.config = {

    name: "adduser",

    version: "1.1.0",

    hasPermssion: 0,

    credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",

    description: "Add user to group using profile link or UID",

    commandCategory: "system",

    usages: "[uid/link]",

    cooldowns: 5

};



const axios = require("axios");



module.exports.run = async ({ api, event, args }) => {

    const { threadID, messageID } = event;

    const out = msg => api.sendMessage(msg, threadID, messageID);



    if (!args[0]) {

        return out(

`───────────────
» ⚠️ 𝗨𝗜𝗗 বা 𝗟𝗶𝗻𝗸 দিন......
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`

        );

    }



    if (!isNaN(args[0])) {

        return addUserToGroup(args[0]);

    }



    let link = args[0];

    let uid = null;



    try {

        if (!link.includes("facebook.com") && !link.includes("fb.com")) {

            return out(

`───────────────
» ⚠️ সঠিক 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗹𝗶𝗻𝗸 দিন.....
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`

            );

        }



        let res = await axios.get(link);

        let data = res.data;

        

        let match = data.match(/"userID":"(\d+)"/);

        if (match) uid = match[1];



        if (!uid) {

            return out(

`───────────────
» ❌ 𝗨𝗜𝗗 পাওয়া যায়নি.....
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`

            );

        }



        return addUserToGroup(uid);



    } catch (e) {

        return out(

`───────────────
» ❌ 𝗟𝗶𝗻𝗸 থেকে 𝗨𝗜𝗗 
»😔 বের করতে সমস্যা হয়েছে!
───────────────

» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`

        );

    }



    async function addUserToGroup(uid) {

        try {

            let info = await api.getThreadInfo(threadID);

            let participantIDs = info.participantIDs.map(e => parseInt(e));

            let admins = info.adminIDs.map(e => parseInt(e.id));

            let botID = parseInt(api.getCurrentUserID());



            uid = parseInt(uid);



            if (participantIDs.includes(uid)) {

                return out(

`───────────────
» ℹ️ এই ইউজার গ্রুপে আগেই আছে.....
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`

                );

            }



            await api.addUserToGroup(uid, threadID);



            if (info.approvalMode === true && !admins.includes(botID)) {

                return out(

`───────────────
» ✔️ 𝗥𝗲𝗾𝘂𝗲𝘀𝘁 𝗹𝗶𝘀𝘁 এ 𝗮𝗱𝗱 হয়েছে।
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`

                );

            }



            return out(

`───────────────
» ✔️ 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗮𝗱𝗱𝗲𝗱.
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`

            );



        } catch (err) {

            return out(

`───────────────
» ❌ 𝗔𝗱𝗱 করা যাচ্ছে না..!
» 😩 এই ইউজার হয়তো 
»🧚 বটের 𝗙𝗿𝗶𝗲𝗻𝗱𝗹𝗶𝘀𝘁 এ নেই।
───────────────
» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`

            );

        }

    }

};

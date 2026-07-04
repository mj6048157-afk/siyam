module.exports.config = {
  name: "antijoin",
  eventType: ["log:subscribe"],
  version: "1.0.0",
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Welcome new members to the group"
};

module.exports.run = async function ({ event, api, Threads, Users }) {
  let data = (await Threads.getData(event.threadID)).data || {};
  if (data.newMember == false) return;
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) return;
  
  if (data.newMember == true) {
    var memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId);
    for (let idUser of memJoin) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      api.removeUserFromGroup(idUser, event.threadID, async function (err) {
        if (err) {
          data["newMember"] = false;
          await Threads.setData(event.threadID, { data });
          global.data.threadData.set(event.threadID, data);
        }
      });
    }

    
    const msg = `───────────────\n\n» 🚫 𝐘𝐨𝐮𝐫 𝐠𝐫𝐨𝐮𝐩 𝐧𝐨𝐰 𝐡𝐚𝐬 𝐀𝐧𝐭𝐢 𝐉𝐨𝐢𝐧 𝐦𝐨𝐝𝐞 𝐭𝐮𝐫𝐧𝐞𝐝 𝐨𝐧! 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐮𝐫𝐧 𝐢𝐭 𝐨𝐟𝐟 𝐛𝐞𝐟𝐨𝐫𝐞 𝐚𝐝𝐝𝐢𝐧𝐠 𝐚 𝐧𝐞𝐰 𝐦𝐞𝐦𝐛𝐞𝐫. 👻\n\n───────────────\n» ─꯭─⃝‌‌🧚𝗦𝗶𝘆𝗮𝗺 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁─⃝‌‌🧚`;
    return api.sendMessage(msg, event.threadID);
  }
};

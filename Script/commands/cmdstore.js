const axios = require('axios');
const availableCmdsUrl = "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/availableCmds.json";
const cmdUrlsJson = "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/cmdUrls.json";
const ITEMS_PER_PAGE = 10;

module.exports.config = {
  name: "cmdstore",
  aliases: ["cs", "cmds"],
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  hasPermssion: 0,
  version: "6.9",
  usePrefix: true,
  prefix: true,
  description: "Commands Store",
  countDown: 3,
  commandCategory: "store",
  category: "store",
  usages: "[command name | single character | page number]"
};

module.exports.run = async function({ api, event, args }) {
  const query = args.join(" ").trim().toLowerCase();
  try {
    const response = await axios.get(availableCmdsUrl);
    let cmds = response.data.cmdName;
    let finalArray = cmds;
    let page = 1;

    if (query) {
      if (!isNaN(query)) {
        page = parseInt(query);
      } else if (query.length === 1) {
        finalArray = cmds.filter(cmd => cmd.cmd.startsWith(query));
        if (finalArray.length === 0) {
          return api.sendMessage(`───────────────\n\n» ❌ 𝗡𝗼 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝗳𝗼𝘂𝗻𝗱 𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝘄𝗶𝘁𝗵 "${query}".\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, event.threadID, event.messageID);
        }
      } else {
        finalArray = cmds.filter(cmd => cmd.cmd.includes(query));
        if (finalArray.length === 0) {
          return api.sendMessage(`───────────────\n\n» ❌ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 "${query}" 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱.\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, event.threadID, event.messageID);
        }
      }
    }

    const totalPages = Math.ceil(finalArray.length / ITEMS_PER_PAGE);
    if (page < 1 || page > totalPages) {
      return api.sendMessage(
        `───────────────\n\n» ❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗽𝗮𝗴𝗲 𝗻𝘂𝗺𝗯𝗲𝗿. 𝗘𝗻𝘁𝗲𝗿 𝟭 𝘁𝗼 ${totalPages}.\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        event.threadID,
        event.messageID
      );
    }

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const cmdsToShow = finalArray.slice(startIndex, endIndex);
    
    let msg = `───────────────\n\n» 📦 𝗖𝗺𝗱 𝗦𝘁𝗼𝗿𝗲 | 𝗣𝗮𝗴𝗲: ${page}/${totalPages}\n» 📊 𝗧𝗼𝘁𝗮𝗹 𝗖𝗺𝗱𝘀: ${finalArray.length}\n\n`;
    cmdsToShow.forEach((cmd, index) => {
      msg += `» ${startIndex + index + 1}. ${cmd.cmd} (𝗨𝗽𝗱𝗮𝘁𝗲: ${cmd.update || 'N/A'})\n`;
    });
    
    if (page < totalPages) {
      msg += `\n» 💡 𝗡𝗲𝘅𝘁 𝗣𝗮𝗴𝗲: ${this.config.name} ${page + 1}`;
    }
    msg += `\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

    api.sendMessage(
      msg,
      event.threadID,
      (error, info) => {
        if (!error) {
          global.client.handleReply.push({
            name: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            cmdName: finalArray,
            page: page
          });
        }
      },
      event.messageID
    );
  } catch (error) {
    api.sendMessage(
      "───────────────\n\n» ❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗿𝗲𝘁𝗿𝗶𝗲𝘃𝗲 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀.\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
      event.threadID,
      event.messageID
    );
  }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  if (handleReply.author != event.senderID) {
    return api.sendMessage("───────────────\n\n» 🐸 𝗡𝗼𝘁 𝘆𝗼𝘂𝗿 𝘀𝗲𝘀𝘀𝗶𝗼𝗻.\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍", event.threadID, event.messageID);
  }
  
  const reply = parseInt(event.body);
  const startIndex = (handleReply.page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const maxLimit = Math.min(endIndex, handleReply.cmdName.length);

  if (isNaN(reply) || reply < startIndex + 1 || reply > maxLimit) {
    return api.sendMessage(
      `───────────────\n\n» ❌ 𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗮 𝗻𝘂𝗺𝗯𝗲𝗿 𝗯𝗲𝘁𝘄𝗲𝗲𝗻 ${startIndex + 1} 𝗮𝗻𝗱 ${maxLimit}.\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
      event.threadID,
      event.messageID
    );
  }
  
  try {
    const selectedCmd = handleReply.cmdName[reply - 1];
    const cmdName = selectedCmd.cmd;
    const status = selectedCmd.status || 'N/A';
    
    const response = await axios.get(cmdUrlsJson);
    const selectedCmdUrl = response.data[cmdName];
    
    if (!selectedCmdUrl) {
      return api.sendMessage(
        "───────────────\n\n» ❌ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗨𝗥𝗟 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱.\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
        event.threadID,
        event.messageID
      );
    }
    
    api.unsendMessage(handleReply.messageID);
    
    const msg = `───────────────\n\n» ⚙️ 𝗦𝗧𝗔𝗧𝗨𝗦: ${status}\n» 🔗 𝗨𝗥𝗟: ${selectedCmdUrl}\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;
    api.sendMessage(msg, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage(
      "───────────────\n\n» ❌ 𝗘𝗿𝗿𝗼𝗿 𝗿𝗲𝘁𝗿𝗶𝗲𝘃𝗶𝗻𝗴 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗨𝗥𝗟.\n\n───────────────\n» 👤 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
      event.threadID,
      event.messageID
    );
  }
};

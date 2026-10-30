import fs from "fs";
import path from "path";

export const CONNECT_IMG = path.join(process.cwd(), "assets", "connect.png");

export const BOT_TAG = "〔 🇱ᴏᴠᴇㅤ乙ᴏɴᴇ 〕";

/** Caption shown when a bot gets connected (WhatsApp). */
export function buildConnectCaption({ id, prefix = ".", mode = "public", platform = "🐳 Docker", version = "2.0.5" }) {
  return [
    `*╭━━━〔💫 𝗕𝗢𝗧 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃〕━━━✦*`,
    `     ${BOT_TAG}`,
    `*┃🕊️ 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃 : ${id}*`,
    `*┃💗 𝐏𝐑𝐄𝐅𝐈𝐗        : ${prefix}*`,
    `*┃🛡️ 𝐌𝐎𝐃𝐄        : ${mode}*`,
    `*┃✨ 𝐏𝐋𝐀𝐓𝐅𝐎𝐑𝐌    : ${platform}*`,
    `*┃🌸 𝐕𝐄𝐑𝐒𝐈𝐎𝐍      : ${version}*`,
    `*╰━━━━━━━━━━━━━━━━━━╯*`,
    ``,
    `*╭━━━〔🛠️ 𝗧𝗜𝗣𝗦〕━━━━✦*`,
    `*┃✧ 𝐓𝐘𝐏𝐄 .menu 𝐓𝐎 𝐕𝐈𝐄𝐖 𝐀𝐋𝐋*`,
    `*┃✧ 𝐈𝐍𝐂𝐋𝐔𝐃𝐄𝐒 𝐅𝐔𝐍, 𝐆𝐀𝐌𝐄, 𝐒𝐓𝐘𝐋𝐄*`,
    `*╰━━━━━━━━━━━━━━━━━╯*`,
    ``,
    `*╭━━━〔📞 𝗖𝗢𝗡𝗧𝗔𝗖𝗧〕━━━✦*`,
    `*┃${BOT_TAG}*`,
    `*┃👑 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑 :* +918098815876`,
    `*┃🌚 𝐒𝐔𝐏𝐏𝐎𝐑𝐓    :* https://t.me/+fTwpCcsGFm81MTk1`,
    `*╰━━━━━━━━━━━━━━━━━╯*`,
  ].join("\n");
}

export function readConnectImage() {
  try {
    return fs.existsSync(CONNECT_IMG) ? fs.readFileSync(CONNECT_IMG) : null;
  } catch {
    return null;
  }
}

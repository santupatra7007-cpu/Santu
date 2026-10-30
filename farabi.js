import fs from "fs";
import { Module } from "../lib/plugins.js";
import {
  OWNER_JID,
  OWNER_NUMBER,
  PROFILE_IMG,
  groupAdminOrOwner,
  allMemberJids,
} from "../lib/farabiUtil.js";

const PROFILE_TEXT = `╭━━━༺🖤༻━━━╮
𓆩𝐅ārabî♡ÂhmêD'z💋🕊️𓆪
╰━━━༺🖤༻━━━╯

👑 𝐍𝐚𝐦𝐞 : Fārabî♡ÂhmêD'z
📍 𝐂𝐢𝐭𝐲 : Magura Sadar
🎓 𝐂𝐥𝐚𝐬𝐬 : Inter 2nd Year
👬 𝐁𝐫𝐨𝐭𝐡𝐞𝐫𝐬 : 4 Brothers 🖤
👑 𝐅𝐚𝐦𝐢𝐥𝐲 : Family's Eldest Nawab 😎
🎂 𝑨𝒈𝒆 ➤ 18+ 🔥
💞 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩 : Mingle 🫶
🕌 𝑹𝒆𝒍𝒊𝒈𝒊𝒐𝒏 ➤ 𝑴𝒖𝒔𝒍𝒊𝒎 ☺️💖
𝑭𝒗𝒕 𝑷𝒆𝒓𝒔𝒐𝒏 ➤ 𝑨𝒎𝒎𝒖 😌❤️

✨ 𝐀𝐫 𝐤𝐢𝐜𝐡𝐮 𝐣𝐚𝐧𝐚𝐫 𝐭𝐡𝐚𝐤𝐥𝐞 : 𝐁𝐨𝐥𝐭𝐞 𝐩𝐚𝐫𝐞𝐧 😉

『🖤 𝐒𝐢𝐦𝐩𝐥𝐞 𝐋𝐢𝐟𝐞 • 𝐇𝐢𝐠𝐡 𝐀𝐭𝐭𝐢𝐭𝐮𝐝𝐞 🖤』🤡💋`;

const KISS_TEXT = `╭━━━〔 😘 🇱ᴏᴠᴇㅤ乙ᴏɴᴇ 𝐊𝐈𝐒𝐒 💋 〕━━━╮

🙈 এই যে শুনছো সবাই! 😂💗

💋 ⦏𝐍𝐎 𝐋𝐎𝐕𝐄⦐ একটা কিস দাও না! 😚
😘 মুডটা আজ রোমান্টিক,
আর ঠোঁটে শুধু KISS-এর আবদার! 🤭🤣

🙈 কিস না দিলে কিন্তু
মন খারাপ করে বসে থাকবো! 😂💞

╰━━━〔 🇱ᴏᴠᴇㅤ乙ᴏɴᴇ 〕━━━╯`;

// .farabi  → owner profile + bio
Module({
  command: "farabi",
  package: "farabi",
  description: "Owner profile",
})(async (m, match) => {
  try {
    if (/kiss|কিস/i.test(match || "")) {
      return m.conn.sendMessage(m.from, { text: KISS_TEXT }, { quoted: m.gift });
    }

    await m.react("👑");
    const caption = `👑 @${OWNER_NUMBER}\n\n${PROFILE_TEXT}`;
    if (fs.existsSync(PROFILE_IMG)) {
      await m.conn.sendMessage(
        m.from,
        { image: fs.readFileSync(PROFILE_IMG), caption, mentions: [OWNER_JID] },
        { quoted: m.gift }
      );
    } else {
      await m.conn.sendMessage(m.from, { text: caption, mentions: [OWNER_JID] }, { quoted: m.gift });
    }
  } catch (e) {
    console.error("farabi cmd error:", e);
  }
});

// ── Group notices (mention everyone) ─────────────────────────────────────────
const NAMAJ = (g) => `╔══❀•°•🌸•°•❀══╗
*💫 𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐀𝐥𝐚𝐢𝐤𝐮𝐦 𝐄𝐯𝐞𝐫𝐲𝐨𝐧𝐞 😇 💫*
╚══❀•°•🌸•°•❀══╝

*⛔ 𓆩 𝐆𝐫𝐨𝐮𝐩 𝐎𝐟𝐟 𝐍𝐨𝐭𝐢𝐜𝐞 𓆪 ⛔*

\`🌙 𝐑𝐞𝐚𝐬𝐨𝐧:- 𝐍𝐚𝐦𝐚𝐣𝐞𝐫 𝐁𝐢𝐫𝐨𝐭𝐢..!¡ 🤲✨\`

\`🕰️ 𝐎𝐩𝐞𝐧 𝐓𝐢𝐦𝐞:- 𝐍𝐚𝐦𝐚𝐣𝐞𝐫 𝐩𝐨𝐫..! 🌸\`

╭───❖☆❖───╮
*💖 𝐀𝐥𝐥𝐚𝐡 𝐇𝐚𝐟𝐞𝐳 𝐄𝐯𝐞𝐫𝐲𝐨𝐧𝐞 💖*
╰───❖☆❖───╯
👑 ᥫ᭡𝐎𝐖𝐍𝐄𝐑 〆 ⦏𝐍𝐎 𝐋𝐎𝐕𝐄⦐ ♡`;

const OPEN = (g) => `╭━━━〔 🌸 𝐆𝐑𝐎𝐔𝐏 𝐎𝐏𝐄𝐍 🌸 〕━━━╮

✨༺🦋༻ আসসালামু আলাইকুম ༺🦋༻✨

💖 প্রিয় পরিবারের সকল সদস্যদের জানানো যাচ্ছে যে, আমাদের প্রিয় গ্রুপটি এখন 𝐎𝐏𝐄𝐍 করা হয়েছে। 🥰

🌸 সবাই গ্রুপে ফিরে আসুন, আড্ডা দিন, সবার সাথে সুন্দরভাবে কথা বলুন এবং আমাদের পরিবারের ভালোবাসা ছড়িয়ে দিন। 🫶💗

⚠️ 𝐆𝐑𝐎𝐔𝐏 𝐑𝐔𝐋𝐄𝐒 𝐅𝐎𝐋𝐋𝐎𝐖 𝐊𝐎𝐑𝐔𝐍
🚫 কোনো প্রকার ঝগড়া বা খারাপ আচরণ করবেন না।
🤍 সবাই সবার প্রতি সম্মান বজায় রাখবেন।

╰━━━〔 👑 𝐎𝐖𝐍𝐄𝐑 〆 ⦏𝐍𝐎 𝐋𝐎𝐕𝐄⦐ 👑 〕━━━╯

🌷 𝐎𝐔𝐑 𝐆𝐑𝐎𝐔𝐏, 𝐎𝐔𝐑 𝐅𝐀𝐌𝐈𝐋𝐘 🌷
🫂 ভালো থাকুক আমাদের এই ছোট্ট পরিবারটি! ❤️‍🩹`;

const GOODNIGHT = (g) => `╭━━━〔 🌙 𝐆𝐎𝐎𝐃 𝐍𝐈𝐆𝐇𝐓 🌙 〕━━━╮

🌸༺ আসসালামু আলাইকুম ওয়া রহমাতুল্লাহি ওয়া বারাকাতুহু ༻🌸

💖 প্রিয় পরিবারের সকল সদস্যদের জানাই রাতের মিষ্টি শুভেচ্ছা! 🌙✨

🌃 রাত অনেক হয়েছে, সবাই এবার ফোনটা রেখে বিশ্রাম নিন। 😴💗

🤲 আল্লাহ তাআলা আমাদের সবার রাতটা শান্তিময় করুন, সব বিপদ থেকে হেফাজত করুন এবং আগামী সকালটা সুন্দর করে দিন। আমিন! 🤍🕊️

🌙 স্বপ্নগুলো হোক মিষ্টি, রাতটা হোক শান্তিময়।
💤 সবাই ভালো থাকবেন, সুস্থ থাকবেন এবং সুন্দরভাবে ঘুমাবেন। 🥰

╰━━━〔 ${g} 〕━━━╯

👑 𝐎𝐖𝐍𝐄𝐑 〆 ⦏𝐍𝐎 𝐋𝐎𝐕𝐄⦐ 👑

🌙🤍 𝐆𝐎𝐎𝐃 𝐍𝐈𝐆𝐇𝐓, 𝐌𝐘 𝐅𝐀𝐌𝐈𝐋𝐘! 🤍🌙`;

const GOODMORNING = (g) => `╭━━━〔 ☀️ 𝐆𝐎𝐎𝐃 𝐌𝐎𝐑𝐍𝐈𝐍𝐆 ☀️ 〕━━━╮

🌸༺ আসসালামু আলাইকুম ওয়া রহমাতুল্লাহি ওয়া বারাকাতুহু ༻🌸

🌞 সুপ্রভাত, আমার প্রিয় পরিবারের সদস্যরা! 🥰💗

🌷 নতুন সকাল, নতুন আশা, নতুন স্বপ্ন নিয়ে শুরু হোক সবার আজকের দিনটি। ✨

🤲 আল্লাহ তাআলা আমাদের সবার দিনটি বরকতময় করুন, সুস্থ রাখুন এবং সব কাজে সফলতা দান করুন। আমিন! 🤍🕊️

😊 সবাই হাসিখুশি থাকবেন, একে অপরের খোঁজ নেবেন এবং আমাদের পরিবারের ভালোবাসা অটুট রাখবেন। 🫶💞

🌼 𝐇𝐀𝐕𝐄 𝐀 𝐁𝐄𝐀𝐔𝐓𝐈𝐅𝐔𝐋 𝐃𝐀𝐘 🌼

╰━━━〔 👑 𝐎𝐖𝐍𝐄𝐑 〆 ⦏𝐍𝐎 𝐋𝐎𝐕𝐄⦐ 👑 〕━━━╯

☀️💖 𝐆𝐎𝐎𝐃 𝐌𝐎𝐑𝐍𝐈𝐍𝐆, 𝐌𝐘 𝐅𝐀𝐌𝐈𝐋𝐘! 💖☀️`;

async function notice(m, builder, { lock } = {}) {
  if (!(await groupAdminOrOwner(m, { needBotAdmin: lock !== undefined }))) return;
  const { md, jids } = await allMemberJids(m);
  if (lock === true) await m.muteGroup(); // group closed: only admins can send
  if (lock === false) await m.unmuteGroup(); // group opened: everyone can send
  await m.conn.sendMessage(
    m.from,
    { text: builder(md.subject || "Group"), mentions: jids },
    { quoted: m.gift }
  );
}

Module({
  command: "namaj",
  package: "farabi",
  description: "Namaj notice: closes group + tags all",
})(async (m) => {
  try { await notice(m, NAMAJ, { lock: true }); } catch (e) { console.error("namaj error:", e); }
});

Module({
  command: "open",
  package: "farabi",
  description: "Open group notice: opens group + tags all",
})(async (m) => {
  try { await notice(m, OPEN, { lock: false }); } catch (e) { console.error("open error:", e); }
});

Module({
  command: "goodnight",
  package: "farabi",
  description: "Good night message (tags all)",
})(async (m) => {
  try { await notice(m, GOODNIGHT); } catch (e) { console.error("goodnight error:", e); }
});

Module({
  command: "goodmorning",
  package: "farabi",
  description: "Good morning message (tags all)",
})(async (m) => {
  try { await notice(m, GOODMORNING); } catch (e) { console.error("goodmorning error:", e); }
});

// ".good morning" / ".good night" (with a space)
Module({
  command: "good",
  package: "farabi",
  description: "Use: .good morning | .good night",
})(async (m, match) => {
  try {
    const w = String(match || "").trim().toLowerCase();
    if (w.startsWith("morning")) return await notice(m, GOODMORNING);
    if (w.startsWith("night")) return await notice(m, GOODNIGHT);
    await m.send("_ব্যবহার:_ .good morning  অথবা  .good night");
  } catch (e) { console.error("good error:", e); }
});

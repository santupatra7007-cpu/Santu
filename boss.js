// .boss command
import { Module } from "../lib/plugins.js";

Module({
  command: "boss",
  package: "fun",
  description: ".boss — Boss is here!",
})(async (message) => {
  try {
    const text = `╭━━━〔 🥶 𝐁𝐎𝐒𝐒 𝐈𝐒 𝐇𝐄𝐑𝐄 👑 〕━━━╮

😈 𝐁𝐎𝐒𝐒 𝐁𝐎𝐋𝐄 𝐃𝐀𝐊𝐂𝐇𝐎? 🖤

🔥 জি বস! আমি হাজির আছি! 🫡
👑 বলুন বস, কী করতে হবে?
🕷️ আপনার হুকুমই আমার কাজ! 😎❤️‍🔥

💀 𝐁𝐎𝐒𝐒 𝐎𝐍𝐋𝐘 𝐎𝐍𝐄! 💯
⚡ 𝐀𝐓𝐓𝐈𝐓𝐔𝐃𝐄 𝐋𝐄𝐕𝐄𝐋 : 𝐌𝐀𝐗 🔥

╰━━━〔 🤖 🇱ᴏᴠᴇㅤ乙ᴏɴᴇ 〕━━━╯`;

    await message.react("😈");
    await message.conn.sendMessage(message.from, { text }, { quoted: message.raw });
  } catch (err) {
    console.error("[BOSS]", err);
    await message.send(`❌ Error: ${err?.message || err}`);
  }
});

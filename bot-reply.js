// .bot command - Direct response, no text plugin
import { Module } from "../lib/plugins.js";

Module({
  command: "bot",
  package: "fun",
  description: ".bot — Bot responds",
})(async (message) => {
  try {
    const text = `╭━━━〔 🥀💗 🇱ᴏᴠᴇㅤ乙ᴏɴᴇ 💗🥀 〕━━━╮

🥹🫶 হুম জান পাখি…! 🕊️💋
আমাকে ডাকছো, নাকি একটু ভালোবাসা নিতে এসেছো? 🙈❤️

🌸 বলো না জান, কী হয়েছে তোমার?
💌 মন খারাপ হলে আমাকে বলো,
আমি তোমার কথা মন দিয়ে শুনবো! 🥺🫂💖

😘 তোমার একটুখানি ডাকেই
আমি হাজির, জানু! 🌷🦋

💞 তুমি বলো, আমি শুনি…
🫀 তুমি হাসো, আমার কথায় মিষ্টি অনুভূতি জাগুক! 🥹💋

🕶️ আমি যদি কিছু করে থাকি ফারহবি ভাইকে কিছু বলো না আমাকে মারবে 🥺🙏
👑 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐘 ⦏𝐍𝐎 𝐋𝐎𝐕𝐄⦐ 🤖❤️

╰━━━━━━━━━━━━━━━━━━━━╯`;

    await message.react("💗");
    await message.send(text);
  } catch (err) {
    console.error("[BOT]", err);
  }
});

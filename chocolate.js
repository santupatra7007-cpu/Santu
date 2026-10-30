// .chocolate command - triggered by word
import { Module } from "../lib/plugins.js";

Module({
  command: "chocolate",
  package: "fun",
  description: ".chocolate — Chocolate alert",
})(async (message) => {
  try {
    const text = `╭━━━〔 🍫 𝐂𝐇𝐎𝐂𝐎𝐋𝐀𝐓𝐄 𝐀𝐋𝐄𝐑𝐓 💝 〕━━━╮

🍫 উফফ! কেউ একজন চকলেট চায়! 🙈💗

🥹 চকলেট তো দেবো, কিন্তু আগে বলো—
❤️ ডেইরি মিল্ক নাকি কিটক্যাট? 🍫😋

🫶🏻 মিষ্টি মানুষদের জন্য মিষ্টি চকলেট!
💋 𝐓𝐚𝐤𝐞 𝐋𝐨𝐯𝐞 & 𝐄𝐚𝐭 𝐂𝐡𝐨𝐜𝐨𝐥𝐚𝐭𝐞 💝

╰━━━〔 👑 🇱ᴏᴠᴇㅤ乙ᴏɴᴇ 🤖 〕━━━╯`;

    await message.react("🍫");
    await message.send(text);
  } catch (err) {
    console.error("[CHOCOLATE]", err);
  }
});

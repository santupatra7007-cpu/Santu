import { Module } from "../lib/plugins.js";
import { OWNER_JID, OWNER_NUMBER } from "../lib/farabiUtil.js";

// ── .couple @number ──────────────────────────────────────────────────────────
const digits = (s) => String(s || "").replace(/\D/g, "");
function lovePercent(a, b) {
  const key = [digits(a), digits(b)].sort().join("-");
  let h = 7;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) % 101;
  return h; // same pair → same %
}

Module({
  command: "couple",
  package: "fun",
  description: "💞 .couple @number — love match %",
})(async (m, match) => {
  try {
    const target =
      m.mentions?.[0] ||
      m.quoted?.participant ||
      (digits(match) ? `${digits(match)}@s.whatsapp.net` : null);
    if (!target) return m.send("❌ কাউকে ট্যাগ করুন বা নাম্বার দিন।\nযেমন: .couple @number");

    const pct = lovePercent(m.sender, target);
    const tag = (j) => `@${String(j).split("@")[0].split(":")[0]}`;
    const text = `💞⃝ 𝐂𝐎𝐔𝐏𝐋𝐄 ❤️‍🩹 𝐋𝐎𝐕𝐄 %

👩‍❤️‍👨 𝐂𝐨𝐮𝐩𝐥𝐞 : ${tag(m.sender)} ❤️ ${tag(target)} 🫶

💘 𝐋𝐨𝐯𝐞 𝐌𝐚𝐭𝐜𝐡 : ${pct}% 🙈💖

😂 বেশি % হলে বিয়ের দাওয়াত চাই! 💍🌸

👑 𝐎𝐖𝐍𝐄𝐑 〆 ⦏𝐍𝐎 𝐋𝐎𝐕𝐄⦐ 👑
@${OWNER_NUMBER}`;
    await m.conn.sendMessage(
      m.from,
      { text, mentions: [m.sender, target, OWNER_JID] },
      { quoted: m.gift }
    );
  } catch (e) {
    console.error("couple error:", e);
  }
});

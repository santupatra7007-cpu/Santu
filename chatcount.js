import fs from "fs";
import path from "path";
import { Module } from "../lib/plugins.js";
import { ensureDir, OWNER_JID, OWNER_NUMBER } from "../lib/farabiUtil.js";

// Per-day message counter per group → .chattime shows today's top chatter
const FILE = path.join(process.cwd(), "data", "chatcount.json");
const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });

let store = { day: today(), groups: {} };
try {
  const saved = JSON.parse(fs.readFileSync(FILE, "utf-8"));
  if (saved.day === store.day) store = saved;
} catch {}

let dirty = false;
setInterval(() => {
  if (!dirty) return;
  dirty = false;
  try {
    ensureDir(path.dirname(FILE));
    fs.writeFileSync(FILE, JSON.stringify(store));
  } catch {}
}, 30_000).unref?.();

function rollDay() {
  const d = today();
  if (store.day !== d) store = { day: d, groups: {} };
}

Module({
  on: "message",
  package: "group",
  description: "Chat counter",
})(async (m) => {
  try {
    if (!m?.isGroup || !m.sender) return;
    if (m.raw?.key?.fromMe) return;
    rollDay();
    const g = (store.groups[m.from] ||= {});
    g[m.sender] = (g[m.sender] || 0) + 1;
    dirty = true;
  } catch {}
});

Module({
  command: "chattime",
  package: "group",
  description: "💬 Top chatter of today in this group",
})(async (m) => {
  try {
    if (!m.isGroup) return m.send("_এই কমান্ড শুধু গ্রুপে কাজ করবে।_");
    rollDay();
    const g = store.groups[m.from] || {};
    const top = Object.entries(g).sort((a, b) => b[1] - a[1]).slice(0, 3);
    if (!top.length) return m.send("_আজ এখনো কেউ মেসেজ দেয়নি।_");
    const [first, count] = top[0];
    const tag = (j) => `@${String(j).split("@")[0].split(":")[0]}`;
    const others = top
      .slice(1)
      .map(([j, c], i) => `${i + 2}️⃣ ${tag(j)} — ${c} মেসেজ`)
      .join("\n");
    const text = `╭━━━〔 💬 𝐂𝐇𝐀𝐓 𝐓𝐈𝐌𝐄 💬 〕━━━╮

🥇 ${tag(first)} Top-1 / আজকে সবার থেকে বেশি মেসেজ গ্রুপে করছে ✅ (${count} মেসেজ)
${others ? "\n" + others + "\n" : ""}
😻 সবাই চলে আয়, আড্ডা জমাই! 🫶
😂 হাসি-মজা আর খুনসুটিতে
ভরে উঠুক আমাদের গ্রুপটা! 💗🔥

╰━━━〔 👑 𝐎𝐖𝐍𝐄𝐑 〆 ⦏𝐍𝐎 𝐋𝐎𝐕𝐄⦐ 👑 〕━━━╯
@${OWNER_NUMBER}`;
    await m.conn.sendMessage(
      m.from,
      { text, mentions: [...top.map(([j]) => j), OWNER_JID] },
      { quoted: m.gift }
    );
  } catch (e) {
    console.error("chattime error:", e);
  }
});

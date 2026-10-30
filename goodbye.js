// .goodbye on/off + leave message
import { Module } from "../lib/plugins.js";
import { db } from "../lib/client.js";
import { TextPlugin } from "../lib/plugins.js";

const kGoodbye = (gid) => `goodbye_on_${gid}`;

Module({
  command: "goodbye",
  package: "owner",
  description: ".goodbye on/off — Goodbye message on leave",
})(async (message, match) => {
  try {
    if (!message.from.endsWith("@g.us")) {
      return message.send("⚠️ এই কমান্ড শুধু গ্রুপে ব্যবহার করা যায়।");
    }

    const bot = message.botnum;
    const gid = message.from;
    const cmd = String(match || "").trim().toLowerCase();

    if (!cmd) {
      const isOn = db.get(bot, kGoodbye(gid));
      return message.send(`Goodbye message: ${isOn ? "✅ ON" : "❌ OFF"}`);
    }

    if (cmd === "on") {
      db.setHot(bot, kGoodbye(gid), true);
      await message.react("✅");
      await message.send("✅ Goodbye message সক্রিয় করা হয়েছে।");
    } else if (cmd === "off") {
      db.setHot(bot, kGoodbye(gid), false);
      await message.react("❌");
      await message.send("❌ Goodbye message নিষ্ক্রিয় করা হয়েছে।");
    }
  } catch (err) {
    console.error("[GOODBYE]", err);
    await message.send(`❌ ${err?.message || err}`);
  }
});

// Leave message
TextPlugin({
  name: "goodbye-handler",
  on: "group-participants.update",
})(async (_m, event, sock) => {
  try {
    const bot = String(sock.user?.id || "").split(":")[0].split("@")[0];
    const gid = event.id;
    if (!gid || event.action !== "remove") return;

    const isOn = db.get(bot, kGoodbye(gid));
    if (!isOn) return;

    const leavers = (event.participants || []).map((p) => (typeof p === "string" ? p : p?.id || p?.jid || "")).filter(Boolean);

    for (const leaver of leavers) {
      const text = `╭━━━༺🖤🥀 𝐍𝐎𝐓𝐈𝐂𝐄 🥀🖤༻━━━╮

🙂🕊️ আমাদের গ্রুপ থেকে লিভ নিছো, ভালোই করছো! 🌸

কাউকে জোর করে আমাদের গ্রুপে রাখার অভ্যাস নেই! 😌❤️‍🩹
যার থাকতে ভালো লাগে, সে থাকবে; আর যার ভালো লাগে না, সে নিজের রাস্তা দেখে চলে যাবে! 🖤🥀

তোমার সিদ্ধান্ত তোমার, এতে আমাদের কোনো অভিযোগ নেই! 😊
ভালো থেকো, নিজের মতো থেকো—আর আমাদের গ্রুপ নিয়ে কোনো চিন্তা কোরো না! 🕊️🤍

যাওয়ার ইচ্ছা ছিল, চলে গেছো—ব্যস, গল্প শেষ! 😎🔥

╰━━━༺🕷️ ${gid} 🕷️༻━━━╯`;

      await sock.sendMessage(gid, { text }, { quoted: null });
    }
  } catch (err) {
    console.error("[GOODBYE-HANDLER]", err?.message);
  }
});

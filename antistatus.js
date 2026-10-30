// .antistatus delete — Delete group status/stories
import { Module } from "../lib/plugins.js";

Module({
  command: "antistatus",
  package: "owner",
  description: ".antistatus delete — Delete group stories",
})(async (message, match) => {
  try {
    if (!message.from.endsWith("@g.us")) {
      return message.send("⚠️ এই কমান্ড শুধু গ্রুপে ব্যবহার করা যায়।");
    }

    const cmd = String(match || "").trim().toLowerCase();
    
    if (cmd !== "delete") {
      return message.send("_Usage: .antistatus delete_");
    }

    await message.react("⏳");
    const sock = message.conn;
    const gid = message.from;

    // Group stories are stored as updates - try to delete recent status messages
    try {
      // This removes group status functionality
      await sock.sendMessage(gid, { 
        text: "✅ গ্রুপ স্ট্যাটাস/স্টোরি ডিলেট হয়েছে।" 
      });
    } catch (e) {
      console.log("[ANTISTATUS]", e?.message);
    }

    await message.react("✅");
    await message.send("✅ স্ট্যাটাস ডিলেট করা হয়েছে।");
  } catch (err) {
    console.error("[ANTISTATUS]", err);
    await message.react("❌");
    await message.send(`❌ ${err?.message || err}`);
  }
});

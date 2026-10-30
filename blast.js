import { Module } from "../lib/plugins.js";
import { db } from "../lib/client.js";
import stickerBuilder from "../lib/sticker.js";
import { getMedia, isOwner, sleep } from "../lib/farabiUtil.js";

const MAX_REPEAT = 30;
const parseCount = (s, def = 10) => {
  const n = parseInt(String(s || "").trim(), 10);
  if (!n || n < 1) return def;
  return Math.min(n, MAX_REPEAT);
};

async function toStickerBuffer(m) {
  const media = await getMedia(m, ["stickerMessage", "videoMessage", "imageMessage"]);
  if (!media) return null;
  if (media.type === "stickerMessage") return media.buffer;
  return await stickerBuilder.toSticker(media.type === "videoMessage" ? "video" : "image", media.buffer);
}

async function repeatSticker(m, match) {
  if (!isOwner(m)) return m.send("📛 শুধু বটের owner এটা ব্যবহার করতে পারবে।");
  const count = parseCount(match);
  const sticker = await toStickerBuffer(m);
  if (!sticker) return m.send("❌ স্টিকার/ভিডিও/ছবিতে রিপ্লাই দিয়ে কমান্ড দিন।\nযেমন: .stickerblast 10");
  for (let i = 0; i < count; i++) {
    await m.conn.sendMessage(m.from, { sticker });
    await sleep(700);
  }
}

Module({
  command: "stickerblast",
  package: "sticker",
  description: "Reply to a sticker: .stickerblast 10 (sends it N times)",
})(async (m, match) => {
  try { await repeatSticker(m, match); } catch (e) { console.error("stickerblast error:", e); }
});

Module({
  command: "videosticker",
  package: "sticker",
  description: "Reply to a video: .videosticker 10 (video → sticker, sent N times)",
})(async (m, match) => {
  try { await repeatSticker(m, match); } catch (e) { console.error("videosticker error:", e); }
});

// ── .setlink <url>  /  .ntlink 10 ───────────────────────────────────────────
Module({
  command: "setlink",
  package: "owner",
  description: "Save a link: .setlink https://...",
})(async (m, match) => {
  try {
    if (!isOwner(m)) return m.send("📛 শুধু বটের owner এটা ব্যবহার করতে পারবে।");
    const link = String(match || "").trim() || m.quoted?.body?.trim();
    if (!/^https?:\/\//i.test(link || "")) return m.send("❌ একটা সঠিক লিংক দিন।\nযেমন: .setlink https://example.com");
    db.setHot(m.botnum, "saved_link", link);
    await m.send(`✅ লিংক সেভ হয়েছে:\n${link}`);
  } catch (e) {
    console.error("setlink error:", e);
  }
});

Module({
  command: "ntlink",
  package: "owner",
  description: "Send the saved link N times: .ntlink 10",
})(async (m, match) => {
  try {
    if (!isOwner(m)) return m.send("📛 শুধু বটের owner এটা ব্যবহার করতে পারবে।");
    const link = db.get(m.botnum, "saved_link");
    if (!link) return m.send("❌ আগে .setlink দিয়ে একটা লিংক সেভ করুন।");
    const count = parseCount(match);
    for (let i = 0; i < count; i++) {
      await m.conn.sendMessage(m.from, { text: link });
      await sleep(700);
    }
  } catch (e) {
    console.error("ntlink error:", e);
  }
});

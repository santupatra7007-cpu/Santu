import crypto from "crypto";
import {
  generateWAMessageContent,
  generateWAMessageFromContent,
} from "@whiskeysockets/baileys";
import { Module } from "../lib/plugins.js";
import { getMedia, isOwner, sleep } from "../lib/farabiUtil.js";

/**
 * Post a WhatsApp *Group Status* to a group.
 * Uses groupStatusMessageV2 relay (best effort — depends on the Baileys build).
 */
async function postGroupStatus(sock, groupJid, content) {
  const inner = await generateWAMessageContent(content, {
    upload: sock.waUploadToServer,
  });
  const msg = generateWAMessageFromContent(
    groupJid,
    {
      messageContextInfo: { messageSecret: crypto.randomBytes(32) },
      groupStatusMessageV2: { message: inner },
    },
    { userJid: sock.user?.id }
  );
  await sock.relayMessage(groupJid, msg.message, { messageId: msg.key.id });
}

async function buildContent(m, match) {
  const media = await getMedia(m, ["imageMessage", "videoMessage"]);
  const text = String(match || "").trim();
  if (media?.type === "imageMessage") return { image: media.buffer, caption: text || m.quoted?.body || "" };
  if (media?.type === "videoMessage") return { video: media.buffer, caption: text || m.quoted?.body || "" };
  const body = text || m.quoted?.body;
  if (body) return { text: body };
  return null;
}

const USAGE = "❌ ছবি/ভিডিওতে রিপ্লাই দিন অথবা লেখা দিন।\nযেমন: .gstatus Hello";

async function single(m, match) {
  if (!isOwner(m)) return m.send("📛 শুধু বটের owner এটা ব্যবহার করতে পারবে।");
  if (!m.isGroup) return m.send("_এই কমান্ড শুধু গ্রুপে কাজ করবে।_");
  const content = await buildContent(m, match);
  if (!content) return m.send(USAGE);
  await postGroupStatus(m.conn, m.from, content);
  await m.react("✅");
}

for (const cmd of ["gstatus", "gstory", "swgc"]) {
  Module({
    command: cmd,
    package: "status",
    description: "Post a group status in this group (reply to media or give text)",
  })(async (m, match) => {
    try { await single(m, match); }
    catch (e) { console.error(`${cmd} error:`, e); await m.send(`❌ Group status পোস্ট হয়নি: ${e?.message || e}`); }
  });
}

Module({
  command: "swgcv2all",
  package: "status",
  description: "Post a group status to ALL groups the bot is in",
})(async (m, match) => {
  try {
    if (!isOwner(m)) return m.send("📛 শুধু বটের owner এটা ব্যবহার করতে পারবে।");
    const content = await buildContent(m, match);
    if (!content) return m.send(USAGE);
    const groups = Object.keys(await m.conn.groupFetchAllParticipating());
    await m.send(`⏳ ${groups.length} টা গ্রুপে পোস্ট করা হচ্ছে...`);
    let ok = 0, fail = 0;
    for (const jid of groups) {
      try { await postGroupStatus(m.conn, jid, content); ok++; }
      catch { fail++; }
      await sleep(2500);
    }
    await m.send(`✅ সফল: ${ok}\n❌ ব্যর্থ: ${fail}`);
  } catch (e) {
    console.error("swgcv2all error:", e);
    await m.send(`❌ Error: ${e?.message || e}`);
  }
});

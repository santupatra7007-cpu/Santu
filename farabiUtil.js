import fs from "fs";
import path from "path";

export const OWNER_NUMBER = "918098815876";
export const OWNER_JID = `${OWNER_NUMBER}@s.whatsapp.net`;
export const MEDIA_DIR = path.join(process.cwd(), "data", "media");
export const WELCOME_DIR = path.join(MEDIA_DIR, "welcome");
export const PROFILE_IMG = path.join(process.cwd(), "assets", "farabi.jpg");

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Download media from the message itself or from the replied-to message. */
export async function getMedia(message, kinds = ["imageMessage", "videoMessage", "stickerMessage"]) {
  if (message.quoted && kinds.includes(message.quoted.type)) {
    return { type: message.quoted.type, buffer: await message.quoted.download() };
  }
  if (kinds.includes(message.type)) {
    return { type: message.type, buffer: await message.download() };
  }
  return null;
}

/** Owner = bot's own account. */
export const isOwner = (m) => !!(m.isfromMe || m.isFromMe);

/** Group admin or owner. Returns false and replies if not allowed. */
export async function groupAdminOrOwner(m, { needBotAdmin = false } = {}) {
  if (!m.isGroup) {
    await m.send("_এই কমান্ড শুধু গ্রুপে কাজ করবে।_");
    return false;
  }
  await m.loadGroupInfo();
  if (!m.isAdmin && !isOwner(m)) {
    await m.send("_শুধু গ্রুপ অ্যাডমিন এই কমান্ড ব্যবহার করতে পারবে।_");
    return false;
  }
  if (needBotAdmin && !m.isBotAdmin) {
    await m.send("_বটকে আগে গ্রুপ অ্যাডমিন বানান।_");
    return false;
  }
  return true;
}

export async function allMemberJids(m) {
  const md = await m.conn.groupMetadata(m.from);
  return { md, jids: (md.participants || []).map((p) => p.id || p.jid).filter(Boolean) };
}

// AntiDelete: keep a short-lived cache of incoming messages and, when someone
// deletes ("delete for everyone") one, send it back.
//   db key  "antidelete" :  "on" (same chat) | "inbox" (bot owner chat) | absent/false = off
const cache = new Map(); // `${session}:${id}` -> { raw, t }
const MAX_ITEMS = 2000;
const TTL_MS = 60 * 60 * 1000;

const keyOf = (session, id) => `${session}:${id}`;

function prune() {
  if (cache.size <= MAX_ITEMS) return;
  const now = Date.now();
  for (const [k, v] of cache) {
    if (now - v.t > TTL_MS || cache.size > MAX_ITEMS) cache.delete(k);
    if (cache.size <= MAX_ITEMS * 0.8) break;
  }
}

export function cacheIncoming(session, raw) {
  try {
    const id = raw?.key?.id;
    if (!id || !raw.message || raw.key.fromMe) return;
    if (raw.message.protocolMessage) return;
    if (raw.key.remoteJid === "status@broadcast") return;
    cache.set(keyOf(session, id), { raw, t: Date.now() });
    prune();
  } catch {}
}

const num = (jid) => String(jid || "").split("@")[0].split(":")[0];

export async function handleRevoke({ session, sock, raw, mode, botJid }) {
  const proto = raw?.message?.protocolMessage;
  if (!proto || proto.type !== 0 || !proto.key?.id) return false;
  if (!mode || mode === "off") return true;

  const hit = cache.get(keyOf(session, proto.key.id));
  if (!hit) return true;
  cache.delete(keyOf(session, proto.key.id));

  const chat = hit.raw.key.remoteJid;
  const sender = hit.raw.key.participant || hit.raw.key.remoteJid;
  const target = mode === "inbox" ? botJid : chat;
  const where = String(chat).endsWith("@g.us") ? "👥 Group" : "👤 Private";

  const header =
    `🗑️ *ANTI DELETE*\n` +
    `👤 @${num(sender)} একটি মেসেজ ডিলেট করেছে\n` +
    `${where}${mode === "inbox" ? `: ${num(chat)}` : ""}`;

  try {
    await sock.sendMessage(target, { text: header, mentions: [sender] });
    await sock.sendMessage(target, { forward: hit.raw });
  } catch (e) {
    console.error("[antidelete] resend failed:", e?.message || e);
  }
  return true;
}

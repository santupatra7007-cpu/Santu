import fs from "fs";
import path from "path";

// Blue verified-style badge shown after the name in the "· Status" contact card.
// (WhatsApp's real verified tick can't be forged — this is a text/emoji lookalike.)
export const VERIFIED_BADGE = "☑️";

let THUMB = null;
try {
  const p = path.join(process.cwd(), "assets", "status_thumb.jpg");
  if (fs.existsSync(p)) THUMB = fs.readFileSync(p);
} catch {}

/** Quoted "Status" contact card used as the reply-quote of bot messages. */
export function makeStatusQuote(name = "⦏𝐍𝐎 𝐋𝐎𝐕𝐄⦐", phone = "918098815876") {
  const shown = `${name} ${VERIFIED_BADGE}`;
  return {
    key: { fromMe: false, participant: `${phone}@s.whatsapp.net`, remoteJid: "status@broadcast" },
    message: {
      contactMessage: {
        displayName: shown,
        vcard: [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `N:;${shown};;`,
          `FN:${shown}`,
          `item1.TEL;waid=${phone}:${phone}`,
          "item1.X-ABLabel:WhatsApp",
          "END:VCARD",
        ].join("\n"),
        ...(THUMB ? { jpegThumbnail: THUMB } : {}),
      },
    },
  };
}

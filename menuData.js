// Menu structure. Every command gets its own sticker (emoji) in front of it.
// Names are written in plain ascii here and converted to small-caps when rendered.

const SMALL = {
  a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ",
  k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "ꜱ", t: "ᴛ",
  u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
};
export const small = (str) =>
  String(str).toLowerCase().replace(/[a-z]/g, (c) => SMALL[c] || c);

export const MENU = [
  {
    key: "main", icon: "🏠", title: "main",
    cmds: [["🔗", "pair"]],
  },
  {
    key: "owner", icon: "👑", title: "owner",
    cmds: [
      ["📵", "anticall"], ["🗑️", "antidelete"], ["🛡️", "antilink"], ["❤️", "autoreact"],
      ["✅", "autoread"], ["🎤", "autorecord"], ["💬", "autoreply"], ["👀", "autostatus"],
      ["💞", "autostatusreact"], ["⌨️", "autotyping"], ["🚫", "block"], ["📛", "blocklist"],
      ["📡", "broadcast"], ["🗑️", "del"], ["🧽", "delme"], ["🗑️", "delmsong"],
      ["🚷", "delmuser"], ["📤", "forward"], ["🖼️", "fullpp"], ["📖", "getbio"],
      ["🔎", "getname"], ["📸", "getpp"], ["🆔", "jid"], ["🤝", "join"],
      ["🏃", "leaveall"], ["🗂️", "listgc"], ["📃", "listmsongs"], ["📋", "listmuser"],
      ["🔔", "mention"], ["🔐", "mode"], ["🪪", "myname"], ["💭", "mystatus"],
      ["💬", "quoted"], ["🙈", "removepp"], ["💾", "save"], ["📝", "setbio"],
      ["📄", "setmbody"], ["↪️", "setmforward"], ["🖼️", "setmimg"], ["🔗", "setmlink"],
      ["🎙️", "setmptt"], ["🎵", "setmsong"], ["🌄", "setmthumb"], ["🔤", "setmtitle"],
      ["👤", "setmuser"], ["✍️", "setname"], ["🤳", "setpp"], ["✔️", "unblock"],
      ["🧼", "unblockall"], ["🕵️", "whois"],
    ],
  },
  {
    key: "downloader", icon: "📥", title: "downloader",
    cmds: [["📘", "fb"], ["🐙", "git"], ["📷", "insta"], ["📌", "pint"], ["🎶", "tiktok"]],
  },
  {
    key: "image", icon: "🎨", title: "image",
    cmds: [
      ["🌸", "animeart"], ["🧸", "cartoon3d"], ["🎨", "imagine"], ["🎞️", "imagine4"],
      ["🪄", "imgprompt"], ["🏷️", "logo"], ["👾", "pixelart"], ["📸", "realistic"],
      ["✏️", "sketch"], ["🖼️", "wallpaper"],
    ],
  },
  {
    key: "tools", icon: "🧰", title: "tools",
    cmds: [
      ["🧮", "calc"], ["⭕", "circle"], ["📖", "dictionary"], ["📥", "get"],
      ["👑", "owner"], ["🔳", "qr"], ["⏱️", "runtime"], ["🔗", "shorturl"],
      ["📸", "ssweb"], ["🎼", "tomp3"], ["🔊", "tts"], ["🎤", "vnote"],
    ],
  },
  {
    key: "encode", icon: "🔐", title: "encode / hash",
    cmds: [
      ["🔣", "asciicodes"], ["🔐", "atbash"], ["🪞", "atbashx"], ["🧬", "b32"],
      ["📭", "b64dec"], ["📦", "b64enc"], ["📟", "bindec"], ["🖥️", "binenc"],
      ["🏺", "caesarx"], ["🪪", "codepoints"], ["🧮", "crc32"], ["🔤", "fromascii"],
      ["🔙", "fromoctal"], ["🧫", "hexdec"], ["🧪", "hexenc"], ["🏷️", "htmlesc"],
      ["🔖", "htmlunesc"], ["📦", "jsonmin"], ["🧾", "jsonpretty"], ["🧾", "md5"],
      ["🔑", "md5h"], ["🎙️", "morsedec"], ["📻", "morseenc"], ["🎱", "octenc"],
      ["🔁", "rot13x"], ["🗝️", "rot47"], ["🔂", "rot47x"], ["📇", "sha1"],
      ["🔏", "sha1h"], ["🛡️", "sha256"], ["🛡️", "sha256h"], ["🧱", "sha384h"],
      ["🏦", "sha512"], ["🏰", "sha512h"], ["🧷", "tooctal"], ["🧫", "unb32"],
      ["🕸️", "urldec"], ["🌍", "urldecode"], ["🌐", "urlenc"],
    ],
  },
  {
    key: "misc", icon: "📦", title: "misc",
    cmds: [["🆔", "checkid"], ["🏓", "ping"], ["⏳", "uptime"]],
  },
  {
    key: "search", icon: "📁", title: "search",
    cmds: [["🎵", "song"]],
  },
];

/** Render menu sections as WhatsApp text. `only` = section key to show just one. */
export function renderMenuSections(prefix = ".", only = null) {
  const sections = only ? MENU.filter((s) => s.key === only) : MENU;
  return sections
    .map((s) => {
      const head = `*[ ${s.icon} ${small(s.title)} — ${s.cmds.length} ]*`;
      const lines = s.cmds.map(([e, c]) => `> *_⤷ ${e} ${prefix}${small(c)}_*`);
      return `${head}\n\n${lines.join("\n")}`;
    })
    .join("\n\n");
}

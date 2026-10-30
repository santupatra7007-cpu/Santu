// Pure text encoders / decoders / hashes used by plugins/encode.js
import crypto from "crypto";

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Encode(buf) {
  let bits = 0, value = 0, out = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  while (out.length % 8) out += "=";
  return out;
}

export function base32Decode(str) {
  const clean = String(str).toUpperCase().replace(/=+$/g, "").replace(/\s+/g, "");
  let bits = 0, value = 0;
  const out = [];
  for (const ch of clean) {
    const idx = B32.indexOf(ch);
    if (idx === -1) throw new Error(`Base32 এ অবৈধ অক্ষর: "${ch}"`);
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

// ── CRC32 ───────────────────────────────────────────────────────────────────
let CRC_TABLE = null;
export function crc32(buf) {
  if (!CRC_TABLE) {
    CRC_TABLE = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      CRC_TABLE[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = CRC_TABLE[(crc ^ b) & 255] ^ (crc >>> 8);
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, "0");
}

// ── Ciphers ─────────────────────────────────────────────────────────────────
const mod = (n, m) => ((n % m) + m) % m;

export function atbash(text, digits = false) {
  return [...text]
    .map((ch) => {
      if (/[a-z]/.test(ch)) return String.fromCharCode(219 - ch.charCodeAt(0));
      if (/[A-Z]/.test(ch)) return String.fromCharCode(155 - ch.charCodeAt(0));
      if (digits && /[0-9]/.test(ch)) return String(9 - Number(ch));
      return ch;
    })
    .join("");
}

export function caesar(text, shift) {
  return [...text]
    .map((ch) => {
      if (/[a-z]/.test(ch)) return String.fromCharCode(97 + mod(ch.charCodeAt(0) - 97 + shift, 26));
      if (/[A-Z]/.test(ch)) return String.fromCharCode(65 + mod(ch.charCodeAt(0) - 65 + shift, 26));
      return ch;
    })
    .join("");
}

/** ROT13 for letters + ROT5 for digits (a.k.a. ROT18) */
export function rot13x(text) {
  return [...caesar(text, 13)]
    .map((ch) => (/[0-9]/.test(ch) ? String((Number(ch) + 5) % 10) : ch))
    .join("");
}

/** Rotate printable ASCII (33–126) by `shift` (47 = classic ROT47). */
export function rot47(text, shift = 47) {
  return [...text]
    .map((ch) => {
      const c = ch.charCodeAt(0);
      return c >= 33 && c <= 126 ? String.fromCharCode(33 + mod(c - 33 + shift, 94)) : ch;
    })
    .join("");
}

// ── Morse ───────────────────────────────────────────────────────────────────
const MORSE = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....", i: "..",
  j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.",
  s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
  0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....", 6: "-....",
  7: "--...", 8: "---..", 9: "----.", ".": ".-.-.-", ",": "--..--", "?": "..--..",
  "'": ".----.", "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...",
  ":": "---...", ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", _: "..--.-",
  '"': ".-..-.", $: "...-..-", "@": ".--.-.",
};
const MORSE_REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

export function morseEncode(text) {
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => [...w].map((ch) => MORSE[ch] ?? "").filter(Boolean).join(" "))
    .join(" / ");
}

export function morseDecode(code) {
  return code
    .trim()
    .split(/\s*\/\s*|\s{3,}/)
    .map((w) => w.split(/\s+/).map((s) => MORSE_REV[s] ?? "?").join(""))
    .join(" ");
}

// ── Hashing ─────────────────────────────────────────────────────────────────
export const hashHex = (algo, text) => crypto.createHash(algo).update(text, "utf8").digest("hex");
export function hashDetails(algo, text) {
  const d = crypto.createHash(algo).update(text, "utf8").digest();
  return [
    `Algorithm : ${algo.toUpperCase()}`,
    `Input     : ${Buffer.byteLength(text, "utf8")} bytes`,
    `Length    : ${d.length * 8} bit (${d.length * 2} hex chars)`,
    ``,
    `HEX (lower):`,
    d.toString("hex"),
    `HEX (UPPER):`,
    d.toString("hex").toUpperCase(),
    `Base64:`,
    d.toString("base64"),
  ].join("\n");
}

// ── Misc ────────────────────────────────────────────────────────────────────
const need = (t) => {
  if (!t || !String(t).length) throw new Error("EMPTY");
  return String(t);
};

export const htmlEscape = (t) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export const htmlUnescape = (t) =>
  t
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");

const numList = (t) => {
  const nums = String(t).match(/-?\d+/g);
  if (!nums) throw new Error("কোনো সংখ্যা পাওয়া যায়নি");
  return nums.map(Number);
};

/**
 * Registry: name → { usage, desc, run(text) -> string }
 * `text` is the command argument (or the replied message text).
 */
export const ENCODERS = {
  // — text ⇄ numbers —
  asciicodes: { usage: "<text>", desc: "টেক্সট → ASCII/Unicode কোড (দশমিক)", run: (t) => [...need(t)].map((c) => c.codePointAt(0)).join(" ") },
  fromascii:  { usage: "<codes>", desc: "ASCII কোড (দশমিক) → টেক্সট", run: (t) => String.fromCodePoint(...numList(need(t))) },
  codepoints: { usage: "<text>", desc: "টেক্সট → Unicode code points (U+XXXX)", run: (t) => [...need(t)].map((c) => "U+" + c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")).join(" ") },

  // — base32 / base64 —
  b32:    { usage: "<text>", desc: "Base32 encode", run: (t) => base32Encode(Buffer.from(need(t), "utf8")) },
  unb32:  { usage: "<base32>", desc: "Base32 decode", run: (t) => base32Decode(need(t)).toString("utf8") },
  b64enc: { usage: "<text>", desc: "Base64 encode", run: (t) => Buffer.from(need(t), "utf8").toString("base64") },
  b64dec: { usage: "<base64>", desc: "Base64 decode", run: (t) => Buffer.from(need(t).trim(), "base64").toString("utf8") },

  // — hex / binary / octal —
  hexenc: { usage: "<text>", desc: "টেক্সট → Hex", run: (t) => Buffer.from(need(t), "utf8").toString("hex") },
  hexdec: {
    usage: "<hex>", desc: "Hex → টেক্সট",
    run: (t) => {
      const h = need(t).replace(/0x|\s+/gi, "");
      if (!/^[0-9a-f]*$/i.test(h) || h.length % 2) throw new Error("সঠিক Hex দিন (জোড় সংখ্যক অক্ষর)");
      return Buffer.from(h, "hex").toString("utf8");
    },
  },
  binenc: { usage: "<text>", desc: "টেক্সট → Binary (8-bit)", run: (t) => [...Buffer.from(need(t), "utf8")].map((b) => b.toString(2).padStart(8, "0")).join(" ") },
  bindec: {
    usage: "<binary>", desc: "Binary → টেক্সট",
    run: (t) => {
      const bits = need(t).replace(/\s+/g, "");
      if (!/^[01]+$/.test(bits) || bits.length % 8) throw new Error("সঠিক Binary দিন (৮ বিটের গ্রুপ)");
      return Buffer.from(bits.match(/.{8}/g).map((b) => parseInt(b, 2))).toString("utf8");
    },
  },
  octenc:    { usage: "<text>", desc: "টেক্সট → Octal (বাইট ধরে)", run: (t) => [...Buffer.from(need(t), "utf8")].map((b) => b.toString(8).padStart(3, "0")).join(" ") },
  fromoctal: {
    usage: "<octal bytes>", desc: "Octal (বাইট) → টেক্সট",
    run: (t) => {
      const parts = need(t).trim().split(/\s+/);
      if (parts.some((p) => !/^[0-7]{1,3}$/.test(p))) throw new Error("সঠিক Octal দিন (যেমন: 110 151)");
      return Buffer.from(parts.map((p) => parseInt(p, 8))).toString("utf8");
    },
  },
  tooctal: { usage: "<number(s)>", desc: "দশমিক সংখ্যা → Octal সংখ্যা", run: (t) => numList(need(t)).map((n) => n.toString(8)).join(" ") },

  // — ciphers —
  atbash:  { usage: "<text>", desc: "Atbash cipher (A↔Z)", run: (t) => atbash(need(t), false) },
  atbashx: { usage: "<text>", desc: "Atbash + সংখ্যা (0↔9)", run: (t) => atbash(need(t), true) },
  rot13x:  { usage: "<text>", desc: "ROT13 + সংখ্যা ROT5 (ROT18)", run: (t) => rot13x(need(t)) },
  rot47:   { usage: "<text>", desc: "ROT47 cipher", run: (t) => rot47(need(t), 47) },
  rot47x:  {
    usage: "[shift] <text>", desc: "ROT47 কাস্টম shift (ডিফল্ট 47)",
    run: (t) => {
      const m = need(t).match(/^\s*(-?\d{1,3})\s+([\s\S]+)$/);
      return m ? rot47(m[2], parseInt(m[1], 10)) : rot47(t, 47);
    },
  },
  caesarx: {
    usage: "<shift> <text>  |  <text> (সব shift)", desc: "Caesar cipher — shift দিন, না দিলে ২৫টি shift-ই দেখায়",
    run: (t) => {
      const m = need(t).match(/^\s*(-?\d{1,3})\s+([\s\S]+)$/);
      if (m) return caesar(m[2], parseInt(m[1], 10));
      return Array.from({ length: 25 }, (_, i) => `${String(i + 1).padStart(2, " ")}: ${caesar(t, i + 1)}`).join("\n");
    },
  },
  morseenc: { usage: "<text>", desc: "টেক্সট → Morse", run: (t) => morseEncode(need(t)) },
  morsedec: { usage: "<morse>", desc: "Morse → টেক্সট (শব্দ আলাদা করতে /)", run: (t) => morseDecode(need(t)) },

  // — HTML / JSON / URL —
  htmlesc:   { usage: "<text>", desc: "HTML escape", run: (t) => htmlEscape(need(t)) },
  htmlunesc: { usage: "<html>", desc: "HTML unescape", run: (t) => htmlUnescape(need(t)) },
  jsonmin: {
    usage: "<json>", desc: "JSON minify",
    run: (t) => { try { return JSON.stringify(JSON.parse(need(t))); } catch { throw new Error("সঠিক JSON দিন"); } },
  },
  jsonpretty: {
    usage: "<json>", desc: "JSON সুন্দর করে সাজায়",
    run: (t) => { try { return JSON.stringify(JSON.parse(need(t)), null, 2); } catch { throw new Error("সঠিক JSON দিন"); } },
  },
  urlenc: { usage: "<text>", desc: "URL encode", run: (t) => encodeURIComponent(need(t)) },
  urldec: {
    usage: "<text>", desc: "URL decode (strict)",
    run: (t) => { try { return decodeURIComponent(need(t)); } catch { throw new Error("অবৈধ URL-encoded টেক্সট"); } },
  },
  urldecode: {
    usage: "<text>", desc: "URL decode (ফর্ম স্টাইল: + = স্পেস, ভুল হলেও চেষ্টা করে)",
    run: (t) => {
      const s = need(t).replace(/\+/g, " ");
      try { return decodeURIComponent(s); }
      catch { return s.replace(/%([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16))); }
    },
  },

  // — checksums & hashes —
  crc32:    { usage: "<text>", desc: "CRC32 checksum", run: (t) => crc32(Buffer.from(need(t), "utf8")) },
  md5:      { usage: "<text>", desc: "MD5 hash", run: (t) => hashHex("md5", need(t)) },
  md5h:     { usage: "<text>", desc: "MD5 — বিস্তারিত (hex/HEX/base64)", run: (t) => hashDetails("md5", need(t)) },
  sha1:     { usage: "<text>", desc: "SHA-1 hash", run: (t) => hashHex("sha1", need(t)) },
  sha1h:    { usage: "<text>", desc: "SHA-1 — বিস্তারিত", run: (t) => hashDetails("sha1", need(t)) },
  sha256:   { usage: "<text>", desc: "SHA-256 hash", run: (t) => hashHex("sha256", need(t)) },
  sha256h:  { usage: "<text>", desc: "SHA-256 — বিস্তারিত", run: (t) => hashDetails("sha256", need(t)) },
  sha384h:  { usage: "<text>", desc: "SHA-384 — বিস্তারিত", run: (t) => hashDetails("sha384", need(t)) },
  sha512:   { usage: "<text>", desc: "SHA-512 hash", run: (t) => hashHex("sha512", need(t)) },
  sha512h:  { usage: "<text>", desc: "SHA-512 — বিস্তারিত", run: (t) => hashDetails("sha512", need(t)) },
};

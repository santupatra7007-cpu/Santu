// Bengali / Banglish abuse detector (token based, so normal words don't trigger it).

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[\u200b-\u200d\u2060\ufeff]/g, "")
    .replace(/ী/g, "ি")
    .replace(/ূ/g, "ু")
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, " ")
    .trim();

const TOKENS = new Set(
  [
    // Bengali
    "বুকাচোদা", "বোকাচোদা", "বকাচোদা", "বানচোদ", "বানচোদা", "বানচোর", "বাইনচোদ",
    "মাগি", "মাগির", "মাগিরা", "খানকি", "খানকির", "খানকিরা", "নটি", "নটির",
    "চুদি", "চুদির", "চুদমারানি", "চোদনা", "চোদা", "চুদা", "মাদারচোদ", "মাদারচুদ",
    // Banglish
    "bokachoda", "bokachod", "bukachoda", "bukachod", "banchod", "banchoda", "banchor",
    "magir", "khanki", "khankir", "notir", "chudi", "chudir", "chudmarani", "chodna", "madarchod",
  ].map(norm)
);

const PHRASES = [
  "মাগির ছেলে", "মাগির পোলা", "নটির পোলা", "নটির ছেলে", "তোর মাকে চুদি", "মাকে চুদি",
  "তোর মারে চুদি", "মারে চুদি", "মাকে চোদ",
  "magir chele", "magir pola", "notir pola", "notir chele", "tor mak chudi", "mak chudi", "tor make chudi",
].map(norm);

/** Returns the matched word/phrase, or null. */
export function findAbuse(text) {
  const t = norm(text);
  if (!t) return null;
  const padded = ` ${t} `;
  for (const p of PHRASES) if (padded.includes(` ${p} `)) return p;
  for (const w of t.split(" ")) if (TOKENS.has(w)) return w;
  return null;
}

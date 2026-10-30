// AI image commands: .imagine .imagine4 .animeart .cartoon3d .logo .pixelart
//                    .realistic .sketch .wallpaper  +  .imgprompt (image → prompt)
// Images come from the free pollinations.ai endpoint (no API key needed).
import axios from "axios";
import { Module } from "../lib/plugins.js";
import { getMedia } from "../lib/farabiUtil.js";

const BASE = "https://image.pollinations.ai/prompt/";

const STYLES = {
  imagine:   { emoji: "🎨", desc: "AI image from text", pre: "", suf: "", w: 1024, h: 1024 },
  imagine4:  { emoji: "🎞️", desc: "AI image — high detail 4K", pre: "", suf: ", ultra detailed, 4k, sharp focus, masterpiece, best quality", w: 1536, h: 1536 },
  animeart:  { emoji: "🌸", desc: "Anime style art", pre: "anime style illustration of ", suf: ", vibrant colors, detailed, studio quality", w: 1024, h: 1024 },
  cartoon3d: { emoji: "🧸", desc: "3D cartoon style", pre: "3D cartoon character render of ", suf: ", pixar style, cute, soft lighting, high quality", w: 1024, h: 1024 },
  logo:      { emoji: "🏷️", desc: "Logo design", pre: "professional minimalist vector logo design for ", suf: ", clean, modern, flat design, white background", w: 1024, h: 1024 },
  pixelart:  { emoji: "👾", desc: "Pixel art", pre: "pixel art of ", suf: ", 16-bit retro game style, crisp pixels", w: 1024, h: 1024 },
  realistic: { emoji: "📸", desc: "Photorealistic image", pre: "photorealistic photo of ", suf: ", ultra realistic, natural lighting, DSLR, 8k", w: 1024, h: 1024 },
  sketch:    { emoji: "✏️", desc: "Pencil sketch", pre: "detailed pencil sketch drawing of ", suf: ", black and white, hand drawn, graphite on paper", w: 1024, h: 1024 },
  wallpaper: { emoji: "🖼️", desc: "Phone wallpaper (portrait)", pre: "stunning phone wallpaper of ", suf: ", 4k, highly detailed, aesthetic", w: 1080, h: 1920 },
};

async function fetchImage(prompt, { w, h }) {
  const seed = Math.floor(Math.random() * 1e9);
  const url = `${BASE}${encodeURIComponent(prompt)}?width=${w}&height=${h}&seed=${seed}&nologo=true&model=flux`;
  let lastErr;
  for (let i = 0; i < 2; i++) {
    try {
      const res = await axios.get(url, { responseType: "arraybuffer", timeout: 120_000 });
      const buf = Buffer.from(res.data);
      if (buf.length > 2000) return buf;
      lastErr = new Error("empty image");
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

for (const [cmd, st] of Object.entries(STYLES)) {
  Module({ command: cmd, package: "image", description: `${st.emoji} ${st.desc}: .${cmd} <prompt>` })(
    async (m, match) => {
      const text = String(match || "").trim() || m.quoted?.body?.trim() || m.quoted?.text?.trim();
      if (!text) return m.send(`${st.emoji} _একটা বর্ণনা লিখুন।_\nযেমন: .${cmd} a lion in the forest`);
      try {
        await m.react("⏳");
        const img = await fetchImage(`${st.pre}${text}${st.suf}`, st);
        await m.conn.sendMessage(
          m.from,
          { image: img, caption: `${st.emoji} *${cmd}*\n_${text.slice(0, 200)}_\n\n〔 🇱ᴏᴠᴇㅤ乙ᴏɴᴇ 〕` },
          { quoted: m.raw }
        );
        await m.react("✅");
      } catch (e) {
        console.error(`[${cmd}]`, e?.message || e);
        await m.react("❌");
        await m.send(`❌ ছবি বানানো যায়নি: ${e?.message || "unknown error"}`);
      }
    }
  );
}

// ── .imgprompt : reply to an image → get a text prompt that describes it ────
const ASK = "Describe this image as a detailed text-to-image prompt (subject, style, colors, lighting, composition). Reply with the prompt only, in English.";

async function describeImage(buf, mime = "image/jpeg") {
  const b64 = buf.toString("base64");

  if (process.env.GEMINI_API_KEY) {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const r = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ inlineData: { mimeType: mime, data: b64 } }, { text: ASK }] }],
    });
    if (r?.text) return r.text.trim();
  }

  const { data } = await axios.post(
    "https://text.pollinations.ai/openai",
    {
      model: "openai",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: ASK },
            { type: "image_url", image_url: { url: `data:${mime};base64,${b64}` } },
          ],
        },
      ],
    },
    { timeout: 90_000 }
  );
  return String(data?.choices?.[0]?.message?.content || "").trim();
}

Module({
  command: "imgprompt",
  package: "image",
  description: "🪄 Reply to an image: get an AI prompt for it",
})(async (m) => {
  try {
    const media = await getMedia(m, ["imageMessage"]);
    if (!media) return m.send("🪄 _একটা ছবিতে রিপ্লাই দিয়ে .imgprompt দিন।_");
    await m.react("⏳");
    const out = await describeImage(media.buffer);
    if (!out) throw new Error("কোনো উত্তর পাওয়া যায়নি");
    await m.react("✅");
    await m.send(`🪄 *Image Prompt*\n\n${out}`);
  } catch (e) {
    console.error("[imgprompt]", e?.message || e);
    await m.react("❌");
    await m.send(`❌ Failed: ${e?.message || "unknown error"}`);
  }
});

import axios from "axios";
import { Module } from "../lib/plugins.js";

// ── .ai  (🤖) — Gemini if GEMINI_API_KEY is set, otherwise free GPT endpoint ──
Module({
  command: "ai",
  package: "ai",
  description: "🤖 Ask AI: .ai <question>",
})(async (m, match) => {
  const q = String(match || "").trim() || m.quoted?.body?.trim();
  if (!q) return m.send("🤖 _একটা প্রশ্ন লিখুন।_\nযেমন: .ai বাংলাদেশের রাজধানী কী?");
  try {
    await m.react("🤖");
    let answer = "";

    if (process.env.GEMINI_API_KEY) {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const r = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
        contents: q,
      });
      answer = r?.text || "";
    } else {
      const { data } = await axios.get("https://api.yupra.my.id/api/ai/gpt5", {
        params: { text: q },
        timeout: 60_000,
      });
      answer = data?.status ? data.result : "";
    }

    if (!answer) throw new Error("AI থেকে কোনো উত্তর আসেনি");
    await m.send(`🤖 ${answer}`);
  } catch (e) {
    console.error("[ai]", e?.message || e);
    await m.send(`🤖 ⚠️ AI error: ${e?.message || "unknown"}`);
  }
});

// ── .claude  (🧠) — needs ANTHROPIC_API_KEY ───────────────────────────────────
Module({
  command: "claude",
  package: "ai",
  description: "🧠 Ask Claude: .claude <question>",
})(async (m, match) => {
  const q = String(match || "").trim() || m.quoted?.body?.trim();
  if (!q) return m.send("🧠 _একটা প্রশ্ন লিখুন।_\nযেমন: .claude একটা ছোট কবিতা লেখো");
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return m.send(
      "🧠 ⚠️ ANTHROPIC_API_KEY সেট করা নেই।\nconfig.env ফাইলে লিখুন:\nANTHROPIC_API_KEY=আপনার_key"
    );
  }
  try {
    await m.react("🧠");
    const { data } = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: process.env.CLAUDE_MODEL || "claude-sonnet-5-5",
        max_tokens: 1000,
        messages: [{ role: "user", content: q }],
      },
      {
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        timeout: 90_000,
      }
    );
    const answer = (data?.content || []).map((b) => b.text || "").join("").trim();
    if (!answer) throw new Error("Claude থেকে কোনো উত্তর আসেনি");
    await m.send(`🧠 ${answer}`);
  } catch (e) {
    const msg = e?.response?.data?.error?.message || e?.message || "unknown";
    console.error("[claude]", msg);
    await m.send(`🧠 ⚠️ Claude error: ${msg}`);
  }
});

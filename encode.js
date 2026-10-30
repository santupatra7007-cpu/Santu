// Encode / decode / hash commands (39). Logic lives in lib/encoders.js.
import { Module } from "../lib/plugins.js";
import { ENCODERS } from "../lib/encoders.js";
import { MENU } from "../lib/menuData.js";

const EMOJI = Object.fromEntries(MENU.find((s) => s.key === "encode").cmds.map(([e, c]) => [c, e]));

for (const [name, def] of Object.entries(ENCODERS)) {
  Module({
    command: name,
    package: "encode",
    description: `${EMOJI[name] || "🔐"} ${def.desc}  —  .${name} ${def.usage}`,
  })(async (m, match) => {
    const input = String(match || "").length ? String(match) : String(m.quoted?.body || m.quoted?.text || "");
    try {
      const out = def.run(input);
      await m.send(`${EMOJI[name] || "🔐"} *${name}*\n\n\`\`\`${out}\`\`\``);
    } catch (e) {
      if (e?.message === "EMPTY") {
        return m.send(`${EMOJI[name] || "🔐"} *${name}* — ${def.desc}\n\n_ব্যবহার:_ .${name} ${def.usage}\n_অথবা কোনো মেসেজে রিপ্লাই দিন।_`);
      }
      await m.send(`❌ ${name}: ${e?.message || "কিছু ভুল হয়েছে"}`);
    }
  });
}

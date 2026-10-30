import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import os from "os";
import { db } from "./client.js";

ffmpeg.setFfmpegPath(ffmpegPath);

export const MENU_ROOT = path.join(process.cwd(), "data", "media", "menu");
export const botDir = (bot) => {
  const d = path.join(MENU_ROOT, String(bot));
  fs.mkdirSync(d, { recursive: true });
  return d;
};

/** menu_cfg = { title, body, link, forward, users:[], songs:[files], img, thumb, ptt } */
export const getCfg = (bot) => db.get(bot, "menu_cfg", {}) || {};
export function setCfg(bot, patch) {
  const next = { ...getCfg(bot), ...patch };
  db.setHot(bot, "menu_cfg", next);
  return next;
}

/** Convert a media buffer with ffmpeg (audio → mp3 / opus-ogg). Returns Buffer. */
export function ffConvert(buf, outExt, build) {
  return new Promise((resolve, reject) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const inp = path.join(os.tmpdir(), `in_${id}`);
    const out = path.join(os.tmpdir(), `out_${id}.${outExt}`);
    fs.writeFileSync(inp, buf);
    const cmd = ffmpeg(inp);
    build(cmd)
      .on("error", (e) => {
        fs.unlink(inp, () => {});
        fs.unlink(out, () => {});
        reject(e);
      })
      .on("end", () => {
        try {
          const data = fs.readFileSync(out);
          resolve(data);
        } catch (e) {
          reject(e);
        } finally {
          fs.unlink(inp, () => {});
          fs.unlink(out, () => {});
        }
      })
      .save(out);
  });
}

export const toMp3 = (buf) =>
  ffConvert(buf, "mp3", (c) => c.noVideo().audioCodec("libmp3lame").audioBitrate(128).format("mp3"));

export const toOpusPtt = (buf) =>
  ffConvert(buf, "ogg", (c) =>
    c.noVideo().audioCodec("libopus").audioBitrate(48).audioChannels(1).audioFrequency(48000).format("ogg")
  );

// 상태 체크: 10분에 1회 돌릴 것. 각 URL 에 HEAD 1회(실패 시 GET 1회) → data/status.json + data/status.js
// 원본에 부담 주지 않게 동시 3개, User-Agent 명시. og:image URL 만 읽어 두고 이미지는 저장하지 않는다.
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
require(join(here, "..", "data", "places.js"));
const places = globalThis.PLACES.filter(p => !p.hidden);
const UA = "yozum-jangso-status/0.1 (+https://yozum-jangso.example/about-status)";
const TIMEOUT = 12000;

async function probe(url) {
  const t0 = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal, headers: { "user-agent": UA } });
    let og = null, title = null;
    if (!res.ok || res.status === 405) {
      res = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal, headers: { "user-agent": UA } });
    }
    if (res.ok) {
      const html = await fetch(url, { redirect: "follow", signal: ctrl.signal, headers: { "user-agent": UA } }).then(r => r.text()).catch(() => "");
      og = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1] || html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i)?.[1] || null;
      if (og && og.startsWith("/")) og = new URL(og, url).href;
      title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || null;
    }
    const ms = Date.now() - t0;
    // 🟢 열림 · 🟡 웨이팅(느림/503) · 🔴 다운
    const status = res.ok ? (ms > 6000 ? "waiting" : "open") : (res.status === 503 || res.status === 429 ? "waiting" : "down");
    return { status, code: res.status, ms, og, title };
  } catch (e) {
    return { status: "down", code: 0, ms: Date.now() - t0, og: null, title: null, error: String(e.name || e) };
  } finally { clearTimeout(timer); }
}

const out = { checkedAt: new Date().toISOString(), places: {} };
const queue = places.filter(p => p.url);
for (let i = 0; i < queue.length; i += 3) {
  const chunk = queue.slice(i, i + 3);
  const results = await Promise.all(chunk.map(p => probe(p.url)));
  chunk.forEach((p, k) => { out.places[p.id] = results[k]; });
}
for (const p of places.filter(p => !p.url)) out.places[p.id] = { status: p.status || "soon", code: 0, ms: 0, og: null };

writeFileSync(join(here, "..", "data", "status.json"), JSON.stringify(out, null, 2));
writeFileSync(join(here, "..", "data", "status.js"), "globalThis.STATUS = " + JSON.stringify(out) + ";\n");
const summary = Object.entries(out.places).map(([id, s]) => `${s.status.padEnd(7)} ${String(s.code).padStart(3)} ${String(s.ms).padStart(5)}ms ${id}${s.og ? " og" : ""}`).join("\n");
console.log(summary);

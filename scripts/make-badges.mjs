// 제작자 배지: badges/<id>.svg (PNG 는 npm run badges 뒤 build-pages 가 아니라 headless Chrome 으로 따로 — docs/deploy.md)
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
require(join(here, "..", "data", "places.js"));
require(join(here, "..", "data", "config.js"));
const out = join(here, "..", "badges"); mkdirSync(out, { recursive: true });
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
let n = 0;
for (const p of globalThis.PLACES) {
  if (!p.url) continue;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="112" viewBox="0 0 360 112">
<defs><style>text{font-family:Pretendard,"Apple SD Gothic Neo","Noto Sans KR",sans-serif}</style></defs>
<rect width="360" height="112" rx="18" fill="#1E6F5C"/>
<rect x="10" y="10" width="340" height="92" rx="12" fill="none" stroke="#F4F1EA" stroke-opacity=".35"/>
<text x="26" y="40" font-size="13" font-weight="600" fill="#F4F1EA" fill-opacity=".85">요즘장소 등재 · 온라인 장소 디렉토리</text>
<text x="26" y="72" font-size="24" font-weight="800" fill="#FFFFFF">${esc(p.name)}</text>
<text x="26" y="92" font-size="12" fill="#F4F1EA" fill-opacity=".8">${esc(p.type)} · ${esc(p.addedAt)} 등록 · ${esc(globalThis.CONFIG.SITE_URL.replace(/^https?:\/\//,""))}/places/${p.id}.html</text>
<circle cx="318" cy="56" r="22" fill="#F4F1EA"/><text x="318" y="64" font-size="22" text-anchor="middle">🪷</text>
</svg>`;
  writeFileSync(join(out, p.id + ".svg"), svg); n++;
}
console.log("badges", n);

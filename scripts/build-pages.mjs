// SEO 상세 페이지 생성: places/<id>.html (정적, JS 없이도 완전) + sitemap.xml
import { createRequire } from "node:module";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const require = createRequire(import.meta.url);
require(join(root, "data", "places.js")); require(join(root, "data", "config.js")); require(join(root, "assets", "icons.js"));
const { icon, ticon } = globalThis;
const P = globalThis.PLACES.filter(p => !p.hidden), C = globalThis.CONFIG;
const S = existsSync(join(root, "data", "status.json")) ? JSON.parse(readFileSync(join(root, "data", "status.json"), "utf8")) : { checkedAt: null, places: {} };
const LABEL = {down:"안 열림",soon:"준비 중"};
const checkedDate = S.checkedAt ? new Date(S.checkedAt).toLocaleDateString("ko-KR",{timeZone:"Asia/Seoul",year:"numeric",month:"numeric",day:"numeric"}) : "—";
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
mkdirSync(join(root, "places"), { recursive: true });

const FOOT = `<footer class="foot">요즘장소는 링크와 우리가 쓴 소개만 싣습니다. 원본의 글·이미지·장소 목록을 복사하지 않고, 화면을 iframe 으로 끼워 넣지 않습니다.<br><a href="../lineage.html">유행의 흐름</a> · <a href="../remove.html">내려 주세요</a> · <a href="../privacy.html">개인정보처리방침</a> · <a href="../submit.html">내 장소 등록하기</a></footer>`;

for (const p of P) {
  const st = S.places[p.id] || {}; const s = st.status || p.status || "unknown";
  const url = `${C.SITE_URL}/places/${p.id}`;   // Cloudflare Pages 는 .html 을 이 주소로 308 → canonical·sitemap 은 깔끔한 주소
  const title = p.url ? `${p.name} 바로가기 · ${p.type} 온라인 장소 | 요즘장소` : `${p.name} · ${p.type} | 요즘장소`;
  const desc = `${p.intro} 할 수 있는 것: ${p.actions.join(", ")}. 말하기 ${p.talk}, ${p.hours}, ${p.devices.join("·")}.`.slice(0, 155);
  const ld = { "@context": "https://schema.org", "@type": "WebSite", name: p.name, url: p.url || url, description: p.intro, inLanguage: p.lang, author: { "@type": "Person", name: p.maker }, isPartOf: { "@type": "Collection", name: "요즘장소", url: C.SITE_URL } };
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:type" content="website">${st.og ? `<meta property="og:image" content="${esc(st.og)}">` : ""}
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"><link rel="stylesheet" href="../assets/style.css"></head>
<body><div class="phone">
<div class="hero">${st.og ? `<img src="${esc(st.og)}" alt="${esc(p.name)} 미리보기(원본 og:image)" referrerpolicy="no-referrer">` : ticon(p.type,72)}<a class="back" href="../index.html">${icon("chevron-left",20)}</a></div>
<section class="detail">
<div class="row"><span class="badge type">${esc(p.type)}</span>${LABEL[s] ? `<span class="badge ${s}">${LABEL[s]}</span>` : ""}${p.overseas?'<span class="badge type">해외</span>':''}</div>
<h1>${esc(p.name)}</h1>
<p class="small">만든 사람 ${esc(p.maker)} · ${p.lang==="ko"?"한국어":"영어"} · ${esc(p.addedAt)} 등록</p>
<p style="font-size:15px;line-height:1.6;margin:10px 0">${esc(p.intro)}</p>
${p.verify ? `<div class="notice">확인 중: ${esc(p.verify)}</div>` : ""}
<h2>할 수 있는 것</h2><div class="acts2">${p.actions.map(a=>`<span>${esc(a)}</span>`).join("")}</div>
<div class="kv"><div><small>말하기</small><b>${esc(p.talk)}</b></div><div><small>개방 시간</small><b>${esc(p.hours)}</b></div><div><small>기기</small><b>${p.devices.join(" · ")}</b></div><div><small>조작</small><b>${esc(p.controls)}</b></div><div><small>링크 확인</small><b>${s==="soon"?"—":checkedDate}</b></div><div><small>안 열리면</small><b><a href="../remove.html?id=${p.id}&kind=broken" style="color:var(--green)">신고하기</a></b></div></div>
<h2>이 장소에 가는 법</h2>
<ol class="small" style="padding-left:18px;font-size:13px">
<li>아래 「입장하기」를 누르면 원본 사이트 ${p.url ? esc(new URL(p.url).host) : ""} 로 바로 갑니다. 설치·가입 없음.</li>
<li>${esc(p.controls)} 으로 움직이고, ${esc(p.actions.slice(0,2).join("·"))} 부터 해 보세요.</li>
<li>${p.talk==="없음" ? "말을 걸 수 없는 공간입니다. 조용히 같이 있는 게 전부예요." : `말하기: ${esc(p.talk)}.`}</li>
</ol>
<p class="small">미리보기는 원본의 og:image 를 그대로 불러오며 저장하지 않습니다. 링크는 등록·갱신할 때 확인하고, 안 열리면 「안 열려요」로 알려 주세요.</p>
${p.url ? `<h2>제작자이신가요?</h2><p class="small">등재 배지를 가져가 스레드·인스타 프로필에 두세요. 링크는 이 페이지로 옵니다.</p><a href="../badges/${p.id}.svg" download><img src="../badges/${p.id}.svg" alt="요즘장소 등재 배지 · ${esc(p.name)}" style="width:100%;max-width:360px;border-radius:12px"></a>` : ""}
<div class="row" style="margin:12px 0 4px"><a class="btn ghost" href="../remove.html?id=${p.id}&kind=broken">안 열려요</a><a class="btn ghost" href="../remove.html?id=${p.id}">내려 주세요</a></div>
</section>
<div class="cta">${p.url ? `<a class="btn primary block" href="${esc(p.url)}" target="_blank" rel="noopener">입장하기 ${icon("arrow-up-right",18)} <span style="font-weight:500;opacity:.8">${esc(new URL(p.url).host)}</span></a>` : `<button class="btn primary block" disabled>준비 중 · 공개되면 1번 자리에</button>`}</div>
${FOOT}
<nav class="tabbar"><a href="../index.html"><i>${icon("house",22)}</i>홈</a><a href="../submit.html"><i>${icon("plus",22)}</i>내 장소 등록</a><a href="../saved.html"><i>${icon("star",22)}</i>저장</a></nav>
</div>
</body></html>`;
  writeFileSync(join(root, "places", p.id + ".html"), html);
}
const pages = ["","lineage","submit","privacy", ...P.map(p=>`places/${p.id}`)];
writeFileSync(join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(u=>`  <url><loc>${C.SITE_URL}${u?"/"+u:"/"}</loc><lastmod>${new Date().toISOString().slice(0,10)}</lastmod></url>`).join("\n")}\n</urlset>\n`);
console.log("pages", P.length, "sitemap", pages.length);

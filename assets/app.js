// 요즘장소 공통 스크립트. 데이터는 data/places.js(globalThis.PLACES) + data/status.js(globalThis.STATUS)
const ICON = {절:"🪷",찜질방:"🧖",사우나:"♨️",성당:"🕯️",교회:"⛪",캠핑장:"🏕️",모닥불:"🔥",산:"⛰️",창문:"🪟",라디오:"📻",드라이브:"🚗",여행:"🌍",카페:"☕",기타:"✨"};
const LABEL = {open:"열림",waiting:"웨이팅",down:"다운",soon:"준비 중"};
const S = globalThis.STATUS || {checkedAt:null,places:{}};
const P = globalThis.PLACES || [];
const st = p => (S.places[p.id] && S.places[p.id].status) || p.status || "unknown";
const og = p => S.places[p.id] && S.places[p.id].og;
const qs = (k) => new URLSearchParams(location.search).get(k);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const saved = () => JSON.parse(localStorage.getItem("yj.saved") || "[]");
const toggleSave = id => { const a = saved(); const i = a.indexOf(id); i < 0 ? a.push(id) : a.splice(i,1); localStorage.setItem("yj.saved", JSON.stringify(a)); };
const clicks = () => JSON.parse(localStorage.getItem("yj.clicks") || "{}");
const countClick = id => { const c = clicks(); c[id] = (c[id]||0)+1; localStorage.setItem("yj.clicks", JSON.stringify(c)); };

function badge(p){ const s = st(p); return `<span class="badge ${s}">${LABEL[s]||s}</span>`; }
function thumb(p){ const u = og(p); return `<div class="thumb">${u ? `<img src="${esc(u)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : (ICON[p.type]||ICON.기타)}</div>`; }
function card(p){
  return `<a class="card" href="places/${encodeURIComponent(p.id)}.html">
    ${thumb(p)}
    <div>
      <div class="name">${esc(p.name)} ${badge(p)}${p.overseas ? ' <span class="badge type">해외</span>' : ''}</div>
      <div class="meta">${esc(p.type)} · 말하기 ${esc(p.talk)} · ${esc(p.hours)}</div>
      <div class="acts">${p.actions.slice(0,4).map(a=>`<span>${esc(a)}</span>`).join("")}</div>
    </div></a>`;
}
function checkedAgo(){ if(!S.checkedAt) return "상태 미확인"; const m = Math.round((Date.now()-new Date(S.checkedAt))/60000); return m < 1 ? "방금 확인" : m < 60 ? `${m}분 전 확인` : `${Math.round(m/60)}시간 전 확인`; }

function renderHome(){
  const el = document.getElementById("home"); if(!el) return;
  const type = qs("type");
  const types = ["전체", ...new Set(P.map(p=>p.type))];
  const list = P.filter(p => !type || type==="전체" || p.type===type);
  const open = list.filter(p => st(p)==="open");
  const fresh = [...list].filter(p=>!p.featured).sort((a,b)=>b.addedAt.localeCompare(a.addedAt)).slice(0,5);
  const feat = P.find(p=>p.featured);
  el.innerHTML = `
  <section>
    <div class="summary">
      <div><b>${P.filter(p=>st(p)==="open").length}</b><span>지금 열려 있어요</span></div>
      <div><b>${P.filter(p=>st(p)==="waiting").length}</b><span>웨이팅</span></div>
      <div><b>${P.filter(p=>p.addedAt>="2026-10-25").length}</b><span>이번 주 새 공간</span></div>
    </div>
    <p class="hint">상태는 10분에 한 번 우리 서버가 확인합니다 · ${checkedAgo()}</p>
  </section>
  ${feat ? `<section><div class="feature"><div class="eyebrow">요즘장소가 만드는 공간</div><div class="title">${esc(feat.name)}</div><p>${esc(feat.intro)}</p><a class="btn" href="places/${feat.id}.html">미리 보기</a><div class="mt">${ICON[feat.type]}</div></div></section>` : ""}
  <section>
    <div class="chips">${types.map(t=>`<a class="chip ${(!type&&t==="전체")||type===t?"on":""}" href="?type=${encodeURIComponent(t)}">${ICON[t]||""} ${t}</a>`).join("")}</div>
  </section>
  <section>
    <h2>🟢 지금 열려 있어요 <span class="count">${open.length}곳</span></h2>
    ${open.map(card).join("") || '<p class="hint">이 종류는 지금 열린 곳이 없어요.</p>'}
  </section>
  <section>
    <h2>✨ 새로 생긴 곳 <span class="count">최근 등록</span></h2>
    ${fresh.map(card).join("")}
  </section>
  <section>
    <h2>🪹 비어 있는 공간 <span class="count">만들어 주세요</span></h2>
    <p class="hint">아직 없는 온라인 장소. 제작자라면 골라 만들고 등록해 주세요.</p>
    <div class="wanted" style="margin-top:8px">${["온라인 등산 (제작 중)","시골 할머니집","심야 편의점","도서관 열람실","한강 돗자리","새벽 버스 맨 뒷자리","목욕탕 평상"].map(w=>`<span>${w}</span>`).join("")}</div>
  </section>`;
}

function renderDetail(){
  const el = document.getElementById("detail"); if(!el) return;
  const p = P.find(x=>x.id===qs("id"));
  if(!p){ el.innerHTML = '<section><h2>없는 장소예요</h2><a class="btn ghost" href="index.html">홈으로</a></section>'; return; }
  const s = st(p); const u = og(p); const isSaved = saved().includes(p.id);
  const info = S.places[p.id] || {};
  document.title = `${p.name} · ${p.type} 바로가기 | 요즘장소`;
  el.innerHTML = `
  <div class="hero">${u ? `<img src="${esc(u)}" alt="${esc(p.name)} 미리보기(원본 og:image)" referrerpolicy="no-referrer">` : (ICON[p.type]||ICON.기타)}<a class="back" href="index.html">‹</a></div>
  <section class="detail">
    <div class="row"><span class="badge type">${esc(p.type)}</span>${badge(p)}${p.overseas?'<span class="badge type">해외</span>':''}</div>
    <h1>${esc(p.name)}</h1>
    <p class="small">만든 사람 ${esc(p.maker)} · ${p.lang==="ko"?"한국어":"영어"} · ${esc(p.addedAt)} 등록</p>
    <p style="font-size:15px;line-height:1.6;margin:10px 0">${esc(p.intro)}</p>
    ${p.verify ? `<div class="notice">확인 중: ${esc(p.verify)}</div>` : ""}
    <h2>할 수 있는 것</h2>
    <div class="acts2">${p.actions.map(a=>`<span>${esc(a)}</span>`).join("")}</div>
    <div class="kv">
      <div><small>말하기</small><b>${esc(p.talk)}</b></div>
      <div><small>개방 시간</small><b>${esc(p.hours)}</b></div>
      <div><small>기기</small><b>${p.devices.join(" · ")}</b></div>
      <div><small>조작</small><b>${esc(p.controls)}</b></div>
      <div><small>상태 확인</small><b>${s==="soon"?"—":`${LABEL[s]} · ${info.code||"-"} · ${info.ms||"-"}ms`}</b></div>
      <div><small>오늘 여기서 나간 사람</small><b>${s==="soon"?"—":(clicks()[p.id]||0)+"명 (이 기기)"}</b></div>
    </div>
    <p class="small">「오늘 여기서 나간 사람」은 요즘장소에서 입장하기를 누른 수이고 원본 접속자 수가 아닙니다. 미리보기는 원본의 og:image 를 그대로 불러오며 저장하지 않습니다.</p>
    <div class="row" style="margin:12px 0 4px">
      <button class="btn ghost" onclick="toggleSave('${p.id}');location.reload()">${isSaved?"★ 저장됨":"☆ 저장"}</button>
      <a class="btn ghost" href="remove.html?id=${p.id}">내려 주세요</a>
    </div>
  </section>
  <div class="cta">${p.url ? `<a class="btn primary block" href="${esc(p.url)}" target="_blank" rel="noopener" onclick="countClick('${p.id}')">입장하기 ↗ <span style="font-weight:500;opacity:.8">${esc(new URL(p.url).host)}</span></a>` : `<button class="btn primary block" disabled>준비 중 · 공개되면 1번 자리에</button>`}</div>`;
}

function renderLineage(){
  const el = document.getElementById("lineage"); if(!el) return;
  const kr = P.filter(p=>p.lineage>0).sort((a,b)=>a.lineage-b.lineage);
  const anc = P.filter(p=>p.overseas).sort((a,b)=>a.addedAt.localeCompare(b.addedAt));
  el.innerHTML = `
  <section><h2>🇰🇷 2026년 10월, 산사가 쏘아 올린 공</h2>
    <p class="hint">절 → 찜질방 → 사우나 → 성당·교회 → 캠핑장. 공통 공식은 three.js 저폴리 + 설치 없음 + 익명 캐릭터 + 의식 동작 3~4개 + 말 없음.</p>
    <div class="timeline">${kr.map(p=>`<div class="tl"><div class="d">${esc(p.addedAt)}</div><a class="n" href="places/${p.id}.html">${ICON[p.type]||""} ${esc(p.name)} ${badge(p)}</a><div class="t">${esc(p.intro)}</div></div>`).join("")}</div>
  </section>
  <section><h2>🌍 조상격 · 해외</h2>
    <p class="hint">2016~2020년에 유행해 지금도 살아 있는 「인터넷 속 장소」들. 3D 는 아니지만 「다른 곳에 가 있는 느낌」을 먼저 팔았다.</p>
    <div class="timeline">${anc.map(p=>`<div class="tl"><div class="d">${esc(p.addedAt.slice(0,7))}</div><a class="n" href="places/${p.id}.html">${ICON[p.type]||""} ${esc(p.name)} ${badge(p)}</a><div class="t">${esc(p.intro)}</div></div>`).join("")}</div>
  </section>`;
}

function renderSaved(){
  const el = document.getElementById("saved"); if(!el) return;
  const list = P.filter(p=>saved().includes(p.id));
  el.innerHTML = `<section><h2>★ 저장한 장소 <span class="count">${list.length}곳</span></h2>${list.map(card).join("") || '<p class="hint">상세 화면에서 ☆ 저장을 누르면 여기에 모여요. 이 기기에만 저장됩니다.</p>'}</section>`;
}

function tabbar(active){
  const el = document.getElementById("tabbar"); if(!el) return;
  const tabs = [["index.html","🏠","홈"],["lineage.html","🧬","계보"],["submit.html","➕","등록"],["saved.html","★","저장"]];
  el.innerHTML = tabs.map(([h,i,t])=>`<a href="${h}" class="${active===h?"on":""}"><i>${i}</i>${t}</a>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  tabbar(location.pathname.split("/").pop() || "index.html");
  renderHome(); renderDetail(); renderLineage(); renderSaved();
});

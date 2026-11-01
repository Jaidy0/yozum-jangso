// 요즘장소 공통 스크립트. 데이터는 data/places.js(globalThis.PLACES) + data/status.js(globalThis.STATUS)
// 아이콘은 assets/icons.js (Lucide) 의 icon()/ticon()
const LABEL = {down:"안 열림",soon:"준비 중"};
const checkedDate = () => S.checkedAt ? new Date(S.checkedAt).toLocaleDateString("ko-KR",{timeZone:"Asia/Seoul",month:"numeric",day:"numeric"}) : null;
const S = globalThis.STATUS || {checkedAt:null,places:{}};
const P = (globalThis.PLACES || []).filter(p => !p.hidden);
const st = p => (S.places[p.id] && S.places[p.id].status) || p.status || "unknown";
const og = p => S.places[p.id] && S.places[p.id].og;
const qs = (k) => new URLSearchParams(location.search).get(k);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const saved = () => JSON.parse(localStorage.getItem("yj.saved") || "[]");
const toggleSave = id => { const a = saved(); const i = a.indexOf(id); i < 0 ? a.push(id) : a.splice(i,1); localStorage.setItem("yj.saved", JSON.stringify(a)); };
const clicks = () => JSON.parse(localStorage.getItem("yj.clicks") || "{}");
const countClick = id => { const c = clicks(); c[id] = (c[id]||0)+1; localStorage.setItem("yj.clicks", JSON.stringify(c)); };

function badge(p){ const s = st(p); return LABEL[s] ? `<span class="badge ${s}">${LABEL[s]}</span>` : ""; }
function thumb(p){ const u = og(p); return `<div class="thumb">${u ? `<img src="${esc(u)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : ticon(p.type,32)}</div>`; }
function card(p){
  return `<a class="card" href="places/${encodeURIComponent(p.id)}.html">
    ${thumb(p)}
    <div>
      <div class="name">${esc(p.name)} ${badge(p)}${p.overseas ? ' <span class="badge type">해외</span>' : ''}</div>
      <div class="meta">${esc(p.type)} · 말하기 ${esc(p.talk)} · ${esc(p.hours)}</div>
      <div class="acts">${p.actions.slice(0,4).map(a=>`<span>${esc(a)}</span>`).join("")}</div>
    </div></a>`;
}
function checkedLine(){ const d = checkedDate(); return d ? `링크는 등록·갱신할 때 확인합니다 · 최근 확인 ${d}` : "링크는 등록·갱신할 때 확인합니다"; }

function renderHome(){
  const el = document.getElementById("home"); if(!el) return;
  const type = qs("type");
  const types = ["전체", ...new Set(P.map(p=>p.type))];
  const list = P.filter(p => !type || type==="전체" || p.type===type);
  const live = list.filter(p => st(p)!=="soon" && st(p)!=="down");
  const fresh = [...list].filter(p=>!p.featured).sort((a,b)=>b.addedAt.localeCompare(a.addedAt)).slice(0,5);
  el.innerHTML = `
  <section>
    <div class="summary">
      <div><b>${P.filter(p=>st(p)!=="soon").length}</b><span>등록된 온라인 장소</span></div>
      <div><b>${P.filter(p=>p.overseas).length}</b><span>해외</span></div>
      <div><b>${P.filter(p=>p.addedAt>="2026-10-25").length}</b><span>이번 주 새 공간</span></div>
    </div>
    <p class="hint">${checkedLine()}</p>
  </section>
  <section>
    <div class="chips">${types.map(t=>`<a class="chip ${(!type&&t==="전체")||type===t?"on":""}" href="?type=${encodeURIComponent(t)}">${t==="전체"?"":ticon(t,14)} ${t}</a>`).join("")}</div>
  </section>
  <section>
    <h2>${icon("map-pin")} 온라인 장소 <span class="count">${live.length}곳</span></h2>
    ${live.map(card).join("") || '<p class="hint">이 종류는 아직 등록된 곳이 없어요.</p>'}
  </section>
  <section>
    <h2>${icon("sparkles")} 새로 생긴 곳 <span class="count">최근 등록</span></h2>
    ${fresh.map(card).join("")}
    <p class="hint" style="text-align:center;margin:16px 0 4px"><a href="wishes.html" style="color:var(--green);font-weight:700">이런 장소 있었으면 → 모두의 의뢰 보기</a></p>
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
  <div class="hero">${u ? `<img src="${esc(u)}" alt="${esc(p.name)} 미리보기(원본 og:image)" referrerpolicy="no-referrer">` : ticon(p.type,72)}<a class="back" href="index.html">${icon("chevron-left",20)}</a></div>
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
      <div><small>링크 확인</small><b>${s==="soon"?"—":(checkedDate()||"—")}</b></div>
      <div><small>오늘 여기서 나간 사람</small><b>${s==="soon"?"—":(clicks()[p.id]||0)+"명 (이 기기)"}</b></div>
    </div>
    <p class="small">「오늘 여기서 나간 사람」은 요즘장소에서 입장하기를 누른 수이고 원본 접속자 수가 아닙니다. 미리보기는 원본의 og:image 를 그대로 불러오며 저장하지 않습니다. 링크는 등록·갱신할 때 확인합니다.</p>
    <div class="row" style="margin:12px 0 4px">
      <button class="btn ghost" onclick="toggleSave('${p.id}');location.reload()">${isSaved?icon("star",16,'fill="currentColor"')+" 저장됨":icon("star",16)+" 저장"}</button>
      <a class="btn ghost" href="remove.html?id=${p.id}&kind=broken">안 열려요</a>
      <a class="btn ghost" href="remove.html?id=${p.id}">내려 주세요</a>
    </div>
  </section>
  <div class="cta">${p.url ? `<a class="btn primary block" href="${esc(p.url)}" target="_blank" rel="noopener" onclick="countClick('${p.id}')">입장하기 ${icon("arrow-up-right",18)} <span style="font-weight:500;opacity:.8">${esc(new URL(p.url).host)}</span></a>` : `<button class="btn primary block" disabled>준비 중 · 공개되면 1번 자리에</button>`}</div>`;
}

function renderLineage(){
  const el = document.getElementById("lineage"); if(!el) return;
  const kr = P.filter(p=>p.lineage>0).sort((a,b)=>a.lineage-b.lineage);
  const anc = P.filter(p=>p.overseas).sort((a,b)=>a.addedAt.localeCompare(b.addedAt));
  el.innerHTML = `
  <section><h2>${icon("flag")} 2026년 10월, 산사가 쏘아 올린 공</h2>
    <p class="hint">절 → 찜질방 → 사우나 → 성당·교회 → 캠핑장. 공통 공식은 three.js 저폴리 + 설치 없음 + 익명 캐릭터 + 의식 동작 3~4개 + 말 없음.</p>
    <div class="timeline">${kr.map(p=>`<div class="tl"><div class="d">${esc(p.addedAt)}</div><a class="n" href="places/${p.id}.html">${ticon(p.type,14)} ${esc(p.name)} ${badge(p)}</a><div class="t">${esc(p.intro)}</div></div>`).join("")}</div>
  </section>
  <section><h2>${icon("globe")} 조상격 · 해외</h2>
    <p class="hint">2016~2020년에 유행해 지금도 살아 있는 「인터넷 속 장소」들. 3D 는 아니지만 「다른 곳에 가 있는 느낌」을 먼저 팔았다.</p>
    <div class="timeline">${anc.map(p=>`<div class="tl"><div class="d">${esc(p.addedAt.slice(0,7))}</div><a class="n" href="places/${p.id}.html">${ticon(p.type,14)} ${esc(p.name)} ${badge(p)}</a><div class="t">${esc(p.intro)}</div></div>`).join("")}</div>
  </section>`;
}

function renderSaved(){
  const el = document.getElementById("saved"); if(!el) return;
  const list = P.filter(p=>saved().includes(p.id));
  el.innerHTML = `<section><h2>${icon("star")} 저장한 장소 <span class="count">${list.length}곳</span></h2>${list.map(card).join("") || '<p class="hint">상세 화면에서 저장을 누르면 여기에 모여요. 이 기기에만 저장됩니다.</p>'}</section>`;
}

function tabbar(active){
  const el = document.getElementById("tabbar"); if(!el) return;
  const tabs = [["index.html","house","홈"],["submit.html","plus","내 장소 등록"],["saved.html","star","저장"]];
  el.innerHTML = tabs.map(([h,i,t])=>`<a href="${h}" class="${active===h?"on":""}"><i>${icon(i,22)}</i>${t}</a>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  tabbar(location.pathname.split("/").pop() || "index.html");
  renderHome(); renderDetail(); renderLineage(); renderSaved();
});

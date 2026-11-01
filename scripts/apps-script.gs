// 요즘장소 시트 백엔드 — Google Apps Script (웹앱으로 배포). docs/sheet-setup.md 참고.
// POST JSON { kind, ...필드 }
//   submit → 「접수」 · remove → 「삭제요청」 · broken → 「신고」 · inquiry → 「문의」 : 한 줄 추가 + 운영자 메일
//   wish   → 「의뢰」 한 줄 추가(게시판 글) · vote { id } → 「의뢰」 투표 +1
// GET ?list=wishes → 「의뢰」 탭에서 숨김 아닌 글을 JSON 배열로 (게시판 읽기)
const SHEET_ID = "여기에_스프레드시트_ID";
const NOTIFY_TO = "여기에_운영자_이메일";
const WISH_HEAD = ["id", "접수시각", "종류", "내용", "닉네임", "투표", "숨김", "비고"];

function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  const ss = SpreadsheetApp.openById(SHEET_ID);
  if (body.kind === "wish") return json(addWish(ss, body));
  if (body.kind === "vote") return json(vote(ss, body));
  const kind = body.kind === "remove" ? "삭제요청" : body.kind === "broken" ? "신고" : body.kind === "inquiry" ? "문의" : "접수";
  const sh = ss.getSheetByName(kind) || ss.insertSheet(kind);
  if (kind === "문의") {
    if (sh.getLastRow() === 0) sh.appendRow(["접수시각", "기관·브랜드", "담당자", "이메일", "공간", "일정·예산", "메모", "상태"]);
    sh.appendRow([new Date(), body.org || "", body.person || "", body.email || "", body.what || "", body.budget || "", body.memo || "", "회신 대기"]);
  } else {
    if (sh.getLastRow() === 0) sh.appendRow(["접수시각", "URL", "이름", "종류", "할 수 있는 것", "말하기", "개방 시간", "기기", "만든 사람", "소개", "이메일", "상태", "메모"]);
    sh.appendRow([
      new Date(), body.url || body.target || "", body.name || "", body.type || "",
      (body.act || []).join("·"), body.talk || "", body.hours || "", (body.dev || []).join("·"),
      body.maker || "", body.intro || body.memo || "", body.email || "", kind === "삭제요청" ? "즉시 비공개" : kind === "신고" ? "확인 필요" : "검수 대기", ""
    ]);
  }
  if (NOTIFY_TO.indexOf("@") > 0) MailApp.sendEmail(NOTIFY_TO, `[요즘장소] ${kind}: ${body.name || body.target || body.org || body.url || ""}`, JSON.stringify(body, null, 1));
  return json({ ok: true });
}

function doGet(e) {
  if (e && e.parameter && e.parameter.list === "wishes") return json(listWishes(SpreadsheetApp.openById(SHEET_ID)));
  return ContentService.createTextOutput("yozum-jangso intake ok");
}

function wishSheet(ss) {
  const sh = ss.getSheetByName("의뢰") || ss.insertSheet("의뢰");
  if (sh.getLastRow() === 0) sh.appendRow(WISH_HEAD);
  return sh;
}
function addWish(ss, b) {
  const text = String(b.text || "").replace(/\s+/g, " ").trim().slice(0, 80);
  if (text.length < 4 || /https?:\/\/|www\./i.test(text)) return { ok: false, reason: "text" };
  const type = String(b.type || "기타").slice(0, 10), nick = String(b.nick || "").trim().slice(0, 12);
  const id = Utilities.getUuid().slice(0, 8);
  wishSheet(ss).appendRow([id, new Date(), type, text, nick, 0, "", ""]);
  return { ok: true, id: id };
}
function vote(ss, b) {
  const lock = LockService.getScriptLock(); lock.waitLock(5000);
  try {
    const sh = wishSheet(ss), rows = sh.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) if (rows[i][0] === b.id) { sh.getRange(i + 1, 6).setValue((Number(rows[i][5]) || 0) + 1); return { ok: true }; }
    return { ok: false };
  } finally { lock.releaseLock(); }
}
function listWishes(ss) {
  const rows = wishSheet(ss).getDataRange().getValues().slice(1);
  return rows.filter(r => r[0] && String(r[6]).toUpperCase() !== "Y")
    .map(r => ({ id: r[0], at: new Date(r[1]).getTime(), type: r[2], text: r[3], nick: r[4], votes: Number(r[5]) || 0 }))
    .sort((a, b) => (b.votes - a.votes) || (b.at - a.at)).slice(0, 200);
}
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
// 운영: 「의뢰」 탭 「숨김」 열에 Y 를 적으면 게시판에서 사라진다. 「문의」는 회신 뒤 「상태」를 바꾼다.

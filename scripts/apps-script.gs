// 요즘장소 접수 시트 — Google Apps Script (웹앱으로 배포). docs/sheet-setup.md 참고.
// POST JSON { kind: "submit" | "remove" | "broken", ...필드 } → 시트 「접수」「삭제요청」「신고」 탭에 한 줄 추가, 운영자 메일 알림.
const SHEET_ID = "여기에_스프레드시트_ID";
const NOTIFY_TO = "여기에_운영자_이메일";

function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const kind = body.kind === "remove" ? "삭제요청" : body.kind === "broken" ? "신고" : "접수";
  const sh = ss.getSheetByName(kind) || ss.insertSheet(kind);
  if (sh.getLastRow() === 0) sh.appendRow(["접수시각", "URL", "이름", "종류", "할 수 있는 것", "말하기", "개방 시간", "기기", "만든 사람", "소개", "이메일", "상태", "메모"]);
  sh.appendRow([
    new Date(), body.url || body.target || "", body.name || "", body.type || "",
    (body.act || []).join("·"), body.talk || "", body.hours || "", (body.dev || []).join("·"),
    body.maker || "", body.intro || body.memo || "", body.email || "", kind === "삭제요청" ? "즉시 비공개" : kind === "신고" ? "확인 필요" : "검수 대기", ""
  ]);
  if (NOTIFY_TO.indexOf("@") > 0) MailApp.sendEmail(NOTIFY_TO, `[요즘장소] ${kind}: ${body.name || body.target || body.url}`, JSON.stringify(body, null, 1));
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}

// 검수 뒤 「상태」를 「게시」로 바꾸면 운영자가 data/places.js 에 옮겨 적는다(1차는 수동). 
function doGet() { return ContentService.createTextOutput("yozum-jangso intake ok"); }

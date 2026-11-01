// 배포 설정. 시트 연결: docs/sheet-setup.md 대로 Apps Script 웹앱을 배포하고 그 URL 을 아래에 넣는다.
globalThis.CONFIG = {
  SITE_URL: "https://yozum-jangso.pages.dev",   // 배포 뒤 실제 주소로 바꾼다 (sitemap·배지 링크에 쓰임)
  SUBMIT_ENDPOINT: "",                           // Apps Script 웹앱 URL (등록·내려주세요 둘 다 같은 URL, kind 로 구분)
  STATUS_UA: "yozum-jangso-status/0.1"
};

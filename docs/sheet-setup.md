# 시트 연결 (10분)

1. Google 스프레드시트 새로 만들기 → 주소의 `/d/<ID>/` 복사
2. 확장 프로그램 → Apps Script → `scripts/apps-script.gs` 내용 붙여넣기, `SHEET_ID`·`NOTIFY_TO` 채우기
3. 배포 → 새 배포 → 유형 「웹 앱」 · 실행: 나 · 액세스: 모든 사용자 → 웹앱 URL 복사
4. `data/config.js` 의 `SUBMIT_ENDPOINT` 에 붙여넣기
5. `submit.html` 에서 테스트 등록 → 시트 「접수」 탭에 한 줄 생기면 끝

- 등록·「내려 주세요」 둘 다 같은 URL 로 가고 `kind` 로 탭이 갈린다
- 브라우저는 `mode:"no-cors"` 로 보내므로 응답은 못 읽지만 행은 들어간다
- 삭제 요청 행이 생기면 **먼저 내리고(places.js 에서 제거) 나중에 확인**한다

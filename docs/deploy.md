# 배포

정적 파일뿐이라 빌드 없이 그대로 올린다. 크론·서버 없음. 재배포는 장소를 추가·수정할 때만.

## 1. GitHub (공개 저장소)
- 저장소: https://github.com/Jaidy0/yozum-jangso (main)
- 장소 추가: `data/places.js` 편집 → `npm run check`(og:image·접속 확인, 선택) → `npm run build`(상세·sitemap) → `npm run badges`(새 장소 배지) → 커밋·푸시

## 2. Cloudflare Pages (Git 연동 · 무료 · 요청·대역폭 무제한)
1. https://dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git → `Jaidy0/yozum-jangso`
2. Project name `yozum-jangso` · Production branch `main` · Framework preset **None** · Build command 비움 · Build output directory `/`
3. Save and Deploy → 1분 뒤 https://yozum-jangso.pages.dev
4. 이후 push 하면 자동 재배포(장소 추가 때만 push 하므로 월 500회 한도와 무관)

## 3. 배포 뒤 할 일
- [ ] 주소가 다르면 `data/config.js` SITE_URL 바꾸고 `npm run build` → 커밋 (canonical·sitemap·배지 링크)
- [ ] 시트 연결: docs/sheet-setup.md → `SUBMIT_ENDPOINT`
- [ ] privacy.html 의 이메일(준비 중) 채우기
- [ ] Google Search Console 에 sitemap.xml 등록
- [ ] 도메인(이름 확정 뒤) → Pages → Custom domains

## 트래픽 참고
- 우리 쪽 한도 없음(정적·엣지). 비용 0
- 썸네일은 원본 og:image 를 방문자가 직접 받음 → 바이럴 시 원본 부담. 캐시 전환은 별도 결정
- 등록·내려주세요·안 열려요 폼 → Apps Script(동시 30·메일 100/일)

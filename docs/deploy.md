# 배포 준비 (배포 자체는 사용자가 요청할 때)

정적 파일뿐이라 어디든 된다. 추천 순서:

## A. Cloudflare Pages (추천 · 무료 · 상태 체크 크론은 GitHub Actions)
1. `git init && git add -A && git commit -m init` → GitHub 새 저장소에 push
2. Cloudflare Pages → Connect to Git → 빌드 명령 없음, 출력 디렉토리 `/`
3. `data/config.js` 의 `SITE_URL` 을 받은 주소로 바꾸고 `npm run build` 뒤 커밋
4. GitHub → Settings → Actions → Workflow permissions: Read and write (크론이 status 커밋하도록)

## B. GitHub Pages
Settings → Pages → Branch main, root. 나머지는 같음.

## 돌아가는 것
- `.github/workflows/status.yml`: 10분마다 `npm run check && npm run build` → `data/status.*`·`places/*.html`·`sitemap.xml` 커밋 → Pages 자동 재배포
- 등록·삭제 폼 → Apps Script → 시트 (docs/sheet-setup.md)
- 배지: `badges/<id>.svg|png` — 제작자가 상세 화면에서 받아 간다

## 배포 전 체크
- [ ] config.js SITE_URL
- [ ] SUBMIT_ENDPOINT
- [ ] privacy.html 의 이메일(준비 중) 채우기
- [ ] 도메인(요즘장소 이름 확정 뒤)

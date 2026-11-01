# 요즘장소 · 온라인 장소 디렉토리

AI·바이브코딩으로 만든 3D 온라인 장소(산사·온라인 찜질방·사우나·성당·캠핑장…)를 한곳에 모은 링크 디렉토리. 링크와 우리가 쓴 소개만 싣는다.

기획: `~/Documents/신규기획/요즘장소-온라인장소-디렉토리-기획서-v2.md` · 피그마 v2: Agents냥 85:94 · 카드 Q-0896

## 구조
- `index.html` 홈 · `places/<id>.html` SEO 정적 상세(생성) · `place.html?id=` 동적 상세(예비) · `lineage.html` 유행의 흐름(탭 없음, 푸터 링크) · `saved.html` 저장 · `wishes.html` 이런 장소 있었으면(게시판, 시트 읽기) · `inquire.html` 공간 제작 문의 · `submit.html` 등록 · `remove.html` 내려 주세요(`?kind=broken` 안 열려요 신고) · `privacy.html`
- `data/places.js` 장소 목록(단일 소스, 손으로 편집) · `data/config.js` 배포 설정 · `data/status.js|json` 마지막 확인 결과(생성, og:image 주소 포함)
- `scripts/` check-status(접속·og 확인) · build-pages(상세·sitemap) · make-badges(등재 배지) · apps-script.gs(시트 접수)
- `badges/` 등재 배지 SVG · `assets/` 스타일·스크립트

## 돌리기
```sh
npm run check    # 접속·og:image 확인 → data/status.*  (장소 추가·갱신 때만, 크론 없음)
npm run build    # places/*.html + sitemap.xml
npm run badges   # badges/*.svg
npm run serve    # http://localhost:8765
```

## 배포
GitHub `Jaidy0/yozum-jangso` → Cloudflare Pages Git 연동, 빌드 없음. 자세한 건 `docs/deploy.md`.

## 원칙(법적 검토 메모)
링크 + 자작 소개만 · 원본 복사·iframe 없음 · og:image 는 저장 없이 불러오기 · 접속 확인은 등록·갱신 때 HEAD 1회 · 「내려 주세요」 즉시 비공개 · 「안 열려요」 신고로 죽은 링크 정리

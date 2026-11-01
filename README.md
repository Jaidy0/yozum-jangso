# 요즘장소 · 온라인 장소 디렉토리 (MVP 뼈대)

기획: `~/Documents/신규기획/요즘장소-온라인장소-디렉토리-기획서-v2.md` · 피그마 v2: Agents냥 85:94 · 카드 Q-0896

## 구조
- `index.html` 홈(지금 열려 있어요 · 새로 생긴 곳 · 종류 칩 · 비어 있는 공간) · `place.html?id=` 상세 · `lineage.html` 계보 · `saved.html` 저장 · `submit.html` 등록 · `remove.html` 내려 주세요 · `privacy.html`
- `data/places.js` 장소 목록(단일 소스, 손으로 편집) · `data/status.js|json` 상태 체크 결과(생성됨)
- `scripts/check-status.mjs` 상태 체크 → 10분 1회 크론 · `assets/` 스타일·스크립트

## 돌리기
```sh
node scripts/check-status.mjs          # 상태·og:image 갱신 (Node 18+)
python3 -m http.server 8765            # http://localhost:8765  (file:// 로 열어도 됨)
```
크론 예: `*/10 * * * * cd ~/Documents/yozum-jangso && node scripts/check-status.mjs && git commit -qam status && git push -q` (배포는 정적 호스팅 어디든)

## 원칙(법적 검토 메모)
링크 + 자작 소개만 · 원본 복사·iframe 없음 · og:image 는 저장 없이 불러오기 · HEAD 10분 1회 · 「내려 주세요」 즉시 비공개

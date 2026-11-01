// 요즘장소 시작 목록 (2026-11-01 조사). 단일 소스: 브라우저(globalThis.PLACES)와 scripts/check-status.mjs 가 함께 읽는다.
// 원칙: 링크 + 우리가 쓴 소개만. 원본 이미지·텍스트 복사 없음. 썸네일은 상태 체크 때 읽은 og:image URL 을 원본에서 바로 불러온다.
globalThis.PLACES = [
  {
    id: "sansa", name: "산사", type: "절", url: "https://sansatemple.com/",
    maker: "@metamong.dev (박진원)", lang: "ko", addedAt: "2026-10-28", lineage: 1,
    actions: ["절하기", "염주 굴리기", "반야심경 듣기", "앉아 있기"], talk: "없음",
    hours: "24시간", devices: ["PC", "모바일"], controls: "WASD·클릭 / 탭",
    intro: "말없이 같이 앉아 있는 온라인 절. 유행의 출발점. 사흘 60만 명이 다녀가 「법당 웨이팅」이 생겼다.",
    featured: false
  },
  {
    id: "koreabath", name: "목욕합니다", type: "찜질방", url: "https://koreabath.jjimjil-online.workers.dev/",
    maker: "@newmoon.md", lang: "ko", addedAt: "2026-10-29", lineage: 2,
    actions: ["앉기", "눕기", "인사하기", "모래시계", "식혜·계란 받기"], talk: "확인 중",
    hours: "한증막은 22시 개방(제작자 안내 기준)", devices: ["PC", "모바일"], controls: "WASD·클릭 / 탭",
    intro: "양머리 캐릭터로 소금방·황토방·노천탕을 오가는 온라인 찜질방. 모래시계를 다 채우면 식혜가 나온다.",
    featured: false
  },
  {
    id: "saunagoyo", name: "사우나 고요", type: "사우나", url: "https://saunagoyo.com/",
    maker: "미상", lang: "ko", addedAt: "2026-10-30", lineage: 3,
    actions: ["물 붓기", "앉기", "인사", "외기욕"], talk: "없음",
    hours: "24시간", devices: ["PC", "모바일"], controls: "클릭 / 탭",
    intro: "사우나 → 냉탕 → 외기욕 순서로 「토토노우」. 물소리·새소리를 틀어 두고 숲속·노천탕·카페에서 쉬어 가는 3D 사우나.",
    featured: false
  },
  {
    id: "inpeace", name: "인피스 InPeace", type: "성당", url: "https://inpeace.online/",
    maker: "미상 (1인 제작)", lang: "en", addedAt: "2026-10-29", lineage: 4,
    actions: ["촛불 켜기", "고해실에 쓰기", "회랑 걷기", "성호·미사포"], talk: "없음",
    hours: "24시간", devices: ["PC", "모바일"], controls: "탭·클릭",
    intro: "조용한 온라인 성당. 낯선 사람의 촛불에서 내 촛불을 켠다. 고해실 글은 내 기기에만 남고 전송되지 않는다고 안내한다.",
    featured: false
  },
  {
    id: "saebyeok", name: "새벽 예배당", type: "교회", url: "https://saebyeok-church.pages.dev/",
    maker: "미상", lang: "ko", addedAt: "2026-10-30", lineage: 5,
    actions: ["기도 타이머", "찬양 켜기", "촛불", "말씀 뽑기", "감사 기록"], talk: "한마디·박수",
    hours: "24시간", devices: ["PC", "모바일"], controls: "탭·클릭",
    intro: "기도·찬양·말씀 나눔 층이 나뉜 온라인 예배당. 오늘의 말씀 뽑기와 매일 감사 기록이 재방문 장치.",
    featured: false
  },
  {
    id: "bangguseok-camp", name: "방구석 캠핑장", type: "캠핑장", url: "https://bangguseok-camp.bangguseok-camp.workers.dev/",
    maker: "Song-Chan-Young", lang: "ko", addedAt: "2026-10-30", lineage: 6,
    actions: ["불멍", "장작 넣기", "해먹·의자", "별 보기", "캠핑 엽서"], talk: "선택(조용히/자유롭게)",
    hours: "24시간", devices: ["PC", "모바일"], controls: "탭 이동·스와이프",
    intro: "혼자여도 좋고 같이여도 좋은 밤. 기본은 「조용히 쉬기」 모드, 친구는 초대 링크로 옆자리에 앉힌다. 방 3개.",
    featured: false
  },
  {
    id: "boolmung", name: "Boolmung 불멍", type: "모닥불", url: "https://eggjini.github.io/boolmung/",
    maker: "Eggjini", lang: "ko", addedAt: "2026-10-31", lineage: 7,
    actions: ["불 고르기", "소리 켜기"], talk: "없음",
    hours: "24시간", devices: ["PC", "모바일"], controls: "클릭",
    intro: "불만 바라보는 한 페이지 불멍 사이트. 3D 여부는 확인 중.",
    featured: false, verify: "3D·동작 확인 필요"
  },
  {
    id: "today-mountain", name: "오늘의 산 (준비 중)", type: "산", url: "",
    maker: "요즘장소 × 노티엄", lang: "ko", addedAt: "2026-11-01", lineage: 8,
    actions: ["오르기", "야호", "정상석 인증샷", "막걸리"], talk: "없음",
    hours: "매일 다른 산", devices: ["모바일"], controls: "버튼 한 번",
    intro: "우리가 만드는 간판 공간. 버튼 한 번으로 오늘의 산을 오르고 정상석 인증샷을 받아 가족 카톡방에 올린다. 5060도 쓸 수 있게 조작을 없앴다.",
    featured: true, status: "soon"
  },
  {
    id: "windowswap", name: "WindowSwap", type: "창문", url: "https://window-swap.com/",
    maker: "Sonali Ranjit·Vaishnav Balasubramaniam", lang: "en", addedAt: "2020-06-01", lineage: 0,
    actions: ["남의 창문 열기", "내 창문 올리기"], talk: "없음",
    hours: "24시간", devices: ["PC", "모바일"], controls: "클릭",
    intro: "세계 어딘가의 창문을 10분씩 바라본다. 「인터넷에서 가장 조용한 곳」. 2020년 유행이 지금도 살아 있는 조상격 온라인 장소.",
    featured: false, overseas: true
  },
  {
    id: "radiogarden", name: "Radio Garden", type: "라디오", url: "https://radio.garden/",
    maker: "Studio Puckey·Moniker", lang: "en", addedAt: "2016-12-01", lineage: 0,
    actions: ["지구 돌리기", "현지 라디오 듣기"], talk: "없음",
    hours: "24시간", devices: ["PC", "모바일"], controls: "드래그",
    intro: "지구를 돌려 그 도시의 라이브 라디오를 듣는다. 장소 자체를 이동하는 가장 단순한 형태.",
    featured: false, overseas: true
  },
  {
    id: "driveandlisten", name: "Drive & Listen", type: "드라이브", url: "https://driveandlisten.com/",
    maker: "Erkam Şeker", lang: "en", addedAt: "2020-05-01", lineage: 0,
    actions: ["도시 고르기", "창밖 보며 라디오"], talk: "없음",
    hours: "24시간", devices: ["PC", "모바일"], controls: "클릭",
    intro: "세계 도시의 차창 영상과 현지 라디오를 함께 틀어 준다. 원래 herokuapp 주소는 닫혔고 .com 으로 옮겨 감.",
    featured: false, overseas: true, verify: "새 주소 동작 확인"
  },
  {
    id: "virtualvacation", name: "Virtual Vacation", type: "여행", url: "https://virtualvacation.us/",
    maker: "미상", lang: "en", addedAt: "2020-04-01", lineage: 0,
    actions: ["도시 산책 영상", "어디인지 맞히기"], talk: "없음",
    hours: "24시간", devices: ["PC", "모바일"], controls: "클릭",
    intro: "도시 라이브 캠과 산책 영상으로 집에서 여행. 「어디인지 맞히기」 게임이 붙어 있다.",
    featured: false, overseas: true
  },
  {
    id: "imissmycafe", name: "I Miss My Cafe", type: "카페", url: "https://imissmycafe.com/",
    maker: "미상", lang: "en", addedAt: "2020-04-01", lineage: 0,
    actions: ["카페 소음 섞기", "주문 소리"], talk: "없음",
    hours: "24시간", devices: ["PC", "모바일"], controls: "슬라이더",
    intro: "팬데믹 때 생긴 「나만의 카페」. 소리로만 만든 장소라 3D 공간과 비교하기 좋은 참고.",
    featured: false, overseas: true
  },
  {
    id: "chapeloflight", name: "Chapel of Light", type: "성당", url: "https://chapeloflight.online/chapel",
    maker: "미상", lang: "en", addedAt: "2025-01-01", lineage: 0,
    actions: ["촛불 켜기(유료)", "기도문 남기기"], talk: "없음",
    hours: "24시간", devices: ["PC", "모바일"], controls: "클릭",
    intro: "촛불 78자리의 3D 성당. 12·24·48시간 촛불을 3~7달러에 판다. 온라인 장소에 돈을 받는 해외 사례라 BM 참고용.",
    featured: false, overseas: true
  }
];

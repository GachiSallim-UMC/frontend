# 같이살림 (Gachi-Salim)

> 같이 사는 사람들을 위한 생활 운영 서비스 — UMC 10기 프론트엔드

집안일·생활비·공용 물품·생활 규칙을 함께 관리하고, 실시간 메신저로 소통하는 룸메이트 협업 서비스입니다.

<br />

## 기술 스택

| 구분 | 스택 |
|------|------|
| Core | React 18, TypeScript 5.6 |
| Build | Vite 6 |
| Routing | React Router 6 |
| Server State | TanStack Query 5 |
| HTTP | Axios |
| Styling | Tailwind CSS 3 (Figma 디자인 토큰 연동) |
| Quality | ESLint 9, Prettier 3 |

<br />

## 폴더 구조 (Feature-Sliced Design)

레이어 간 의존성은 **단방향**입니다: `app → pages → features → shared`

```
src/
├── app/                 # 앱 진입 — Provider, Router 설정
│   ├── App.tsx
│   └── router/
├── pages/               # 라우트 단위 화면 (도메인 조합만, 얇게 유지)
│   ├── chore/           # 예: ChoreListPage
│   └── _shared/
├── features/            # 도메인 레이어 (비즈니스 로직)
│   ├── chore/           # ✅ 표준 템플릿 (api·components·hooks·types)
│   ├── expense/
│   ├── item/
│   ├── rule/
│   └── ...              # auth, dashboard, messenger, notification, activity, member
└── shared/              # 도메인 무관 공통 자원
    ├── components/      # ui · form · layout · messenger (공통 컴포넌트)
    ├── api/             # axios 인스턴스
    ├── lib/             # cn 등 유틸
    └── types/           # 공통 타입
```

각 도메인(`features/*`)은 `index.ts`(public API)로만 외부에 노출합니다. 자세한 규칙은 [src/features/README.md](src/features/README.md) 참고.

<br />

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 (http://localhost:5173)
npm run dev

# 타입 체크
npm run type-check

# 린트 / 포맷
npm run lint
npm run format

# 프로덕션 빌드
npm run build
```

환경 변수는 `.env`에 설정합니다.

```
VITE_API_BASE_URL=http://localhost:8080/api
```

<br />

## 화면 목록 및 플로우

| # | 화면 | 경로 | 도메인 |
|---|------|------|--------|
| 01 | 로그인 | `/login` | auth |
| 06 | 메인 대시보드 | `/dashboard` | dashboard |
| 07 | 집안일 목록 | `/chores` | chore |
| 08 | 집안일 등록·수정 | `/chores/new`, `/chores/:id/edit` | chore |
| 09 | 생활비 정산 목록 | `/expenses` | expense |
| 10 | 생활비 등록·정산 상세 | `/expenses/new`, `/expenses/:id` | expense |
| 11 | 공용 물품 목록 | `/items` | item |
| 12 | 공용 물품 등록·상태 변경 | `/items/new`, `/items/:id/edit` | item |
| 13 | 생활 규칙 목록 | `/rules` | rule |
| 14 | 생활 규칙 등록·상세 | `/rules/new`, `/rules/:id` | rule |
| 15 | 그룹 실시간 메신저 | `/messenger` | messenger |
| 16 | 알림 목록 | `/notifications` | notification |
| 17 | 최근 활동 내역 | `/activity` | activity |
| 18 | 마이페이지·프로필 설정 | `/mypage` | member |

**메인 플로우:** 로그인 → 대시보드(요약) → 각 관리 화면(집안일/생활비/물품/규칙) → 메신저로 공유·소통

<br />

## 팀원 및 역할 분담

| 이름 | 역할 | 담당 도메인 |
|------|------|------------|
| _작성_ | _작성_ | _작성_ |

<br />

## 컨벤션

코드·커밋·브랜치·PR 컨벤션은 [docs/CONVENTIONS.md](docs/CONVENTIONS.md)를 따릅니다.

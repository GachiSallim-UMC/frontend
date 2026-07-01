# 같이살림 (Gachi-Salim)

> 같이 사는 사람들을 위한 생활 운영 서비스 — UMC 10기 프론트엔드

집안일·생활비·공용 물품·생활 규칙을 함께 관리하고, 실시간 메신저로 소통하는 룸메이트 협업 서비스입니다.

<br />

## 프로젝트 소개

**같이살림**은 룸메이트 사이의 생활 협업을 돕는 서비스입니다.

- 집안일 일정을 구성원에게 배분하고 완료 여부를 추적합니다.
- 생활비를 입력하고 균등 또는 비율로 정산합니다.
- 공용 물품 재고를 공유하고 부족 시 구매 담당자를 지정합니다.
- 생활 규칙을 등록하고 동의를 받아 함께 지킵니다.
- 실시간 메신저로 정산·집안일·물품을 대화 흐름 안에서 공유합니다.

<br />

## 팀원 및 역할 분담

| 파트 | 닉네임 / 이름 | 역할 | 담당 화면 |
|------|--------------|------|----------|
| A | 소리 / 오소윤 | 팀원 | 01 로그인 · 06 대시보드 · 18 마이페이지 |
| B | 루피 / 오성이 | 팀원 | 07 집안일 목록 · 08 집안일 등록/수정 |
| C | 하루 / 박금별 | 팀원 | 09 생활비 목록 · 10 생활비 등록/상세 |
| D | 천월 / 임석현 | 소통팀장 | 11 공용물품 목록 · 12 물품 등록 · 13 생활규칙 목록 · 14 규칙 상세 |
| E | 주노 / 조혜인 | 기술팀장 | 15 메신저 · 16 알림 · 17 활동내역 |

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
├── assets/              # SVG 아이콘, 아바타 이미지
├── pages/               # 라우트 단위 화면 (도메인 조합만, 얇게 유지)
│   ├── dashboard/
│   ├── chore/
│   ├── expense/
│   ├── item/
│   ├── rule/
│   ├── messenger/
│   ├── notification/
│   ├── activity/
│   ├── auth/
│   ├── member/
│   └── _shared/         # mockData 등 페이지 공통 자원
├── features/            # 도메인 레이어 (비즈니스 로직)
│   ├── chore/           # api·components·hooks·types·index 구조
│   ├── expense/
│   ├── item/
│   ├── rule/
│   ├── auth/
│   ├── dashboard/
│   ├── messenger/
│   ├── notification/
│   ├── activity/
│   └── member/
├── shared/              # 도메인 무관 공통 자원
│   ├── components/      # ui · form · layout (공통 컴포넌트)
│   ├── api/             # axios 인스턴스
│   ├── lib/             # cn 등 유틸
│   └── types/           # 공통 타입
└── styles/              # 전역 CSS
```

각 도메인(`features/*`)은 `index.ts`(public API)로만 외부에 노출합니다. 자세한 규칙은 [src/features/README.md](src/features/README.md) 참고.

<br />

## 컨벤션

브랜치는 항상 `develop`에서 따고, 작업이 끝나면 `develop`으로 PR을 올립니다. `main`은 배포할 때만 머지합니다.

```
main
 └─ develop
     └─ feature/<도메인>-<기능>   예) feature/chore-list
```

커밋 메시지는 `feat: 집안일 목록 구현` 처럼 **타입: 한글 설명** 형식으로 씁니다. PR 제목도 같은 형식이고, Squash merge를 권장합니다.

- 코드·커밋·PR 규칙 전체 → [docs/CONVENTIONS.md](docs/CONVENTIONS.md)
- Copilot PR 리뷰 프롬프트 설정 → [.github/copilot-instructions.md](.github/copilot-instructions.md)

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

환경 변수는 [.env.example](.env.example)을 복사해서 `.env`로 만들고 값을 채워주세요.

```bash
cp .env.example .env
```

<br />

## 화면 목록 및 플로우

| # | 화면 | 경로 | 파트 |
|---|------|------|------|
| 01 | 로그인 | `/login` | A (소리) |
| 06 | 메인 대시보드 | `/dashboard` | A (소리) |
| 07 | 집안일 목록 | `/chores` | B (루피) |
| 08 | 집안일 등록·수정 | `/chores/new`, `/chores/:id/edit` | B (루피) |
| 09 | 생활비 정산 목록 | `/expenses` | C (하루) |
| 10 | 생활비 등록·정산 상세 | `/expenses/new`, `/expenses/:id` | C (하루) |
| 11 | 공용 물품 목록 | `/items` | D (천월) |
| 12 | 공용 물품 등록·상태 변경 | `/items/new`, `/items/:id/edit` | D (천월) |
| 13 | 생활 규칙 목록 | `/rules` | D (천월) |
| 14 | 생활 규칙 등록·상세 | `/rules/new`, `/rules/:id` | D (천월) |
| 15 | 그룹 실시간 메신저 | `/messenger` | E (주노) |
| 16 | 알림 목록 | `/notifications` | E (주노) |
| 17 | 최근 활동 내역 | `/activity` | E (주노) |
| 18 | 마이페이지·프로필 설정 | `/mypage` | A (소리) |

**메인 플로우:** 로그인 → 대시보드(요약) → 각 관리 화면(집안일/생활비/물품/규칙) → 메신저로 공유·소통

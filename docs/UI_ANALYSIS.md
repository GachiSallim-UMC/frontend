# UI 분석 기반 개발 정리

## 전체 화면 목록 및 담당자

| 화면 | 경로 | 도메인 | 담당자 |
|------|------|--------|--------|
| 로그인 | `/login` | auth | FE-A |
| 대시보드 | `/dashboard` | dashboard | FE-A |
| 집안일 목록 | `/chores` | chore | FE-B |
| 집안일 등록/수정 | `/chores/new`, `/chores/:id/edit` | chore | FE-B |
| 생활비 정산 목록 | `/expenses` | expense | FE-C |
| 생활비 등록 | `/expenses/new` | expense | FE-C |
| 정산 상세 | `/expenses/:id` | expense | FE-C |
| 공용 물품 목록 | `/items` | item | FE-D |
| 공용 물품 등록/수정 | `/items/new`, `/items/:id/edit` | item | FE-D |
| 생활 규칙 목록 | `/rules` | rule | FE-D |
| 생활 규칙 등록/상세 | `/rules/new`, `/rules/:id` | rule | FE-D |
| 메신저 | `/messenger` | messenger | FE-A |
| 알림 목록 | `/notifications` | notification | FE-B |
| 활동 내역 | `/activity` | activity | FE-B |
| 마이페이지 | `/mypage` | member | FE-A |
| 그룹 설정/변경 | `/group/settings`, `/group/change` | member | FE-A |

담당자는 실명 확정 전 협업 분배용 역할명입니다. 팀원 실명 확정 시 이 표만 교체하면 됩니다.

## 화면별 UI 구성 요소

| 화면군 | 주요 UI 구성 |
|--------|--------------|
| 로그인 | 로고, 이메일 입력, 비밀번호 입력, 로그인 버튼, 그룹 초대 안내 |
| 대시보드 | 요약 카드, 오늘 할 일, 생활비 현황, 공용 물품 상태, 최근 활동 |
| 집안일 | 필터 탭, 검색, 집안일 테이블, 담당자 아바타, 상태 배지, 등록 폼 |
| 생활비 | 금액 요약 카드, 정산 테이블, 멤버별 납부 상태, 등록 폼, 상세 패널 |
| 공용 물품 | 상태별 요약, 물품 테이블, 소진/부족 배지, 구매 담당자, 등록 폼 |
| 생활 규칙 | 카테고리 카드, 동의 현황, 활성/비활성 배지, 등록/상세 화면 |
| 메신저 | 채팅방 목록, 채팅 버블, 공유 카드, 메시지 입력 영역 |
| 알림/활동 | 시간순 리스트, 상태 배지, 액션 버튼, 타임라인 |
| 멤버/그룹 | 프로필 카드, 멤버 목록, 그룹 정보 폼, 그룹 전환 목록 |

## 공통 컴포넌트 도출

| 컴포넌트 | 위치 | 사용 목적 |
|----------|------|-----------|
| `Button` | `shared/components/ui` | 주요 액션, 보조 액션, 위험 액션 |
| `SummaryCard` | `shared/components/ui` | 대시보드 및 도메인 요약 수치 |
| `DataTable` | `shared/components/ui` | 목록형 데이터 표시 |
| `StatusBadge` | `shared/components/ui` | 완료, 미완료, 예정, 미정산, 부족, 소진 등 상태 표시 |
| `FilterTabGroup` | `shared/components/ui` | 상태/카테고리 필터 |
| `SearchInput` | `shared/components/ui` | 목록 검색 |
| `UserAvatar` | `shared/components/ui` | 멤버 표시 |
| `FormInput`, `SelectDropdown`, `DatePicker`, `TextArea`, `CheckboxGroup` | `shared/components/form` | 등록/수정 폼 |
| `PageHeading`, `Panel` | `shared/components/layout` | 라우트 화면의 제목 영역과 섹션 패널 |
| `MetricList` | `shared/components/ui` | 요약 지표 리스트 |
| `ChatBubble`, `ChatRoomItem`, `ShareCard`, `ShareTypeBar` | `shared/components/messenger` | 메신저 및 공유 흐름 |

## 구현 원칙

- 도메인 조합은 `pages`에서 처리합니다.
- 도메인 내부 파일은 외부에서 직접 import하지 않고 `features/<domain>/index.ts` public API를 사용합니다.
- 색상은 `tailwind.config.ts`의 Figma 토큰 계열만 사용합니다.
- 실제 API 연동 전까지는 `pages/_shared/mockData.ts`의 정적 데이터를 사용해 화면 구조를 검증합니다.

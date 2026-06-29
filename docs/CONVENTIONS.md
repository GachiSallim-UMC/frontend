# 코드 컨벤션

## 1. 아키텍처 규칙 (Feature-Sliced Design)

### 레이어 의존성 (단방향)

```
app  →  pages  →  features  →  shared
```

- 상위 레이어는 하위 레이어만 import 할 수 있습니다.
- `shared`는 어떤 도메인(`features`)도 import 하지 않습니다. (역방향 금지)
- 도메인끼리 직접 참조하지 않습니다. 도메인 간 조합이 필요하면 `pages`에서 합칩니다.
- 도메인 외부에서는 `features/<domain>/index.ts`(public API)만 import 합니다. 내부 파일(`api`, `hooks`)을 직접 가져오지 마세요.

```ts
// ✅ Good
import { useChores, ChoreTable } from '@/features/chore';

// ❌ Bad — 내부 파일 직접 접근
import { choreApi } from '@/features/chore/api/chore.api';
```

## 2. 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `ChoreTable.tsx` |
| 훅 파일 | camelCase, `use` 접두 | `useChores.ts` |
| 일반 모듈 | camelCase | `chore.api.ts`, `cn.ts` |
| 타입 파일 | `*.types.ts` | `chore.types.ts` |
| 타입·인터페이스 | PascalCase | `Chore`, `CreateChoreDto` |
| 상수 | UPPER_SNAKE_CASE | `STATUS_TABS` |
| 변수·함수 | camelCase | `choreList`, `getList` |

- DTO는 용도를 접미사로: `CreateXxxDto`, `UpdateXxxDto`.
- 이벤트 핸들러는 `handle*` (정의) / `on*` (prop): `handleSubmit`, `onEdit`.

## 3. 컴포넌트

- 함수형 컴포넌트 + 화살표 함수로 작성합니다.
- props 타입은 `XxxProps` 인터페이스로 정의합니다.
- 한 폴더 = 한 컴포넌트 + `index.ts` 배럴.
- import 타입은 `import type`을 사용합니다. (ESLint로 강제)
- 색상·간격은 **반드시 Tailwind 디자인 토큰**을 사용합니다. 임의의 hex/기본 색상 금지 → [tailwind.config.ts](../tailwind.config.ts)의 Figma 토큰만 사용.

```ts
// ✅ Good
<div className="bg-primary-600 text-white" />
// ❌ Bad
<div style={{ background: '#3b82f6' }} />
```

## 4. import 순서

1. 외부 라이브러리 (react, 라이브러리)
2. 내부 절대경로 (`@/shared`, `@/features`)
3. 상대경로 (`./`, `../`)

절대경로 alias `@/*` → `src/*` 를 사용합니다. (`../../../` 금지)

## 5. 커밋 컨벤션

```
<type>: <subject>

예) feat: 집안일 목록 필터 기능 추가
```

| type | 용도 |
|------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `style` | 코드 포맷 (동작 변경 없음) |
| `refactor` | 리팩토링 |
| `design` | UI/CSS 변경 |
| `docs` | 문서 |
| `chore` | 빌드·설정·패키지 |
| `test` | 테스트 |

- subject는 한글 명령형, 50자 이내, 마침표 없이.

## 6. 브랜치 전략

```
main          # 배포 가능한 안정 버전
 └─ develop       # 통합 개발 브랜치
     └─ feature/<도메인>-<기능>   # 기능 단위 작업
```

- 예: `feature/chore-list`, `feature/expense-form`
- 작업은 `develop`에서 분기 → 완료 후 `develop`로 PR.
- `develop` → `main` 머지는 배포 시점에만.

## 7. PR 컨벤션

- 제목: 커밋 컨벤션과 동일 (`feat: 집안일 목록 구현`)
- 본문 템플릿:

```markdown
## 작업 내용
- 

## 관련 화면
- SCREEN 07 집안일 목록

## 스크린샷

## 체크리스트
- [ ] npm run type-check 통과
- [ ] npm run lint 통과
- [ ] 디자인 토큰 사용 (임의 색상 없음)
```

- 리뷰어 1명 이상 승인 후 머지.
- 머지 방식: Squash and merge 권장.

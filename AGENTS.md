# AGENTS.md — AI 작업 가이드

이 파일은 Codex / Cursor 등 AI 코딩 도구가 **같이살림** 프로젝트에서 작업할 때 반드시 따라야 할 규칙입니다.

## 프로젝트

- **같이살림**: 룸메이트 생활 협업 서비스 (집안일·생활비·공용물품·생활규칙·메신저)
- React 18 + TypeScript + Vite, Tailwind CSS, TanStack Query, React Router
- 디자인 원본: Figma "같이살림 - UMC 10기"

## 아키텍처 (Feature-Sliced Design) — 반드시 준수

레이어 의존성은 **단방향**입니다:

```
app  →  pages  →  features  →  shared
```

- `shared`는 `features`를 import 하지 않습니다. (역방향 절대 금지)
- 도메인끼리 직접 import 하지 않습니다. 조합은 `pages`에서.
- 도메인은 `features/<domain>/index.ts`로만 외부 노출. 내부 파일 직접 import 금지.
- 같은 도메인 내부에서는 자기 `index.ts`를 경유하지 않고 `@/features/<domain>/...` 절대경로로 내부 모듈을 참조합니다.
- `features/chore`가 **표준 템플릿**입니다. 새 도메인은 이 구조(api·components·hooks·types·index)를 그대로 따르세요.

## 디자인 토큰 — 임의 색상 금지

- 색상은 **반드시 [tailwind.config.ts](tailwind.config.ts)에 정의된 Figma 토큰**만 사용합니다.
- `#3b82f6` 같은 임의 hex, Tailwind 기본 색상 직접 사용 금지.
- 상태 표시는 `StatusBadge` 컴포넌트를 재사용합니다. 색을 새로 칠하지 마세요.
- 토큰 매핑: 완료=green, 미완료=primary(blue), 예정=purple, 미정산=orange, 비활성=gray, 소진=red.
- Figma에서 새 값이 필요하면 먼저 디자인 토큰으로 추가한 뒤 사용합니다.

## 컴포넌트 작성 규칙

- 함수형 + 화살표 함수, props는 `XxxProps` 인터페이스.
- 공통으로 재사용 가능하면 `shared/components`, 특정 도메인 전용이면 `features/<domain>/components`.
- 새 컴포넌트 전에 **기존 `shared/components`에 비슷한 게 있는지 먼저 확인**하고 재사용/확장합니다.
- `import type` 사용 (값 import와 분리).
- 모든 내부 모듈 접근에는 절대경로 `@/*`를 사용합니다. 상대경로 import는 사용하지 않습니다.

## 작업 전 체크

1. 이 변경이 어느 레이어/도메인에 속하는가? 의존성 방향이 맞는가?
2. 재사용 가능한 기존 컴포넌트/훅/타입이 있는가?
3. 색상·간격이 디자인 토큰을 쓰는가?

## 작업 후 체크

```bash
npm run type-check   # 타입 에러 0
npm run lint         # 린트 통과
```

## 커밋

- 형식: `<type>: <한글 subject>` (예: `feat: 생활비 정산 폼 구현`)
- type: feat / fix / style / refactor / design / docs / chore / test
- 자세한 컨벤션은 [docs/CONVENTIONS.md](docs/CONVENTIONS.md).

## 브랜치

- 모든 작업 브랜치는 `develop`에서 분기하고 완료 후 `develop`으로 PR을 올립니다.
- `develop`에서 `main`으로의 병합은 배포 시점에만 진행합니다.
- 브랜치명에는 이슈 번호를 반드시 포함합니다.
- 형식: `<type>/<이슈번호>-<도메인 또는 기능>-<요약>`
- type: feature / fix / design / refactor / docs / chore
- 예: `feature/7-chore-list`, `fix/23-button`, `docs/222-project-conventions`

# features — 도메인 레이어

각 도메인은 독립적인 비즈니스 단위입니다. **`chore` 도메인을 표준 템플릿**으로 삼아 구현하세요.

## 도메인 내부 구조

```
features/<domain>/
├── api/            # 서버 통신 (shared/api의 apiClient 사용)
├── components/     # 도메인 전용 컴포넌트 (shared/components 조합)
├── hooks/          # React Query 기반 도메인 훅
├── types/          # 도메인 모델 · DTO
└── index.ts        # public API (배럴) — 외부는 이것만 import
```

## 도메인 목록 (Figma 화면 매핑)

| 도메인 | 화면 | 상태 |
|--------|------|------|
| `auth` | 01 로그인 | 구조만 |
| `dashboard` | 06 대시보드 | 구조만 |
| `chore` | 07·08 집안일 | ✅ 완성 (템플릿) |
| `expense` | 09·10 생활비 정산 | 타입 정의 |
| `item` | 11·12 공용 물품 | 타입 정의 |
| `rule` | 13·14 생활 규칙 | 타입 정의 |
| `messenger` | 15 메신저 | 구조만 |
| `notification` | 16 알림 | 구조만 |
| `activity` | 17 활동 내역 | 구조만 |
| `member` | 18 마이페이지·그룹 | 구조만 |

## 의존성 규칙 (중요)

```
app → pages → features → shared
```

- ✅ `features`는 `shared`만 import (도메인끼리 직접 참조 금지)
- ✅ 도메인 간 통신이 필요하면 `pages`에서 조합
- ❌ `shared`가 `features`를 import (역방향) — 절대 금지
- ❌ 다른 도메인의 내부 파일 직접 import — `index.ts`만 사용

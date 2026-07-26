# 공용물품 API 계약 보완 요청

프론트 공용물품 화면의 기존 입력·표시 계약을 유지하기 위해 백엔드 보완이 필요합니다.

## 현재 확인된 차이

- `Supply` 모델과 등록·목록 응답에 카테고리와 메모가 없습니다.
- `PATCH /supplies/:supplyId/status`만 있어 물품명·카테고리·담당자·메모를 수정할 수 없습니다.
- `GET /groups/:groupId/members` 응답에 사용자 이름·닉네임·프로필 이미지가 없어 담당자 선택지를 표시할 수 없습니다.

## 요청 계약

### 공용물품 카테고리

다음 고정 값을 백엔드 enum 또는 동등한 카테고리 리소스로 제공해 주세요.

`DAILY`, `KITCHEN`, `BATHROOM`, `CLEANING`, `GROCERY`, `MEDICINE`, `PET`, `TOOL`, `ETC`

### 등록

`POST /supplies`

```json
{
  "groupId": 2,
  "name": "화장지",
  "category": "DAILY",
  "status": "SUFFICIENT",
  "assigneeId": 1,
  "memo": "매달 구매"
}
```

- `category`는 필수
- `assigneeId`, `memo`는 선택
- 응답에도 `category`, `memo` 포함

### 전체 수정

`PATCH /supplies/:supplyId`

```json
{
  "name": "화장지",
  "category": "DAILY",
  "assigneeId": null,
  "memo": "이번 주 구매"
}
```

- `assigneeId: null`로 담당자 해제 지원
- `memo: null` 또는 빈 문자열로 메모 삭제 지원
- 상태 변경은 기존 `PATCH /supplies/:supplyId/status`를 유지
- 응답에도 `category`, `memo` 포함

### 그룹 멤버 조회

`GET /groups/:groupId/members`

각 멤버에 아래 사용자 표시 정보를 포함해 주세요.

```json
{
  "userId": 1,
  "role": "ADMIN",
  "nickname": "테스트유저",
  "name": "테스트계정",
  "profileImage": null,
  "joinedAt": "2026-07-21T14:12:50.375Z"
}
```

## 확인 기준

- 등록 후 재조회해도 카테고리·담당자·메모가 유지되어야 합니다.
- 전체 수정 후 목록과 편집 화면에 변경값이 반영되어야 합니다.
- 담당자 미지정과 담당자 해제가 구분되어야 합니다.
- Swagger와 dev 서버에 동일한 계약이 배포되어야 합니다.

interface ApiErrorDefinition {
  statusCode: number;
  message: string;
}

/** 백엔드 develop의 ErrorCode 상수와 동일한 공통 오류 계약 */
export const BACKEND_ERROR_DEFINITIONS = {
  COMMON_500: {
    statusCode: 500,
    message: '서버 오류가 발생했습니다. 관리자에게 문의해 주세요.',
  },
  COMMON_400: { statusCode: 400, message: '잘못된 요청입니다.' },
  COMMON_INVALID_PARAMETER: {
    statusCode: 400,
    message: '요청 파라미터가 잘못되었습니다.',
  },
  COMMON_401: { statusCode: 401, message: '인증이 필요합니다.' },
  COMMON_403: { statusCode: 403, message: '접근 권한이 없습니다.' },
  COMMON_404: { statusCode: 404, message: '요청한 리소스를 찾을 수 없습니다.' },
  COMMON_409: { statusCode: 409, message: '요청이 현재 상태와 충돌합니다.' },

  AUTH_UNAUTHORIZED: { statusCode: 401, message: '인증이 필요합니다.' },
  AUTH_INVALID_CREDENTIALS: {
    statusCode: 401,
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },
  AUTH_EMAIL_ALREADY_EXISTS: { statusCode: 409, message: '이미 가입된 이메일입니다.' },
  AUTH_EMAIL_NOT_CONFIRMED: { statusCode: 409, message: '이메일 확인이 필요합니다.' },
  AUTH_INVALID_CONFIRMATION_CODE: {
    statusCode: 400,
    message: '이메일 확인 코드가 올바르지 않습니다.',
  },
  AUTH_EXPIRED_CONFIRMATION_CODE: {
    statusCode: 400,
    message: '이메일 확인 코드가 만료되었습니다.',
  },
  AUTH_PASSWORD_POLICY_VIOLATION: {
    statusCode: 400,
    message: '비밀번호 정책을 충족하지 않습니다.',
  },
  AUTH_CURRENT_PASSWORD_INVALID: {
    statusCode: 400,
    message: '현재 비밀번호가 올바르지 않습니다.',
  },
  AUTH_ACCOUNT_INACTIVE: { statusCode: 403, message: '비활성화된 계정입니다.' },
  AUTH_ACCOUNT_NOT_FOUND: {
    statusCode: 404,
    message: '인증 계정 정보를 찾을 수 없습니다.',
  },
  AUTH_TOO_MANY_REQUESTS: {
    statusCode: 429,
    message: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
  },
  AUTH_PROVIDER_ERROR: {
    statusCode: 502,
    message: '인증 서비스 요청을 처리하지 못했습니다.',
  },
  AUTH_COMPENSATION_FAILED: {
    statusCode: 500,
    message: '인증 정보 복구에 실패했습니다.',
  },

  USER_404: { statusCode: 404, message: '존재하지 않는 사용자입니다.' },

  NOTIFICATION_FORBIDDEN: {
    statusCode: 403,
    message: '알림을 생성할 권한이 없습니다.',
  },
  NOTIFICATION_TARGET_NOT_FOUND: {
    statusCode: 404,
    message: '알림 대상 사용자를 찾을 수 없습니다.',
  },
  NOTIFICATION_SUBSCRIPTION_NOT_FOUND: {
    statusCode: 404,
    message: '존재하지 않는 알림 구독입니다.',
  },
  NOTIFICATION_NOT_FOUND: { statusCode: 404, message: '존재하지 않는 알림입니다.' },

  CHORE_400_DATE: {
    statusCode: 400,
    message: '마감일은 시작일보다 빠를 수 없습니다.',
  },
  CHORE_403: {
    statusCode: 403,
    message: '집안일을 삭제할 권한이 없습니다. (등록자 또는 관리자만 가능)',
  },
  CHORE_404: { statusCode: 404, message: '존재하지 않는 집안일입니다.' },
  CHORE_409: { statusCode: 409, message: '이미 완료된 집안일입니다.' },

  SUP_400_CATEGORY: {
    statusCode: 400,
    message: '구매 완료 처리 시 정산 카테고리(categoryId)는 필수입니다.',
  },
  SUP_403: {
    statusCode: 403,
    message: '공용물품을 삭제할 권한이 없습니다. (등록자 또는 관리자만 가능)',
  },
  SUP_404: { statusCode: 404, message: '존재하지 않는 공용물품입니다.' },
  SUP_409: {
    statusCode: 409,
    message: '이미 등록된 공용물품입니다. (그룹 내 동일 물품명)',
  },
  SUP_ALREADY_PURCHASED: {
    statusCode: 409,
    message: '이미 구매 완료된 공용물품입니다.',
  },

  RULE_404_GROUP: { statusCode: 404, message: '존재하지 않는 그룹입니다.' },
  RULE_404_CATEGORY: {
    statusCode: 404,
    message: '존재하지 않는 규칙 카테고리입니다.',
  },

  GROUP_NOT_FOUND: { statusCode: 404, message: '존재하지 않는 그룹입니다.' },
  GROUP_MEMBER_NOT_FOUND: {
    statusCode: 403,
    message: '그룹에 속하지 않은 사용자입니다.',
  },
  GROUP_FORBIDDEN: {
    statusCode: 403,
    message: '그룹 관리자만 수행할 수 있는 작업입니다.',
  },
  GROUP_TARGET_MEMBER_NOT_FOUND: {
    statusCode: 404,
    message: '대상 사용자는 그룹의 구성원이 아닙니다.',
  },
  GROUP_LAST_ADMIN: {
    statusCode: 409,
    message: '그룹에 남은 마지막 관리자는 강등하거나 내보낼 수 없습니다.',
  },
  GROUP_INVITE_CODE_INVALID: {
    statusCode: 404,
    message: '유효하지 않은 초대코드입니다.',
  },
  GROUP_INVITE_CODE_EXPIRED: { statusCode: 400, message: '만료된 초대코드입니다.' },
  GROUP_ALREADY_MEMBER: {
    statusCode: 409,
    message: '이미 그룹에 참여 중인 사용자입니다.',
  },
  GROUP_FULL: { statusCode: 409, message: '그룹 정원이 가득 찼습니다.' },

  CHAT_ROOM_NOT_FOUND: { statusCode: 404, message: '존재하지 않는 채팅방입니다.' },
  CHAT_ROOM_MEMBER_NOT_FOUND: {
    statusCode: 404,
    message: '채팅방에 속하지 않은 사용자입니다.',
  },
  CHAT_ROOM_MEMBER_ALREADY_JOINED: {
    statusCode: 409,
    message: '이미 채팅방에 참여 중인 사용자입니다.',
  },
} as const satisfies Record<string, ApiErrorDefinition>;

export const CLIENT_ERROR_DEFINITIONS = {
  NETWORK_ERROR: {
    statusCode: 0,
    message: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
  },
  AUTH_SESSION_EXPIRED: {
    statusCode: 401,
    message: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
  },
  INVALID_API_RESPONSE: {
    statusCode: 502,
    message: '서버 응답 형식이 올바르지 않습니다.',
  },
  GROUP_SELECTION_REQUIRED: {
    statusCode: 409,
    message: '먼저 사용할 그룹을 선택해 주세요.',
  },
  GROUP_SELECTION_INVALID: {
    statusCode: 409,
    message: '선택한 그룹 정보가 올바르지 않습니다.',
  },
} as const satisfies Record<string, ApiErrorDefinition>;

export type BackendErrorCode = keyof typeof BACKEND_ERROR_DEFINITIONS;
export type ClientErrorCode = keyof typeof CLIENT_ERROR_DEFINITIONS;
export type KnownApiErrorCode = BackendErrorCode | ClientErrorCode;

const hasOwn = <T extends object>(value: T, key: PropertyKey): key is keyof T =>
  Object.prototype.hasOwnProperty.call(value, key);

export const isBackendErrorCode = (code: string): code is BackendErrorCode =>
  hasOwn(BACKEND_ERROR_DEFINITIONS, code);

export const isClientErrorCode = (code: string): code is ClientErrorCode =>
  hasOwn(CLIENT_ERROR_DEFINITIONS, code);

export const getApiErrorFallbackMessage = (statusCode: number, code: string): string => {
  if (isBackendErrorCode(code)) return BACKEND_ERROR_DEFINITIONS[code].message;
  if (isClientErrorCode(code)) return CLIENT_ERROR_DEFINITIONS[code].message;
  if (statusCode === 401) return CLIENT_ERROR_DEFINITIONS.AUTH_SESSION_EXPIRED.message;
  if (statusCode === 403) return BACKEND_ERROR_DEFINITIONS.COMMON_403.message;
  if (statusCode === 404) return BACKEND_ERROR_DEFINITIONS.COMMON_404.message;
  if (statusCode === 409) return BACKEND_ERROR_DEFINITIONS.COMMON_409.message;
  if (statusCode === 429) return BACKEND_ERROR_DEFINITIONS.AUTH_TOO_MANY_REQUESTS.message;
  if (statusCode >= 500) return BACKEND_ERROR_DEFINITIONS.COMMON_500.message;
  return '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
};

export const getApiErrorTitle = (statusCode: number, code: string): string => {
  if (code === 'NETWORK_ERROR') return '네트워크 오류';
  if (statusCode === 401) return '로그인 만료';
  if (statusCode === 403) return '접근 권한 없음';
  if (statusCode === 404) return '찾을 수 없음';
  if (statusCode === 409) return '요청 충돌';
  if (statusCode === 429) return '요청 제한';
  if (statusCode >= 500) return '서비스 오류';
  return '요청 오류';
};

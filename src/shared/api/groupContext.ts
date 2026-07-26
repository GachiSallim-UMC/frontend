import { useGroupStore } from '@/shared/store';
import { ApiError } from './ApiError';

export const requireSelectedGroupId = (): string => {
  const groupId = useGroupStore.getState().selectedGroupId;

  if (!groupId) {
    throw new ApiError(409, 'GROUP_SELECTION_REQUIRED', '먼저 사용할 그룹을 선택해 주세요.');
  }

  return groupId;
};

export const withSelectedGroupParams = <T extends Record<string, unknown>>(params?: T) => ({
  ...(params ?? ({} as T)),
  groupId: requireSelectedGroupId(),
});

export const withSelectedGroupBody = <T extends Record<string, unknown>>(body: T) => {
  return { ...body, groupId: requireSelectedGroupId() };
};

/** 숫자 groupId를 요구하는 DTO(집안일·규칙 등)에서 사용합니다. */
export const withSelectedNumericGroupBody = <T extends Record<string, unknown>>(body: T) => {
  const groupId = requireSelectedGroupId();
  const numericGroupId = Number(groupId);

  if (!Number.isSafeInteger(numericGroupId) || numericGroupId < 1) {
    throw new ApiError(409, 'GROUP_SELECTION_INVALID', '선택한 그룹 정보가 올바르지 않습니다.');
  }

  return { ...body, groupId: numericGroupId };
};

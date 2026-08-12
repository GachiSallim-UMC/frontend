import type { QueryClient } from '@tanstack/react-query';

/** 여러 기능에서 함께 소비하는 서버 상태의 최상위 쿼리 키입니다. */
export const SHARED_QUERY_ROOTS = {
  dashboard: ['dashboard'] as const,
  activityLogs: ['activityLogs'] as const,
  groupMembers: ['member', 'group-members'] as const,
  chores: ['chores'] as const,
  expenses: ['expenses'] as const,
  items: ['items'] as const,
  rules: ['rules'] as const,
  messenger: ['messenger'] as const,
};

const toNumericGroupId = (groupId: number | string | null | undefined) => {
  if (groupId === null || groupId === undefined || groupId === '') return null;
  const numericGroupId = Number(groupId);
  return Number.isSafeInteger(numericGroupId) && numericGroupId > 0 ? numericGroupId : null;
};

/** 대시보드 요약과 최근 활동에 영향을 주는 도메인 변경 후 호출합니다. */
export const invalidateGroupOverviewQueries = async (
  queryClient: QueryClient,
  groupId?: number | string | null,
) => {
  const numericGroupId = toNumericGroupId(groupId);

  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: numericGroupId
        ? [...SHARED_QUERY_ROOTS.dashboard, numericGroupId]
        : SHARED_QUERY_ROOTS.dashboard,
    }),
    queryClient.invalidateQueries({ queryKey: SHARED_QUERY_ROOTS.activityLogs }),
  ]);
};

/** 닉네임·프로필 이미지를 포함해 내려주는 모든 도메인 캐시를 갱신합니다. */
export const invalidateProfilePresentationQueries = async (queryClient: QueryClient) => {
  await Promise.all(
    [
      SHARED_QUERY_ROOTS.groupMembers,
      SHARED_QUERY_ROOTS.chores,
      SHARED_QUERY_ROOTS.expenses,
      SHARED_QUERY_ROOTS.items,
      SHARED_QUERY_ROOTS.rules,
      SHARED_QUERY_ROOTS.messenger,
      SHARED_QUERY_ROOTS.dashboard,
      SHARED_QUERY_ROOTS.activityLogs,
    ].map(queryKey => queryClient.invalidateQueries({ queryKey })),
  );
};

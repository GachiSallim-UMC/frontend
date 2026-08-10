export const expenseKeys = {
  all: ['expenses'] as const,
  scope: (userId: string | null, groupId: string | null) =>
    [...expenseKeys.all, userId, groupId] as const,
  lists: (userId: string | null, groupId: string | null) =>
    [...expenseKeys.scope(userId, groupId), 'list'] as const,
  detail: (userId: string | null, groupId: string | null, id: number | string) =>
    [...expenseKeys.scope(userId, groupId), 'detail', id] as const,
  receipt: (userId: string | null, groupId: string | null, id: number | string) =>
    [...expenseKeys.detail(userId, groupId, id), 'receipt'] as const,
};

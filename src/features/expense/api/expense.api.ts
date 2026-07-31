import { apiClient, withSelectedNumericGroupBody, withSelectedGroupParams } from '@/shared/api';
import type {
  Expense,
  CreateExpenseDto,
  ExpenseCategory,
  CalculateExpenseDto,
  SettleExpenseSplitDto,
  UpdateExpenseDto,
} from '@/features/expense';
import type { ExpenseStatus } from '@/shared/types';

export interface GetExpensesParams {
  groupId?: number;
  category?: ExpenseCategory;
  userId?: number;
  [key: string]: unknown;
}

function unwrap(raw: unknown): unknown {
  if (raw && typeof raw === 'object' && 'data' in raw && ('statusCode' in raw || 'error' in raw)) {
    return (raw as Record<string, unknown>).data;
  }
  return raw;
}

function toExpenseStatus(rawStatus: string): ExpenseStatus {
  return rawStatus === 'PAID' || rawStatus === 'DONE' ? 'paid' : 'unpaid';
}

function toSplitIsPaid(rawStatus: string): boolean {
  return rawStatus === 'PAID' || rawStatus === 'PRE_PAID' || rawStatus === 'DONE';
}

export function toExpense(rawResponse: unknown): Expense {
  const raw = unwrap(rawResponse) as Record<string, unknown>;

  const payerIdStr = String(raw.payerId ?? '');

  const shares = Array.isArray(raw.splits)
    ? raw.splits.map((s: Record<string, unknown>) => {
        const sUser = s.user as Record<string, unknown> | undefined;
        return {
          id: s.id as string | number,
          user: sUser
            ? {
                id: String(sUser.id ?? ''),
                name: (sUser.name as string) ?? '',
                nickname: (sUser.nickname as string) ?? '',
                email: (sUser.email as string) ?? '',
                avatarUrl: (sUser.profileImage as string) ?? '',
              }
            : {
                id: String(s.userId ?? ''),
                name: '',
                nickname: '',
                email: '',
                avatarUrl: '',
              },
          amount: (s.amount as number) ?? 0,
          isPaid: toSplitIsPaid(s.status as string),
        };
      })
    : undefined;

  return {
    id: raw.id as string | number,
    title: (raw.title as string) ?? '',
    amount: (raw.totalAmount as number) ?? 0,
    date: (raw.date as string) ?? (raw.createdAt as string) ?? '',
    payer: {
      id: payerIdStr,
      name: '',
      nickname: '',
      email: '',
      avatarUrl: '',
    },
    payerId: payerIdStr,
    splitType: (raw.splitType as Expense['splitType']) ?? 'EQUAL',
    category: (raw.category as ExpenseCategory) ?? 'ETC',
    status: toExpenseStatus(raw.status as string),
    shares: shares ?? [],
    memo: (raw.memo as string) ?? undefined,
  } as Expense;
}

export const createExpense = async (formData: CreateExpenseDto): Promise<Expense> => {
  const payload = withSelectedNumericGroupBody(
    formData as unknown as Record<string, unknown>
  );

  const response = await apiClient.post('/expenses', payload);
  const created = unwrap(response.data) as Record<string, unknown>;
  const expenseId = (created?.expenseId ?? created?.id) as string | number | undefined;

  if (!expenseId) {
    throw new Error('지출 생성 응답에서 expenseId를 찾을 수 없습니다.');
  }

  return getExpenseById(expenseId);
};

export const getExpense = async (params: GetExpensesParams): Promise<Expense[]> => {
  const queryParams = withSelectedGroupParams(params);

  const response = await apiClient.get('/expenses', { params: queryParams });
  const unwrapped = unwrap(response.data);
  const rawList = Array.isArray(unwrapped) ? unwrapped : [];
  return rawList.map((raw: unknown) => toExpense(raw));
};

export const calculateExpenseSplit = async (data: CalculateExpenseDto): Promise<Record<string, any>> => {
  const response = await apiClient.post('/expenses/calculate', data);
  return unwrap(response.data) as Record<string, any>;
};

export const createPayLink = async (splitId: number | string): Promise<Record<string, any>> => {
  const response = await apiClient.post(`/expenses/splits/${splitId}/paylink`);
  return unwrap(response.data) as Record<string, any>;
};

export const settleExpenseSplit = async (
  splitId: number,
  data: SettleExpenseSplitDto
): Promise<void> => {
  await apiClient.patch(`/expenses/splits/${splitId}/settle`, data);
};

export const getExpenseById = async (expenseId: number | string): Promise<Expense> => {
  const response = await apiClient.get(`/expenses/${expenseId}`);
  return toExpense(response.data);
};

export const updateExpense = async (
  expenseId: number | string,
  updateData: UpdateExpenseDto
): Promise<Expense> => {
  await apiClient.patch(`/expenses/${expenseId}`, updateData);
  return getExpenseById(expenseId);
};

export const deleteExpense = async (expenseId: number | string): Promise<void> => {
  await apiClient.delete(`/expenses/${expenseId}`);
};

export const shareExpenseCard = async (expenseId: number | string): Promise<unknown> => {
  const response = await apiClient.post(`/expenses/${expenseId}/share`);
  return unwrap(response.data);
};
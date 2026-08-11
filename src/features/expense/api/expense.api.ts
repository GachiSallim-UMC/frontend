import {
  apiClient,
  withSelectedNumericGroupBody,
  withSelectedGroupParams,
  ApiError,
} from '@/shared/api';
import type {
  Expense,
  CreateExpenseDto,
  ExpenseCategory,
  CalculateExpenseDto,
  CalculateExpenseSplitResponse,
  SettleExpenseSplitDto,
  UpdateExpenseDto,
  RequestReceiptUploadUrlDto,
  ReceiptUploadUrlResponse,
  PayLinkResponse,
  BankAccount,
  CreateBankAccountDto,
} from '@/features/expense';
import type { ExpenseStatus } from '@/shared/types';

export interface GetExpensesParams {
  groupId?: number;
  category?: ExpenseCategory;
  userId?: number;
  [key: string]: unknown;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const invalidResponse = (message: string) => new ApiError(502, 'INVALID_API_RESPONSE', message);

function toExpenseStatus(rawStatus: string): ExpenseStatus {
  return rawStatus === 'PAID' || rawStatus === 'DONE' ? 'paid' : 'unpaid';
}

function toSplitIsPaid(rawStatus: string): boolean {
  return rawStatus === 'PAID' || rawStatus === 'PRE_PAID' || rawStatus === 'DONE';
}

export function toExpense(rawResponse: unknown): Expense {
  if (!isRecord(rawResponse)) {
    throw invalidResponse('생활비 응답 형식이 올바르지 않습니다.');
  }
  const raw = rawResponse;

  const payerIdStr = String(raw.payerId ?? '');

  const shares = Array.isArray(raw.splits)
    ? raw.splits.filter(isRecord).map(s => {
        const sUser = s.user as Record<string, unknown> | undefined;
        const userNickname = typeof sUser?.nickname === 'string' ? sUser.nickname : '';
        const userName = typeof sUser?.name === 'string' ? sUser.name : '';
        return {
          id: s.id as string | number,
          user: sUser
            ? {
                id: String(sUser.id ?? ''),
                name: userNickname || userName,
                nickname: userNickname,
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
    : [];

  const allSharesPaid = shares.length > 0 && shares.every(s => s.isPaid);
  const derivedStatus: ExpenseStatus = allSharesPaid
    ? 'paid'
    : toExpenseStatus(raw.status as string);

  return {
    id: raw.id as string | number,
    groupId:
      typeof raw.groupId === 'string' || typeof raw.groupId === 'number'
        ? String(raw.groupId)
        : undefined,
    title: (raw.title as string) ?? '',
    amount: (raw.totalAmount as number) ?? 0,
    date: (raw.date as string) ?? (raw.createdAt as string) ?? '',
    createdById:
      typeof raw.createdBy === 'string' || typeof raw.createdBy === 'number'
        ? String(raw.createdBy)
        : undefined,
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
    status: derivedStatus,
    shares,
    memo: (raw.memo as string) ?? undefined,
  } as Expense;
}

export const createExpense = async (formData: CreateExpenseDto): Promise<Expense> => {
  const payload = withSelectedNumericGroupBody(formData as unknown as Record<string, unknown>);

  const response = await apiClient.post('/expenses', payload);
  if (!isRecord(response.data)) {
    throw invalidResponse('생활비 생성 응답 형식이 올바르지 않습니다.');
  }
  const created = response.data;
  const expenseId = (created?.expenseId ?? created?.id) as string | number | undefined;

  if (!expenseId) {
    throw new Error('지출 생성 응답에서 expenseId를 찾을 수 없습니다.');
  }

  return getExpenseById(expenseId);
};

export const getExpense = async (params: GetExpensesParams): Promise<Expense[]> => {
  const queryParams = withSelectedGroupParams(params);

  const response = await apiClient.get('/expenses', { params: queryParams });
  if (!Array.isArray(response.data)) {
    throw invalidResponse('생활비 목록 응답 형식이 올바르지 않습니다.');
  }
  return response.data.map((raw: unknown) => toExpense(raw));
};

export const calculateExpenseSplit = async (
  data: CalculateExpenseDto,
): Promise<CalculateExpenseSplitResponse> => {
  const response = await apiClient.post('/expenses/calculate', data);
  if (
    !isRecord(response.data) ||
    typeof response.data.totalAmount !== 'number' ||
    !Array.isArray(response.data.calculatedSplits) ||
    !response.data.calculatedSplits.every(
      split =>
        isRecord(split) &&
        (typeof split.userId === 'string' || typeof split.userId === 'number') &&
        typeof split.amount === 'number' &&
        (split.role === 'RECEIVER' || split.role === 'SENDER'),
    )
  ) {
    throw invalidResponse('생활비 분담 계산 응답 형식이 올바르지 않습니다.');
  }
  return response.data as unknown as CalculateExpenseSplitResponse;
};

export const createPayLink = async (splitId: number | string): Promise<PayLinkResponse> => {
  const response = await apiClient.post(`/expenses/splits/${splitId}/paylink`);
  if (
    !isRecord(response.data) ||
    typeof response.data.deepLinkUrl !== 'string'
  ) {
    throw invalidResponse('송금 링크 응답 형식이 올바르지 않습니다.');
  }
  return response.data as unknown as PayLinkResponse;
};

export const settleExpenseSplit = async (
  splitId: number,
  data: SettleExpenseSplitDto,
): Promise<void> => {
  await apiClient.patch(`/expenses/splits/${splitId}/settle`, data);
};

export const getExpenseById = async (expenseId: number | string): Promise<Expense> => {
  const response = await apiClient.get(`/expenses/${expenseId}`);
  return toExpense(response.data);
};

export const updateExpense = async (
  expenseId: number | string,
  updateData: UpdateExpenseDto,
): Promise<Expense> => {
  await apiClient.patch(`/expenses/${expenseId}`, updateData);
  return getExpenseById(expenseId);
};

export const deleteExpense = async (expenseId: number | string): Promise<void> => {
  await apiClient.delete(`/expenses/${expenseId}`);
};

export const requestReceiptUploadUrl = async (
  dto: RequestReceiptUploadUrlDto,
): Promise<ReceiptUploadUrlResponse> => {
  const response = await apiClient.post('/expenses/receipt-image/upload-url', dto);
  const data = response.data;

  if (
    !isRecord(data) ||
    typeof data.uploadUrl !== 'string' ||
    !isRecord(data.fields) ||
    !Object.values(data.fields).every(value => typeof value === 'string') ||
    typeof data.objectKey !== 'string'
  ) {
    throw invalidResponse('영수증 업로드 응답 형식이 올바르지 않습니다.');
  }

  return {
    uploadUrl: data.uploadUrl,
    fields: data.fields as Record<string, string>,
    objectKey: data.objectKey,
  };
};

export const uploadReceiptToS3 = async (
  uploadUrl: string,
  fields: Record<string, string>,
  file: File,
): Promise<void> => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append('file', file);

  const res = await fetch(uploadUrl, { method: 'POST', body: formData });
  if (!res.ok) {
    throw new Error('영수증 이미지 업로드에 실패했습니다.');
  }
};

export const getReceiptViewUrl = async (
  expenseId: number | string,
): Promise<string | null> => {
  try {
    const response = await apiClient.get(`/expenses/${expenseId}/receipt-image`);
    if (!isRecord(response.data)) {
      throw invalidResponse('영수증 조회 응답 형식이 올바르지 않습니다.');
    }
    if (response.data.viewUrl === null) return null;
    if (typeof response.data.viewUrl !== 'string') {
      throw invalidResponse('영수증 조회 응답 형식이 올바르지 않습니다.');
    }
    return response.data.viewUrl;
  } catch (err) {
    // 상세 생활비는 이미 조회된 상태이므로 영수증 하위 리소스의 400/404는
    // 영수증이 등록되지 않은 정상 상태로 취급합니다.
    if (err instanceof ApiError && (err.statusCode === 400 || err.statusCode === 404)) {
      return null;
    }
    throw err;
  }
};

/** 정산 수령용 계좌 등록 */
export const createBankAccount = async (
  dto: CreateBankAccountDto,
): Promise<BankAccount> => {
  const response = await apiClient.post('/expenses/bank-accounts', dto);
  if (
    !isRecord(response.data) ||
    typeof response.data.id !== 'number' ||
    typeof response.data.bankName !== 'string' ||
    typeof response.data.accountNumber !== 'string'
  ) {
    throw invalidResponse('계좌 등록 응답 형식이 올바르지 않습니다.');
  }
  return {
    id: response.data.id,
    bankName: response.data.bankName,
    accountNumber: response.data.accountNumber,
    isPrimary: Boolean(response.data.isPrimary),
  };
};

/** 내 계좌 목록 조회 (기본 계좌가 먼저 오도록 정렬되어 응답) */
export const getBankAccounts = async (): Promise<BankAccount[]> => {
  const response = await apiClient.get('/expenses/bank-accounts');
  if (!Array.isArray(response.data)) {
    throw invalidResponse('계좌 목록 응답 형식이 올바르지 않습니다.');
  }
  return response.data.map((raw: unknown) => {
    if (
      !isRecord(raw) ||
      typeof raw.id !== 'number' ||
      typeof raw.bankName !== 'string' ||
      typeof raw.accountNumber !== 'string'
    ) {
      throw invalidResponse('계좌 목록 응답 형식이 올바르지 않습니다.');
    }
    return {
      id: raw.id,
      bankName: raw.bankName,
      accountNumber: raw.accountNumber,
      isPrimary: Boolean(raw.isPrimary),
    };
  });
};

/** 송금 완료 알림 전송: 상태를 TRANSFER_PENDING으로 변경하고 수령인에게 확인 요청을 보냄 */
export const claimTransferComplete = async (splitId: number | string): Promise<void> => {
  await apiClient.patch(`/expenses/splits/${splitId}/transfer-claim`);
};

/** 기본(수계좌) 계좌 변경 */
export const setPrimaryBankAccount = async (
  bankAccountId: number | string,
): Promise<void> => {
  await apiClient.patch(`/expenses/bank-accounts/${bankAccountId}/primary`);
};

/** 계좌 삭제 */
export const deleteBankAccount = async (
  bankAccountId: number | string,
): Promise<void> => {
  await apiClient.delete(`/expenses/bank-accounts/${bankAccountId}`);
};
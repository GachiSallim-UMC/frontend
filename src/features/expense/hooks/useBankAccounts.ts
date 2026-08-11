import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getBankAccounts,
  createBankAccount,
  setPrimaryBankAccount,
  deleteBankAccount,
} from '@/features/expense';
import type { BankAccount, CreateBankAccountDto } from '@/features/expense';
import { ApiError } from '@/shared/api';
import { useAlertStore } from '@/shared/store';

export const bankAccountKeys = {
  all: ['bankAccounts'] as const,
  lists: () => [...bankAccountKeys.all, 'list'] as const,
};

export function useBankAccounts() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore(state => state.showAlert);

  const {
    data: accounts = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<BankAccount[]>({
    queryKey: bankAccountKeys.lists(),
    queryFn: getBankAccounts,
  });

  const invalidateAccounts = () =>
    queryClient.invalidateQueries({ queryKey: bankAccountKeys.lists() });

  const registerMutation = useMutation({
    mutationFn: (dto: CreateBankAccountDto) => createBankAccount(dto),
    onSuccess: () => invalidateAccounts(),
    onError: () => {
      showAlert({
        title: '오류',
        message: '계좌 등록에 실패했습니다. 입력하신 정보를 다시 확인해 주세요.',
      });
    },
  });

  const changePrimaryMutation = useMutation({
    mutationFn: (bankAccountId: number) => setPrimaryBankAccount(bankAccountId),
    onSuccess: () => invalidateAccounts(),
    onError: () => {
      showAlert({
        title: '오류',
        message: '기본 계좌 변경에 실패했습니다.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (bankAccountId: number) => deleteBankAccount(bankAccountId),
    onSuccess: () => invalidateAccounts(),
    onError: (err: unknown) => {
      const isSettlementBlocked = err instanceof ApiError && err.statusCode === 400;

      showAlert({
        title: '오류',
        message: isSettlementBlocked
          ? '본인이 선지불자인 미완료 정산 내역이 있어 마지막 계좌를 삭제할 수 없습니다.'
          : '계좌 삭제에 실패했습니다.',
      });
    },
  });

  const registerAccount = async (dto: CreateBankAccountDto) => {
    try {
      await registerMutation.mutateAsync(dto);
      return true;
    } catch {
      return false;
    }
  };

  const changePrimaryAccount = async (bankAccountId: number) => {
    try {
      await changePrimaryMutation.mutateAsync(bankAccountId);
      return true;
    } catch {
      return false;
    }
  };

  const deleteAccount = async (bankAccountId: number) => {
    try {
      await deleteMutation.mutateAsync(bankAccountId);
      return true;
    } catch {
      return false;
    }
  };

  const isSubmitting =
    registerMutation.isPending ||
    changePrimaryMutation.isPending ||
    deleteMutation.isPending;

  const primaryAccount = accounts.find(account => account.isPrimary) ?? accounts[0];

  return {
    accounts,
    primaryAccount,
    isLoading,
    isError,
    isSubmitting,
    registerAccount,
    changePrimaryAccount,
    deleteAccount,
    refetch,
  };
}
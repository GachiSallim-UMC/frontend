import { useCallback, useEffect, useState } from 'react';
import {
  getBankAccounts,
  createBankAccount,
  setPrimaryBankAccount,
} from '@/features/expense';
import type { BankAccount, CreateBankAccountDto } from '@/features/expense';
import { useAlertStore } from '@/shared/store';

export function useBankAccounts() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await getBankAccounts();
      setAccounts(data);
    } catch (err) {
      console.error('계좌 목록 조회 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts]);

  const registerAccount = useCallback(
    async (dto: CreateBankAccountDto) => {
      setIsSubmitting(true);

      try {
        await createBankAccount(dto);
        await fetchAccounts();
        return true;
      } catch (err) {
        console.error('계좌 등록 실패:', err);

        useAlertStore.getState().showAlert({
          title: '오류',
          message: '계좌 등록에 실패했습니다. 입력하신 정보를 다시 확인해 주세요.',
        });

        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchAccounts],
  );

  const changePrimaryAccount = useCallback(
    async (bankAccountId: number) => {
      setIsSubmitting(true);

      try {
        await setPrimaryBankAccount(bankAccountId);
        await fetchAccounts();
        return true;
      } catch (err) {
        console.error('기본 계좌 변경 실패:', err);

        useAlertStore.getState().showAlert({
          title: '오류',
          message: '기본 계좌 변경에 실패했습니다.',
        });

        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchAccounts],
  );

  const primaryAccount = accounts.find(account => account.isPrimary) ?? accounts[0];

  return {
    accounts,
    primaryAccount,
    isLoading,
    isSubmitting,
    registerAccount,
    changePrimaryAccount,
    refetch: fetchAccounts,
  };
}
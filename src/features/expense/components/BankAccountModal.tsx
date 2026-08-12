import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { FormInput, Button } from '@/shared/components';
import { SelectDropdown, type SelectOption } from '@/shared/components/form';
import { useBankAccounts } from '@/features/expense';
import { maskAccountNumber } from '@/features/expense';

const BANK_OPTIONS: readonly SelectOption[] = [
  { value: 'KB', label: 'KB국민은행' },
  { value: 'SHINHAN', label: '신한은행' },
  { value: 'WOORI', label: '우리은행' },
  { value: 'HANA', label: '하나은행' },
  { value: 'NH', label: 'NH농협은행' },
  { value: 'IBK', label: 'IBK기업은행' },
  { value: 'KDB', label: 'KDB산업은행' },
  { value: 'SC', label: 'SC제일은행' },
  { value: 'CITI', label: '한국씨티은행' },
  { value: 'KAKAOBANK', label: '카카오뱅크' },
  { value: 'TOSSBANK', label: '토스뱅크' },
  { value: 'SUHYUP', label: '수협은행' },
  { value: 'POST', label: '우체국' },
  { value: 'SAEMAUL', label: '새마을금고' },
  { value: 'SINHYUP', label: '신협' },
  { value: 'DGB', label: 'DGB대구은행' },
  { value: 'BNK', label: 'BNK부산은행' },
] as const;

interface BankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BankAccountModal({ isOpen, onClose }: BankAccountModalProps) {
  const {
    accounts,
    isLoading,
    isError,
    isSubmitting,
    registerAccount,
    changePrimaryAccount,
    deleteAccount,
    refetch,
  } = useBankAccounts();

  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsAddingAccount(false);
      setBankCode('');
      setAccountNumber('');
      setToastMessage(null);
      setDeletingId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const resetForm = () => {
    setIsAddingAccount(false);
    setBankCode('');
    setAccountNumber('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSelectAccount = async (accountId: number, isPrimary: boolean) => {
    if (isPrimary || isSubmitting) return;

    const success = await changePrimaryAccount(accountId);
    if (success) {
      setToastMessage('주계좌가 변경되었습니다.');
    }
  };

  const handleDeleteAccount = async (
    e: React.MouseEvent,
    accountId: number,
  ) => {
    e.stopPropagation();
    if (isSubmitting || deletingId !== null) return;

    setDeletingId(accountId);

    try {
      const success = await deleteAccount(accountId);
      if (success) {
        setToastMessage('계좌가 삭제되었습니다.');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async () => {
    if (!bankCode || !accountNumber.trim()) return;

    const success = await registerAccount({
      bankName: bankCode,
      accountNumber: accountNumber.trim(),
    });

    if (success) {
      resetForm();
      setToastMessage('계좌가 등록되었습니다.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="정산 받을 계좌"
      className="relative"
    >
      <div className="flex flex-col gap-1">
        {isLoading ? (
          <div className="py-6 text-center text-caption text-gray-400">
            계좌 목록을 불러오는 중...
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center text-caption text-red-500">
            <p>계좌 목록을 불러오지 못했습니다.</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
            >
              다시 시도
            </Button>
          </div>
        ) : accounts.length === 0 && !isAddingAccount ? (
          <div className="py-6 text-center text-caption text-gray-400">
            등록된 계좌가 없습니다.
          </div>
        ) : (
          accounts.map(account => (
            <div
              key={account.id}
              className="flex items-center rounded-lg px-3 py-3 hover:bg-gray-50"
            >
             <button
  type="button"
  disabled={account.isPrimary || isSubmitting}
  onClick={() => handleSelectAccount(account.id, account.isPrimary)}
  className={`flex flex-1 items-center justify-between gap-2 text-left text-mobile-label transition-colors lg:text-button ${
    account.isPrimary
      ? 'font-bold text-gray-900'
      : 'text-gray-500'
  }`}
>
  <span className="truncate">
    {account.bankName} {maskAccountNumber(account.accountNumber)}
  </span>

  {account.isPrimary && (
    <span className="whitespace-nowrap text-mobile-label font-bold text-primary-700 lg:text-caption">
      주계좌
    </span>
  )}
</button>

              <button
                type="button"
                onClick={e => void handleDeleteAccount(e, account.id)}
                disabled={isSubmitting || deletingId !== null}
                aria-label="계좌 삭제"
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {!isError && (isAddingAccount ? (
        <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
          <SelectDropdown
            label="은행명"
            required
            value={bankCode}
            onChange={setBankCode}
            options={BANK_OPTIONS}
            placeholder="은행을 선택해 주세요"
          />

          <FormInput
            label="계좌번호"
            value={accountNumber}
            onChange={e =>
              setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))
            }
            placeholder="'-' 없이 숫자만 입력"
          />

          <div className="mt-1 flex gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={resetForm}
              className="flex-1"
            >
              취소
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => void handleSubmit()}
              disabled={isSubmitting || !bankCode || !accountNumber.trim()}
              className="flex-1"
            >
              {isSubmitting ? '등록 중...' : '등록'}
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAddingAccount(true)}
          className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 py-3 text-button font-bold text-gray-700 hover:bg-gray-50"
        >
          + 계좌 추가
        </button>
      ))}

      {toastMessage && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
          <div className="rounded-full bg-gray-900 px-4 py-2 text-caption text-white shadow-lg">
            {toastMessage}
          </div>
        </div>
      )}
    </Modal>
  );
}
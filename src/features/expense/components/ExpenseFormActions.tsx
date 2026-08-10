import { Button, ShareMessengerButton } from '@/shared/components/ui';

interface ExpenseFormActionsProps {
  isEditMode: boolean;
  isSettled: boolean;
  currentExpenseId?: string;
  isSharing?: boolean;
  canDelete: boolean;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  onShare?: (expenseId: string) => void;
}

export const ExpenseFormActions = ({
  isEditMode,
  isSettled,
  currentExpenseId,
  isSharing,
  canDelete,
  onSave,
  onCancel,
  onDelete,
  onShare,
}: ExpenseFormActionsProps) => (
  <div className="mt-2 flex w-full flex-col-reverse gap-3 pb-6 pt-3 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between sm:gap-4 sm:overflow-x-auto sm:pb-8 sm:pt-4">
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-nowrap sm:shrink-0">
      <Button
        variant="primary"
        size="md"
        onClick={onSave}
        disabled={isSettled}
        className="w-full shrink-0 sm:w-[110px]"
      >
        {isEditMode ? '수정하기' : '저장'}
      </Button>
      <Button
        variant="secondary"
        size="md"
        onClick={onCancel}
        className="hidden shrink-0 sm:flex sm:w-[110px]"
      >
        취소
      </Button>
      {canDelete && (
        <Button
          variant="secondary"
          size="md"
          onClick={onDelete}
          className="w-full shrink-0 border-none bg-red-700 font-bold text-white hover:bg-red-700 sm:w-[110px]"
        >
          삭제
        </Button>
      )}
    </div>

    {isEditMode && (
      <ShareMessengerButton
        label={isSharing ? '공유 중...' : '메신저에 공유'}
        onClick={() => currentExpenseId && onShare?.(currentExpenseId)}
        className="w-full shrink-0 sm:w-auto sm:min-w-[140px]"
        disabled={isSharing || !currentExpenseId}
      />
    )}
  </div>
);

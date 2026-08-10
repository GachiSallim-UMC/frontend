import { CheckboxModal } from '@/features/expense/components/CheckboxModal';
import { ExpenseCancelModal } from '@/features/expense/components/ExpenseCancelModal';
import { ExpenseSaveModal } from '@/features/expense/components/ExpenseSaveModal';
import { SettlementConfirm } from '@/features/expense/components/SettlementConfirm';

interface SettlementMember {
  id: number | string;
  name: string;
  amount?: number;
  isPaid?: boolean;
}

interface ExpenseFormDialogsProps {
  isEditMode: boolean;
  expenseName: string;
  save: {
    isOpen: boolean;
    isSaving: boolean;
    errorMessage?: string;
    onClose: () => void;
    onConfirm: () => void;
  };
  cancel: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  };
  settlement: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  };
  individual: {
    isOpen: boolean;
    members: SettlementMember[];
    onClose: () => void;
    onSubmit: (selectedIds: (number | string)[]) => void;
  };
}

export const ExpenseFormDialogs = ({
  isEditMode,
  expenseName,
  save,
  cancel,
  settlement,
  individual,
}: ExpenseFormDialogsProps) => (
  <>
    <ExpenseSaveModal
      isOpen={save.isOpen}
      onClose={save.onClose}
      onConfirm={save.onConfirm}
      expenseName={expenseName}
      isSaving={save.isSaving}
      errorMessage={save.errorMessage}
      mode={isEditMode ? 'update' : 'create'}
    />

    <ExpenseCancelModal
      isOpen={cancel.isOpen}
      onClose={cancel.onClose}
      onConfirm={cancel.onConfirm}
    />

    {isEditMode && (
      <>
        <SettlementConfirm
          isOpen={settlement.isOpen}
          onClose={settlement.onClose}
          onConfirm={settlement.onConfirm}
        />
        <CheckboxModal
          title="개별 정산 완료 처리"
          description="정산이 완료된 멤버를 선택해주세요."
          members={individual.members}
          isOpen={individual.isOpen}
          onClose={individual.onClose}
          onSubmit={individual.onSubmit}
        />
      </>
    )}
  </>
);

import { useState } from 'react';
import { useAlertStore } from '@/shared/store';

interface UseExpenseFormDialogsProps {
  isEditMode: boolean;
  isSettled: boolean;
  isDirty: boolean;
  saveExpense: () => Promise<void>;
  onCancel?: () => void;
}

export const useExpenseFormDialogs = ({
  isEditMode,
  isSettled,
  isDirty,
  saveExpense,
  onCancel,
}: UseExpenseFormDialogsProps) => {
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string>();

  const openSave = () => {
    setSaveErrorMessage(undefined);
    setIsSaveOpen(true);
  };

  const confirmSave = async () => {
    if (isSettled) {
      useAlertStore.getState().showAlert({
        title: '알림',
        message: '정산 완료된 내역은 수정할 수 없습니다.',
      });
      return;
    }

    setIsSaving(true);
    try {
      await saveExpense();
      setIsSaveOpen(false);
    } catch (error) {
      setSaveErrorMessage(
        error instanceof Error
          ? error.message
          : isEditMode
            ? '지출 수정 중 오류가 발생했습니다.'
            : '지출 등록 중 오류가 발생했습니다.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const confirmCancel = () => {
    setIsCancelOpen(false);
    onCancel?.();
  };

  const openCancel = () => {
    if (!isDirty) {
      onCancel?.();
      return;
    }
    setIsCancelOpen(true);
  };

  return {
    save: {
      isOpen: isSaveOpen,
      isSaving,
      errorMessage: saveErrorMessage,
      open: openSave,
      close: () => setIsSaveOpen(false),
      confirm: confirmSave,
    },
    cancel: {
      isOpen: isCancelOpen,
      open: openCancel,
      close: () => setIsCancelOpen(false),
      confirm: confirmCancel,
    },
    settlement: {
      isOpen: isSettlementOpen,
      open: () => setIsSettlementOpen(true),
      close: () => setIsSettlementOpen(false),
    },
  };
};

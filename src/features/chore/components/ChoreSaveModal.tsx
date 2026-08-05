import ChoreIcon from '@/assets/icons/sidebar/chores.svg?react';
import { ConfirmModal } from '@/shared/components';

interface ChoreSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  choreName: string;
  isSaving?: boolean;
  /** 저장 실패 사유. 모달을 열어둔 채 안에서 보여줍니다. */
  errorMessage?: string;
  /** 등록/수정에 따라 문구가 달라집니다. */
  mode?: 'create' | 'update';
}

export const ChoreSaveModal = ({
  isOpen,
  onClose,
  onConfirm,
  choreName,
  isSaving = false,
  errorMessage,
  mode = 'create',
}: ChoreSaveModalProps) => {
  const isCreate = mode === 'create';

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      icon={<ChoreIcon className="size-6" />}
      title={isCreate ? '집안일을 등록할까요?' : '집안일을 수정할까요?'}
      highlight={choreName}
      description={isCreate ? '내용으로 집안일을 등록합니다.' : '집안일 데이터를 수정합니다.'}
      confirmLabel={isCreate ? '저장하기' : '수정하기'}
      isPending={isSaving}
      errorMessage={errorMessage}
      tone={isCreate ? 'default' : 'edit'}
    />
  );
};

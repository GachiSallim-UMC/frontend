import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChoreBasicInfo,
  ChoreFormActions,
  ChoreMemo,
  ChoreRepeat,
  useChoreForm,
  useCreateChore,
  ChoreSaveModal,
  ChoreCancelModal,
} from '@/features/chore';
import type { ChoreApiCategory } from '@/features/chore';
import { useGroupMembers } from '@/features/member';
import { useAlertStore, useGroupStore } from '@/shared/store';

export const ChoreCreatePage = () => {
  const navigate = useNavigate();
  const showAlert = useAlertStore(state => state.showAlert);
  const createMutation = useCreateChore();
  const { formData, errors, updateField, getCreateDto } = useChoreForm();
  const selectedGroupId = useGroupStore(state => state.selectedGroupId);
  const groupId = selectedGroupId ? Number(selectedGroupId) : undefined;
  const { data: members } = useGroupMembers(selectedGroupId);

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const userOptions =
    members?.map(member => ({
      value: String(member.userId),
      label: member.user.nickname || member.user.name || `멤버 ${member.userId}`,
    })) ?? [];

  const handleBasicInfoChange = (
    updates: Partial<{
      title: string;
      assigneeId: string;
      category: ChoreApiCategory | '';
    }>,
  ) => {
    const { assigneeId, ...rest } = updates;
    updateField({
      ...rest,
      ...(assigneeId !== undefined
        ? { assigneeId: assigneeId === '' ? '' : Number(assigneeId) }
        : {}),
    });
  };

  const handleSaveClick = () => {
    if (!groupId || !Number.isSafeInteger(groupId)) {
      showAlert({ title: '안내', message: '선택된 그룹을 확인해 주세요.' });
      return;
    }
    const dto = getCreateDto(groupId);
    if (!dto) return;
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = () => {
    if (!groupId || !Number.isSafeInteger(groupId)) return;
    const dto = getCreateDto(groupId);
    if (!dto) return;

    createMutation.mutate(dto, {
      onSuccess: () => {
        setIsSaveModalOpen(false);
        navigate('/chores');
      },
      // 실패 시 모달을 열어둔 채 사유를 모달 안에서 보여준다.
    });
  };

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    setIsCancelModalOpen(false);
    navigate(-1);
  };

  return (
    <div className="h-fit flex w-full max-w-[1114px] flex-col pb-[16px] lg:pb-0 gap-4 lg:gap-[30px]">
      <ChoreBasicInfo
        title={formData.title}
        assigneeId={String(formData.assigneeId)}
        category={formData.category}
        assigneeOptions={userOptions}
        errors={errors}
        onChange={handleBasicInfoChange}
      />
      <ChoreRepeat
        repeatType={formData.repeatType}
        customOption={formData.customOption}
        repeatInterval={formData.repeatInterval}
        repeatDays={formData.repeatDays}
        startDate={formData.startDate}
        dueDate={formData.dueDate}
        errors={errors}
        onChange={updateField}
      />
      <ChoreMemo
        value={formData.memo}
        error={errors.memo}
        onChange={memo => updateField({ memo })}
      />
      <ChoreFormActions
        onSave={handleSaveClick}
        onCancel={handleCancelClick}
        isSubmitting={createMutation.isPending}
      />
      <ChoreSaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onConfirm={handleConfirmSave}
        choreName={formData.title || '새 집안일'}
        isSaving={createMutation.isPending}
        errorMessage={
          createMutation.error instanceof Error
            ? createMutation.error.message
            : createMutation.isError
              ? '등록에 실패했습니다. 다시 시도해 주세요.'
              : undefined
        }
      />
      <ChoreCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};

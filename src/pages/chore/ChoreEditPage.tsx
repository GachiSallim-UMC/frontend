import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChoreBasicInfo,
  ChoreFormActions,
  ChoreMemo,
  ChoreRepeat,
  useChoreFromList,
  useChoreForm,
  useUpdateChore,
  useRemoveChore,
  ChoreDeleteModal,
  ChoreSaveModal,
  ChoreCancelModal,
} from '@/features/chore';
import type { ChoreApiCategory } from '@/features/chore';
import { useGroupMembers } from '@/features/member';
import { useGroupStore } from '@/shared/store';
import { ShareItemPickerModal, useShareToMessenger } from '@/features/messenger';

export const ChoreEditPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const selectedGroupId = useGroupStore(state => state.selectedGroupId);
  const groupId = selectedGroupId ? Number(selectedGroupId) : undefined;
  const { data: choreData, isLoading, isError } = useChoreFromList(groupId, id);
  const { data: members } = useGroupMembers(selectedGroupId);
  const updateMutation = useUpdateChore();
  const deleteMutation = useRemoveChore();
  const { formData, updateField, getUpdateDto } = useChoreForm();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const { activeType, chatRoomOptions, openShare, closeShare, handleSelectChatRoom, isSharePending } =
    useShareToMessenger('chore');

  const userOptions =
    members?.map(member => ({
      value: String(member.userId),
      label: member.user.nickname || member.user.name || `멤버 ${member.userId}`,
    })) ?? [];

  useEffect(() => {
    if (!choreData) return;

    updateField({
      title: choreData.title,
      assigneeId: choreData.assignee.userId,
      category: choreData.category,
      repeatType: choreData.repeatType,
      customOption: choreData.customOption ?? '',
      repeatInterval: choreData.repeatInterval === null ? '' : String(choreData.repeatInterval),
      repeatDays: choreData.repeatDays,
      startDate: choreData.startDate,
      dueDate: choreData.dueDate ?? '',
      memo: choreData.memo ?? '',
    });
  }, [choreData, updateField]);

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
    const dto = getUpdateDto();
    if (!dto || !id) return;
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = () => {
    const dto = getUpdateDto();
    if (!dto || !id) return;

    updateMutation.mutate(
      { id, dto },
      {
        onSuccess: () => {
          setIsSaveModalOpen(false);
          navigate('/chores');
        },
        onError: () => {
          alert('수정에 실패했습니다. 다시 시도해 주세요.');
          setIsSaveModalOpen(false);
        },
      },
    );
  };

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    setIsCancelModalOpen(false);
    navigate(-1);
  };

  const handleDeleteClick = () => {
    if (!id) return;
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!id) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        navigate('/chores');
      },
      onError: () => {
        alert('삭제에 실패했습니다. 다시 시도해 주세요.');
        setIsDeleteModalOpen(false);
      },
    });
  };

  const handleShareClick = () => {
    if (!id) return;
    openShare(id);
  };

  if (isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center mt-[28px]">
        <div className="text-gray-500 font-semibold">데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (isError || !choreData) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center mt-[28px]">
        <div className="text-gray-500 font-semibold">집안일 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="mt-[28px] h-fit flex w-full max-w-[1114px] flex-col gap-[30px] p-[20px]">
      <ChoreBasicInfo
        title={formData.title}
        assigneeId={String(formData.assigneeId)}
        category={formData.category}
        assigneeOptions={userOptions}
        onChange={handleBasicInfoChange}
      />
      <ChoreRepeat
        repeatType={formData.repeatType}
        customOption={formData.customOption}
        repeatInterval={formData.repeatInterval}
        repeatDays={formData.repeatDays}
        startDate={formData.startDate}
        dueDate={formData.dueDate}
        onChange={updateField}
      />
      <ChoreMemo value={formData.memo} onChange={memo => updateField({ memo })} />
      <ChoreFormActions
        onSave={handleSaveClick}
        onCancel={handleCancelClick}
        onDelete={handleDeleteClick}
        onShare={handleShareClick}
        isSubmitting={updateMutation.isPending || deleteMutation.isPending}
      />
      <ChoreDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        choreName={choreData.title}
        isDeleting={deleteMutation.isPending}
      />
      <ChoreSaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onConfirm={handleConfirmSave}
        choreName={formData.title || choreData.title}
        isSaving={updateMutation.isPending}
      />
      <ChoreCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
      <ShareItemPickerModal
        type={activeType}
        options={chatRoomOptions}
        onSelect={handleSelectChatRoom}
        onClose={closeShare}
        isSubmitting={isSharePending}
      />
    </div>
  );
};

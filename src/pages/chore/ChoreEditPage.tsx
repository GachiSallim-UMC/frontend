import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ChoreFormActions,
  ChoreFormFields,
  useChoreFromList,
  useChoreForm,
  useUpdateChore,
  useRemoveChore,
  ChoreDeleteModal,
  ChoreSaveModal,
  ChoreCancelModal,
} from '@/features/chore';
import { useGroupMembers } from '@/features/member';
import { useAuthStore, useGroupStore } from '@/shared/store';
import { ShareItemPickerModal, useShareToMessenger } from '@/features/messenger';

export const ChoreEditPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUserId = useAuthStore(state => state.userId);
  const selectedGroupId = useGroupStore(state => state.selectedGroupId);
  const groupId = selectedGroupId ? Number(selectedGroupId) : undefined;
  const { data: choreData, isLoading, isError } = useChoreFromList(groupId, id);
  const { data: members } = useGroupMembers(selectedGroupId);
  const updateMutation = useUpdateChore();
  const deleteMutation = useRemoveChore();
  const { formData, errors, isDirty, initializeForm, updateField, getUpdateDto } = useChoreForm();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const {
    activeType,
    chatRoomOptions,
    openShare,
    closeShare,
    handleSelectChatRoom,
    isSharePending,
  } = useShareToMessenger('chore');

  const userOptions =
    members?.map(member => ({
      value: String(member.userId),
      label: member.user.nickname || member.user.name || `멤버 ${member.userId}`,
    })) ?? [];

  const isGroupAdmin =
    members?.some(member => member.userId === currentUserId && member.role === 'ADMIN') ?? false;
  const isSelectedGroupChore = Boolean(
    choreData && selectedGroupId && String(choreData.groupId) === selectedGroupId,
  );
  const isChoreCreator = Boolean(
    choreData && currentUserId && String(choreData.createdBy.userId) === currentUserId,
  );
  const canDeleteChore = isSelectedGroupChore && (isChoreCreator || isGroupAdmin);

  useEffect(() => {
    if (!choreData) return;

    initializeForm({
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
  }, [choreData, initializeForm]);

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
        // 실패 시 모달을 열어둔 채 사유를 모달 안에서 보여준다.
      },
    );
  };

  const handleCancelClick = () => {
    if (!isDirty) {
      navigate(-1);
      return;
    }
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    setIsCancelModalOpen(false);
    navigate(-1);
  };

  const handleDeleteClick = () => {
    if (!id || !canDeleteChore) return;
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!id || !canDeleteChore) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        navigate('/chores');
      },
      // 실패 시 모달을 열어둔 채 사유를 모달 안에서 보여준다.
    });
  };

  const handleShareClick = () => {
    if (!id) return;
    openShare(id);
  };

  if (isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-gray-500 font-semibold">데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (isError || !choreData) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-gray-500 font-semibold">집안일 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  if (String(choreData.groupId) !== selectedGroupId) {
    return <Navigate to="/chores" replace />;
  }

  return (
    <div className="h-fit flex w-full max-w-[1114px] flex-col pb-[16px] lg:pb-0 gap-4 lg:gap-[30px]">
      <ChoreFormFields
        formData={formData}
        errors={errors}
        assigneeOptions={userOptions}
        onChange={updateField}
      />
      <ChoreFormActions
        onSave={handleSaveClick}
        onCancel={handleCancelClick}
        onDelete={canDeleteChore ? handleDeleteClick : undefined}
        onShare={handleShareClick}
        isSubmitting={updateMutation.isPending || deleteMutation.isPending}
      />
      <ChoreDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        choreName={choreData.title}
        isDeleting={deleteMutation.isPending}
        errorMessage={
          deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : deleteMutation.isError
              ? '삭제에 실패했습니다. 다시 시도해 주세요.'
              : undefined
        }
      />
      <ChoreSaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onConfirm={handleConfirmSave}
        choreName={formData.title || choreData.title}
        isSaving={updateMutation.isPending}
        mode="update"
        errorMessage={
          updateMutation.error instanceof Error
            ? updateMutation.error.message
            : updateMutation.isError
              ? '수정에 실패했습니다. 다시 시도해 주세요.'
              : undefined
        }
      />
      <ChoreCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        isPending={updateMutation.isPending || deleteMutation.isPending}
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

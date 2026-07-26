import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChoreBasicInfo,
  ChoreFormActions,
  ChoreMemo,
  ChoreRepeat,
  useChoreFromList,
  useChoreForm,
  useUpdateChore,
} from '@/features/chore';
import type { ChoreApiCategory } from '@/features/chore';
import { useGroupMembers } from '@/features/member';
import { useGroupStore } from '@/shared/store';

export const ChoreEditPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const selectedGroupId = useGroupStore(state => state.selectedGroupId);
  const groupId = selectedGroupId ? Number(selectedGroupId) : undefined;
  const { data: choreData, isLoading, isError } = useChoreFromList(groupId, id);
  const { data: members } = useGroupMembers(selectedGroupId);
  const updateMutation = useUpdateChore();
  const { formData, updateField, getUpdateDto } = useChoreForm();

  const userOptions =
    members?.map(member => ({
      value: String(member.userId),
      label: member.user.name || member.user.nickname || `멤버 ${member.userId}`,
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

  const handleSave = () => {
    const dto = getUpdateDto();
    if (!dto || !id) return;

    updateMutation.mutate(
      { id, dto },
      {
        onSuccess: () => navigate('/chores'),
        onError: () => alert('수정에 실패했습니다. 다시 시도해 주세요.'),
      },
    );
  };

  const handleCancel = () => {
    if (confirm('수정을 취소하시겠습니까? 변경 사항이 저장되지 않습니다.')) {
      navigate(-1);
    }
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
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
};

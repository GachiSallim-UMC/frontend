import { useNavigate } from 'react-router-dom';
import {
  ChoreBasicInfo,
  ChoreFormActions,
  ChoreMemo,
  ChoreRepeat,
  useChoreForm,
  useCreateChore,
} from '@/features/chore';
import type { ChoreApiCategory } from '@/features/chore';
import { useGroupMembers } from '@/features/member';
import { useGroupStore } from '@/shared/store';

export const ChoreCreatePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateChore();
  const { formData, updateField, getCreateDto } = useChoreForm();
  const selectedGroupId = useGroupStore(state => state.selectedGroupId);
  const groupId = selectedGroupId ? Number(selectedGroupId) : undefined;
  const { data: members } = useGroupMembers(selectedGroupId);

  const userOptions =
    members?.map(member => ({
      value: String(member.userId),
      label: member.user.name || member.user.nickname || `멤버 ${member.userId}`,
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

  const handleSave = () => {
    if (!groupId || !Number.isSafeInteger(groupId)) {
      alert('선택된 그룹을 확인해 주세요.');
      return;
    }

    const dto = getCreateDto(groupId);
    if (!dto) return;

    createMutation.mutate(dto, {
      onSuccess: () => navigate('/chores'),
      onError: () => alert('등록에 실패했습니다. 다시 시도해 주세요.'),
    });
  };

  const handleCancel = () => {
    if (confirm('작성 중인 내용이 모두 사라집니다. 취소하시겠습니까?')) {
      navigate(-1);
    }
  };

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
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
};

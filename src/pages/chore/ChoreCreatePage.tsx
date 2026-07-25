import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ChoreBasicInfo,
  ChoreFormActions,
  ChoreMemo,
  ChoreRepeat,
  CreateChoreDto,
  useChoreForm,
  useCreateChore,
} from '@/features/chore';
import { useGroupMembers, useMyGroups } from '@/features/member';

export const ChoreCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createMutation = useCreateChore();
  const { formData, updateField, getCreateDto } = useChoreForm();

  const { data: myGroups } = useMyGroups();
  const currentGroupId = myGroups?.[0]?.id;

  const { data: members } = useGroupMembers(currentGroupId);

  const userOptions =
    members?.map(member => ({
      value: String(member.userId),
      label: member.name,
    })) || [];

  const handleSave = () => {
    const rawDto = getCreateDto(Number(currentGroupId));
    if (!rawDto) return;

    console.log('현재 전송되는 assigneeId 값:', rawDto.assigneeId);
    console.log('현재 선택된 폼 전체 데이터:', formData);

    const isWeeklyCondition =
      rawDto.repeatType === 'WEEKLY' ||
      (rawDto.repeatType === 'CUSTOM' && formData.customOption === 'EVERY_N_WEEKS');

    const submitDto = {
      ...rawDto,

      startDate: rawDto.startDate ? String(rawDto.startDate).replace(/\//g, '-') : '',
      dueDate: rawDto.dueDate ? String(rawDto.dueDate).replace(/\//g, '-') : undefined,
      repeatDays: isWeeklyCondition ? rawDto.repeatDays || [] : [],
    };

    if (!submitDto.title || !submitDto.category || !submitDto.repeatType || !submitDto.startDate) {
      alert('제목, 카테고리, 반복 유형, 시작일을 모두 작성해주세요.');
      return;
    }

    createMutation.mutate(submitDto as CreateChoreDto, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['chores'] });
        navigate('/chores');
      },
      onError: error => {
        console.error(error);
        alert('등록에 실패했습니다. 다시 시도해 주세요.');
      },
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
        title={formData.title || ''}
        assigneeId={String(formData.assigneeId || '')}
        category={formData.category || ''}
        assigneeOptions={userOptions}
        onChange={updateField as any}
      />
      <ChoreRepeat
        repeatType={formData.repeatType || ''}
        customOption={formData.customOption || ''}
        repeatInterval={formData.repeatInterval || ''}
        repeatDays={formData.repeatDays || []}
        startDate={formData.startDate || ''}
        dueDate={formData.dueDate || ''}
        onChange={updateField}
      />
      <ChoreMemo value={formData.memo || ''} onChange={memo => updateField({ memo })} />
      <ChoreFormActions
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
};

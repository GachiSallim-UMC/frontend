import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ChoreBasicInfo,
  ChoreFormActions,
  ChoreMemo,
  ChoreRepeat,
  useChoreDetail,
  useUpdateChore,
  useChoreForm,
} from '@/features/chore';

import { useGroupMembers, useMyGroups } from '@/features/member';

export const ChoreEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: choreData, isLoading } = useChoreDetail(id || '');
  const updateMutation = useUpdateChore();

  const { data: myGroups } = useMyGroups();
  const currentGroupId = myGroups?.[0]?.id;
  const { data: members } = useGroupMembers(currentGroupId);

  const userOptions =
    members?.map(member => ({
      value: String(member.userId),
      label: member.name,
    })) || [];

  const { formData, updateField, getUpdateDto } = useChoreForm();

  useEffect(() => {
    if (choreData) {
      updateField({
        title: choreData.title,
        assigneeId: choreData.assignee?.userId,
        category: choreData.category,
        repeatType: choreData.repeatType,
        repeatDays: choreData.repeatDays,
        startDate: choreData.startDate,
        dueDate: choreData.dueDate,
        memo: choreData.memo,
      });
    }
  }, [choreData]);

  const handleSave = () => {
    const rawDto = getUpdateDto();
    if (!rawDto || !id) return;

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

    updateMutation.mutate(
      { id, dto: submitDto },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['chores'] });
          alert('수정이 완료되었습니다!');
          navigate('/chores');
        },
        onError: error => {
          console.error(error);
          alert('수정에 실패했습니다. 다시 시도해 주세요.');
        },
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
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
};

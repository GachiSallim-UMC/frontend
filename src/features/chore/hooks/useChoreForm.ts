import { useCallback, useEffect, useState } from 'react';
import type {
  ChoreApiCategory,
  ChoreApiCustomOption,
  ChoreApiDayOfWeek,
  ChoreApiRepeatType,
  CreateChoreDto,
  UpdateChoreDto,
} from '../types/chore.types';

interface ChoreFormState {
  title: string;
  assigneeId: number | '';
  category: ChoreApiCategory | '';
  repeatType: ChoreApiRepeatType | '';
  customOption: ChoreApiCustomOption | '';
  repeatInterval: string;
  repeatDays: ChoreApiDayOfWeek[];
  startDate: string;
  dueDate: string;
  memo: string;
}

const INITIAL_FORM: ChoreFormState = {
  title: '',
  assigneeId: '',
  category: '',
  repeatType: '',
  customOption: '',
  repeatInterval: '',
  repeatDays: [],
  startDate: '',
  dueDate: '',
  memo: '',
};

const usesRepeatInterval = (customOption: ChoreApiCustomOption | '') =>
  customOption === 'EVERY_N_DAYS' ||
  customOption === 'EVERY_N_WEEKS' ||
  customOption === 'EVERY_N_MONTHS';

export const useChoreForm = (initialData?: Partial<ChoreFormState>) => {
  const [formData, setFormData] = useState<ChoreFormState>({
    ...INITIAL_FORM,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(previous => ({ ...previous, ...initialData }));
    }
  }, [initialData]);

  const updateField = useCallback((updates: Partial<ChoreFormState>) => {
    setFormData(previous => ({ ...previous, ...updates }));
  }, []);

  const getCommonDto = (): UpdateChoreDto | null => {
    const { title, assigneeId, category, repeatType, startDate } = formData;
    if (!title.trim() || !assigneeId || !category || !repeatType || !startDate) {
      alert('제목, 담당자, 카테고리, 반복 유형, 시작일을 모두 작성해 주세요.');
      return null;
    }

    if (repeatType === 'CUSTOM' && !formData.customOption) {
      alert('사용자 지정 반복 방식을 선택해 주세요.');
      return null;
    }

    const needsInterval = repeatType === 'CUSTOM' && usesRepeatInterval(formData.customOption);
    const repeatInterval = needsInterval ? Number(formData.repeatInterval) : undefined;
    if (
      needsInterval &&
      (!Number.isInteger(repeatInterval) || repeatInterval! < 1 || repeatInterval! > 99)
    ) {
      alert('반복 간격은 1부터 99 사이의 정수로 입력해 주세요.');
      return null;
    }

    const needsDays =
      repeatType === 'WEEKLY' ||
      (repeatType === 'CUSTOM' && formData.customOption === 'SPECIFIC_DAYS');
    if (needsDays && formData.repeatDays.length === 0) {
      alert('반복할 요일을 한 개 이상 선택해 주세요.');
      return null;
    }

    return {
      title: title.trim(),
      category,
      assigneeId: Number(assigneeId),
      startDate,
      dueDate: formData.dueDate || undefined,
      repeatType,
      customOption: repeatType === 'CUSTOM' ? formData.customOption || undefined : undefined,
      repeatInterval,
      repeatDays: needsDays ? formData.repeatDays : undefined,
      memo: formData.memo.trim() || undefined,
    };
  };

  const getCreateDto = (groupId: number): CreateChoreDto | null => {
    const dto = getCommonDto();
    return dto ? { groupId, ...dto } : null;
  };

  return {
    formData,
    updateField,
    getCreateDto,
    getUpdateDto: getCommonDto,
  };
};

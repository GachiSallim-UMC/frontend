import { useCallback, useEffect, useState } from 'react';
import type {
  ChoreApiCategory,
  ChoreApiCustomOption,
  ChoreApiDayOfWeek,
  ChoreApiRepeatType,
  CreateChoreDto,
  UpdateChoreDto,
} from '../types/chore.types';
import { isValidDateOnly } from '@/shared/lib/inputValidation';

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

export type ChoreFormErrors = Partial<
  Record<
    | 'title'
    | 'assigneeId'
    | 'category'
    | 'repeatType'
    | 'customOption'
    | 'repeatInterval'
    | 'repeatDays'
    | 'startDate'
    | 'dueDate'
    | 'memo',
    string
  >
>;

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
  const [errors, setErrors] = useState<ChoreFormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData(previous => ({ ...previous, ...initialData }));
    }
  }, [initialData]);

  const updateField = useCallback((updates: Partial<ChoreFormState>) => {
    setFormData(previous => ({ ...previous, ...updates }));
    setErrors(previous => {
      const next = { ...previous };
      Object.keys(updates).forEach(key => {
        delete next[key as keyof ChoreFormErrors];
      });
      return next;
    });
  }, []);

  const getCommonDto = (): UpdateChoreDto | null => {
    const { title, assigneeId, category, repeatType, startDate, dueDate } = formData;
    const nextErrors: ChoreFormErrors = {};

    if (!title.trim()) nextErrors.title = '집안일 이름을 입력해 주세요.';
    else if (title.trim().length > 100) nextErrors.title = '집안일 이름은 100자 이하로 입력해 주세요.';
    if (!assigneeId) nextErrors.assigneeId = '담당자를 선택해 주세요.';
    if (!category) nextErrors.category = '카테고리를 선택해 주세요.';
    if (!repeatType) nextErrors.repeatType = '반복 유형을 선택해 주세요.';
    if (!startDate) nextErrors.startDate = '시작일을 선택해 주세요.';
    else if (!isValidDateOnly(startDate)) nextErrors.startDate = '올바른 시작일을 선택해 주세요.';
    if (dueDate && !isValidDateOnly(dueDate)) {
      nextErrors.dueDate = '올바른 종료일을 선택해 주세요.';
    } else if (startDate && dueDate && dueDate < startDate) {
      nextErrors.dueDate = '종료일은 시작일보다 빠를 수 없습니다.';
    }
    if (formData.memo.length > 255) {
      nextErrors.memo = '메모는 255자 이하로 입력해 주세요.';
    }

    if (repeatType === 'CUSTOM' && !formData.customOption) {
      nextErrors.customOption = '사용자 지정 옵션을 선택해 주세요.';
    }

    const needsInterval = repeatType === 'CUSTOM' && usesRepeatInterval(formData.customOption);
    const repeatInterval = needsInterval ? Number(formData.repeatInterval) : undefined;
    if (
      needsInterval &&
      (!Number.isInteger(repeatInterval) || repeatInterval! < 1 || repeatInterval! > 99)
    ) {
      nextErrors.repeatInterval = '반복 간격은 1부터 99 사이의 정수로 입력해 주세요.';
    }

    const needsDays =
      repeatType === 'WEEKLY' ||
      (repeatType === 'CUSTOM' && formData.customOption === 'SPECIFIC_DAYS');
    if (needsDays && formData.repeatDays.length === 0) {
      nextErrors.repeatDays = '반복할 요일을 한 개 이상 선택해 주세요.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return null;
    }
    if (!assigneeId || !category || !repeatType || !startDate) return null;

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
    errors,
    updateField,
    getCreateDto,
    getUpdateDto: getCommonDto,
  };
};

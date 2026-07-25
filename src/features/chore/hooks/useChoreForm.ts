import { useEffect, useState } from 'react';
import type {
  UpdateChoreDto,
  ChoreCategory,
  RepeatType,
  CustomOption,
  CreateChoreDto,
} from '../types/chore.types';

type ChoreFormState = Omit<CreateChoreDto, 'groupId' | 'category' | 'repeatType' | 'assigneeId'> & {
  category?: ChoreCategory | '';
  repeatType?: RepeatType | '';
  customOption?: CustomOption | '';
  repeatInterval?: string;
  assigneeId?: number | '';
};

export const useChoreForm = (initialData?: Partial<ChoreFormState>) => {
  const [formData, setFormData] = useState<ChoreFormState>({
    title: '',
    assigneeId: '',
    category: '',
    repeatType: '',
    repeatDays: [],
    startDate: '',
    dueDate: '',
    memo: '',
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [JSON.stringify(initialData)]);

  const updateField = (updates: Partial<ChoreFormState>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const getCreateDto = (groupId: number): CreateChoreDto | null => {
    if (!formData.title || !formData.assigneeId || !formData.category || !formData.repeatType) {
      alert('필수 항목을 모두 입력하세요.');
      return null;
    }

    const { customOption, repeatInterval, assigneeId, category, repeatType, ...restData } =
      formData;
    return {
      ...restData,
      groupId,
      assigneeId: Number(assigneeId),
      category: category as ChoreCategory,
      repeatType: repeatType as RepeatType,
    };
  };

  const getUpdateDto = (): UpdateChoreDto | null => {
    if (!formData.title || !formData.assigneeId || !formData.category || !formData.repeatType) {
      alert('필수 항목을 모두 입력하세요.');
      return null;
    }

    const { customOption, repeatInterval, assigneeId, category, repeatType, ...restData } =
      formData;
    return {
      ...restData,
      assigneeId: Number(assigneeId),
      category: category as ChoreCategory,
      repeatType: repeatType as RepeatType,
    };
  };

  return {
    formData,
    updateField,
    getCreateDto,
    getUpdateDto,
  };
};

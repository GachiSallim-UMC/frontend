import { ChoreBasicInfo } from '@/features/chore/components/ChoreBasicInfo';
import { ChoreMemo } from '@/features/chore/components/ChoreMemo';
import { ChoreRepeat } from '@/features/chore/components/ChoreRepeat';
import type { ChoreFormErrors, ChoreFormState } from '@/features/chore/hooks/useChoreForm';
import type { ChoreApiCategory } from '@/features/chore/types/chore.types';

interface ChoreAssigneeOption {
  value: string;
  label: string;
}

interface ChoreFormFieldsProps {
  formData: ChoreFormState;
  errors: ChoreFormErrors;
  assigneeOptions: ChoreAssigneeOption[];
  onChange: (updates: Partial<ChoreFormState>) => void;
}

export const ChoreFormFields = ({
  formData,
  errors,
  assigneeOptions,
  onChange,
}: ChoreFormFieldsProps) => {
  const handleBasicInfoChange = (
    updates: Partial<{
      title: string;
      assigneeId: string;
      category: ChoreApiCategory | '';
    }>,
  ) => {
    const { assigneeId, ...rest } = updates;
    onChange({
      ...rest,
      ...(assigneeId !== undefined
        ? { assigneeId: assigneeId === '' ? '' : Number(assigneeId) }
        : {}),
    });
  };

  return (
    <>
      <ChoreBasicInfo
        title={formData.title}
        assigneeId={String(formData.assigneeId)}
        category={formData.category}
        assigneeOptions={assigneeOptions}
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
        onChange={onChange}
      />
      <ChoreMemo value={formData.memo} error={errors.memo} onChange={memo => onChange({ memo })} />
    </>
  );
};

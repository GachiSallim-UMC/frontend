import { FormInput, SelectDropdown } from '@/shared/components';
import type { ChoreApiCategory as ChoreCategory } from '../types/chore.types';
import type { ChoreFormErrors } from '../hooks/useChoreForm';
import { CATEGORY_OPTIONS } from '../constants/chore.constants';

interface ChoreBasicInfoProps {
  title: string;
  assigneeId: string;
  category: ChoreCategory | '';
  assigneeOptions: { value: string; label: string }[];
  errors?: ChoreFormErrors;
  onChange: (
    updates: Partial<{ title: string; assigneeId: string; category: ChoreCategory | '' }>,
  ) => void;
}

export const ChoreBasicInfo = ({
  title,
  assigneeId,
  category,
  assigneeOptions,
  errors = {},
  onChange,
}: ChoreBasicInfoProps) => {
  return (
    <section className="flex w-full flex-col rounded-2xl bg-white p-[32px]">
      <h2 className="mb-[24px] text-[18px] font-bold text-gray-800">기본 정보</h2>

      <div className="flex flex-col gap-[20px]">
        <FormInput
          label="집안일 이름"
          required
          maxLength={100}
          placeholder="예: 화장실 청소, 설거지, 분리수거"
          value={title || ''}
          onChange={e => onChange({ title: e.target.value })}
          error={errors.title}
        />

        <div className="flex w-full gap-[20px]">
          <div className="flex-1">
            <SelectDropdown
              label="담당자"
              required
              placeholder="담당자 선택"
              options={assigneeOptions}
              value={assigneeId}
              onChange={value => onChange({ assigneeId: value })}
              error={errors.assigneeId}
            />
          </div>

          <div className="flex-1">
            <SelectDropdown<ChoreCategory>
              label="카테고리"
              required
              placeholder="카테고리를 선택해 주세요"
              options={CATEGORY_OPTIONS as { value: ChoreCategory; label: string }[]}
              value={category}
              onChange={value => onChange({ category: value })}
              error={errors.category}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

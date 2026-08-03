import type { AddGroupDto } from '@/features/member/types/member.types';
import { FormInput, SelectDropdown } from '@/shared/components';
import PlusIcon from '@/assets/icons/member/plus-circle.svg?react';
import MinusIcon from '@/assets/icons/member/minus.svg?react';
import { RESIDENCE_OPTIONS } from '../../constants/member.constants';

interface AddGroupInputProps {
  formData: AddGroupDto;
  onChange: (field: keyof AddGroupDto, value: string | number) => void;
  errors?: Partial<Record<keyof AddGroupDto, string>>;
  disabled?: boolean;
}

export const AddGroupInput = ({
  formData,
  onChange,
  errors = {},
  disabled = false,
}: AddGroupInputProps) => {
  const handleDecrease = () => {
    if (formData.maxMemberCount > 2) {
      onChange('maxMemberCount', formData.maxMemberCount - 1);
    }
  };

  const handleIncrease = () => {
    if (formData.maxMemberCount < 12) {
      onChange('maxMemberCount', formData.maxMemberCount + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-base font-bold text-gray-800">
          그룹 이름 <span className="text-red-700">*</span>
        </label>
        <FormInput
          type="text"
          value={formData.name}
          onChange={e => onChange('name', e.target.value)}
          disabled={disabled}
          placeholder="예: 우리집 룸메이트, 대학원 쉐어하우스"
          maxLength={40}
          error={errors.name}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-base font-bold text-gray-800">그룹 설명</label>
        <FormInput
          type="text"
          value={formData.description}
          onChange={e => onChange('description', e.target.value)}
          disabled={disabled}
          placeholder="그룹에 대한 간단한 설명 (선택)"
          maxLength={255}
          error={errors.description}
        />
      </div>

      <div className="mb-5 flex gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <label className="text-base font-bold text-gray-800">
            거주 유형 <span className="text-red-700">*</span>
          </label>
          <div className="relative">
            <SelectDropdown
              value={formData.type}
              placeholder="거주 유형을 선택해 주세요"
              options={RESIDENCE_OPTIONS}
              onChange={value => onChange('type', value)}
              disabled={disabled}
              error={errors.type}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <label className="text-base font-bold text-gray-800">
            최대 인원 <span className="text-red-700">*</span>
          </label>
          <div className={`flex w-full h-[50px] items-center justify-between rounded-lg border p-4 ${errors.maxMemberCount ? 'border-red-500' : 'border-gray-100'}`}>
            <button
              type="button"
              onClick={handleDecrease}
              disabled={disabled || formData.maxMemberCount <= 2}
              className={formData.maxMemberCount <= 2 ? 'opacity-45 cursor-not-allowed' : ''}
            >
              <MinusIcon className="h-6 w-6"></MinusIcon>
            </button>

            <span className="text-base text-gray-900">{formData.maxMemberCount}</span>

            <button
              type="button"
              onClick={handleIncrease}
              disabled={disabled || formData.maxMemberCount >= 12}
              className={formData.maxMemberCount >= 12 ? 'opacity-45 cursor-not-allowed' : ''}
            >
              <PlusIcon className="h-6 w-6"></PlusIcon>
            </button>
          </div>
          {errors.maxMemberCount && <p className="text-xs text-red-500">{errors.maxMemberCount}</p>}
        </div>
      </div>
    </div>
  );
};

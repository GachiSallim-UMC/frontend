import type { AddGroupDto } from '@/features/member/types/member.types';
import { FormInput, SelectDropdown } from '@/shared/components';
import PlusIcon from '@/assets/icons/member/plus-circle.svg?react';
import MinusIcon from '@/assets/icons/member/minus.svg?react';
import { RESIDENCE_OPTIONS } from '../../constants/member.constants';

interface AddGroupInputProps {
  formData: AddGroupDto;
  onChange: (field: keyof AddGroupDto, value: string | number) => void;
  disabled?: boolean;
}

export const AddGroupInput = ({ formData, onChange, disabled = false }: AddGroupInputProps) => {
  const handleDecrease = () => {
    if (formData.maxMemberCount > 1) {
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
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <label className="text-base font-bold text-gray-800">
            최대 인원 <span className="text-red-700">*</span>
          </label>
          <div className="flex w-full h-[50px] items-center justify-between rounded-lg border border-gray-100 p-4">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={disabled || formData.maxMemberCount <= 1}
              className={formData.maxMemberCount <= 1 ? 'opacity-45 cursor-not-allowed' : ''}
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
        </div>
      </div>
    </div>
  );
};

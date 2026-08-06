import type { AddGroupDto } from '@/features/member/types/member.types';
import { FormInput, SelectDropdown } from '@/shared/components';
import { RESIDENCE_OPTIONS } from '../../constants/member.constants';

/** 최대 인원 2~12명. 디자인상 드롭다운으로 고릅니다. */
const MAX_MEMBER_OPTIONS = Array.from({ length: 11 }, (_, index) => {
  const count = index + 2;
  return { value: String(count), label: `${count}명` };
});

const labelClass = 'text-mobile-body font-bold text-gray-700 lg:text-base lg:text-gray-800';

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
}: AddGroupInputProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <label className={labelClass}>
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
      <label className={labelClass}>그룹 설명</label>
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

    <div className="flex gap-4 lg:mb-5">
      <div className="flex flex-1 flex-col gap-2">
        <label className={labelClass}>
          거주 유형 <span className="text-red-700">*</span>
        </label>
        <SelectDropdown
          value={formData.type}
          placeholder="선택"
          options={RESIDENCE_OPTIONS}
          onChange={value => onChange('type', value)}
          disabled={disabled}
          error={errors.type}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <label className={labelClass}>
          최대 인원 <span className="text-red-700">*</span>
        </label>
        <SelectDropdown
          value={String(formData.maxMemberCount)}
          placeholder="선택"
          options={MAX_MEMBER_OPTIONS}
          onChange={value => onChange('maxMemberCount', Number(value))}
          disabled={disabled}
          error={errors.maxMemberCount}
        />
      </div>
    </div>
  </div>
);

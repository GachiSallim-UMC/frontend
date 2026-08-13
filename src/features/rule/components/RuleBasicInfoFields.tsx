import { FormInput, SelectDropdown, TextArea } from '@/shared/components/form';
import { Panel } from '@/shared/components/layout';
import type { RuleStatus } from '@/shared/types';
import {
  RULE_CATEGORY_OPTIONS,
  RULE_STATUS_OPTIONS,
} from '@/features/rule/constants/rule.constants';
import type { RuleFormErrors, RuleFormValues } from '@/features/rule/lib/ruleFormValidation';

interface RuleBasicInfoFieldsProps extends RuleFormValues {
  errors: RuleFormErrors;
  status?: RuleStatus;
  titlePlaceholder?: string;
  onTitleChange: (value: string) => void;
  onCategoryChange: (value: RuleFormValues['category']) => void;
  onContentChange: (value: string) => void;
}

export const RuleBasicInfoFields = ({
  title,
  category,
  content,
  errors,
  status,
  titlePlaceholder,
  onTitleChange,
  onCategoryChange,
  onContentChange,
}: RuleBasicInfoFieldsProps) => (
  <Panel
    title="기본 정보"
    className="h-auto rounded-none p-0 shadow-none lg:min-h-[500px] lg:rounded-[18px] lg:p-[32px]"
    headerClassName="hidden lg:mb-6 lg:flex"
    titleClassName="text-gray-800"
  >
    <div className="grid grid-cols-2 gap-x-2 gap-y-4 lg:grid-cols-1 lg:gap-5">
      <FormInput
        label="규칙 제목"
        required
        maxLength={30}
        placeholder={titlePlaceholder}
        value={title}
        onChange={event => onTitleChange(event.target.value)}
        error={errors.title}
        containerClassName="order-1 col-span-2 gap-2 lg:col-span-1 lg:gap-1"
        labelClassName="leading-[17px] text-gray-800"
        className="h-11 px-4 text-mobile-label lg:h-[50px] lg:text-button"
      />
      <SelectDropdown
        label="카테고리"
        required
        value={category}
        onChange={onCategoryChange}
        options={RULE_CATEGORY_OPTIONS}
        placeholder="카테고리 선택"
        error={errors.category}
        containerClassName="order-2 gap-2 lg:gap-1"
        labelClassName="leading-[17px] text-gray-800"
        className="h-11 px-4 text-mobile-label lg:h-[50px] lg:px-3 lg:text-button"
      />
      <TextArea
        label="상세 설명"
        mobileLabel="메모"
        required
        placeholder="규칙에 대한 자세한 설명, 예외 상황 등"
        maxLength={200}
        showCount
        countInside
        countClassName="hidden lg:block"
        value={content}
        onChange={event => onContentChange(event.target.value)}
        error={errors.content}
        containerClassName="order-4 col-span-2 gap-2 lg:order-3 lg:col-span-1 lg:gap-1"
        labelClassName="leading-[17px] text-gray-800"
        className="block h-[88px] px-4 py-3 text-mobile-label lg:h-[100px] lg:pb-9 lg:pt-4 lg:text-button"
      />
      {status && (
        <SelectDropdown
          label="적용 상태"
          value={status}
          onChange={() => undefined}
          options={RULE_STATUS_OPTIONS}
          disabled
          containerClassName="order-3 gap-2 lg:order-4 lg:gap-1"
          labelClassName="leading-[17px] text-gray-800"
          className="h-11 px-4 text-mobile-label lg:h-[50px] lg:px-3 lg:text-button"
        />
      )}
    </div>
  </Panel>
);

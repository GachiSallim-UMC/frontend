import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RULE_CATEGORY_OPTIONS, RULE_STATUS_OPTIONS, useRuleForm } from '@/features/rule';
import { FormActions } from '@/shared/components/ui';
import { FormInput, SelectDropdown, TextArea } from '@/shared/components/form';
import { Panel } from '@/shared/components/layout';

type FormErrors = Partial<Record<'title' | 'category' | 'status', string>>;

export const RuleFormPage = () => {
  const navigate = useNavigate();
  const { title, setTitle, category, setCategory, content, setContent, status, setStatus } =
    useRuleForm();
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSave = () => {
    const nextErrors: FormErrors = {};
    if (!title.trim()) nextErrors.title = '규칙 제목을 입력해 주세요.';
    if (!category) nextErrors.category = '카테고리를 선택해 주세요.';
    if (!status) nextErrors.status = '적용 상태를 선택해 주세요.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    navigate('/rules');
  };

  return (
    <div className="mx-auto mt-16 w-full max-w-[1114px] min-[1440px]:w-[calc(100%-18px)] min-[1440px]:max-w-none">
      <div className="flex min-w-0 flex-col gap-5">
        <Panel
          title="기본 정보"
          className="h-[500px] rounded-[18px] p-[30px] shadow-none"
          headerClassName="mb-5"
          titleClassName="text-gray-800"
        >
          <div className="grid gap-5">
            <FormInput
              label="규칙 제목"
              required
              placeholder="예: 밤 11시 이후 조용히 하기"
              value={title}
              onChange={e => setTitle(e.target.value)}
              error={errors.title}
              containerClassName="gap-1"
              labelClassName="leading-[17px] text-gray-800"
              className="px-4"
            />
            <SelectDropdown
              label="카테고리"
              required
              value={category}
              onChange={setCategory}
              options={RULE_CATEGORY_OPTIONS}
              placeholder="카테고리 선택"
              error={errors.category}
              containerClassName="gap-1"
              labelClassName="leading-[17px] text-gray-800"
            />
            <TextArea
              label="상세 설명"
              placeholder="규칙에 대한 자세한 설명, 예외 상황 등"
              maxLength={200}
              showCount
              countInside
              value={content}
              onChange={e => setContent(e.target.value)}
              containerClassName="gap-1"
              labelClassName="leading-[17px] text-gray-800"
              className="block h-[100px] px-4 pb-9 pt-4"
            />
            <SelectDropdown
              label="적용 상태"
              required
              value={status}
              onChange={setStatus}
              options={RULE_STATUS_OPTIONS}
              error={errors.status}
              containerClassName="gap-1"
              labelClassName="leading-[17px] text-gray-800"
            />
          </div>
        </Panel>

        <FormActions onSave={handleSave} onCancel={() => navigate(-1)} />
      </div>
    </div>
  );
};

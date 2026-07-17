import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RULE_CATEGORY_OPTIONS, useRuleForm } from '@/features/rule';
import { FormActions } from '@/shared/components/ui';
import { FormInput, SelectDropdown, TextArea } from '@/shared/components/form';
import { Panel } from '@/shared/components/layout';

type FormErrors = Partial<Record<'title' | 'category', string>>;

export const RuleFormPage = () => {
  const navigate = useNavigate();
  const { title, setTitle, category, setCategory, content, setContent } = useRuleForm();
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSave = () => {
    const nextErrors: FormErrors = {};
    if (!title.trim()) nextErrors.title = '규칙 제목을 입력해 주세요.';
    if (!category) nextErrors.category = '카테고리를 선택해 주세요.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    navigate('/rules');
  };

  return (
    <Panel title="기본 정보" className="mt-7 rounded-[18px]">
      <div className="grid gap-4">
        <FormInput
          label="규칙 제목"
          required
          placeholder="예: 밤 11시 이후 조용히 하기"
          value={title}
          onChange={e => setTitle(e.target.value)}
          error={errors.title}
        />
        <SelectDropdown
          label="카테고리"
          required
          value={category}
          onChange={setCategory}
          options={RULE_CATEGORY_OPTIONS}
          placeholder="카테고리 선택"
          error={errors.category}
        />
        <TextArea
          label="상세 설명"
          placeholder="규칙에 대한 자세한 설명, 예외 상황 등"
          rows={4}
          maxLength={200}
          showCount
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>

      <FormActions className="mt-6" onSave={handleSave} onCancel={() => navigate(-1)} />
    </Panel>
  );
};

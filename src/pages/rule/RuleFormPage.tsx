import { useNavigate } from 'react-router-dom';
import { RULE_CATEGORY_OPTIONS, useRuleForm } from '@/features/rule';
import { Button, ShareMessengerButton } from '@/shared/components/ui';
import { FormInput, SelectDropdown, TextArea } from '@/shared/components/form';
import { Panel } from '@/shared/components/layout';

export const RuleFormPage = () => {
  const navigate = useNavigate();
  const { title, setTitle, category, setCategory, content, setContent } = useRuleForm();

  return (
    <Panel title="기본 정보" className="mt-7 rounded-[18px]">
      <div className="grid gap-4">
        <FormInput
          label="규칙 제목"
          required
          placeholder="예: 밤 11시 이후 조용히 하기"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <SelectDropdown
          label="카테고리"
          required
          value={category}
          onChange={setCategory}
          options={RULE_CATEGORY_OPTIONS}
          placeholder="카테고리 선택"
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

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={() => navigate('/rules')}>저장</Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            취소
          </Button>
        </div>
        <ShareMessengerButton />
      </div>
    </Panel>
  );
};

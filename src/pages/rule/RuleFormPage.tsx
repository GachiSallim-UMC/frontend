import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RuleBasicInfoFields, useCreateRule, useRuleEditor } from '@/features/rule';
import RuleIcon from '@/assets/icons/sidebar/rules.svg?react';
import { Button, ConfirmModal, FormActions } from '@/shared/components/ui';

export const RuleFormPage = () => {
  const navigate = useNavigate();
  const { title, category, content, validate, fieldProps } = useRuleEditor();
  const createRule = useCreateRule();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const mutationError = createRule.error;

  const handleSubmitClick = () => {
    if (createRule.isPending) return;

    if (!validate() || !category) return;

    setIsSaveModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!category) return;

    try {
      await createRule.mutateAsync({
        title: trimmedTitle,
        category,
        content: content.trim(),
      });
      setIsSaveModalOpen(false);
      navigate('/rules');
    } catch {
      // 실패 시 모달을 열어둔 채 errorMessage로 사유를 보여준다.
    }
  };

  return (
    <div className="min-h-full w-full bg-white pb-6 lg:min-h-0 lg:max-w-[1114px] lg:bg-transparent lg:p-0">
      <div className="flex min-w-0 flex-col gap-4 lg:gap-[30px]">
        <RuleBasicInfoFields {...fieldProps} titlePlaceholder="예: 밤 11시 이후 조용히 하기" />

        {mutationError && (
          <p className="text-caption text-red-500">
            {mutationError instanceof Error
              ? mutationError.message
              : '생활규칙 요청을 처리하지 못했습니다.'}
          </p>
        )}

        <FormActions
          onSave={handleSubmitClick}
          onCancel={() => navigate(-1)}
          rightSlot={null}
          className="hidden lg:flex"
        />

        <div className="flex flex-col gap-2.5 lg:hidden">
          <Button
            type="button"
            className="h-11 w-full text-mobile-label font-bold"
            onClick={handleSubmitClick}
            disabled={createRule.isPending}
          >
            저장
          </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onConfirm={() => void handleConfirmSubmit()}
        icon={<RuleIcon className="size-6" />}
        title="생활 규칙을 등록할까요?"
        highlight={title.trim()}
        description="내용으로 생활 규칙을 등록합니다."
        isPending={createRule.isPending}
        errorMessage={mutationError instanceof Error ? mutationError.message : undefined}
      />
    </div>
  );
};

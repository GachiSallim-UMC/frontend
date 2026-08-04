import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RULE_CATEGORY_OPTIONS,
  RULE_STATUS_OPTIONS,
  useCreateRule,
  useRuleForm,
  useShareRule,
  useUpdateRule,
} from '@/features/rule';
import RuleIcon from '@/assets/icons/sidebar/rules-active.svg?react';
import { Button, ConfirmModal, FormActions, ShareMessengerButton } from '@/shared/components/ui';
import { FormInput, SelectDropdown, TextArea } from '@/shared/components/form';
import { Panel } from '@/shared/components/layout';

type FormErrors = Partial<Record<'title' | 'category' | 'content' | 'status', string>>;

export const RuleFormPage = () => {
  const navigate = useNavigate();
  const { title, setTitle, category, setCategory, content, setContent, status, setStatus } =
    useRuleForm();
  const createRule = useCreateRule();
  const updateRule = useUpdateRule();
  const shareRule = useShareRule();
  const [errors, setErrors] = useState<FormErrors>({});
  const [pendingShare, setPendingShare] = useState<boolean | null>(null);
  const mutationError = createRule.error ?? updateRule.error ?? shareRule.error;

  const handleSubmitClick = (shareAfterSave: boolean) => {
    if (createRule.isPending || updateRule.isPending || shareRule.isPending) return;

    const nextErrors: FormErrors = {};
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      nextErrors.title = '규칙 제목을 입력해 주세요.';
    } else if (trimmedTitle.length > 30) {
      nextErrors.title = '규칙 제목은 30자 이하로 입력해 주세요.';
    }
    if (!category) nextErrors.category = '카테고리를 선택해 주세요.';
    if (!content.trim()) nextErrors.content = '상세 설명을 입력해 주세요.';
    if (!status) nextErrors.status = '적용 상태를 선택해 주세요.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !category || !status) return;

    setPendingShare(shareAfterSave);
  };

  const handleConfirmSubmit = async () => {
    const trimmedTitle = title.trim();
    const shareAfterSave = pendingShare === true;
    if (!category || !status) return;

    try {
      const created = await createRule.mutateAsync({
        title: trimmedTitle,
        category,
        content: content.trim(),
      });
      if (status !== 'active') {
        await updateRule.mutateAsync({
          id: String(created.ruleId),
          dto: {
            title: trimmedTitle,
            category,
            content: content.trim(),
            status,
          },
        });
      }
      if (shareAfterSave) {
        try {
          await shareRule.mutateAsync(String(created.ruleId));
        } finally {
          navigate('/rules');
        }
        return;
      }
      setPendingShare(null);
      navigate('/rules');
    } catch {
      // mutationError를 폼 하단에 표시한다.
    }
  };

  return (
    <div className="min-h-full w-full bg-white pb-6 lg:min-h-0 lg:max-w-[1114px] lg:bg-transparent lg:p-0">
      <div className="flex min-w-0 flex-col gap-4 lg:gap-[30px]">
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
              placeholder="예: 밤 11시 이후 조용히 하기"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                setErrors(previous => ({ ...previous, title: undefined }));
              }}
              error={errors.title}
              containerClassName="order-1 col-span-2 gap-2 lg:col-span-1 lg:gap-1"
              labelClassName="leading-[17px] text-gray-800"
              className="h-11 px-4 text-mobile-label lg:h-[50px] lg:text-button"
            />
            <SelectDropdown
              label="카테고리"
              required
              value={category}
              onChange={value => {
                setCategory(value);
                setErrors(previous => ({ ...previous, category: undefined }));
              }}
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
              onChange={e => {
                setContent(e.target.value);
                setErrors(previous => ({ ...previous, content: undefined }));
              }}
              error={errors.content}
              containerClassName="order-4 col-span-2 gap-2 lg:order-3 lg:col-span-1 lg:gap-1"
              labelClassName="leading-[17px] text-gray-800"
              className="block h-[88px] px-4 py-3 text-mobile-label lg:h-[100px] lg:pb-9 lg:pt-4 lg:text-button"
            />
            <SelectDropdown
              label="적용 상태"
              required
              value={status}
              onChange={value => {
                setStatus(value);
                setErrors(previous => ({ ...previous, status: undefined }));
              }}
              options={RULE_STATUS_OPTIONS}
              error={errors.status}
              containerClassName="order-3 gap-2 lg:order-4 lg:gap-1"
              labelClassName="leading-[17px] text-gray-800"
              className="h-11 px-4 text-mobile-label lg:h-[50px] lg:px-3 lg:text-button"
            />
          </div>
        </Panel>

        {mutationError && (
          <p className="text-caption text-red-500">
            {mutationError instanceof Error
              ? mutationError.message
              : '생활규칙 요청을 처리하지 못했습니다.'}
          </p>
        )}

        <FormActions
          onSave={() => handleSubmitClick(false)}
          onCancel={() => navigate(-1)}
          rightSlot={<ShareMessengerButton onClick={() => handleSubmitClick(true)} />}
          className="hidden lg:flex"
        />

        <div className="flex flex-col gap-2.5 lg:hidden">
          <ShareMessengerButton
            className="h-11 text-mobile-label"
            onClick={() => handleSubmitClick(true)}
            disabled={createRule.isPending || updateRule.isPending || shareRule.isPending}
          />
          <Button
            type="button"
            className="h-11 w-full text-mobile-label font-bold"
            onClick={() => handleSubmitClick(false)}
            disabled={createRule.isPending || updateRule.isPending || shareRule.isPending}
          >
            저장
          </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={pendingShare !== null}
        onClose={() => setPendingShare(null)}
        onConfirm={() => void handleConfirmSubmit()}
        icon={<RuleIcon className="size-6" />}
        title="생활 규칙을 등록할까요?"
        highlight={title.trim()}
        description="내용으로 생활 규칙을 등록합니다."
        isPending={createRule.isPending || updateRule.isPending || shareRule.isPending}
      />
    </div>
  );
};

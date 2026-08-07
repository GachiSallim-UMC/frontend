import { useState, type ComponentProps, type ComponentType } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  RULE_CATEGORY_OPTIONS,
  RULE_STATUS_OPTIONS,
  useRuleAgreement,
  useRuleDetail,
  useRuleForm,
  useUpdateRule,
  useUpdateRuleAgreement,
  type MyAgreement,
  type Rule,
  type RuleAgreementApiStatus,
  type RuleHistoryType,
} from '@/features/rule';
import RuleIcon from '@/assets/icons/sidebar/rules.svg?react';
import { ShareItemPickerModal, useShareToMessenger } from '@/features/messenger';
import {
  Button,
  ConfirmModal,
  FormActions,
  ShareMessengerButton,
  StatusBadge,
  UserAvatar,
} from '@/shared/components/ui';
import { FormInput, SelectDropdown, TextArea } from '@/shared/components/form';
import { Panel } from '@/shared/components/layout';
import { useAuthStore } from '@/shared/store';
import HistoryRegisterIcon from '@/assets/icons/rule/history-register.svg?react';
import HistoryEditIcon from '@/assets/icons/rule/history-edit.svg?react';
import HistoryAgreeIcon from '@/assets/icons/rule/history-agree.svg?react';

const HISTORY_ICON: Record<RuleHistoryType, ComponentType<{ className?: string }>> = {
  register: HistoryRegisterIcon,
  agree: HistoryAgreeIcon,
  edit: HistoryEditIcon,
};

const AGREEMENT_TOGGLE_OPTIONS: ReadonlyArray<{
  value: MyAgreement;
  apiStatus: RuleAgreementApiStatus;
  label: string;
}> = [
  { value: 'agree', apiStatus: 'AGREED', label: '동의' },
  { value: 'disagree', apiStatus: 'DISAGREED', label: '반대' },
  { value: 'pending', apiStatus: 'PENDING', label: '보류' },
];

const AGREEMENT_BADGE: Record<MyAgreement, ComponentProps<typeof StatusBadge>> = {
  agree: { variant: 'active', label: '동의' },
  disagree: { variant: 'disagree', label: '반대' },
  pending: { variant: 'inactive', label: '보류' },
};

const AGREEMENT_SUBLABEL: Record<MyAgreement, string> = {
  agree: '동의함',
  disagree: '반대함',
  pending: '미응답',
};

type FormErrors = Partial<Record<'title' | 'category' | 'content' | 'status', string>>;

export const RuleDetailPage = () => {
  const { id = '' } = useParams();
  const { data: rule, isLoading, error, refetch } = useRuleDetail(id);

  if (!id) return <Navigate to="/rules" replace />;
  if (isLoading) {
    return <p className="text-center text-gray-500">생활규칙을 불러오는 중입니다.</p>;
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
        <p>{error instanceof Error ? error.message : '생활규칙을 불러오지 못했습니다.'}</p>
        <button
          type="button"
          className="text-button font-bold text-primary-600"
          onClick={() => void refetch()}
        >
          다시 시도
        </button>
      </div>
    );
  }
  if (!rule) return <Navigate to="/rules" replace />;

  return <RuleDetailContent rule={rule} />;
};

const RuleDetailContent = ({ rule }: { rule: Rule }) => {
  const navigate = useNavigate();
  const currentUserId = useAuthStore(state => state.userId);
  const { title, setTitle, category, setCategory, content, setContent, status, setStatus } =
    useRuleForm(rule);
  const { myAgreement, memberStatuses, historyEntries } = useRuleAgreement(rule, currentUserId);
  const updateRule = useUpdateRule();
  const updateAgreement = useUpdateRuleAgreement();
  const {
    activeType,
    chatRoomOptions,
    openShare,
    closeShare,
    handleSelectChatRoom,
    isSharePending,
  } = useShareToMessenger('rule');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const isPending = updateRule.isPending || updateAgreement.isPending;
  const mutationError = updateRule.error ?? updateAgreement.error;

  const handleSaveClick = () => {
    if (isPending) return;

    const nextErrors: FormErrors = {};
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle) {
      nextErrors.title = '규칙 제목을 입력해 주세요.';
    } else if (trimmedTitle.length > 30) {
      nextErrors.title = '규칙 제목은 30자 이하로 입력해 주세요.';
    }
    if (!category) nextErrors.category = '카테고리를 선택해 주세요.';
    if (!trimmedContent) nextErrors.content = '상세 설명을 입력해 주세요.';
    if (!status) nextErrors.status = '적용 상태를 선택해 주세요.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !category || !status) return;

    const hasChanges =
      trimmedTitle !== rule.title.trim() ||
      category !== rule.category ||
      trimmedContent !== (rule.content ?? '').trim() ||
      status !== rule.status;

    if (!hasChanges) {
      navigate('/rules');
      return;
    }

    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!category || !status) return;

    try {
      await updateRule.mutateAsync({
        id: rule.id,
        dto: {
          title: trimmedTitle,
          category,
          content: trimmedContent,
          status,
        },
      });
      setIsSaveModalOpen(false);
      navigate('/rules');
    } catch {
      // 실패 시 모달을 열어둔 채 errorMessage로 사유를 보여준다.
    }
  };

  const handleAgreement = async (agreementStatus: RuleAgreementApiStatus) => {
    if (isPending) return;
    try {
      await updateAgreement.mutateAsync({
        id: rule.id,
        dto: { status: agreementStatus },
      });
    } catch {
      // 실패 시 모달을 열어둔 채 errorMessage로 사유를 보여준다.
    }
  };

  const handleShare = () => {
    openShare(rule.id);
  };

  return (
    <div className="grid min-h-full w-full content-start grid-cols-1 gap-5 bg-white pb-6 lg:min-h-0 lg:max-w-[1114px] lg:gap-5 lg:bg-transparent lg:p-0 xl:grid-cols-2">
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
          onSave={handleSaveClick}
          onCancel={() => navigate(-1)}
          rightSlot={<ShareMessengerButton onClick={handleShare} />}
          className="hidden lg:flex"
        />
      </div>

      <div className="flex min-w-0 flex-col gap-4 border-t border-gray-100 pt-5 lg:gap-[30px] lg:border-0 lg:pt-0">
        <Panel
          title="동의 현황"
          description="멤버들이 규칙에 동의하면 상태가 업데이트 됩니다."
          className="h-auto rounded-none p-0 shadow-none lg:flex lg:h-[435px] lg:flex-col lg:rounded-[18px] lg:p-[32px]"
          headerClassName="hidden lg:mb-2.5 lg:flex lg:shrink-0"
          titleClassName="text-gray-800"
          descriptionClassName="leading-[17px]"
        >
          <h3 className="mb-2 text-sm font-bold text-gray-900 lg:hidden">멤버 동의 현황</h3>
          <div className="rounded-lg border border-gray-100 px-4 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:rounded-none lg:border-0 lg:px-0">
            <div className="divide-y divide-gray-100 border-b border-gray-100 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:border-b-0">
              {memberStatuses.map(({ member, isMe, isRegistrant, agreement }) => (
                <div
                  key={member.id}
                  className="flex h-[54px] items-center justify-between lg:h-[72px] lg:px-[10px]"
                >
                  <span className="flex min-w-0 items-center gap-2 lg:gap-[9px]">
                    <UserAvatar
                      name={member.name}
                      size="sm"
                      className="h-8 w-8 shrink-0 lg:h-10 lg:w-10"
                    />
                    <span className="flex min-w-0 flex-col gap-0.5 lg:gap-1">
                      <p className="truncate text-mobile-label font-bold leading-normal text-gray-900 lg:text-button">
                        {member.name}
                        {isMe && ' (나)'}
                      </p>
                      <p className="truncate text-mobile-caption leading-normal text-gray-600 lg:text-caption lg:text-gray-900">
                        {isRegistrant ? '등록자' : AGREEMENT_SUBLABEL[agreement]}
                      </p>
                    </span>
                  </span>
                  <StatusBadge
                    {...AGREEMENT_BADGE[agreement]}
                    className="ml-2 h-[26px] w-[52px] shrink-0 px-0 text-mobile-caption leading-normal lg:h-[34px] lg:w-[68px] lg:text-caption"
                  />
                </div>
              ))}
            </div>

            <div className="w-full py-3 lg:mt-[30px] lg:w-[296px] lg:shrink-0 lg:py-0">
              <p className="mb-2 text-mobile-caption leading-normal text-gray-500 lg:mb-2.5 lg:text-caption">
                나의 동의 상태
              </p>
              <div className="flex gap-2 lg:gap-2.5">
                {AGREEMENT_TOGGLE_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    disabled={isPending}
                    onClick={() => void handleAgreement(option.apiStatus)}
                    className={
                      myAgreement === option.value
                        ? 'h-9 min-w-0 flex-1 rounded bg-gray-900 text-mobile-label font-normal text-white disabled:cursor-not-allowed disabled:opacity-50 lg:h-[45px] lg:w-[92px] lg:flex-none lg:text-button'
                        : 'h-9 min-w-0 flex-1 rounded border border-gray-900 bg-white text-mobile-label font-normal text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 lg:h-[45px] lg:w-[92px] lg:flex-none lg:text-button'
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <div className="flex flex-col gap-2.5 lg:hidden">
          <ShareMessengerButton
            className="h-11 text-mobile-label"
            onClick={handleShare}
            disabled={isSharePending}
          />
          <Button
            type="button"
            className="h-11 w-full text-mobile-label font-bold"
            onClick={handleSaveClick}
            disabled={isPending}
          >
            저장
          </Button>
        </div>

        <Panel
          title="규칙 히스토리"
          className="h-auto rounded-none border-t border-gray-100 px-0 pb-0 pt-4 shadow-none lg:flex lg:h-[306px] lg:flex-col lg:rounded-[18px] lg:border-0 lg:p-[32px]"
          headerClassName="mb-2.5 lg:shrink-0"
          titleClassName="text-gray-800"
        >
          <div className="divide-y divide-gray-100 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            {historyEntries.map(entry => {
              const HistoryIcon = HISTORY_ICON[entry.type];
              return (
                <div
                  key={entry.id}
                  className="flex h-[60px] items-center justify-between lg:h-[72px] lg:px-[10px]"
                >
                  <div className="flex min-w-0 items-center gap-2 lg:gap-[9px]">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 lg:h-10 lg:w-10">
                      <HistoryIcon className="h-5 w-5 lg:h-6 lg:w-6" />
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5 lg:gap-1">
                      <p className="truncate text-mobile-label font-bold leading-normal text-gray-900 lg:text-button">
                        {entry.title}
                      </p>
                      <p className="truncate text-mobile-caption leading-normal text-gray-600 lg:text-caption lg:text-gray-900">
                        {entry.subtitle}
                      </p>
                    </span>
                  </div>
                  {entry.time && (
                    <span className="ml-3 shrink-0 text-mobile-caption leading-normal text-gray-500 lg:text-xs">
                      {entry.time}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <ConfirmModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onConfirm={() => void handleConfirmSave()}
        icon={<RuleIcon className="size-6" />}
        title="생활 규칙을 수정할까요?"
        highlight={title.trim()}
        description="생활 규칙 데이터를 수정합니다."
        confirmLabel="수정하기"
        isPending={isPending}
        errorMessage={mutationError instanceof Error ? mutationError.message : undefined}
        tone="edit"
      />

      <ShareItemPickerModal
        type={activeType}
        options={chatRoomOptions}
        onSelect={handleSelectChatRoom}
        onClose={closeShare}
        isSubmitting={isSharePending}
      />
    </div>
  );
};

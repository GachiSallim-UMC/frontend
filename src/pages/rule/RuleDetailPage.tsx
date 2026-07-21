import { useState, type ComponentProps, type ComponentType } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  RULE_CATEGORY_OPTIONS,
  RULE_STATUS_OPTIONS,
  useRuleAgreement,
  useRuleForm,
  type MyAgreement,
  type Rule,
  type RuleHistoryType,
} from '@/features/rule';
import { FormActions, StatusBadge, UserAvatar } from '@/shared/components/ui';
import { FormInput, SelectDropdown, TextArea } from '@/shared/components/form';
import { Panel } from '@/shared/components/layout';
import { currentUser, rules, users } from '@/pages/_shared/mockData';
import HistoryRegisterIcon from '@/assets/icons/rule/history-register.svg?react';
import HistoryEditIcon from '@/assets/icons/rule/history-edit.svg?react';
import HistoryAgreeIcon from '@/assets/icons/rule/history-agree.svg?react';

const HISTORY_ICON: Record<RuleHistoryType, ComponentType<{ className?: string }>> = {
  register: HistoryRegisterIcon,
  agree: HistoryAgreeIcon,
  edit: HistoryEditIcon,
};

const AGREEMENT_TOGGLE_OPTIONS = [
  { value: 'agree', label: '동의' },
  { value: 'disagree', label: '반대' },
  { value: 'pending', label: '보류' },
] as const;

/** 동의 현황 목록의 멤버별 배지 — 토글의 동의/반대/보류 3단계와 1:1 대응 */
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

type FormErrors = Partial<Record<'title' | 'category' | 'status', string>>;

export const RuleDetailPage = () => {
  const { id } = useParams();
  const rule = rules.find(item => item.id === id);

  if (!rule) {
    return <Navigate to="/rules" replace />;
  }

  return <RuleDetailContent rule={rule} />;
};

/** rule 존재가 보장된 뒤에만 훅을 실행하도록 RuleDetailPage에서 분리 */
const RuleDetailContent = ({ rule }: { rule: Rule }) => {
  const navigate = useNavigate();
  const { title, setTitle, category, setCategory, content, setContent, status, setStatus } =
    useRuleForm(rule);
  const { myAgreement, setMyAgreement, memberStatuses, historyEntries } = useRuleAgreement(
    rule,
    currentUser,
    users,
  );
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
    <div className="mx-auto mt-16 grid w-full max-w-[1114px] grid-cols-1 gap-5 xl:grid-cols-2 min-[1440px]:w-[calc(100%-18px)] min-[1440px]:max-w-none">
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

      <div className="flex min-w-0 flex-col gap-[30px]">
        <Panel
          title="동의 현황 (등록 후 표시)"
          description="멤버들이 규칙에 동의하면 상태가 업데이트 됩니다."
          className="h-[435px] rounded-[18px] p-[30px] shadow-none"
          headerClassName="mb-2.5"
          titleClassName="text-gray-800"
          descriptionClassName="leading-[17px]"
        >
          <div className="divide-y divide-gray-100">
            {memberStatuses.map(({ member, isMe, isRegistrant, agreement }) => (
              <div key={member.id} className="flex h-[72px] items-center justify-between px-[10px]">
                <span className="flex items-center gap-[9px]">
                  <UserAvatar name={member.name} size="sm" className="h-10 w-10" />
                  <span className="flex flex-col gap-1">
                    <p className="text-button font-bold leading-normal text-gray-900">
                      {member.name}
                      {isMe && ' (나)'}
                    </p>
                    <p className="text-caption leading-normal text-gray-900">
                      {isRegistrant ? '등록자' : AGREEMENT_SUBLABEL[agreement]}
                    </p>
                  </span>
                </span>
                <StatusBadge
                  {...AGREEMENT_BADGE[agreement]}
                  className="w-[68px] shrink-0 px-0 leading-normal"
                />
              </div>
            ))}
          </div>

          <div className="mt-[30px] w-[296px]">
            <p className="mb-2.5 text-caption leading-normal text-gray-500">나의 동의 상태</p>
            <div className="flex gap-2.5">
              {AGREEMENT_TOGGLE_OPTIONS.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMyAgreement(option.value)}
                  className={
                    myAgreement === option.value
                      ? 'h-[45px] w-[92px] shrink-0 rounded bg-gray-900 text-button font-normal text-white'
                      : 'h-[45px] w-[92px] shrink-0 rounded border border-gray-900 bg-white text-button font-normal text-gray-900'
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </Panel>

        <Panel
          title="규칙 히스토리"
          className="h-[306px] rounded-[18px] p-[30px] shadow-none"
          headerClassName="mb-2.5"
          titleClassName="text-gray-800"
        >
          <div className="divide-y divide-gray-100">
            {historyEntries.map(entry => {
              const HistoryIcon = HISTORY_ICON[entry.type];
              return (
                <div
                  key={entry.id}
                  className="flex h-[72px] items-center justify-between px-[10px]"
                >
                  <div className="flex min-w-0 items-center gap-[9px]">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
                      <HistoryIcon className="h-6 w-6" />
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <p className="truncate text-button font-bold leading-normal text-gray-900">
                        {entry.title}
                      </p>
                      <p className="truncate text-caption leading-normal text-gray-900">
                        {entry.subtitle}
                      </p>
                    </span>
                  </div>
                  {entry.time && (
                    <span className="ml-3 shrink-0 text-xs leading-normal text-gray-500">
                      {entry.time}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
};

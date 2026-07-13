import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { RuleCategory } from '@/features/rule';
import type { RuleStatus } from '@/shared/types';
import { Button, ShareMessengerButton, StatusBadge, UserAvatar } from '@/shared/components/ui';
import { FormInput, SelectDropdown, TextArea } from '@/shared/components/form';
import { Panel } from '@/shared/components/layout';
import { currentUser, rules, users } from '@/pages/_shared/mockData';

const CATEGORY_LABEL: Record<RuleCategory, string> = {
  noise: '소음',
  visitor: '방문객',
  cleanliness: '청결',
  trash: '분리수거',
  etc: '기타',
};

const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABEL) as RuleCategory[]).map(value => ({
  value,
  label: CATEGORY_LABEL[value],
}));

const STATUS_OPTIONS: { value: RuleStatus; label: string }[] = [
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
];

/** registeredAt("YYYY.MM.DD")과 오늘 날짜 차이를 "N일 전"으로 계산 */
const toDaysAgoLabel = (registeredAt: string) => {
  const [y, m, d] = registeredAt.split('.').map(Number);
  const registered = new Date(y, m - 1, d);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - registered.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return '오늘';
  return `${diffDays}일 전`;
};

type MyAgreement = 'agree' | 'disagree' | 'pending';

export const RuleDetailPage = () => {
  const { id } = useParams();
  const rule = rules.find(item => item.id === id) ?? rules[0];

  const [title, setTitle] = useState(rule.title);
  const [category, setCategory] = useState<RuleCategory | ''>(rule.category);
  const [content, setContent] = useState(rule.content ?? '');
  const [status, setStatus] = useState<RuleStatus | ''>(rule.status);

  const iAlreadyAgreed = rule.agreement.agreedMembers.some(member => member.id === currentUser.id);
  const [myAgreement, setMyAgreement] = useState<MyAgreement>(iAlreadyAgreed ? 'agree' : 'pending');

  const historyEntries = [
    {
      id: 'h-created',
      title: `${rule.registeredBy.name} 님이 규칙을 등록했습니다.`,
      subtitle: `새 규칙: ${rule.title}`,
      time: toDaysAgoLabel(rule.registeredAt),
    },
    ...(rule.agreement.agreedCount > 0
      ? [
          {
            id: 'h-agreed',
            title: `현재 ${rule.agreement.agreedCount}/${rule.agreement.totalCount}명이 동의했습니다.`,
            subtitle: rule.title,
            time: null,
          },
        ]
      : []),
  ];

  return (
    <div className="grid grid-cols-2 gap-5">
      <Panel title="기본정보" className="rounded-[18px]">
        <div className="grid gap-4">
          <FormInput label="규칙 제목" required value={title} onChange={e => setTitle(e.target.value)} />
          <SelectDropdown
            label="카테고리"
            required
            value={category}
            onChange={setCategory}
            options={CATEGORY_OPTIONS}
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
          <SelectDropdown
            label="적용 상태"
            required
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            <Button>저장</Button>
            <Button variant="secondary">취소</Button>
          </div>
          <ShareMessengerButton />
        </div>
      </Panel>

      <div className="flex flex-col gap-5">
        <Panel title="동의 현황 (등록 후 표시)" description="멤버들이 규칙에 동의하면 상태가 업데이트 됩니다." className="rounded-[18px]">
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
            {users.map(member => {
              const isMe = member.id === currentUser.id;
              const isRegistrant = member.id === rule.registeredBy.id;
              const isAgreed = rule.agreement.agreedMembers.some(agreed => agreed.id === member.id);

              return (
                <div key={member.id} className="flex items-center justify-between px-[10px] py-4">
                  <span className="flex items-center gap-[9px]">
                    <UserAvatar name={member.name} size="sm" />
                    <span>
                      <p className="text-button font-bold text-gray-900">
                        {member.name}
                        {isMe && ' (나)'}
                      </p>
                      <p className="text-caption text-gray-500">
                        {isRegistrant ? '등록자' : isAgreed ? '동의함' : '미응답'}
                      </p>
                    </span>
                  </span>
                  <StatusBadge variant={isAgreed || isRegistrant ? 'active' : 'inactive'} label={isAgreed || isRegistrant ? '동의' : '보류'} />
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <p className="mb-2.5 text-caption text-gray-500">나의 동의 상태</p>
            <div className="flex gap-2.5">
              {(
                [
                  { value: 'agree', label: '동의' },
                  { value: 'disagree', label: '반대' },
                  { value: 'pending', label: '보류' },
                ] as const
              ).map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMyAgreement(option.value)}
                  className={
                    myAgreement === option.value
                      ? 'h-[45px] flex-1 rounded text-button text-white bg-gray-900'
                      : 'h-[45px] flex-1 rounded border border-gray-900 text-button text-gray-900 bg-white'
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="규칙 히스토리" className="rounded-[18px]">
          <div className="divide-y divide-gray-100">
            {historyEntries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-[9px]">
                  <span className="h-10 w-10 shrink-0 rounded-full bg-primary-100" />
                  <span>
                    <p className="text-button font-bold text-gray-900">{entry.title}</p>
                    <p className="text-caption text-gray-600">{entry.subtitle}</p>
                  </span>
                </div>
                {entry.time && <span className="shrink-0 text-caption text-gray-400">{entry.time}</span>}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
};

import { useParams } from 'react-router-dom';
import type { RuleCategory } from '@/features/rule';
import { Button, StatusBadge, UserAvatar } from '@/shared/components/ui';
import { PageHeading, Panel } from '@/shared/components/layout';
import { rules } from '@/pages/_shared/mockData';

const CATEGORY_LABEL: Record<RuleCategory, string> = {
  noise: '소음',
  visitor: '방문객',
  cleanliness: '청결',
  trash: '분리수거',
  etc: '기타',
};

export const RuleDetailPage = () => {
  const { id } = useParams();
  const rule = rules.find(item => item.id === id) ?? rules[0];

  return (
    <>
      <PageHeading title="규칙 상세" description="규칙 내용과 멤버 동의 상태를 확인합니다." actions={<Button>동의하기</Button>} />

      <div className="grid grid-cols-[1fr_0.8fr] gap-6">
        <Panel title={rule.title}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <StatusBadge variant={rule.status} />
              <span className="text-caption font-bold text-gray-500">{CATEGORY_LABEL[rule.category]}</span>
            </div>
            <p className="text-body text-gray-700">{rule.content}</p>
            <p className="text-caption text-gray-500">
              {rule.registeredBy.name} 등록 · {rule.registeredAt}
            </p>
          </div>
        </Panel>

        <Panel title="동의 현황">
          <div className="mb-4 text-key-number font-bold text-gray-900">
            {rule.agreement.agreedCount}/{rule.agreement.totalCount}명 동의
          </div>
          <div className="space-y-3">
            {rule.agreement.agreedMembers.map(member => (
              <div key={member.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                <div className="flex items-center gap-2">
                  <UserAvatar name={member.name} size="sm" />
                  <span className="text-button font-bold text-gray-900">{member.name}</span>
                </div>
                <StatusBadge variant="done" label="동의" />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
};

import { Link } from 'react-router-dom';
import { Plus, ShieldCheck, CircleCheckBig, CircleAlert } from 'lucide-react';
import type { Rule, RuleCategory } from '@/features/rule';
import { DataTable, StatusBadge, SummaryCard, UserAvatar, type Column } from '@/shared/components/ui';
import { PageHeading, Panel } from '@/shared/components/layout';
import { rules } from '@/pages/_shared/mockData';

const CATEGORY_LABEL: Record<RuleCategory, string> = {
  noise: '소음',
  visitor: '방문객',
  cleanliness: '청결',
  trash: '분리수거',
  etc: '기타',
};

const columns: Column<Rule>[] = [
  { key: 'title', header: '규칙명' },
  { key: 'category', header: '카테고리', render: rule => CATEGORY_LABEL[rule.category] },
  {
    key: 'registeredBy',
    header: '등록자',
    render: rule => (
      <span className="flex items-center gap-2">
        <UserAvatar name={rule.registeredBy.name} size="xs" />
        {rule.registeredBy.name}
      </span>
    ),
  },
  {
    key: 'agreement',
    header: '동의 현황',
    render: rule => `${rule.agreement.agreedCount}/${rule.agreement.totalCount}명`,
  },
  { key: 'status', header: '상태', render: rule => <StatusBadge variant={rule.status} /> },
  {
    key: 'detail',
    header: '',
    align: 'right',
    render: rule => (
      <Link to={`/rules/${rule.id}`} className="text-caption font-bold text-primary-700">
        상세
      </Link>
    ),
  },
];

const activeCount = rules.filter(rule => rule.status === 'active').length;
const fullyAgreedCount = rules.filter(rule => rule.agreement.agreedCount === rule.agreement.totalCount).length;
const needAgreeCount = rules.filter(rule => rule.agreement.agreedCount < rule.agreement.totalCount).length;

export const RuleListPage = () => (
  <>
    <PageHeading
      title="생활 규칙"
      description="함께 정한 생활 규칙과 멤버 동의 현황을 관리합니다."
      actions={
        <Link
          to="/rules/new"
          className="inline-flex h-[50px] items-center gap-2 rounded-lg bg-primary-600 px-4 text-button font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Plus size={16} />
          규칙 등록
        </Link>
      }
    />

    <div className="mb-6 grid grid-cols-3 gap-4">
      <SummaryCard
        icon={<ShieldCheck className="h-6 w-6 text-green-700" />}
        iconBg="bg-green-100"
        label="활성 규칙"
        value={`${activeCount}개`}
      />
      <SummaryCard
        icon={<CircleCheckBig className="h-6 w-6 text-primary-600" />}
        iconBg="bg-primary-100"
        label="전체 동의"
        value={`${fullyAgreedCount}개`}
      />
      <SummaryCard
        icon={<CircleAlert className="h-6 w-6 text-orange-700" />}
        iconBg="bg-orange-100"
        label="동의 필요"
        value={`${needAgreeCount}개`}
      />
    </div>

    <Panel>
      <DataTable columns={columns} data={rules} emptyMessage="등록된 생활 규칙이 없습니다." />
    </Panel>
  </>
);

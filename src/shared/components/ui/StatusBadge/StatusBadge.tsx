import { cn } from '@/shared/lib/cn';

type BadgeVariant =
  | 'done'
  | 'pending'
  | 'scheduled'
  | 'unpaid'
  | 'active'
  | 'inactive'
  | 'short'
  | 'empty'
  | 'enough'
  | 'disagree';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

/**
 * 색상은 Figma 디자인 시스템 > Component > 상태버튼 정의를 따릅니다.
 * 완료=Green, 미완료=Blue, 예정=Purple, 미정산=Orange, 비활성=Gray
 *
 * 반대(disagree)는 디자인 시스템 상태버튼에 정의가 없어, 팔레트의 Red 토큰으로 추가했습니다.
 * (규칙 동의 현황의 동의/반대/보류 3단계 표시에 사용)
 */
const variantConfig: Record<BadgeVariant, { label: string; className: string }> = {
  done: { label: '완료', className: 'bg-green-300 text-green-700' },
  pending: { label: '미완료', className: 'bg-primary-200 text-primary-700' },
  scheduled: { label: '예정', className: 'bg-purple-300 text-purple-700' },
  unpaid: { label: '미정산', className: 'bg-orange-100 text-orange-700' },
  active: { label: '활성', className: 'bg-green-300 text-green-700' },
  inactive: { label: '비활성', className: 'bg-gray-100 text-gray-600' },
  short: { label: '부족', className: 'bg-orange-100 text-orange-700' },
  empty: { label: '소진', className: 'bg-red-100 text-red-700' },
  enough: { label: '충분', className: 'bg-green-300 text-green-700' },
  disagree: { label: '반대', className: 'bg-red-100 text-red-700' },
};

export const StatusBadge = ({ variant, label, className }: StatusBadgeProps) => {
  const config = variantConfig[variant];

  return (
    <span
      className={cn(
        'inline-flex h-[34px] items-center justify-center rounded-full px-[21px] text-caption font-bold',
        config.className,
        className,
      )}
    >
      {label ?? config.label}
    </span>
  );
};

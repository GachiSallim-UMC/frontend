import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { ActivityLog } from '@/features/activity/types';
import { toTimeLabel } from '@/features/activity/lib/activityDate';
import { cn } from '@/shared/lib/cn';

type ActivityItemProps = Pick<ActivityLog, 'description' | 'createdAt' | 'route'> & {
  /** 마지막 항목엔 구분선을 안 그림 (모바일: 카드 하단 자체 테두리와 중복 방지) */
  isLast?: boolean;
};

const getItemClassName = (isLast: boolean) =>
  cn(
    'relative flex min-h-[56px] w-full flex-col justify-center gap-[5px] bg-white px-4',
    'lg:min-h-[69px] lg:border-t lg:border-gray-100 lg:px-[29px] lg:first:border-t-0 lg:last:border-b',
    !isLast && 'after:absolute after:bottom-0 after:left-4 after:right-4 after:h-px after:bg-gray-100 lg:after:hidden',
  );

export const ActivityItem: FC<ActivityItemProps> = ({ description, createdAt, route, isLast = false }) => {
  const content = (
    <>
      <p className="text-caption text-gray-900">{description ?? '새로운 활동이 있습니다.'}</p>
      <p className="text-xs text-gray-400">{toTimeLabel(createdAt)}</p>
    </>
  );

  const itemClassName = getItemClassName(isLast);

  if (route === null) {
    return <div className={itemClassName}>{content}</div>;
  }

  return (
    <Link to={route} className={itemClassName}>
      {content}
    </Link>
  );
};

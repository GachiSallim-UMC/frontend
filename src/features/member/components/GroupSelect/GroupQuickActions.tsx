import { Link } from 'react-router-dom';
import GroupChangeIcon from '@/assets/icons/sidebar/group-change-active.svg?react';
import GroupSettingsIcon from '@/assets/icons/sidebar/group-settings-active.svg?react';

const QUICK_ACTION_CLASS_NAME =
  'flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-gray-500 shadow-mobile-icon transition-colors hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300';

export const GroupQuickActions = () => (
  <div className="flex shrink-0 items-center gap-[9px]">
    <Link to="/group" aria-label="그룹 변경" className={QUICK_ACTION_CLASS_NAME}>
      <GroupChangeIcon className="size-4" />
    </Link>
    <Link to="/group/settings" aria-label="그룹 설정" className={QUICK_ACTION_CLASS_NAME}>
      <GroupSettingsIcon className="size-4" />
    </Link>
  </div>
);

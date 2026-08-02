import type { ComponentType, SVGProps } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';
import logoUrl from '@/assets/logo.svg?url';

// Figma 디자인 시스템 사이드바 아이콘 (Default=outline, Active=filled)
import DashboardIcon from '@/assets/icons/sidebar/dashboard.svg?react';
import DashboardActiveIcon from '@/assets/icons/sidebar/dashboard-active.svg?react';
import ChoresIcon from '@/assets/icons/sidebar/chores.svg?react';
import ChoresActiveIcon from '@/assets/icons/sidebar/chores-active.svg?react';
import ExpensesIcon from '@/assets/icons/sidebar/expenses.svg?react';
import ExpensesActiveIcon from '@/assets/icons/sidebar/expenses-active.svg?react';
import ItemsIcon from '@/assets/icons/sidebar/items.svg?react';
import ItemsActiveIcon from '@/assets/icons/sidebar/items-active.svg?react';
import RulesIcon from '@/assets/icons/sidebar/rules.svg?react';
import RulesActiveIcon from '@/assets/icons/sidebar/rules-active.svg?react';
import MessengerIcon from '@/assets/icons/sidebar/messenger.svg?react';
import MessengerActiveIcon from '@/assets/icons/sidebar/messenger-active.svg?react';
import NotificationsIcon from '@/assets/icons/sidebar/notifications.svg?react';
import NotificationsActiveIcon from '@/assets/icons/sidebar/notifications-active.svg?react';
import ActivityIcon from '@/assets/icons/sidebar/activity.svg?react';
import ActivityActiveIcon from '@/assets/icons/sidebar/activity-active.svg?react';
import MypageIcon from '@/assets/icons/sidebar/mypage.svg?react';
import MypageActiveIcon from '@/assets/icons/sidebar/mypage-active.svg?react';
import GroupSettingsIcon from '@/assets/icons/sidebar/group-settings.svg?react';
import GroupSettingsActiveIcon from '@/assets/icons/sidebar/group-settings-active.svg?react';
import GroupChangeIcon from '@/assets/icons/sidebar/group-change.svg?react';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface NavItem {
  to: string;
  Icon: IconType;
  ActiveIcon?: IconType;
  label: string;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'MAIN',
    items: [
      { to: '/dashboard', Icon: DashboardIcon, ActiveIcon: DashboardActiveIcon, label: '대시보드' },
    ],
  },
  {
    title: '관리',
    items: [
      { to: '/chores', Icon: ChoresIcon, ActiveIcon: ChoresActiveIcon, label: '집안일' },
      { to: '/expenses', Icon: ExpensesIcon, ActiveIcon: ExpensesActiveIcon, label: '생활비 정산' },
      { to: '/items', Icon: ItemsIcon, ActiveIcon: ItemsActiveIcon, label: '공용 물품' },
      { to: '/rules', Icon: RulesIcon, ActiveIcon: RulesActiveIcon, label: '생활 규칙' },
    ],
  },
  {
    title: '소통',
    items: [
      { to: '/messenger', Icon: MessengerIcon, ActiveIcon: MessengerActiveIcon, label: '메신저' },
      {
        to: '/notifications',
        Icon: NotificationsIcon,
        ActiveIcon: NotificationsActiveIcon,
        label: '알림',
      },
      { to: '/activity', Icon: ActivityIcon, ActiveIcon: ActivityActiveIcon, label: '활동 내역' },
    ],
  },
];

const BOTTOM_NAV: NavItem[] = [
  { to: '/mypage', Icon: MypageIcon, ActiveIcon: MypageActiveIcon, label: '마이페이지' },
  {
    to: '/group/settings',
    Icon: GroupSettingsIcon,
    ActiveIcon: GroupSettingsActiveIcon,
    label: '그룹 설정',
  },
  { to: '/group', Icon: GroupChangeIcon, label: '그룹 변경' },
];

const NavItemLink = ({ item }: { item: NavItem }) => (
  <NavLink
    to={item.to}
    end
    className={({ isActive }) =>
      cn(
        'flex items-center gap-[8px] rounded-r-[10px] border-l-4 px-[22px] py-[10px] text-body transition-colors',
        // Figma: 활성 = 연파랑 배경 + 검정 텍스트 + 왼쪽 검정 보더 + Bold / 비활성 = 검정 텍스트
        isActive
          ? 'border-gray-900 bg-primary-200 font-bold text-gray-900'
          : 'border-transparent font-normal text-gray-900 hover:bg-gray-100',
      )
    }
  >
    {({ isActive }) => {
      const Icon = isActive && item.ActiveIcon ? item.ActiveIcon : item.Icon;
      return (
        <>
          <Icon className="h-6 w-6 shrink-0" />
          <span>{item.label}</span>
          {item.badge != null && item.badge > 0 && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-700 px-1 text-xs text-white">
              {item.badge}
            </span>
          )}
        </>
      );
    }}
  </NavLink>
);

export const Sidebar = () => {
  return (
    <aside
      className="z-20 flex w-[200px] shrink-0 flex-col border-r border-gray-100 bg-white"
      style={{ width: 'var(--sidebar-width)' }}
    >
      {/* 로고 */}
      <div className="flex h-16 items-center gap-2 px-4">
        <img src={logoUrl} alt="같이살림" className="h-9 w-auto" />
        <span className="font-logo text-group-title font-bold text-gray-900">같이살림</span>
      </div>

      {/* 메인 네비게이션 */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {NAV_GROUPS.map(group => (
          <div key={group.title} className="mb-4">
            <p className="mb-1 px-[22px] text-caption font-normal uppercase tracking-[1.38px] text-gray-600">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(item => (
                <li key={item.to}>
                  <NavItemLink item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* 하단 네비게이션 */}
      <div className="border-t border-gray-100 px-3 py-3">
        <ul className="space-y-0.5">
          {BOTTOM_NAV.map(item => (
            <li key={item.to}>
              <NavItemLink item={item} />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

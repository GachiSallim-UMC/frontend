import type { ComponentType, SVGProps } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@/assets/icons/sidebar/dashboard.svg?react';
import DashboardActiveIcon from '@/assets/icons/sidebar/dashboard-active.svg?react';
import ChoresIcon from '@/assets/icons/sidebar/chores.svg?react';
import ChoresActiveIcon from '@/assets/icons/sidebar/chores-active.svg?react';
import ExpensesIcon from '@/assets/icons/sidebar/expenses.svg?react';
import ExpensesActiveIcon from '@/assets/icons/sidebar/expenses-active.svg?react';
import MessengerIcon from '@/assets/icons/sidebar/messenger.svg?react';
import MessengerActiveIcon from '@/assets/icons/sidebar/messenger-active.svg?react';
import { cn } from '@/shared/lib/cn';
import { isMobileBottomNavigationPath } from './mobileNavigation';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface NavigationItem {
  to: string;
  label: string;
  Icon: IconType;
  ActiveIcon: IconType;
  badge?: number;
}

interface MobileBottomNavigationProps {
  unreadMessageCount?: number;
}

export const MobileBottomNavigation = ({ unreadMessageCount = 0 }: MobileBottomNavigationProps) => {
  const { pathname } = useLocation();
  const items: NavigationItem[] = [
    { to: '/dashboard', label: '홈', Icon: DashboardIcon, ActiveIcon: DashboardActiveIcon },
    { to: '/chores', label: '집안일', Icon: ChoresIcon, ActiveIcon: ChoresActiveIcon },
    { to: '/expenses', label: '정산', Icon: ExpensesIcon, ActiveIcon: ExpensesActiveIcon },
    {
      to: '/messenger',
      label: '메신저',
      Icon: MessengerIcon,
      ActiveIcon: MessengerActiveIcon,
      badge: unreadMessageCount,
    },
  ];

  if (!isMobileBottomNavigationPath(pathname)) return null;

  return (
    <nav
      aria-label="모바일 주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-40 h-[calc(3.5rem+env(safe-area-inset-bottom))] border-t border-gray-100 bg-white pb-safe lg:hidden"
    >
      <ul className="mx-auto grid h-full max-w-[390px] grid-cols-4">
        {items.map(item => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'relative flex h-full flex-col items-center justify-center gap-0.5 text-[8px] tracking-[0.04em]',
                  isActive ? 'font-semibold text-gray-700' : 'font-normal text-gray-400',
                )
              }
            >
              {({ isActive }) => {
                const Icon = isActive ? item.ActiveIcon : item.Icon;

                return (
                  <>
                    <span className="relative">
                      <Icon className="size-5" />
                      {item.badge != null && item.badge > 0 && (
                        <span className="absolute -right-2 -top-1.5 flex size-3.5 items-center justify-center rounded-full bg-red-700 text-[8px] leading-none text-white">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </span>
                    <span>{item.label}</span>
                  </>
                );
              }}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

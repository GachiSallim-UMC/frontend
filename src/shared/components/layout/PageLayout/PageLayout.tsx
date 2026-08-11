import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { Header } from '@/shared/components/layout/Header';
import { MobileHeader } from '@/shared/components/layout/MobileHeader';
import {
  isMobileBottomNavigationPath,
  MobileBottomNavigation,
} from '@/shared/components/layout/MobileBottomNavigation';
import { cn } from '@/shared/lib/cn';

interface PageLayoutProps {
  children: ReactNode;
  groupName?: string;
  memberCount?: number;
  user?: { name: string; avatarUrl?: string };
  unreadMessageCount?: number;
  unreadNotificationCount?: number;
  onMarkAllNotificationsRead?: () => void;
  className?: string;
}

export const PageLayout = ({
  children,
  groupName = '그룹',
  memberCount = 0,
  user = { name: '사용자' },
  unreadMessageCount = 0,
  unreadNotificationCount = 0,
  onMarkAllNotificationsRead,
  className,
}: PageLayoutProps) => {
  const { pathname } = useLocation();
  const hasMobileBottomNavigation = isMobileBottomNavigationPath(pathname);
  const hasWhiteMobileCanvas =
    pathname === '/items/new' ||
    (pathname.startsWith('/items/') && pathname.endsWith('/edit')) ||
    pathname.startsWith('/chores/') ||
    pathname.startsWith('/rules/');

  return (
    <div className="flex min-h-dvh w-full bg-primary-50 lg:h-screen lg:overflow-hidden">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col lg:h-screen lg:min-h-0 lg:overflow-hidden">
        <MobileHeader
          user={user}
          unreadNotificationCount={unreadNotificationCount}
          onMarkAllNotificationsRead={onMarkAllNotificationsRead}
        />
        <Header
          groupName={groupName}
          memberCount={memberCount}
          user={user}
          unreadMessageCount={unreadMessageCount}
          unreadNotificationCount={unreadNotificationCount}
        />
        <main
          className={cn(
            // 사이드바·상단바와 본문 사이 공통 여백. 페이지에서 다시 지정하지 않습니다.
            'flex min-h-0 flex-1 flex-col overflow-x-hidden px-4 pt-4',
            'lg:overflow-y-auto lg:px-6 lg:pb-6 lg:pt-[28px]',
            hasWhiteMobileCanvas && 'bg-white lg:bg-transparent',
            hasMobileBottomNavigation
              ? 'pb-[calc(3.5rem+env(safe-area-inset-bottom))]'
              : 'pb-[env(safe-area-inset-bottom)]',
            className,
          )}
        >
          {children}
        </main>
        <MobileBottomNavigation unreadMessageCount={unreadMessageCount} />
      </div>
    </div>
  );
};

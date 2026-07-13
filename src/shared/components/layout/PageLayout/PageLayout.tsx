import type { ReactNode } from 'react';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { Header } from '@/shared/components/layout/Header';
import { cn } from '@/shared/lib/cn';

interface PageLayoutProps {
  children: ReactNode;
  groupName?: string;
  memberCount?: number;
  user?: { name: string; avatarUrl?: string };
  unreadMessageCount?: number;
  className?: string;
}

export const PageLayout = ({
  children,
  groupName = '우리집 룸메이트',
  memberCount = 3,
  user = { name: '홍길동' },
  unreadMessageCount = 0,
  className,
}: PageLayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-primary-50">
      <Sidebar />
      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <Header
          groupName={groupName}
          memberCount={memberCount}
          user={user}
          unreadMessageCount={unreadMessageCount}
        />
        <main className={cn('flex flex-1 flex-col overflow-y-auto px-6 pb-6', className)}>{children}</main>
      </div>
    </div>
  );
};

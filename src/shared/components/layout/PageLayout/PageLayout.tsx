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
    <div className="min-h-screen bg-primary-50">
      <Sidebar />
      <Header
        groupName={groupName}
        memberCount={memberCount}
        user={user}
        unreadMessageCount={unreadMessageCount}
      />
      <main className={cn('content-area p-6', className)}>{children}</main>
    </div>
  );
};

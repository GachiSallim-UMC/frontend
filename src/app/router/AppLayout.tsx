import { Outlet } from 'react-router-dom';
import { PageLayout } from '@/shared/components/layout';
import { useGroupStore } from '@/shared/store';
import { useMyGroups } from '@/features/member';
import { useMe } from '@/features/auth';
import { useUnreadNotificationCount } from '@/features/notification';

/** 사이드바 + 헤더가 있는 공통 레이아웃으로 라우트 children을 감쌉니다. */
export const AppLayout = () => {
  const { data: me } = useMe();
  const selectedGroupId = useGroupStore(s => s.selectedGroupId);
  const { data: groups } = useMyGroups();
  const selectedGroup = groups.find(g => g.id === selectedGroupId);
  const { unreadCount } = useUnreadNotificationCount();

  return (
    <PageLayout
      groupName={selectedGroup?.name}
      memberCount={selectedGroup?.memberCount}
      user={me ? { name: me.name, avatarUrl: me.profileImage ?? undefined } : undefined}
      unreadNotificationCount={unreadCount}
    >
      <Outlet />
    </PageLayout>
  );
};

import { Link } from 'react-router-dom';
import { UserAvatar } from '@/shared/components/ui/UserAvatar';
// 헤더 아이콘은 항상 filled(꽉찬) 버전 고정 사용
import MessengerIcon from '@/assets/icons/sidebar/messenger-active.svg?react';
import NotificationsIcon from '@/assets/icons/sidebar/notifications-active.svg?react';

interface HeaderProps {
  groupName: string;
  memberCount: number;
  user: { name: string; avatarUrl?: string };
  unreadMessageCount?: number;
  unreadNotificationCount?: number;
}

export const Header = ({
  groupName,
  memberCount,
  user,
  unreadMessageCount = 0,
  unreadNotificationCount = 0,
}: HeaderProps) => {
  return (
    <header className="z-10 hidden h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 lg:flex">
      {/* 그룹 정보 */}
      <div>
        <h1 className="text-group-title font-semibold text-gray-900">{groupName}</h1>
        <p className="text-caption text-gray-500">멤버 {memberCount}명</p>
      </div>

      {/* 우측: 메신저·알림(흰 원형) + 아바타·이름 */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <Link
            to="/messenger"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-card transition-colors hover:text-gray-900"
            aria-label="메신저"
          >
            <MessengerIcon className="h-6 w-6" />
            {unreadMessageCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-700 px-1 text-[10px] text-white">
                {unreadMessageCount}
              </span>
            )}
          </Link>
          <Link
            to="/notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-card transition-colors hover:text-gray-900"
            aria-label="알림"
          >
            <NotificationsIcon className="h-6 w-6" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-700 px-1 text-[10px] text-white">
                {unreadNotificationCount}
              </span>
            )}
          </Link>
        </div>

        <Link to="/mypage" className="flex items-center gap-2" aria-label="마이페이지">
          <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="md" />
          <span className="text-button font-bold text-gray-900">{user.name}</span>
        </Link>
      </div>
    </header>
  );
};

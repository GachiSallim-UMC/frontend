import { ArrowLeft, Plus } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationsIcon from '@/assets/icons/sidebar/notifications-active.svg?react';
import RulesIcon from '@/assets/icons/sidebar/rules-active.svg?react';
import logoUrl from '@/assets/logo.svg?url';
import { UserAvatar } from '@/shared/components/ui/UserAvatar';

interface MobileHeaderProps {
  user: { name: string; avatarUrl?: string };
  unreadNotificationCount?: number;
}

interface MobileRouteHeader {
  title: string;
  backTo?: string;
  action?: { label: string; to: string };
}

const getRouteHeader = (pathname: string): MobileRouteHeader => {
  if (pathname === '/chores') {
    return { title: '집안일', backTo: '/dashboard', action: { label: '등록', to: '/chores/new' } };
  }
  if (pathname === '/chores/new') return { title: '집안일 등록', backTo: '/chores' };
  if (pathname.startsWith('/chores/') && pathname.endsWith('/edit')) {
    return { title: '집안일 수정', backTo: '/chores' };
  }
  if (pathname === '/expenses') {
    return {
      title: '생활비 정산',
      backTo: '/dashboard',
      action: { label: '등록', to: '/expenses/new' },
    };
  }
  if (pathname === '/expenses/new') return { title: '정산 등록', backTo: '/expenses' };
  if (pathname.startsWith('/expenses/')) return { title: '정산 상세', backTo: '/expenses' };
  if (pathname === '/items') {
    return {
      title: '공용 물품',
      backTo: '/dashboard',
      action: { label: '등록', to: '/items/new' },
    };
  }
  if (pathname === '/items/new') return { title: '물품 등록', backTo: '/items' };
  if (pathname.startsWith('/items/') && pathname.endsWith('/edit')) {
    return { title: '물품 수정', backTo: '/items' };
  }
  if (pathname === '/rules') {
    return {
      title: '생활 규칙',
      backTo: '/dashboard',
      action: { label: '등록', to: '/rules/new' },
    };
  }
  if (pathname === '/rules/new') return { title: '생활 규칙 등록', backTo: '/rules' };
  if (pathname.startsWith('/rules/')) return { title: '생활 규칙 상세', backTo: '/rules' };
  if (pathname === '/messenger') return { title: '메신저', backTo: '/dashboard' };
  if (pathname === '/notifications') return { title: '알림', backTo: '/dashboard' };
  if (pathname === '/activity') return { title: '활동 내역', backTo: '/dashboard' };
  if (pathname === '/mypage') return { title: '마이페이지', backTo: '/dashboard' };
  if (pathname === '/group/settings') return { title: '그룹 설정', backTo: '/mypage' };
  return { title: '같이살림', backTo: '/dashboard' };
};

export const MobileHeader = ({ user, unreadNotificationCount = 0 }: MobileHeaderProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const routeHeader = getRouteHeader(pathname);

  if (pathname === '/dashboard') {
    return (
      <header className="sticky top-0 z-30 h-[52px] shrink-0 border-b border-gray-100 bg-white lg:hidden">
        <div className="mx-auto flex h-full w-full max-w-[390px] items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2.5" aria-label="같이살림 홈">
            <img src={logoUrl} alt="" className="h-[22.572px] w-5" />
            <span className="font-logo text-mobile-title font-medium leading-normal tracking-[0.04em] text-gray-900">
              같이살림
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/rules"
              aria-label="생활 규칙"
              className="flex h-9 w-6 flex-col items-center justify-center gap-0.5 text-gray-600"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-white shadow-mobile-icon">
                <RulesIcon className="size-4" />
              </span>
              <span className="text-[8px] leading-none">규칙</span>
            </Link>
            <Link
              to="/notifications"
              aria-label="알림"
              className="relative flex h-9 w-6 flex-col items-center justify-center gap-0.5 text-gray-600"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-white shadow-mobile-icon">
                <NotificationsIcon className="size-4" />
              </span>
              <span className="text-[8px] leading-none">알림</span>
              {unreadNotificationCount > 0 && (
                <span className="absolute -right-1 top-0 flex size-3.5 items-center justify-center rounded-full bg-red-700 text-[8px] leading-none text-white">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </Link>
            <Link
              to="/mypage"
              aria-label="마이페이지"
              className="flex h-9 w-6 flex-col items-center justify-center gap-0.5 text-gray-600"
            >
              <UserAvatar name={user.name} avatarUrl={user.avatarUrl} className="size-6" />
              <span className="text-[8px] leading-none">MY</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 h-[52px] shrink-0 border-b border-gray-100 bg-white lg:hidden">
      <div className="mx-auto grid h-full w-full max-w-[390px] grid-cols-[1fr_auto_1fr] items-center px-4">
        <div className="justify-self-start">
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={() => (routeHeader.backTo ? navigate(routeHeader.backTo) : navigate(-1))}
            className="flex size-8 items-center justify-start text-gray-900"
          >
            <ArrowLeft className="size-6" strokeWidth={1.5} />
          </button>
        </div>
        <h1 className="max-w-[210px] truncate text-mobile-title font-bold tracking-[0.04em] text-gray-900">
          {routeHeader.title}
        </h1>
        <div className="justify-self-end">
          {routeHeader.action && (
            <Link
              to={routeHeader.action.to}
              className="flex items-center text-mobile-body font-normal text-primary-400"
            >
              <Plus className="size-4" />
              {routeHeader.action.label}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

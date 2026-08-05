import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Circle, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { Notification } from '@/features/notification/types';
import ArrowGoIcon from '@/assets/icons/notification/arrow-go.svg';

interface NotificationItemProps extends Notification {
  onHide?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
}

export const NotificationItem: FC<NotificationItemProps> = ({
  id,
  title,
  message,
  time,
  isRead = false,
  route,
  onHide,
  onMarkAsRead,
}) => {
  const navigate = useNavigate();

  const handleHide = (e: React.MouseEvent) => {
    e.stopPropagation();
    onHide?.(id);
  };

  const handleMarkAsRead = () => {
    if (!isRead) onMarkAsRead?.(id);
  };

  const handleGo = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMarkAsRead();
    if (route) navigate(route);
  };

  return (
    <div className="w-full border-b border-gray-100 last:border-b-0">
      {/* 모바일: 행 전체 탭 = 읽음 처리 + 이동, 숨기기 버튼만 별도 노출 (Figma엔 액션 아이콘 없음) */}
      <div
        onClick={handleGo}
        className={cn(
          'flex w-full items-start gap-3 bg-white px-4 py-[13px] transition-colors active:bg-gray-50 lg:hidden',
          route && 'cursor-pointer',
        )}
      >
        <Circle
          className={cn('mt-[3px] size-2 shrink-0', isRead ? 'text-gray-100' : 'text-primary-600')}
          fill="currentColor"
          stroke="none"
          role="img"
          aria-label={isRead ? '읽음' : '읽지 않음'}
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-mobile-label font-bold text-gray-800">{title}</p>
          <p className="mt-1.5 text-mobile-label text-gray-800">{message}</p>
          <p className="mt-1.5 text-mobile-caption text-gray-400">{time}</p>
        </div>

        <button
          type="button"
          onClick={handleHide}
          aria-label="알림 숨기기"
          className="flex size-6 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* 데스크톱: 기존 레이아웃 유지 */}
      <div
        onClick={handleMarkAsRead}
        className="relative hidden h-[100px] w-full cursor-pointer bg-white transition-colors hover:bg-gray-50 lg:block"
      >
        <div className="absolute left-[30px] top-[22px] w-[12px] h-[12px] flex items-center justify-center">
          <Circle
            className={cn('w-3 h-3', isRead ? 'text-gray-100' : 'text-primary-600')}
            fill="currentColor"
            stroke="none"
            role="img"
            aria-label={isRead ? '읽음' : '읽지 않음'}
          />
        </div>

        <div className="absolute left-[70px] right-[136px] top-[20px] h-[19px] text-[16px] font-bold text-gray-800 leading-none truncate">
          {title}
        </div>

        <div className="absolute left-[70px] right-[136px] top-[41px] h-[17px] text-[14px] font-normal text-gray-800 leading-none truncate">
          {message}
        </div>

        <div className="absolute left-[70px] right-[136px] top-[64px] h-[15px] text-[12px] font-normal text-gray-400 leading-none truncate">
          {time}
        </div>

        <button
          type="button"
          onClick={handleHide}
          aria-label="알림 숨기기"
          className="absolute right-[84px] top-[27px] flex items-center justify-center w-[42px] h-[42px] rounded-full border border-gray-100 bg-white text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleGo}
          disabled={!route}
          aria-label="상세 페이지로 이동"
          className={cn(
            'absolute right-[30px] top-[27px] flex items-center justify-center w-[42px] h-[42px] rounded-full border border-gray-100 bg-white',
            !route && 'cursor-not-allowed opacity-40',
          )}
        >
          <img src={ArrowGoIcon} alt="" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

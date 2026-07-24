import type { FC } from 'react';
import { Circle, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { Notification } from '@/features/notification/types';
import ArrowGoIcon from '@/assets/icons/notification/arrow-go.svg';

interface NotificationItemProps extends Notification {
  onHide?: (id: string) => void;
}

export const NotificationItem: FC<NotificationItemProps> = ({
  id,
  title,
  message,
  time,
  isRead = false,
  onHide,
}) => {
  const handleHide = (e: React.MouseEvent) => {
    e.stopPropagation();
    onHide?.(id);
  };

  return (
    <div className="relative w-full h-[100px] bg-white border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors">
      <div className="absolute left-[30px] top-[22px] w-[12px] h-[12px] flex items-center justify-center">
        <Circle
          className={cn('w-3 h-3', isRead ? 'text-gray-100' : 'text-primary-600')}
          fill="currentColor"
          stroke="none"
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

      <div className="absolute right-[30px] top-[27px] flex items-center justify-center w-[42px] h-[42px] rounded-full border border-gray-100 bg-white">
        <img src={ArrowGoIcon} alt="이동" className="w-6 h-6" />
      </div>
    </div>
  );
};

import type { FC } from 'react';
import type { Notification } from '@/features/notification/types';
import UnreadIcon from '@/assets/icons/notification/Ellipse 273-1.svg';
import ReadIcon from '@/assets/icons/notification/Ellipse 273.svg'; 
import ArrowGoIcon from '@/assets/icons/notification/solar_arrow-up-linear.svg';

export const NotificationItem: FC<Notification> = ({
  title,
  message,
  time,
  isRead = false,
}) => {
  return (
    <div className="relative w-full h-[100px] bg-white border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors">
      <div className="absolute left-[30px] top-[22px] w-[12px] h-[12px] flex items-center justify-center">
        <img src={isRead ? ReadIcon : UnreadIcon} alt={isRead ? '읽음' : '읽지 않음'} className="w-full h-full" />
      </div>

      <div className="absolute left-[70px] right-[90px] top-[20px] h-[19px] text-[16px] font-bold text-gray-800 leading-none truncate">
        {title}
      </div>

      <div className="absolute left-[70px] right-[90px] top-[41px] h-[17px] text-[14px] font-normal text-gray-800 leading-none truncate">
        {message}
      </div>

      <div className="absolute left-[70px] right-[90px] top-[64px] h-[15px] text-[12px] font-normal text-gray-400 leading-none truncate">
        {time}
      </div>

      <div className="absolute right-[30px] top-[27px] flex items-center justify-center w-[42px] h-[42px] rounded-full border border-gray-100 bg-white">
        <img src={ArrowGoIcon} alt="이동" className="w-6 h-6" />
      </div>
    </div>
  );
};

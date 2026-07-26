import ReconnectingIcon from '@/assets/icons/messenger/reconnecting.svg?react';

export const ReconnectingBanner = () => {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1 border-t border-gray-100 py-12 text-center">
      <ReconnectingIcon className="h-5 w-5" />
      <p className="text-[14px] font-normal leading-[1.5] text-gray-500">자동으로 다시 연결하는 중…</p>
    </div>
  );
};

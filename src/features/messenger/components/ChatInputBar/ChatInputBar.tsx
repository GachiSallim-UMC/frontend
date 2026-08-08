import type { FormEvent } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { ShareTypeBar } from '@/features/messenger/components/ShareTypeBar';
import type { ShareCardType } from '@/features/messenger/types';

interface ChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onSelectShareType?: (type: ShareCardType) => void;
}

export const ChatInputBar = ({ value, onChange, onSend, onSelectShareType }: ChatInputBarProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedValue = value.trim();
    if (!trimmedValue || trimmedValue.length > 2000) return;
    onSend();
  };

  return (
    <div className="flex shrink-0 flex-col gap-3 border-t border-gray-100 bg-white px-4 pb-4 pt-4 lg:gap-[14px] lg:px-[30px] lg:pb-[30px] lg:pt-[30px]">
      <ShareTypeBar onSelect={type => onSelectShareType?.(type)} />
      <form onSubmit={handleSubmit} className="flex items-center gap-2 lg:gap-3">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          maxLength={2000}
          placeholder="메시지를 입력하세요... (WebSocket 실시간 전송)"
          className="h-[42px] min-w-0 flex-1 rounded-lg border border-gray-100 bg-white px-3 text-caption text-gray-900 placeholder:text-[10px] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:px-4 lg:placeholder:text-caption"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!value.trim() || value.trim().length > 2000}
          className="h-[42px] w-[72px] font-bold lg:w-[116px]"
        >
          전송
        </Button>
      </form>
    </div>
  );
};

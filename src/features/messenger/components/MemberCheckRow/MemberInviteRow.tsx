import { Check } from 'lucide-react';
import { UserAvatar } from '@/shared/components/ui/UserAvatar';
import { cn } from '@/shared/lib/cn';

interface MemberInviteRowProps {
  name: string;
  avatarUrl?: string;
  selected: boolean;
  onToggle: () => void;
  /** 지정 시 체크 버튼 대신 표시되는 보조 텍스트 (예: 본인 행의 '나') */
  trailingLabel?: string;
}

export const MemberInviteRow = ({ name, avatarUrl, selected, onToggle, trailingLabel }: MemberInviteRowProps) => {
  const avatarAndName = (
    <div className="flex items-center gap-2.5">
      <UserAvatar name={name} avatarUrl={avatarUrl} size="md" className="h-10 w-10" />
      <span className="text-[16px] font-bold leading-[normal] text-gray-900">{name}</span>
    </div>
  );

  if (trailingLabel) {
    return (
      <div className="flex h-[60px] shrink-0 items-center justify-between">
        {avatarAndName}
        <span className="text-[16px] font-bold leading-[normal] text-gray-400">{trailingLabel}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      aria-label={`${name} 선택`}
      className="flex h-[60px] w-full shrink-0 items-center justify-between text-left"
    >
      {avatarAndName}
      <span
        aria-hidden
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors',
          selected ? 'border-primary-500 bg-primary-500' : 'border-gray-400 bg-white',
        )}
      >
        {selected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
      </span>
    </button>
  );
};

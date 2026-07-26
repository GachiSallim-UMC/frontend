import { Check } from 'lucide-react';
import { UserAvatar } from '@/shared/components/ui/UserAvatar';
import { cn } from '@/shared/lib/cn';

interface MemberCheckRowProps {
  name: string;
  avatarUrl?: string;
  selected: boolean;
  onToggle: () => void;
}

export const MemberCheckRow = ({ name, avatarUrl, selected, onToggle }: MemberCheckRowProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        'flex h-[58px] w-full items-center justify-between rounded-lg border px-[13px] text-left transition-colors',
        selected ? 'border-primary-500' : 'border-gray-100 hover:bg-gray-50',
      )}
    >
      <div className="flex items-center gap-2.5">
        <UserAvatar name={name} avatarUrl={avatarUrl} size="sm" className="h-9 w-9" />
        <span className="text-[14px] font-bold leading-[normal] text-gray-900">{name}</span>
      </div>
      <span
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

import { useNavigate } from 'react-router-dom';
import { ChevronDown, Check } from 'lucide-react';
import { useMyGroups } from '@/features/member/hooks/useMyGroups';
import { useGroupStore } from '@/shared/store';
import { cn, useDropdown } from '@/shared/lib';

/** 모바일 대시보드 상단의 "우리집 룸메이트" 그룹 전환 드롭다운 */
export const GroupSwitchDropdown = () => {
  const navigate = useNavigate();
  const { data: groups } = useMyGroups();
  const selectedGroupId = useGroupStore(s => s.selectedGroupId);
  const setSelectedGroupId = useGroupStore(s => s.setSelectedGroupId);
  const { isOpen, containerRef, toggle, close } = useDropdown();

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  const handleSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    close();
    navigate('/dashboard');
  };

  if (!selectedGroup) return null;

  return (
    <div className="relative w-[184px] shrink-0" ref={containerRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggle}
        className="flex h-8 w-full min-w-0 items-center gap-1 rounded-full border border-gray-100 bg-white px-3 text-mobile-label"
      >
        <span className="min-w-0 flex-1 truncate text-left font-bold text-gray-600">
          {selectedGroup.name}
        </span>
        <span className="shrink-0 text-gray-600">· 멤버 {selectedGroup.memberCount}명</span>
        <ChevronDown
          className={cn('size-3 shrink-0 text-gray-400 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="그룹 선택"
          className="absolute left-0 top-full z-10 mt-2 min-w-full origin-top-left max-h-[280px] overflow-y-auto rounded-lg border border-gray-100 bg-white shadow-dropdown"
        >
          {groups.map(group => {
            const isSelected = group.id === selectedGroupId;
            return (
              <li
                key={group.id}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => handleSelect(group.id)}
                onKeyDown={e => e.key === 'Enter' && handleSelect(group.id)}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-2 whitespace-nowrap px-4 py-2.5 text-mobile-label font-normal transition-colors',
                  isSelected ? 'bg-primary-100 text-primary-500' : 'text-gray-600 hover:bg-gray-100',
                )}
              >
                {group.name}
                {isSelected && <Check className="size-4 shrink-0 text-primary-500" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

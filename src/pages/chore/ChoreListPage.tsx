import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChoreCalendarView,
  ChoreFilterBar,
  ChoreTable,
  useChores,
  useCompleteChore,
  useIncompleteChore,
  getChoreUIStatus,
} from '@/features/chore';
import type { Chore, ChoreFilter, RepeatType, ChoreApiStatus } from '@/features/chore';
import { useGroupStore, useErrorStore } from '@/shared/store';
import { useGroupMembers } from '@/features/member';
import { ShareItemPickerModal, useShareToMessenger } from '@/features/messenger';

const REPEAT_TYPE_FROM_FILTER: Record<NonNullable<ChoreFilter['repeatType']>, RepeatType> = {
  NONE: 'once',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
};

type ExtendedChoreFilter = Omit<ChoreFilter, 'status'> & {
  status?: ChoreApiStatus | 'SCHEDULED' | 'ALL';
};

export const ChoreListPage = () => {
  const [filter, setFilter] = useState<ExtendedChoreFilter>({});
  const navigate = useNavigate();
  const completeMutation = useCompleteChore();
  const incompleteMutation = useIncompleteChore();
  const {
    activeType,
    chatRoomOptions,
    openShare,
    closeShare,
    handleSelectChatRoom,
    isSharePending,
  } = useShareToMessenger('chore');

  const selectedGroupId = useGroupStore(state => state.selectedGroupId);
  const groupId = selectedGroupId ? Number(selectedGroupId) : undefined;

  const apiStatus = useMemo(() => {
    if (filter.status === 'SCHEDULED') return 'PENDING';
    if (filter.status === 'ALL') return undefined;
    return filter.status as ChoreApiStatus | undefined;
  }, [filter.status]);

  const { data: chores = [] } = useChores(
    groupId && Number.isSafeInteger(groupId)
      ? {
          groupId,
          status: apiStatus,
          assigneeId: filter.assigneeId,
        }
      : undefined,
  );

  const { data: rawMembers = [] } = useGroupMembers(selectedGroupId);

  const mappedMembers = useMemo(() => {
    return rawMembers.map(m => ({
      id: m.userId,
      userId: m.userId,
      name: m.user.nickname, //이름 대신 닉네임을 표시하도록 변경
      role: m.role,
      joinedAt: m.joinedAt,
      avatarUrl: m.user.profileImage || undefined,
    }));
  }, [rawMembers]);

  const filteredChores = useMemo(() => {
    const keyword = filter.keyword?.trim().toLocaleLowerCase();
    const repeatType = filter.repeatType ? REPEAT_TYPE_FROM_FILTER[filter.repeatType] : undefined;

    return chores.filter(chore => {
      const matchesKeyword = !keyword || chore.name.toLocaleLowerCase().includes(keyword);
      const matchesRepeat = !repeatType || chore.repeatType === repeatType;

      let matchesStatus = true;
      if (filter.status && filter.status !== 'ALL') {
        const uiStatus = getChoreUIStatus(chore).toUpperCase();
        matchesStatus = uiStatus === filter.status;
      }

      return matchesKeyword && matchesRepeat && matchesStatus;
    });
  }, [chores, filter.keyword, filter.repeatType, filter.status]);

  const handleEdit = (chore: Chore) => navigate(`/chores/${chore.id}/edit`);

  const showError = useErrorStore(state => state.showError);
  const handleToggleComplete = (chore: Chore) => {
    if (getChoreUIStatus(chore) === 'done') {
      // 이미 완료 상태면 -> 미완료 처리 API 호출
      incompleteMutation.mutate(String(chore.id), {
        onError: () => {
          showError({ title: '오류', message: '완료 취소 처리에 실패했습니다.' });
        },
      });
    } else {
      // 미완료 상태면 -> 기존처럼 완료 처리 API 호출
      completeMutation.mutate(String(chore.id), {
        onError: () => {
          showError({ title: '오류', message: '완료 처리에 실패했습니다.' });
        },
      });
    }
  };

  const handleShareClick = (chore: Chore) => {
    openShare(String(chore.id));
  };

  const todayText = useMemo(() => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = days[today.getDay()];
    return `${month}월 ${date}일 (${dayName})`;
  }, []);

  return (
    <div className="flex w-full flex-1 flex-col bg-transparent lg:gap-[20px] lg:rounded-2xl lg:bg-white lg:p-[30px]">
      <div className="order-3 mt-[8px] w-full lg:order-1 lg:mt-0">
        <ChoreFilterBar
          filter={filter as ChoreFilter}
          onFilterChange={f => setFilter(f as ExtendedChoreFilter)}
          groupMembers={mappedMembers}
        />
      </div>
      <div className="order-1 w-full lg:order-2">
        <ChoreCalendarView chores={filteredChores} />
      </div>
      <div className="order-2 mt-[16px] w-full lg:hidden">
        <h3 className="text-[14px] font-bold text-gray-700">{todayText}</h3>
      </div>
      <div className="order-4 mt-[8px] w-full flex-1 pb-[16px] lg:order-3 lg:mt-0 lg:pb-0">
        <ChoreTable
          chores={filteredChores}
          onEdit={handleEdit}
          onShare={handleShareClick}
          onToggleComplete={handleToggleComplete}
          isUpdating={completeMutation.isPending || incompleteMutation.isPending}
        />
      </div>
      <ShareItemPickerModal
        type={activeType}
        options={chatRoomOptions}
        onSelect={handleSelectChatRoom}
        onClose={closeShare}
        isSubmitting={isSharePending}
      />
    </div>
  );
};

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChoreCalendarView,
  ChoreFilterBar,
  ChoreTable,
  useChores,
  useCompleteChore,
  useIncompleteChore,
  useWeekCalendar,
  getChoreUIStatus,
  getChoreTargetDateStr,
} from '@/features/chore';
import type { Chore, ChoreFilter, RepeatType, ChoreApiStatus } from '@/features/chore';
import { useAlertStore, useGroupStore } from '@/shared/store';
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
  const showAlert = useAlertStore(state => state.showAlert);
  const completeMutation = useCompleteChore();
  const incompleteMutation = useIncompleteChore();
  const {
    selectedDate,
    weekDates,
    weekDateValues,
    fromDate,
    toDate,
    dayLabels,
    handlePrevWeek,
    handleNextWeek,
    handleSelectDate,
    todayDate,
  } = useWeekCalendar();
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

  const {
    data: chores = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useChores(
    groupId && Number.isSafeInteger(groupId)
      ? {
          groupId,
          status: apiStatus,
          assigneeId: filter.assigneeId,
          fromDate,
          toDate,
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

  const choresWithAssigneeAvatars = useMemo(() => {
    const avatarByUserId = new Map(
      rawMembers.map(member => [String(member.userId), member.user.profileImage || undefined]),
    );

    return chores.map(chore => ({
      ...chore,
      assignee: {
        ...chore.assignee,
        avatarUrl: avatarByUserId.get(String(chore.assignee.id)),
      },
    }));
  }, [chores, rawMembers]);

  const filteredChores = useMemo(() => {
    const keyword = filter.keyword?.trim().toLocaleLowerCase();
    const repeatType = filter.repeatType ? REPEAT_TYPE_FROM_FILTER[filter.repeatType] : undefined;

    return choresWithAssigneeAvatars
      .filter(chore => {
        const matchesKeyword = !keyword || chore.name.toLocaleLowerCase().includes(keyword);
        const matchesRepeat = !repeatType || chore.repeatType === repeatType;

        let matchesStatus = true;
        if (filter.status && filter.status !== 'ALL') {
          const uiStatus = getChoreUIStatus(chore).toUpperCase();
          matchesStatus = uiStatus === filter.status;
        }

        return matchesKeyword && matchesRepeat && matchesStatus;
      })
      .sort((a, b) => {
        const isADone = getChoreUIStatus(a) === 'done';
        const isBDone = getChoreUIStatus(b) === 'done';
        const completionOrder = Number(isADone) - Number(isBDone);
        if (completionOrder !== 0) return completionOrder;

        if (isADone && isBDone) {
          return (a.completedAt ?? '').localeCompare(b.completedAt ?? '');
        }

        const dateOrder = getChoreTargetDateStr(a).localeCompare(getChoreTargetDateStr(b));
        if (dateOrder !== 0) return dateOrder;

        return 0;
      });
  }, [choresWithAssigneeAvatars, filter.keyword, filter.repeatType, filter.status]);

  const mobileChores = useMemo(
    () => filteredChores.filter(chore => getChoreTargetDateStr(chore) === selectedDate),
    [filteredChores, selectedDate],
  );

  const handleEdit = (chore: Chore) => navigate(`/chores/${chore.id}/edit`);

  const handleToggleComplete = (chore: Chore) => {
    if (getChoreUIStatus(chore) === 'done') {
      // 이미 완료 상태면 -> 미완료 처리 API 호출
      incompleteMutation.mutate(String(chore.id), {
        onError: error => {
          console.error('완료 취소 실패:', error);
          showAlert({ title: '오류', message: '완료 취소에 실패했습니다.' });
        },
      });
    } else {
      // 미완료 상태면 -> 기존처럼 완료 처리 API 호출
      completeMutation.mutate(String(chore.id), {
        onError: error => {
          console.error('완료 처리 실패:', error);
          showAlert({ title: '오류', message: '완료 처리에 실패했습니다.' });
        },
      });
    }
  };

  const handleShareClick = (chore: Chore) => {
    openShare(String(chore.id));
  };

  const selectedDateText = useMemo(() => {
    const [year, month, date] = selectedDate.split('-').map(Number);
    const selected = new Date(year, month - 1, date);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = days[selected.getDay()];
    return `${String(month).padStart(2, '0')}월 ${String(date).padStart(2, '0')}일 (${dayName})`;
  }, [selectedDate]);

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
        <ChoreCalendarView
          chores={filteredChores}
          selectedDate={selectedDate}
          weekDates={weekDates}
          weekDateValues={weekDateValues}
          dayLabels={dayLabels}
          todayDate={todayDate}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onSelectDate={handleSelectDate}
        />
      </div>
      <div className="order-2 mt-[16px] w-full lg:hidden">
        <h3 className="text-[14px] font-bold text-gray-700">{selectedDateText}</h3>
      </div>
      <div className="order-4 mt-[8px] w-full flex-1 pb-[16px] lg:order-3 lg:mt-0 lg:pb-0">
        {isLoading ? (
          <div className="flex min-h-[104px] items-center justify-center text-mobile-label text-gray-500 lg:text-button">
            집안일 목록을 불러오는 중입니다.
          </div>
        ) : isError ? (
          <div className="flex min-h-[104px] flex-col items-center justify-center gap-3 text-mobile-label text-gray-500 lg:text-button">
            <p>{error instanceof Error ? error.message : '집안일 목록을 불러오지 못했습니다.'}</p>
            <button
              type="button"
              className="text-button font-bold text-primary-600"
              onClick={() => void refetch()}
            >
              다시 시도
            </button>
          </div>
        ) : (
          <ChoreTable
            chores={filteredChores}
            mobileChores={mobileChores}
            onEdit={handleEdit}
            onShare={handleShareClick}
            onToggleComplete={handleToggleComplete}
            isUpdating={completeMutation.isPending || incompleteMutation.isPending}
          />
        )}
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

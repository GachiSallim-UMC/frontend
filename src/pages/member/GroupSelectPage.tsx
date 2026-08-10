import {
  GroupActionBox,
  GroupEmptyState,
  GroupList,
  GroupOrDivider,
  useMyGroups,
} from '@/features/member';
import { GroupPageShell } from './GroupPageShell';

export const GroupSelectPage = () => {
  // 목록 자체는 GroupList가 다시 조회하지만, React Query 캐시를 공유하므로 추가 요청은 없습니다.
  const { data: groups, isLoading, isError } = useMyGroups();
  const hasNoGroup = !isLoading && !isError && groups.length === 0;

  return (
    <GroupPageShell title="내 그룹">
      {hasNoGroup ? (
        <GroupEmptyState />
      ) : (
        <>
          <div className="mb-5">
            <h2 className="mb-0.5 text-base font-bold tracking-[0.04em] text-gray-900 lg:mb-1 lg:text-2xl lg:tracking-normal">
              어느 그룹으로 들어갈까요?
            </h2>
            <p className="text-mobile-label font-medium text-gray-600 lg:text-sm">
              기존 그룹에 참여하거나 새 그룹을 만들어보세요.
            </p>
          </div>

          <GroupList />

          <GroupOrDivider />

          <GroupActionBox />
        </>
      )}
    </GroupPageShell>
  );
};

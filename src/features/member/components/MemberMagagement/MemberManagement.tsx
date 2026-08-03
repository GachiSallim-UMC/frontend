import { UserAvatar } from '@/shared/components';
import { useGroupMembers, GROUP_MEMBER_QUERY_KEYS } from '@/features/member/hooks/useGroupMembers';
import {
  useUpdateMemberRole,
  useRemoveGroupMember,
} from '@/features/member/hooks/useGroupMutations';
import { useGroupStore } from '@/shared/store';
import { useQueryClient } from '@tanstack/react-query';

export const MemberManagement = () => {
  const selectedGroupId = useGroupStore(s => s.selectedGroupId);
  const { data: members, isLoading, isError } = useGroupMembers(selectedGroupId);
  const updateRoleMutation = useUpdateMemberRole();
  const removeMemberMutation = useRemoveGroupMember();
  const queryClient = useQueryClient();

  const handleDelegateAdmin = (userId: string, name: string) => {
    if (!selectedGroupId) return;

    if (window.confirm(`${name}님에게 관리자 권한을 위임하시겠습니까?`)) {
      updateRoleMutation.mutate(
        { groupId: selectedGroupId, userId, role: 'ADMIN' },
        {
          onSuccess: () => {
            alert(`${name}님이 관리자로 지정되었습니다.`);
            queryClient.invalidateQueries({
              queryKey: GROUP_MEMBER_QUERY_KEYS.list(selectedGroupId),
            });
          },
          onError: () => alert('권한 위임에 실패했습니다.'),
        },
      );
    }
  };

  const handleKickOut = (userId: string, name: string) => {
    if (!selectedGroupId) return;

    if (window.confirm(`${name}님을 내보내시겠습니까?`)) {
      removeMemberMutation.mutate(
        { groupId: selectedGroupId, userId },
        {
          onSuccess: () => {
            alert(`${name}님이 그룹에서 내보내졌습니다.`);
            queryClient.invalidateQueries({
              queryKey: GROUP_MEMBER_QUERY_KEYS.list(selectedGroupId),
            });
          },
          onError: () => alert('멤버 내보내기에 실패했습니다.'),
        },
      );
    }
  };

  if (isLoading) {
    return (
      <section className="flex w-full items-center justify-center rounded-2xl bg-white p-10">
        <span className="text-sm text-gray-500">멤버 목록을 불러오는 중...</span>
      </section>
    );
  }

  if (isError || !members) {
    return (
      <section className="flex w-full items-center justify-center rounded-2xl bg-white p-10">
        <span className="text-sm text-red-500">멤버 목록을 불러오지 못했습니다.</span>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col rounded-2xl bg-white p-7">
      <h3 className="mb-5 text-lg font-bold text-gray-900 leading-snug">멤버 관리</h3>

      {/* 멤버 리스트 영역 */}
      <div className="flex flex-col">
        {members.map((member, index) => {
          const userName = member.user?.nickname || member.user?.name || '멤버';
          const userAvatarUrl = member.user?.profileImage ?? undefined;

          return (
            <div
              key={member.userId || member.user.id}
              className={`flex items-center justify-between p-3 ${
                index !== members.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              {/* 좌측 */}
              <div className="flex items-center">
                <UserAvatar name={userName} avatarUrl={userAvatarUrl} size="lg" className="mr-2" />

                <div className="flex items-center gap-6">
                  <span className="text-base font-bold text-gray-900">{userName}</span>

                  <span
                    className={`flex h-6 w-14 items-center justify-center rounded-md px-2 py-1 text-xs text-white ${
                      member.role === 'ADMIN' ? 'bg-primary-600' : 'bg-gray-400'
                    }`}
                  >
                    {member.role === 'ADMIN' ? '관리자' : '멤버'}
                  </span>
                </div>

                {/* 관리자 위임 / 내보내기 버튼 */}
                {member.role === 'MEMBER' && (
                  <div className="ml-6 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelegateAdmin(member.userId, userName)}
                      className="rounded-md border border-gray-100 bg-white px-3 py-1 text-xs text-gray-900 transition-colors hover:bg-gray-100"
                    >
                      관리자 위임
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKickOut(member.userId, userName)}
                      className="rounded-md border border-gray-100 bg-white px-3 py-1 text-xs text-gray-900 transition-colors hover:bg-gray-100"
                    >
                      내보내기
                    </button>
                  </div>
                )}
              </div>

              {/* 우측 영역: 가입일 */}
              {member.joinedAt && <span className="text-sm text-gray-500">{member.joinedAt}</span>}
            </div>
          );
        })}
      </div>
    </section>
  );
};

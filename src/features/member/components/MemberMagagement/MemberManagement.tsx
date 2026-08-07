import { useState } from 'react';
import { UserAvatar } from '@/shared/components';
import { useGroupMembers, GROUP_MEMBER_QUERY_KEYS } from '@/features/member/hooks/useGroupMembers';
import {
  useUpdateMemberRole,
  useRemoveGroupMember,
} from '@/features/member/hooks/useGroupMutations';
import { useGroupStore } from '@/shared/store';
import { useQueryClient } from '@tanstack/react-query';
import { DelegateAdminModal } from '@/features/member/components/DelegateAdminModal';
import { KickOutModal } from '@/features/member/components/KickOutModal';

interface MemberManagementProps {
  isAdmin?: boolean;
  onUnauthorized?: () => void;
}

export const MemberManagement = ({ isAdmin = false, onUnauthorized }: MemberManagementProps) => {
  const selectedGroupId = useGroupStore(s => s.selectedGroupId);
  const { data: members, isLoading, isError } = useGroupMembers(selectedGroupId);
  const updateRoleMutation = useUpdateMemberRole();
  const removeMemberMutation = useRemoveGroupMember();
  const queryClient = useQueryClient();

  const [delegateTarget, setDelegateTarget] = useState({ isOpen: false, userId: '', name: '' });
  const [kickOutTarget, setKickOutTarget] = useState({ isOpen: false, userId: '', name: '' });

  const [delegateError, setDelegateError] = useState<string | null>(null);
  const [kickOutError, setKickOutError] = useState<string | null>(null);

  const handleDelegateAdminClick = (userId: string, name: string) => {
    if (!isAdmin) {
      if (onUnauthorized) onUnauthorized();
      return;
    }
    setDelegateError(null);
    setDelegateTarget({ isOpen: true, userId, name });
  };

  const handleConfirmDelegate = () => {
    if (!selectedGroupId || !delegateTarget.userId) return;
    setDelegateError(null);

    updateRoleMutation.mutate(
      { groupId: selectedGroupId, userId: delegateTarget.userId, role: 'ADMIN' },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: GROUP_MEMBER_QUERY_KEYS.list(selectedGroupId),
          });
          setDelegateTarget({ isOpen: false, userId: '', name: '' });
        },
        onError: () => {
          setDelegateError('권한 위임에 실패했습니다.');
        },
      },
    );
  };

  const handleKickOutClick = (userId: string, name: string) => {
    if (!isAdmin) {
      if (onUnauthorized) onUnauthorized();
      return;
    }
    setKickOutError(null);
    setKickOutTarget({ isOpen: true, userId, name });
  };

  const handleConfirmKickOut = () => {
    if (!selectedGroupId || !kickOutTarget.userId) return;
    setKickOutError(null);

    removeMemberMutation.mutate(
      { groupId: selectedGroupId, userId: kickOutTarget.userId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: GROUP_MEMBER_QUERY_KEYS.list(selectedGroupId),
          });
          setKickOutTarget({ isOpen: false, userId: '', name: '' });
        },
        onError: () => {
          setKickOutError('멤버 내보내기에 실패했습니다.');
        },
      },
    );
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

  const sortedMembers = [...members].sort((a, b) => {
    if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
    if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;
    return 0;
  });

  return (
    <section className="flex w-full flex-col bg-transparent px-4 pt-0 lg:rounded-2xl lg:bg-white lg:p-7">
      <h3 className="lg:mb-5 mb-[8px] text-[14px] lg:text-lg font-bold text-gray-900 leading-snug">
        멤버 관리
      </h3>

      {/* 멤버 리스트 영역 */}
      <div className="flex flex-col rounded-lg border border-gray-100 bg-white px-[8px] lg:rounded-none lg:border-none lg:bg-transparent lg:p-0">
        {sortedMembers.map((member, index) => {
          const userName = member.user?.nickname || member.user?.name || '멤버';
          const userAvatarUrl = member.user?.profileImage ?? undefined;

          return (
            <div
              key={member.userId || member.user.id}
              className={`flex h-[56px] lg:h-auto items-center justify-between p-3 ${
                index !== sortedMembers.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              {/* 좌측 */}
              <div className="flex flex-1 items-center justify-between lg:flex-none lg:justify-start">
                <div className="flex items-center">
                  {/**모바일용 아바타 - sm */}
                  <UserAvatar
                    name={userName}
                    avatarUrl={userAvatarUrl}
                    size="sm"
                    className="mr-2 lg:hidden"
                  />
                  {/* 데스크탑용 아바타 - lg */}
                  <UserAvatar
                    name={userName}
                    avatarUrl={userAvatarUrl}
                    size="lg"
                    className="mr-2 hidden lg:block"
                  />

                  <div className="flex items-center gap-2 lg:gap-6">
                    <span className="lg:text-base text-[12px] font-bold text-gray-900">
                      {userName}
                    </span>

                    <span
                      className={`flex h-[20px] w-[46px] lg:h-6 lg:w-14 items-center justify-center rounded-md px-1 lg:px-2 py-1 text-[10px] lg:text-xs text-white ${
                        member.role === 'ADMIN' ? 'bg-primary-600' : 'bg-gray-400'
                      }`}
                    >
                      {member.role === 'ADMIN' ? '관리자' : '멤버'}
                    </span>
                  </div>
                </div>

                {/* 관리자 위임 / 내보내기 버튼 */}
                {member.role === 'MEMBER' && (
                  <div className="lg:ml-6 ml-2 flex items-center gap-1.5 lg:gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelegateAdminClick(member.userId, userName)}
                      className="rounded-md border border-gray-100 bg-white px-2 py-1 lg:px-3 text-[10px] lg:text-xs text-gray-900 transition-colors hover:bg-gray-100"
                    >
                      관리자 위임
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKickOutClick(member.userId, userName)}
                      className="rounded-md border border-gray-100 bg-white px-2 lg:px-3 py-1 text-[10px] lg:text-xs text-gray-900 transition-colors hover:bg-gray-100"
                    >
                      내보내기
                    </button>
                  </div>
                )}
              </div>

              {/* 우측 영역: 가입일 */}
              {member.joinedAt && (
                <span className="hidden text-[12px] text-gray-500 lg:block">
                  {member.joinedAt.split(/[T ]/)[0]}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <DelegateAdminModal
        isOpen={delegateTarget.isOpen}
        memberName={delegateTarget.name}
        onClose={() => {
          setDelegateTarget(prev => ({ ...prev, isOpen: false }));
          setDelegateError(null);
        }}
        onConfirm={handleConfirmDelegate}
        isSaving={updateRoleMutation.isPending}
        errorMessage={delegateError}
      />
      <KickOutModal
        isOpen={kickOutTarget.isOpen}
        memberName={kickOutTarget.name}
        onClose={() => {
          setKickOutTarget(prev => ({ ...prev, isOpen: false }));
          setKickOutError(null);
        }}
        onConfirm={handleConfirmKickOut}
        isSaving={removeMemberMutation.isPending}
        errorMessage={kickOutError}
      />
      <div className="mt-5 w-full border-b border-gray-100 lg:hidden" />
    </section>
  );
};

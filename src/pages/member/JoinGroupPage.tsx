import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  type Group,
  JoinGroupInput,
  GroupPreviewCard,
  JoinGroupAction,
  useJoinGroup,
} from '@/features/member';
import { useGroupStore } from '@/shared/store';
import { GroupPageHeader } from './GroupPageHeader';

export const JoinGroupPage = () => {
  const navigate = useNavigate();
  const setSelectedGroupId = useGroupStore(s => s.setSelectedGroupId);
  const joinGroupMutation = useJoinGroup();

  const [inviteCode, setInviteCode] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [foundGroup, setFoundGroup] = useState<Group | null>(null);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteCode(e.target.value);
  };

  const handleConfirmCode = () => {
    if (!inviteCode.trim()) {
      alert('초대 코드를 입력해주세요.');
      return;
    }

    joinGroupMutation.mutate(
      { inviteCode },
      {
        onSuccess: res => {
          const joinedGroup: Group = {
            id: res.groupId,
            name: '참여한 그룹',
            description: '',
            type: 'etc',
            address: '',
            inviteCode: inviteCode,
            memberCount: 1,
            members: [],
            ownerId: '',
          };

          setFoundGroup(joinedGroup);
          setShowPreview(true);
        },
        onError: error => {
          alert('유효하지 않은 초대 코드이거나 이미 가입된 그룹입니다.');
          setShowPreview(false);
          setFoundGroup(null);
          console.error(error);
        },
      },
    );
  };

  const handleJoinGroup = () => {
    if (!foundGroup) return;
    setSelectedGroupId(foundGroup.id);
    navigate('/dashboard');
  };

  const handleCancel = () => {
    setShowPreview(false);
    setFoundGroup(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-100">
      <div className="flex h-[696px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
        <GroupPageHeader />

        <div className="flex-1 pt-5 pb-18 px-10">
          <div className="mb-5">
            <h1 className="mb-1 text-2xl font-bold text-gray-900">그룹 참여</h1>
            <p className="text-sm font-medium text-gray-600">
              초대 코드를 입력하면 그룹에 참여할 수 있습니다.
            </p>
          </div>

          <JoinGroupInput
            inviteCode={inviteCode}
            onChange={handleCodeChange}
            onConfirm={handleConfirmCode}
            disabled={showPreview}
          />

          {showPreview && foundGroup && (
            <div className="mt-4">
              <GroupPreviewCard group={foundGroup} />

              <JoinGroupAction onJoin={handleJoinGroup} onCancel={handleCancel} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

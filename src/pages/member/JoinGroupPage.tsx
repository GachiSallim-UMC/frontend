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
import { memberApi } from '@/features/member/api/member.api';

export const JoinGroupPage = () => {
  const navigate = useNavigate();
  const setSelectedGroupId = useGroupStore(s => s.setSelectedGroupId);
  const joinGroupMutation = useJoinGroup();

  const [inviteCode, setInviteCode] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [foundGroup, setFoundGroup] = useState<Group | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [inviteCodeError, setInviteCodeError] = useState<string>();

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (!/^[A-HJ-NP-Z2-9]*$/.test(value)) {
      setInviteCodeError('I·O를 제외한 영문 대문자와 숫자 2~9만 입력할 수 있습니다.');
      return;
    }
    setInviteCode(value);
    setInviteCodeError(undefined);
  };

  const handleConfirmCode = async () => {
    if (!/^[A-HJ-NP-Z2-9]{6}$/.test(inviteCode)) {
      setInviteCodeError('초대 코드를 정확히 6자리로 입력해 주세요.');
      return;
    }

    setIsChecking(true);
    try {
      const previewData = await memberApi.getInviteInfo(inviteCode);

      const groupPreview: Group = {
        id: 'temp-id', // 가입 전이므로 임시 ID 사용
        name: previewData.name,
        description: previewData.description,
        type: previewData.residenceType || 'ETC',
        address: '',
        inviteCode: inviteCode,
        memberCount: previewData.currentMembers,
        maxMemberCount: previewData.maxMembers,
        members: [],
        ownerId: '',
        groupImage: previewData.groupImage || null,
      };

      setFoundGroup(groupPreview);
      setShowPreview(true);
    } catch (error) {
      alert('유효하지 않은 초대 코드이거나 만료되었습니다.');
      setShowPreview(false);
      setFoundGroup(null);
      console.error(error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleJoinGroup = () => {
    if (!inviteCode) return;

    joinGroupMutation.mutate(
      { inviteCode },
      {
        onSuccess: res => {
          setSelectedGroupId(res.id);
          navigate('/dashboard');
        },
        onError: error => {
          alert('가입에 실패했거나 이미 가입된 그룹입니다.');
          console.error(error);
        },
      },
    );
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
            disabled={showPreview || isChecking}
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

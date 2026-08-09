import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  type Group,
  JoinGroupInput,
  GroupPreviewCard,
  JoinGroupAction,
  useJoinGroup,
} from '@/features/member';
import { useAlertStore, useGroupStore } from '@/shared/store';
import { GroupPageShell } from './GroupPageShell';
import { memberApi } from '@/features/member/api/member.api';

export const JoinGroupPage = () => {
  const navigate = useNavigate();
  const setSelectedGroupId = useGroupStore(s => s.setSelectedGroupId);
  const showAlert = useAlertStore(s => s.showAlert);
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
    setInviteCodeError(undefined);

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
    } catch {
      setInviteCodeError('유효하지 않은 초대 코드이거나 만료되었습니다.');
      setShowPreview(false);
      setFoundGroup(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleJoinGroup = () => {
    if (!inviteCode) return;
    setInviteCodeError(undefined);

    joinGroupMutation.mutate(
      { inviteCode },
      {
        onSuccess: res => {
          setSelectedGroupId(res.id);
          navigate('/dashboard');
        },
        onError: () => {
          showAlert({
            title: '그룹 참여 실패',
            message: '가입에 실패했거나 이미 가입된 그룹입니다.',
          });
          setInviteCode('');
          setShowPreview(false);
          setFoundGroup(null);
        },
      },
    );
  };

  const handleCancel = () => {
    setShowPreview(false);
    setFoundGroup(null);
  };

  return (
    <GroupPageShell
      title="그룹 참여"
      footer={
        showPreview && foundGroup ? (
          <JoinGroupAction
            onJoin={handleJoinGroup}
            onCancel={handleCancel}
            isSubmitting={joinGroupMutation.isPending}
          />
        ) : undefined
      }
    >
      <div className="mb-5">
        <h2 className="mb-0.5 text-base font-bold tracking-[0.04em] text-gray-900 lg:mb-1 lg:text-2xl lg:tracking-normal">
          그룹 참여
        </h2>
        <p className="text-mobile-label font-medium text-gray-600 lg:text-sm">
          초대 코드를 입력하면 그룹에 참여할 수 있습니다.
        </p>
      </div>

      <JoinGroupInput
        inviteCode={inviteCode}
        onChange={handleCodeChange}
        onConfirm={handleConfirmCode}
        error={inviteCodeError}
        disabled={showPreview || isChecking}
      />

      {showPreview && foundGroup && (
        <div className="mt-5">
          <GroupPreviewCard group={foundGroup} />
        </div>
      )}
    </GroupPageShell>
  );
};

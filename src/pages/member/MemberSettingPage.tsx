import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GroupBasicInfo,
  MemberManagement,
  PermissionSettings,
  WarningModal,
  useDeleteGroup,
  useGroupMembers,
  IsAdminModal,
} from '@/features/member';
import { Button } from '@/shared/components';
import CrossIcon from '@/assets/icons/member/cross.svg?react';
import { useGroupStore, useAuthStore } from '@/shared/store';

export const MemberSettingPage = () => {
  const navigate = useNavigate();
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [isAdminAlertOpen, setIsAdminAlertOpen] = useState(false);

  const deleteGroupMutation = useDeleteGroup();
  const selectedGroupId = useGroupStore(s => s.selectedGroupId);
  const myUserId = useAuthStore(s => s.userId);

  const { data: members } = useGroupMembers(selectedGroupId);
  const myInfo = members?.find(member => member.userId === myUserId);
  const isAdmin = myInfo?.role === 'ADMIN';

  const handleWithdrawClick = () => {
    if (!isAdmin) {
      setIsAdminAlertOpen(true);
      return;
    }
    setIsWithdrawalModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsWithdrawalModalOpen(false);
  };

  const handleConfirmWithdraw = () => {
    if (!selectedGroupId) {
      alert('선택된 그룹 정보가 없습니다.');
      return;
    }

    deleteGroupMutation.mutate(selectedGroupId, {
      onSuccess: () => {
        setIsWithdrawalModalOpen(false);
        navigate('/group');
      },
      onError: error => {
        setIsAdminAlertOpen(true);
        console.error(error);
        setIsWithdrawalModalOpen(false);
      },
    });
  };

  return (
    <>
      <div className="flex w-full flex-col gap-5 py-7">
        <GroupBasicInfo isAdmin={isAdmin} />
        <MemberManagement isAdmin={isAdmin} />
        <PermissionSettings />
        <Button
          variant="danger"
          size="lg"
          leftIcon={<CrossIcon className="h-5 w-5" />}
          className="w-full"
          onClick={handleWithdrawClick}
          isLoading={false}
        >
          그룹 삭제
        </Button>
      </div>
      <WarningModal
        isOpen={isWithdrawalModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmWithdraw}
      />
      <IsAdminModal isOpen={isAdminAlertOpen} onClose={() => setIsAdminAlertOpen(false)} />
    </>
  );
};

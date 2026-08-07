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
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteGroupMutation = useDeleteGroup();
  const selectedGroupId = useGroupStore(s => s.selectedGroupId);
  const myUserId = useAuthStore(s => s.userId);

  const { data: members } = useGroupMembers(selectedGroupId);
  const myInfo = members?.find(member => member.userId === myUserId);
  const isAdmin = myInfo?.role === 'ADMIN';

  const handleUnauthorized = () => {
    setIsAdminAlertOpen(true);
  };

  const handleWithdrawClick = () => {
    if (!isAdmin) {
      setIsAdminAlertOpen(true);
      return;
    }
    setDeleteError(null);
    setIsWithdrawalModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsWithdrawalModalOpen(false);
    setDeleteError(null);
  };

  const handleConfirmWithdraw = () => {
    if (!selectedGroupId) {
      setDeleteError('선택된 그룹 정보가 없습니다.');
      return;
    }

    deleteGroupMutation.mutate(selectedGroupId, {
      onSuccess: () => {
        setIsWithdrawalModalOpen(false);
        navigate('/group');
      },
      onError: () => {
        setDeleteError('그룹 삭제에 실패했습니다. 다시 시도해 주세요.');
      },
    });
  };

  return (
    <>
      <div className="flex w-full flex-col gap-5 pt-[16px] pb-7 lg:py-7">
        <GroupBasicInfo isAdmin={isAdmin} onUnauthorized={handleUnauthorized} />
        <MemberManagement isAdmin={isAdmin} onUnauthorized={handleUnauthorized} />
        <PermissionSettings isAdmin={isAdmin} onUnauthorized={handleUnauthorized} />
        <div className="w-full px-4 lg:px-0">
          <Button
            variant="danger"
            size="lg"
            leftIcon={<CrossIcon className="lg:h-6 lg:w-6 h-5 w-5" />}
            className="w-full !h-[44px] lg:!h-[50px] !text-[14px] lg:!text-[16px]"
            onClick={handleWithdrawClick}
            isLoading={deleteGroupMutation.isPending}
          >
            그룹 삭제
          </Button>
        </div>
      </div>
      <WarningModal
        isOpen={isWithdrawalModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmWithdraw}
        isSaving={deleteGroupMutation.isPending}
        errorMessage={deleteError}
      />
      <IsAdminModal isOpen={isAdminAlertOpen} onClose={() => setIsAdminAlertOpen(false)} />
    </>
  );
};

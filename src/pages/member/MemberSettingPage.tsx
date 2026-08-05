import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GroupBasicInfo,
  MemberManagement,
  PermissionSettings,
  WarningModal,
  useDeleteGroup,
} from '@/features/member';
import { Button } from '@/shared/components';
import CrossIcon from '@/assets/icons/member/cross.svg?react';
import { useGroupStore } from '@/shared/store';

export const MemberSettingPage = () => {
  const navigate = useNavigate();
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  const deleteGroupMutation = useDeleteGroup();
  const selectedGroupId = useGroupStore(s => s.selectedGroupId);

  const handleWithdrawClick = () => {
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
        alert('그룹 삭제에 실패했습니다. 권한을 확인해주세요.');
        console.error(error);
        setIsWithdrawalModalOpen(false);
      },
    });
  };

  return (
    <>
      <div className="flex w-full flex-col gap-5 pb-7">
        <GroupBasicInfo />
        <MemberManagement />
        <PermissionSettings />
        <Button
          variant="danger"
          size="lg"
          leftIcon={<CrossIcon className="h-5 w-5" />}
          className="w-full"
          onClick={handleWithdrawClick}
          isLoading={deleteGroupMutation.isPending}
        >
          그룹 삭제
        </Button>
      </div>
      <WarningModal
        isOpen={isWithdrawalModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmWithdraw}
      />
    </>
  );
};

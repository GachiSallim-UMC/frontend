import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GroupBasicInfo,
  MemberManagement,
  PermissionSettings,
  WarningModal,
  useDeleteGroup,
  useUpdateGroup,
  useGroupDetail,
} from '@/features/member';
import { Button } from '@/shared/components';
import CrossIcon from '@/assets/icons/member/cross.svg?react';
import { useGroupStore } from '@/shared/store';
import { authApi } from '@/features/auth';

export const MemberSettingPage = () => {
  const navigate = useNavigate();
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  const deleteGroupMutation = useDeleteGroup();
  const updateGroupMutation = useUpdateGroup();
  const selectedGroupId = useGroupStore(s => s.selectedGroupId);

  const { data: groupDetail } = useGroupDetail(selectedGroupId ?? undefined);
  const currentGroupImage = groupDetail?.groupImage;

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedGroupId || !groupDetail) return;

    try {
      const uploadData = await authApi.getUploadUrl({
        contentType: file.type,
        fileSize: file.size,
      });

      const uploadedImageUrl = await authApi.uploadToS3(uploadData, file);

      updateGroupMutation.mutate({
        groupId: selectedGroupId,
        body: {
          name: groupDetail.name,
          description: groupDetail.description,
          maxMembers: groupDetail.maxMembers,
          groupImage: uploadedImageUrl,
        },
      });
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 변경에 실패했습니다.');
    }
  };

  return (
    <>
      <div className="flex w-full flex-col gap-5 py-7">
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

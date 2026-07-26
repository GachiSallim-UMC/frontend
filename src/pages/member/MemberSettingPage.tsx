import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GroupBasicInfo, MemberManagement, PermissionSettings } from "@/features/member";
import { WarningModal } from "@/features/member";
import { Button } from "@/shared/components";
import CrossIcon from "@/assets/icons/member/cross.svg?react"

export const MemberSettingPage = () => {
  const navigate = useNavigate();
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  
  const handleWithdrawClick = () => {
    setIsWithdrawalModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsWithdrawalModalOpen(false);
  };

  const handleConfirmWithdraw = () => {
        console.log("그룹 삭제됨");
        setIsWithdrawalModalOpen(false);
        navigate('/group'); 
    };
  return (
    <>
      <div className="flex w-full flex-col gap-5 py-7">
        
        {/* 그룹 기본 정보 */}
        <GroupBasicInfo />

        {/* 멤버 관리 */}
        <MemberManagement />

        {/* 권한 설정 */}
        <PermissionSettings />

        {/* 그룹 삭제 버튼 */}
        <Button
              variant="danger"
              size="lg"
              leftIcon={
                  <CrossIcon className="h-5 w-5" />
              }
              className="w-full"
              onClick={handleWithdrawClick}
          >
              그룹 삭제    
          </Button>
        
      </div>
      {/* 모달 렌더링 영역 */}
      <WarningModal 
        isOpen={isWithdrawalModalOpen} 
        onClose={handleCloseModal} 
        onConfirm={handleConfirmWithdraw} 
      />
    </>
  );
};
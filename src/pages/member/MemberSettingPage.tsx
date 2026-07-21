import { GroupBasicInfo, MemberManagement, PermissionSettings } from "@/features/member";
import { Button } from "@/shared/components";
import CrossIcon from "@/assets/icons/member/cross.svg?react"

export const MemberSettingPage = () => {
  return (
    <div className="flex w-full flex-col gap-5 py-7">
      
      {/* 1. 그룹 기본 정보 */}
      <GroupBasicInfo />

      {/* 2. 멤버 관리 */}
      <MemberManagement />

      {/* 3. 권한 설정 */}
      <PermissionSettings />

      {/* 4. 그룹 삭제 버튼 */}
      <Button
            variant="danger"
            size="lg"
            leftIcon={
                <CrossIcon className="h-5 w-5" />
            }
            className="w-full"
        >
            그룹 삭제    
        </Button>
      
    </div>
  );
};
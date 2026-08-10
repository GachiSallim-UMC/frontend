import { useState } from "react";
import {
    ProfileBasicInfo,
    PasswordChangeForm,
    NotificationSettings,
    SystemSetting,
    DataInfoSettings,
    MyPageButtonGroup
 } from "@/features/mypage";
import { useLogout } from '@/features/auth';
import { MyPagePrivacyPage } from "@/pages/mypage/MyPagePrivacyPage";
import { MyPageTermsPage } from "@/pages/mypage/MyPageTermsPage";

 export const MyPage = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <div className="flex min-h-0 w-full flex-1 bg-primary-50 pb-7">

      <div className="flex flex-1 flex-col overflow-hidden">

        <div className="flex-1 overflow-y-auto">

          <div className="flex w-full flex-col gap-5 pb-12 lg:gap-6">

            <ProfileBasicInfo />
            <PasswordChangeForm />
            <NotificationSettings />
            <SystemSetting />
            <DataInfoSettings
              onViewPrivacy={() => setIsPrivacyOpen(true)}
              onViewTerms={() => setIsTermsOpen(true)}
            />
            <MyPageButtonGroup onLogout={() => logout()} isLoggingOut={isLoggingOut} />

          </div>
        </div>
      </div>

      <MyPagePrivacyPage isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <MyPageTermsPage isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
};
